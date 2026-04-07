import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Book, Borrowing, Student } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!payload.schoolId) return NextResponse.json([], { status: 200 });

    await connectDB();
    const books = await Book.find({ schoolId: payload.schoolId }).sort({ title: 1 }).lean();
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!['school_admin', 'super_admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Only admins can add books' }, { status: 403 });
    }

    const { title, author, isbn, category, totalCopies } = await req.json();
    if (!title || !author) {
      return NextResponse.json({ error: 'Title and author are required' }, { status: 400 });
    }

    await connectDB();
    const copies = totalCopies || 1;
    const book = await Book.create({
      schoolId: payload.schoolId, title, author,
      isbn: isbn || '', category: category || 'General',
      totalCopies: copies, availableCopies: copies
    });
    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
