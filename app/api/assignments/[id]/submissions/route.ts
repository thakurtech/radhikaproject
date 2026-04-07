import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Assignment, Submission, Student } from '@/lib/models';

// GET: List submissions for an assignment (teacher/admin only)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!['teacher', 'school_admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Only teachers and admins can view submissions' }, { status: 403 });
    }
    const { id } = await params;

    await connectDB();
    const submissions = await Submission.find({ assignmentId: id })
      .populate('studentId', 'firstName lastName enrollmentNumber')
      .sort({ submittedAt: -1 }).lean();

    return NextResponse.json(submissions, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Submit an assignment (student only)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (payload.role !== 'student') {
      return NextResponse.json({ error: 'Only students can submit assignments' }, { status: 403 });
    }
    const { id } = await params;
    const { submissionText, attachmentUrl } = await req.json();

    if (!submissionText && !attachmentUrl) {
      return NextResponse.json({ error: 'Please provide either text or an attachment' }, { status: 400 });
    }

    await connectDB();

    // Verify assignment exists and is active
    const assignment = await Assignment.findById(id);
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    if (assignment.status === 'closed') {
      return NextResponse.json({ error: 'This assignment is closed and no longer accepting submissions' }, { status: 400 });
    }

    // Verify student belongs to the assignment's course
    const student = await Student.findOne({ userId: payload.userId, schoolId: payload.schoolId });
    if (!student) return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    if (student.courseId.toString() !== assignment.courseId.toString()) {
      return NextResponse.json({ error: 'You are not enrolled in the course for this assignment' }, { status: 403 });
    }

    // Check for duplicate submission
    const existing = await Submission.findOne({ assignmentId: id, studentId: student._id });
    if (existing) {
      return NextResponse.json({ error: 'You have already submitted this assignment' }, { status: 409 });
    }

    // Check if late
    const isLate = new Date() > new Date(assignment.dueDate);

    const submission = await Submission.create({
      assignmentId: id,
      studentId: student._id,
      schoolId: payload.schoolId,
      submissionText: submissionText || '',
      attachmentUrl: attachmentUrl || '',
      submittedAt: new Date(),
      isLate,
      status: 'submitted'
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'Duplicate submission' }, { status: 409 });
    }
    console.error('Submit assignment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
