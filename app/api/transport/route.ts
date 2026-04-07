import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import connectDB from '@/lib/db';
import { Vehicle } from '@/lib/models';

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('edu_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyAuth(token);
    if (!payload.schoolId) return NextResponse.json([], { status: 200 });

    await connectDB();
    const vehicles = await Vehicle.find({ schoolId: payload.schoolId }).sort({ routeName: 1 }).lean();
    return NextResponse.json(vehicles, { status: 200 });
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
      return NextResponse.json({ error: 'Only admins can manage transport' }, { status: 403 });
    }

    const { vehicleNumber, type, capacity, driverName, driverPhone, routeName, stops } = await req.json();
    if (!vehicleNumber || !driverName || !driverPhone || !routeName) {
      return NextResponse.json({ error: 'Vehicle number, driver info, and route name are required' }, { status: 400 });
    }

    await connectDB();
    const vehicle = await Vehicle.create({
      schoolId: payload.schoolId, vehicleNumber, type: type || 'Bus',
      capacity: capacity || 40, driverName, driverPhone,
      routeName, stops: stops || [], status: 'active'
    });
    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
