import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Student, User } from '@/lib/models';

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (payload.role !== 'school_admin' && payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden. Only Admins can modify students.' }, { status: 403 });
    }

    const params = await props.params;
    const { id } = params;
    const updates = await req.json();

    if (!id) return NextResponse.json({ error: 'Student ID required' }, { status: 400 });

    await connectDB();

    const student = await Student.findOneAndUpdate(
      { _id: id, schoolId: payload.schoolId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!student) return NextResponse.json({ error: 'Student not found.' }, { status: 404 });

    // Also update User profile name if name was changed
    if (updates.firstName || updates.lastName) {
      if (student.userId) {
        await User.findByIdAndUpdate(student.userId, {
          name: `${updates.firstName || student.firstName} ${updates.lastName || student.lastName}`
        });
      }
    }

    return NextResponse.json({ success: true, student }, { status: 200 });
  } catch (error) {
    console.error('Update student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (payload.role !== 'school_admin' && payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden. Only Admins can delete students.' }, { status: 403 });
    }

    const params = await props.params;
    const { id } = params;
    if (!id) return NextResponse.json({ error: 'Student ID required' }, { status: 400 });

    await connectDB();

    const student = await Student.findOneAndDelete({ _id: id, schoolId: payload.schoolId });
    if (!student) return NextResponse.json({ error: 'Student not found.' }, { status: 404 });

    // Force cascade delete their login account
    if (student.userId) {
      await User.findByIdAndDelete(student.userId);
    }

    return NextResponse.json({ success: true, message: 'Student and linked account deleted.' }, { status: 200 });
  } catch (error) {
    console.error('Delete student error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
