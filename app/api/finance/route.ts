import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Payment, Student } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    // Secure route: only admin roles can view financial data
    if (payload.role !== 'school_admin' && payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden. Admin access required.' }, { status: 403 });
    }

    await connectDB();

    // Fetch payments and populate the associated student's details
    const rawPayments = await Payment.find({ schoolId: payload.schoolId })
      .populate({ path: 'studentId', select: 'firstName lastName enrollmentNumber' })
      .sort({ date: -1 })
      .lean();

    // Map output to match our UI format expectations
    const payments = rawPayments.map((p: any) => ({
      _id: p._id,
      studentName: p.studentId ? `${p.studentId.firstName} ${p.studentId.lastName}` : 'Unknown Student',
      enrollmentNumber: p.studentId?.enrollmentNumber || 'N/A',
      amount: p.amount,
      status: p.status,
      date: p.date,
    }));

    // Aggregate key stats for the dashboard preview
    const totalCollected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + p.amount, 0);

    return NextResponse.json({ 
      payments, 
      stats: { totalCollected, pendingAmount, overdueAmount } 
    }, { status: 200 });

  } catch (error) {
    console.error('Fetch finance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (payload.role !== 'school_admin' && payload.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { studentId, amount, status, date } = await req.json();

    if (!studentId || !amount || !status) {
      return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
    }

    await connectDB();

    const payment = await Payment.create({
      schoolId: payload.schoolId,
      studentId: studentId,
      amount: Number(amount),
      status: status,
      date: date ? new Date(date) : new Date()
    });

    return NextResponse.json({ success: true, payment }, { status: 201 });

  } catch (error) {
    console.error('Create payment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
