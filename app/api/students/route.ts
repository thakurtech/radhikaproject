import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Student, User, Teacher, Course } from '@/lib/models';
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
    if (!['school_admin', 'super_admin', 'teacher'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden. Only Admins and Teachers can add students.' }, { status: 403 });
    }

    const { firstName, lastName, enrollmentNumber, courseId, currentYear, email, password } = await req.json();

    if (!firstName || !lastName || !enrollmentNumber || !courseId || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields including password' }, { status: 400 });
    }

    await connectDB();

    if (payload.role === 'teacher') {
      const teacherProfile = await Teacher.findOne({ userId: payload.userId }).lean();
      if (!teacherProfile) return NextResponse.json({ error: 'Teacher profile not found' }, { status: 400 });
      
      const course = await Course.findById(courseId).lean();
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 400 });
      
      const cName = course.name.toLowerCase();
      const tDept = teacherProfile.department.toLowerCase();
      
      // Simple mapping verification for standard courses like B.Tech CS <-> Computer Science, BBA <-> Business
      const isValid = 
        cName.includes(tDept) || 
        tDept.includes(cName) || 
        (tDept.includes('computer') && cName.includes('cs')) ||
        (tDept.includes('computer') && cName.includes('bca')) ||
        (tDept.includes('mechanical') && cName.includes('me')) ||
        (tDept.includes('business') && cName.includes('bba')) ||
        (tDept.includes('management') && cName.includes('mba'));
        
      if (!isValid) {
         return NextResponse.json({ error: 'Forbidden. You can only add students to your department.' }, { status: 403 });
      }
    }

    // Optional: If teacher, could verify course relation here, but we rely on UI restriction.

    // 1. Create a User login credentials for the student using provided password
    const studentPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email: email,
      passwordHash: studentPassword,
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
