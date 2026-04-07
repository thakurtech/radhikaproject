import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { TimetableEntry, Teacher } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!payload.schoolId) return NextResponse.json([], { status: 200 });

    await connectDB();
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');

    const filter: any = { schoolId: payload.schoolId };
    if (courseId) filter.courseId = courseId;

    const entries = await TimetableEntry.find(filter)
      .populate('courseId', 'name')
      .populate('teacherId', 'firstName lastName')
      .sort({ dayOfWeek: 1, startTime: 1 }).lean();
    return NextResponse.json(entries, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!['school_admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Only admins can manage timetables' }, { status: 403 });
    }

    const { courseId, dayOfWeek, startTime, endTime, subject, teacherId, room } = await req.json();
    if (!courseId || dayOfWeek === undefined || !startTime || !endTime || !subject) {
      return NextResponse.json({ error: 'Course, day, times, and subject are required' }, { status: 400 });
    }

    await connectDB();
    const entry = await TimetableEntry.create({
      schoolId: payload.schoolId, courseId,
      dayOfWeek: Number(dayOfWeek), startTime, endTime,
      subject, teacherId: teacherId || undefined, room: room || ''
    });
    return NextResponse.json(entry, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ error: 'This time slot is already occupied for this course' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!['school_admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await req.json();
    await connectDB();
    await TimetableEntry.findByIdAndDelete(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
