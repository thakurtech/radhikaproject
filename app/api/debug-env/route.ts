import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasMongoUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    mongoUriStart: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 15) + '...' : 'none'
  });
}
