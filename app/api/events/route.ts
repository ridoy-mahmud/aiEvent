import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import mongoose from 'mongoose';

// GET - Get all events
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let query: any = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .populate('registeredUsers', 'name email')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: events }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new event
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      title,
      description,
      date,
      time,
      location,
      category,
      image,
      organizer,
      capacity,
      createdBy,
    } = body;

    if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
      return NextResponse.json(
        { success: false, error: 'Valid createdBy user ID is required' },
        { status: 400 }
      );
    }

    const event = await Event.create({
      title,
      description,
      date,
      time,
      location,
      category,
      image,
      organizer,
      capacity,
      createdBy,
      registeredUsers: [],
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('createdBy', 'name email')
      .populate('registeredUsers', 'name email');

    return NextResponse.json(
      { success: true, data: populatedEvent },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

