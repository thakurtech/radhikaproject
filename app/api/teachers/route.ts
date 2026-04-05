import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Teacher, User } from '@/lib/models';
import bcrypt from 'bcryptjs';

// GET: Fetch teachers for the current school
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    await connectDB();

    const query: any = {};
    if (payload.schoolId) {
      query.schoolId = payload.schoolId;
    } else if (payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const teachers = await Teacher.find(query).lean();
    return NextResponse.json({ teachers }, { status: 200 });

  } catch (error) {
    console.error('Fetch teachers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new teacher and generate their user account
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    // Only school admins (and super admins for demo) can create teachers
    if (payload.role !== 'school_admin' && payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { firstName, lastName, department, email, password, targetSchoolId } = body;

    // Use targetSchoolId if Super Admin is creating, otherwise use current schoolId
    const schoolIdToUse = payload.role === 'super_admin' ? (targetSchoolId || payload.schoolId) : payload.schoolId;

    if (!schoolIdToUse) {
      return NextResponse.json({ error: 'School ID required to assign teacher' }, { status: 400 });
    }

    if (!firstName || !lastName || !department || !email || !password) {
      return NextResponse.json({ error: 'Missing required configuration fields' }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
    }

    // Hash password & create the Teacher User
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      passwordHash,
      role: 'teacher',
      schoolId: schoolIdToUse
    });

    // Create the Teacher profile
    const teacher = await Teacher.create({
      schoolId: schoolIdToUse,
      userId: user._id,
      firstName,
      lastName,
      department
    });

    return NextResponse.json({ success: true, teacher }, { status: 201 });

  } catch (error) {
    console.error('Create teacher error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
