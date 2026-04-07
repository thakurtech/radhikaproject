import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Submission, Assignment } from '@/lib/models';

// PATCH: Grade a submission
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; subId: string }> }) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!['teacher', 'school_admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Only teachers and admins can grade submissions' }, { status: 403 });
    }
    const { id, subId } = await params;
    const { grade, feedback } = await req.json();

    await connectDB();

    const assignment = await Assignment.findById(id);
    if (!assignment) return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });

    if (grade !== undefined && grade !== null) {
      if (grade < 0 || grade > assignment.maxMarks) {
        return NextResponse.json({ error: `Grade must be between 0 and ${assignment.maxMarks}` }, { status: 400 });
      }
    }

    const updated = await Submission.findByIdAndUpdate(subId, {
      ...(grade !== undefined && grade !== null ? { grade: Number(grade) } : {}),
      ...(feedback !== undefined ? { feedback } : {}),
      status: 'graded'
    }, { new: true }).populate('studentId', 'firstName lastName enrollmentNumber');

    if (!updated) return NextResponse.json({ error: 'Submission not found' }, { status: 404 });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error('Grade submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
