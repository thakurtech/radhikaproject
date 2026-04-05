import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Course } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAuth(token);

    if (!payload.schoolId) {
       return NextResponse.json({ error: 'No school associated' }, { status: 400 });
    }

    await connectDB();

    const courses = await Course.find({ schoolId: payload.schoolId }).sort({ name: 1 });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    console.error('Fetch courses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
