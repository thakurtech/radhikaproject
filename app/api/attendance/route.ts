import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Attendance, Student } from '@/lib/models';

// GET: Fetch attendance records for a specific date
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (!payload.schoolId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required (YYYY-MM-DD)' }, { status: 400 });
    }

    await connectDB();

    const records = await Attendance.find({
      schoolId: payload.schoolId,
      date: date
    }).lean();

    return NextResponse.json({ records }, { status: 200 });

  } catch (error) {
    console.error('Fetch attendance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Batch save/update attendance
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    // Teachers and Admins can mark attendance
    if (!['teacher', 'school_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { date, records } = body; 
    // records should be an array: [{ studentId, status }]

    if (!date || !Array.isArray(records)) {
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    await connectDB();

    const operations = records.map((record: any) => ({
      updateOne: {
        filter: {
          schoolId: payload.schoolId,
          studentId: record.studentId,
          date: date
        },
        update: {
          $set: {
            status: record.status,
            markedBy: payload.userId
          }
        },
        upsert: true
      }
    }));

    if (operations.length > 0) {
      await Attendance.bulkWrite(operations);
    }

    // Optional: We should recalculate overall attendance for each student in the background, 
    // but for demo purposes, we will leave it as is or defer calculate.

    return NextResponse.json({ success: true, message: 'Attendance marked successfully' }, { status: 200 });

  } catch (error) {
    console.error('Mark attendance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
