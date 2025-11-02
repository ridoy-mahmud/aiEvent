import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

// GET - Get all users
export async function GET() {
  try {
    await connectDB();
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { email, password, name, role = 'user' } = body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const user = await User.create({
      email,
      password,
      name,
      role,
    });

    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    return NextResponse.json(
      { success: true, data: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

