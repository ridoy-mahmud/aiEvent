import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST - Login/Register with Google
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { idToken, email, name, photoURL } = await request.json();

    // Validation
    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: 'Please provide email and name from Google' },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, update name if needed and log them in
      if (name && user.name !== name) {
        user.name = name;
        await user.save();
      }
    } else {
      // Create new user with Google authentication
      const userData = {
        name,
        email,
        password: `google_${Date.now()}_${Math.random()}`, // Unique dummy password for Google users
        role: email === 'ridoy007@gmail.com' ? 'admin' : 'user',
      };
      
      user = await User.create(userData);
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
    console.error('Google Auth Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Google authentication failed' },
      { status: 500 }
    );
  }
}

