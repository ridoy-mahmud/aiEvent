import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Event from '@/lib/models/Event';

// POST - Initialize default admin and events
export async function POST() {
  try {
    await connectDB();

    // Initialize admin user
    const adminExists = await User.findOne({ email: 'ridoy007@gmail.com' });
    if (!adminExists) {
      const existingAdmin = await User.findOne({ role: 'admin' });
      
      if (existingAdmin) {
        existingAdmin.email = 'ridoy007@gmail.com';
        existingAdmin.password = 'ridoy007';
        existingAdmin.name = 'Admin User';
        existingAdmin.role = 'admin';
        await existingAdmin.save();
      } else {
        await User.create({
          email: 'ridoy007@gmail.com',
          password: 'ridoy007',
          name: 'Admin User',
          role: 'admin',
        });
      }
    }

    // Initialize default events if none exist
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      const admin = await User.findOne({ email: 'ridoy007@gmail.com' });
      
      if (admin) {
        const defaultEvents = [
          {
            title: "AI Summit 2024",
            description: "Join us for the biggest AI conference of the year",
            date: "2024-06-15",
            time: "09:00",
            location: "San Francisco Convention Center",
            category: "Conference",
            image: "https://picsum.photos/400/300?random=1",
            organizer: "AI Events Organization",
            capacity: 500,
            createdBy: admin._id,
            registeredUsers: [],
          },
          {
            title: "Machine Learning Workshop",
            description: "Hands-on workshop on machine learning fundamentals",
            date: "2024-07-20",
            time: "14:00",
            location: "Online",
            category: "Workshop",
            image: "https://picsum.photos/400/300?random=2",
            organizer: "Tech Education Hub",
            capacity: 100,
            createdBy: admin._id,
            registeredUsers: [],
          },
        ];

        await Event.insertMany(defaultEvents);
      }
    }

    return NextResponse.json(
      { success: true, message: 'Initialization complete' },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

