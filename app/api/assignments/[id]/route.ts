import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Assignment, Submission } from '@/lib/models';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    const { id } = await params;

    await connectDB();
    const assignment = await Assignment.findById(id).populate('courseId', 'name').lean();
    if (!assignment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json(assignment, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!['teacher', 'school_admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { id } = await params;
    const body = await req.json();

    await connectDB();
    const assignment = await Assignment.findById(id);
    if (!assignment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (payload.role === 'teacher' && assignment.createdBy.toString() !== payload.userId) {
      return NextResponse.json({ error: 'You can only edit your own assignments' }, { status: 403 });
    }

    const updated = await Assignment.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!['teacher', 'school_admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { id } = await params;

    await connectDB();
    const assignment = await Assignment.findById(id);
    if (!assignment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (payload.role === 'teacher' && assignment.createdBy.toString() !== payload.userId) {
      return NextResponse.json({ error: 'You can only delete your own assignments' }, { status: 403 });
    }

    await Submission.deleteMany({ assignmentId: id }); // Cascade delete
    await Assignment.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
