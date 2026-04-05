import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Student, Teacher, Payment, Attendance } from '@/lib/models';

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await verifyAuth(token);
    if (!payload.schoolId) {
       return NextResponse.json({ reply: 'You must be associated with a school to access AI analytics.' }, { status: 200 });
    }

    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: 'Message required' }, { status: 400 });

    const prompt = message.toLowerCase();
    await connectDB();

    let reply = "I'm EduAI. I can help answer questions about your school's attendance, student count, teaching staff, or finances. What would you like to know?";

    if (prompt.includes('student') || prompt.includes('how many kids')) {
       const count = await Student.countDocuments({ schoolId: payload.schoolId });
       reply = `Your institution currently has **${count}** students enrolled in the active session.`;
    } 
    else if (prompt.includes('teacher') || prompt.includes('staff') || prompt.includes('faculty')) {
       const count = await Teacher.countDocuments({ schoolId: payload.schoolId });
       reply = `There are **${count}** active teachers managing the classrooms at your school.`;
    }
    else if (prompt.includes('finance') || prompt.includes('revenue') || prompt.includes('money') || prompt.includes('fee')) {
       const payments = await Payment.find({ schoolId: payload.schoolId });
       const collected = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
       const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
       reply = `You have collected **₹${collected.toLocaleString('en-IN')}** so far, with **₹${pending.toLocaleString('en-IN')}** currently pending.`;
    }
    else if (prompt.includes('attendance') || prompt.includes('present') || prompt.includes('absent')) {
       const today = new Date().toISOString().split('T')[0];
       const records = await Attendance.find({ schoolId: payload.schoolId, date: today });
       
       if (records.length === 0) {
         reply = `No attendance records have been officially submitted for today (${today}) yet.`;
       } else {
         const present = records.filter(r => r.status === 'present').length;
         const absent = records.filter(r => r.status === 'absent').length;
         reply = `For today's roll call, **${present}** students marked present, and **${absent}** students marked absent.`;
       }
    }
    else if (prompt.includes('hello') || prompt.includes('hi')) {
       reply = `Hello, ${payload.name}! I am currently connected to your school's live database. How can I assist you today?`;
    }

    // A tiny simulated delay to make it feel like "AI generation"
    await new Promise(res => setTimeout(res, 600));

    return NextResponse.json({ reply }, { status: 200 });

  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ reply: 'Sorry, I am experiencing internal latency. Try again later.' }, { status: 200 });
  }
}
