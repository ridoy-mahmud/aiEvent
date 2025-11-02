import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST - User login
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Please provide email and password' },
        { status: 400 }
      );
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Get the user with password field
    const userWithPassword = await User.findById((user as any)._id).select('+password');
    if (!userWithPassword || !userWithPassword.password) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if password matches
    let isMatch = false;
    // Check if password is hashed (bcrypt hash starts with $2a$, $2b$, etc.)
    if (userWithPassword.password.startsWith('$2')) {
      isMatch = await bcrypt.compare(password, userWithPassword.password);
    } else {
      // Plain text comparison for backward compatibility
      isMatch = userWithPassword.password === password;
    }

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ id: (user as any)._id.toString() }, JWT_SECRET, {
      expiresIn: '30d',
    });

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: (user as any)._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

