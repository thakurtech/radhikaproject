import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Assignment, Submission, Course, Student } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!payload.schoolId) return NextResponse.json({ error: 'No school' }, { status: 400 });

    await connectDB();

    let assignments;
    if (payload.role === 'teacher') {
      assignments = await Assignment.find({ schoolId: payload.schoolId, createdBy: payload.userId })
        .populate('courseId', 'name').sort({ createdAt: -1 }).lean();
    } else if (payload.role === 'student') {
      const student = await Student.findOne({ userId: payload.userId });
      if (!student) return NextResponse.json([], { status: 200 });
      assignments = await Assignment.find({ schoolId: payload.schoolId, courseId: student.courseId })
        .populate('courseId', 'name').sort({ createdAt: -1 }).lean();
      // Attach submission status for each
      const subs = await Submission.find({ studentId: student._id, assignmentId: { $in: assignments.map(a => a._id) } }).lean();
      const subMap = new Map(subs.map(s => [s.assignmentId.toString(), s]));
      assignments = assignments.map(a => ({ ...a, mySubmission: subMap.get(a._id.toString()) || null }));
    } else {
      assignments = await Assignment.find({ schoolId: payload.schoolId })
        .populate('courseId', 'name').sort({ createdAt: -1 }).lean();
    }

    // Attach submission count for teachers/admins
    if (payload.role !== 'student') {
      const counts = await Submission.aggregate([
        { $match: { assignmentId: { $in: assignments.map(a => a._id) } } },
        { $group: { _id: '$assignmentId', count: { $sum: 1 }, graded: { $sum: { $cond: [{ $eq: ['$status', 'graded'] }, 1, 0] } } } }
      ]);
      const countMap = new Map(counts.map(c => [c._id.toString(), c]));
      assignments = assignments.map(a => ({
        ...a,
        submissionCount: countMap.get(a._id.toString())?.count || 0,
        gradedCount: countMap.get(a._id.toString())?.graded || 0
      }));
    }

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error('Fetch assignments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!['teacher', 'school_admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Only teachers and admins can create assignments' }, { status: 403 });
    }
    if (!payload.schoolId) return NextResponse.json({ error: 'No school' }, { status: 400 });

    const { title, description, courseId, dueDate, maxMarks } = await req.json();
    if (!title || !courseId || !dueDate) {
      return NextResponse.json({ error: 'Title, course, and due date are required' }, { status: 400 });
    }

    await connectDB();
    const course = await Course.findById(courseId);
    if (!course || course.schoolId.toString() !== payload.schoolId) {
      return NextResponse.json({ error: 'Invalid course' }, { status: 400 });
    }

    const assignment = await Assignment.create({
      schoolId: payload.schoolId,
      courseId,
      title,
      description: description || '',
      dueDate: new Date(dueDate),
      maxMarks: maxMarks || 100,
      createdBy: payload.userId,
      status: 'active'
    });

    return NextResponse.json(assignment, { status: 201 });
  } catch (error) {
    console.error('Create assignment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
