import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Student, Teacher, Payment, Course, Attendance } from '@/lib/models';

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
    const allStudents = await Student.find(query).select('overallAttendance courseId currentYear');
    const avgAttendance = allStudents.length > 0 
      ? allStudents.reduce((acc, curr) => acc + (curr.overallAttendance || 0), 0) / allStudents.length 
      : 0;

    // 4. Fee Collection
    const payments = await Payment.find({ ...query, status: 'paid' });
    const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);

    // 5. Course-wise breakdown (for admin dashboard)
    const courses = await Course.find(query).select('name');
    const courseBreakdown = courses.map(course => {
      const courseStudents = allStudents.filter(
        s => s.courseId?.toString() === course._id.toString()
      );
      const avgAtt = courseStudents.length > 0
        ? courseStudents.reduce((a, c) => a + (c.overallAttendance || 0), 0) / courseStudents.length
        : 0;
      return {
        courseId: course._id,
        courseName: course.name,
        studentCount: courseStudents.length,
        avgAttendance: Math.round(avgAtt * 10) / 10
      };
    });

    // 6. Year-wise breakdown
    const yearGroups: Record<number, number> = {};
    allStudents.forEach(s => {
      const y = s.currentYear || 1;
      yearGroups[y] = (yearGroups[y] || 0) + 1;
    });
    const yearBreakdown = Object.entries(yearGroups)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([year, count]) => ({ year: `Year ${year}`, count }));

    // 7. Department distribution (teachers)
    const allTeachers = await Teacher.find(query).select('department');
    const deptGroups: Record<string, number> = {};
    allTeachers.forEach(t => {
      const d = t.department || 'Other';
      deptGroups[d] = (deptGroups[d] || 0) + 1;
    });
    const departmentBreakdown = Object.entries(deptGroups)
      .sort(([, a], [, b]) => b - a)
      .map(([dept, count]) => ({ department: dept, count }));

    return NextResponse.json({
      totalStudents,
      avgAttendance: avgAttendance.toFixed(1),
      totalCollected,
      totalTeachers,
      courseBreakdown,
      yearBreakdown,
      departmentBreakdown,
      role: payload.role
    }, { status: 200 });

  } catch (error) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
