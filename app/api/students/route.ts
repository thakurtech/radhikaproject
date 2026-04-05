import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Student, User } from '@/lib/models';
import bcrypt from 'bcryptjs';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (!payload.schoolId) return NextResponse.json({ error: 'No school mapping' }, { status: 400 });

    await connectDB();

    // Populate course details so the frontend can display 'B.Tech (CS)' instead of an ID
    const students = await Student.find({ schoolId: payload.schoolId })
                                  .populate('courseId', 'name')
                                  .sort({ createdAt: -1 });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Fetch students error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (payload.role !== 'school_admin') {
      return NextResponse.json({ error: 'Forbidden. Only Admins can add students.' }, { status: 403 });
    }

    const { firstName, lastName, enrollmentNumber, courseId, currentYear, email } = await req.json();

    if (!firstName || !lastName || !enrollmentNumber || !courseId || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // 1. Create a User login credentials for the student
    const defaultPassword = await bcrypt.hash('Student@123', 10);
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email: email,
      passwordHash: defaultPassword,
      role: 'student',
      schoolId: payload.schoolId
    });

    // 2. Create the Student Profile linked to the User
    const student = await Student.create({
      schoolId: payload.schoolId,
      userId: user._id,
      firstName,
      lastName,
      enrollmentNumber,
      courseId,
      currentYear: currentYear || 1,
      overallAttendance: 100, // Starts at 100%
      overallGrade: 'N/A'     // Starts blank
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error: any) {
    console.error('Create student error:', error);
    if (error.code === 11000) {
        return NextResponse.json({ error: 'Email or Enrollment Number already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
