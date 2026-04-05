import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { User, School } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyAuth(token);

    await connectDB();

    const user = await User.findById(payload.userId).select('-passwordHash');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let school = null;
    if (user.schoolId) {
      school = await School.findById(user.schoolId);
    }

    return NextResponse.json({ user, school }, { status: 200 });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
