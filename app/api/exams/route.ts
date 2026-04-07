import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Exam, Course } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!payload.schoolId) return NextResponse.json([], { status: 200 });

    await connectDB();
    const exams = await Exam.find({ schoolId: payload.schoolId })
      .populate('courseId', 'name').sort({ examDate: 1 }).lean();
    return NextResponse.json(exams, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!['teacher', 'school_admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, courseId, examDate, startTime, endTime, maxMarks, room, description } = await req.json();
    if (!title || !courseId || !examDate || !startTime || !endTime) {
      return NextResponse.json({ error: 'Title, course, date, start time, and end time are required' }, { status: 400 });
    }

    await connectDB();
    const exam = await Exam.create({
      schoolId: payload.schoolId, courseId, title, description: description || '',
      examDate: new Date(examDate), startTime, endTime,
      maxMarks: maxMarks || 100, room: room || '', createdBy: payload.userId
    });
    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
