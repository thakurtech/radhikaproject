import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { School, User, Student, Payment } from '@/lib/models';
import bcrypt from 'bcryptjs';

// GET: Fetch all institutions with aggregated data for Super Admin
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    // Only Super Admin can access this route
    if (payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const schools = await School.find().lean();

    // Aggregate stats for each school
    const processedSchools = await Promise.all(schools.map(async (school) => {
      const studentCount = await Student.countDocuments({ schoolId: school._id });
      
      const payments = await Payment.find({ schoolId: school._id, status: 'paid' });
      const mrr = payments.reduce((acc, curr) => acc + curr.amount, 0);

      // Check if admin user exists (active status)
      const adminExists = await User.exists({ schoolId: school._id, role: 'school_admin' });

      return {
        id: school._id,
        name: school.name,
        domain: school.adminEmail.split('@')[1] || 'N/A',
        status: adminExists ? 'Active' : 'Pending',
        members: studentCount,
        plan: 'Enterprise',
        mrr: `₹${mrr.toLocaleString('en-IN')}`
      };
    }));

    return NextResponse.json({ schools: processedSchools }, { status: 200 });

  } catch (error) {
    console.error('Fetch schools error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Create a new School and generate the primary School Admin user
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const { name, adminEmail, password, address } = await req.json();

    if (!name || !adminEmail || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email is already in use globally
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return NextResponse.json({ error: 'Admin email already exists on the platform' }, { status: 409 });
    }

    // 1. Create the School
    const school = await School.create({
      name,
      adminEmail,
      address: address || ''
    });

    // 2. Hash password & create the School Admin User
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: `${name} Admin`,
      email: adminEmail,
      passwordHash,
      role: 'school_admin',
      schoolId: school._id
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Institution and School Admin created successfully.',
      schoolId: school._id 
    }, { status: 201 });

  } catch (error) {
    console.error('Create school error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
