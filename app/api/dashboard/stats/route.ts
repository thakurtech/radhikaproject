import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Student, Teacher, Payment } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAuth(token);

    if (!payload.schoolId && payload.role !== 'super_admin') {
       return NextResponse.json({ error: 'No school associated' }, { status: 400 });
    }

    await connectDB();

    const query: any = {};
    if (payload.schoolId) {
       query.schoolId = payload.schoolId;
    }

    // 1. Total Students
    const totalStudents = await Student.countDocuments(query);

    // 2. Total Teachers
    const totalTeachers = await Teacher.countDocuments(query);

    // 3. Average Attendance
    const allStudents = await Student.find(query).select('overallAttendance');
    const avgAttendance = allStudents.length > 0 
      ? allStudents.reduce((acc, curr) => acc + (curr.overallAttendance || 0), 0) / allStudents.length 
      : 0;

    // 4. Fee Collection
    const payments = await Payment.find({ ...query, status: 'paid' });
    const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);

    return NextResponse.json({
      totalStudents,
      avgAttendance: avgAttendance.toFixed(1),
      totalCollected,
      totalTeachers
    }, { status: 200 });

  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
