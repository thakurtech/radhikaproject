import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Teacher, User } from '@/lib/models';

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (payload.role !== 'school_admin' && payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden. Only Admins can modify teachers.' }, { status: 403 });
    }

    const params = await props.params;
    const { id } = params;
    const updates = await req.json();

    if (!id) return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 });

    await connectDB();

    const query: any = { _id: id };
    if (payload.role !== 'super_admin') {
      query.schoolId = payload.schoolId;
    }

    const teacher = await Teacher.findOneAndUpdate(
      query,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!teacher) return NextResponse.json({ error: 'Teacher not found.' }, { status: 404 });

    // Also update User profile name if name was changed
    if (updates.firstName || updates.lastName) {
      if (teacher.userId) {
        await User.findByIdAndUpdate(teacher.userId, {
          name: `${updates.firstName || teacher.firstName} ${updates.lastName || teacher.lastName}`
        });
      }
    }

    return NextResponse.json({ success: true, teacher }, { status: 200 });
  } catch (error) {
    console.error('Update teacher error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (payload.role !== 'school_admin' && payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden. Only Admins can delete teachers.' }, { status: 403 });
    }

    const params = await props.params;
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'Teacher ID required' }, { status: 400 });

    await connectDB();

    const query: any = { _id: id };
    if (payload.role !== 'super_admin') {
      query.schoolId = payload.schoolId;
    }

    const teacher = await Teacher.findOneAndDelete(query);
    if (!teacher) return NextResponse.json({ error: 'Teacher not found.' }, { status: 404 });

    // Force cascade delete their login account
    if (teacher.userId) {
      await User.findByIdAndDelete(teacher.userId);
    }

    return NextResponse.json({ success: true, message: 'Teacher and linked account deleted.' }, { status: 200 });
  } catch (error) {
    console.error('Delete teacher error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
