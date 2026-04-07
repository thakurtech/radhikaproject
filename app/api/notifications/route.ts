import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Notification } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!payload.schoolId) return NextResponse.json([], { status: 200 });

    await connectDB();
    const notifications = await Notification.find({
      schoolId: payload.schoolId,
      $or: [{ targetRole: 'all' }, { targetRole: payload.role }]
    }).populate('createdBy', 'name').sort({ createdAt: -1 }).limit(50).lean();

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!['teacher', 'school_admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title, message, type, targetRole } = await req.json();
    if (!title || !message) {
      return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
    }

    await connectDB();
    const notification = await Notification.create({
      schoolId: payload.schoolId, title, message,
      type: type || 'announcement', targetRole: targetRole || 'all',
      createdBy: payload.userId, readBy: []
    });
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
