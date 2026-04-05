import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { School, User } from '@/lib/models';
import bcrypt from 'bcryptjs';

// POST: Create a new institution (Super Admin Only)
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    
    // Security check: Only super_admin can create new schools
    if (payload.role !== 'super_admin') {
       return NextResponse.json({ error: 'Forbidden. Only Super Admins can onboard new schools.' }, { status: 403 });
    }

    const { schoolName, schoolAddress, adminName, adminEmail, adminPassword } = await req.json();

    if (!schoolName || !adminName || !adminEmail || !adminPassword) {
       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Check if email is already used anywhere
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
        return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    // 1. Create the new School
    const newSchool = await School.create({
      name: schoolName,
      address: schoolAddress,
      adminEmail: adminEmail
    });

    // 2. Create the School Admin user
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const newSchoolAdmin = await User.create({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'school_admin',
      schoolId: newSchool._id
    });

    return NextResponse.json({ 
        success: true, 
        message: 'Institution onboarded successfully', 
        schoolId: newSchool._id 
    }, { status: 201 });

  } catch (error) {
    console.error('School onboarding error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
