import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// POST - Register user for event
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    // Get token from Authorization header
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to access this route' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('JWT Decoded:', decoded);
    } catch (jwtError: any) {
      console.error('JWT Verification Error:', jwtError.message);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Handle both { id: string } and { _id: string } formats
    const userId = decoded.id || decoded._id;

    if (!userId) {
      console.error('No user ID found in token. Decoded:', decoded);
      return NextResponse.json(
        { success: false, error: 'Valid user ID is required in token' },
        { status: 400 }
      );
    }

    // Convert to string if it's an ObjectId
    const userIdString = typeof userId === 'string' ? userId : userId.toString();

    if (!mongoose.Types.ObjectId.isValid(userIdString)) {
      console.error('Invalid user ID format:', userIdString);
      return NextResponse.json(
        { success: false, error: 'Valid user ID is required' },
        { status: 400 }
      );
    }

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Check if already registered
    if (event.registeredUsers.includes(new mongoose.Types.ObjectId(userIdString))) {
      return NextResponse.json(
        { success: false, error: 'User already registered for this event' },
        { status: 400 }
      );
    }

    // Check if event is full
    if (event.registeredUsers.length >= event.capacity) {
      return NextResponse.json(
        { success: false, error: 'Event is full' },
        { status: 400 }
      );
    }

    // Add user to registeredUsers
    event.registeredUsers.push(new mongoose.Types.ObjectId(userIdString));
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email')
      .populate('registeredUsers', 'name email');

    return NextResponse.json(
      { success: true, data: populatedEvent },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Unregister user from event
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid event ID' },
        { status: 400 }
      );
    }

    // Get token from Authorization header for DELETE too
    const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Not authorized to access this route' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      console.log('JWT Decoded (DELETE):', decoded);
    } catch (jwtError: any) {
      console.error('JWT Verification Error:', jwtError.message);
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Handle both { id: string } and { _id: string } formats
    const userId = decoded.id || decoded._id;

    if (!userId) {
      console.error('No user ID found in token. Decoded:', decoded);
      return NextResponse.json(
        { success: false, error: 'Valid user ID is required in token' },
        { status: 400 }
      );
    }

    // Convert to string if it's an ObjectId
    const userIdString = typeof userId === 'string' ? userId : userId.toString();

    if (!mongoose.Types.ObjectId.isValid(userIdString)) {
      console.error('Invalid user ID format:', userIdString);
      return NextResponse.json(
        { success: false, error: 'Valid user ID is required' },
        { status: 400 }
      );
    }

    // Find event first
    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    // Remove user from registeredUsers
    event.registeredUsers = event.registeredUsers.filter(
      (regUserId) => regUserId.toString() !== userIdString
    );
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email')
      .populate('registeredUsers', 'name email');

    return NextResponse.json(
      { success: true, data: populatedEvent },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

