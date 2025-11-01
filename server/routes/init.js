const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Event = require('../models/Event');

// Generate image URL based on event title
const generateEventImage = (title, category) => {
  const seed = title
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const categoryMap = {
    Technology: 1,
    Workshop: 2,
    Conference: 3,
    Seminar: 4,
    Networking: 5,
  };

  const categorySeed = categoryMap[category] || 0;
  const finalSeed = (seed + categorySeed) % 1000;
  return `https://picsum.photos/400/300?random=${finalSeed}`;
};

// @route   POST /api/init
// @desc    Initialize database with admin user and all 38 default events
// @access  Public
router.post('/', async (req, res) => {
  try {
    // Initialize admin user
    const adminExists = await User.findOne({ email: 'ridoy007@gmail.com' });
    let admin;

    if (!adminExists) {
      // Check if there's an existing admin
      const existingAdmin = await User.findOne({ role: 'admin' });
      
      if (existingAdmin) {
        // Update existing admin
        existingAdmin.email = 'ridoy007@gmail.com';
        existingAdmin.password = 'ridoy007'; // Will be hashed by pre-save hook
        existingAdmin.name = 'Admin User';
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        admin = existingAdmin;
      } else {
        // Create new admin
        admin = await User.create({
          email: 'ridoy007@gmail.com',
          password: 'ridoy007',
          name: 'Admin User',
          role: 'admin',
        });
      }
    } else {
      admin = adminExists;
    }

    // Initialize all 38 default events
    const eventCount = await Event.countDocuments();
    const defaultEvents = [
      {
        title: "AI Innovation Summit 2024",
        description: "Join us for a groundbreaking conference exploring the latest in AI technology, machine learning, and automation. Network with industry leaders and discover cutting-edge innovations.",
        date: "2024-06-15",
        time: "09:00",
        location: "San Francisco Convention Center",
        category: "Technology",
        image: generateEventImage("AI Innovation Summit 2024", "Technology"),
        organizer: "AI Tech Community",
        capacity: 500,
      },
      {
        title: "Machine Learning Workshop",
        description: "Hands-on workshop covering neural networks, deep learning, and practical ML applications. Perfect for developers and data scientists.",
        date: "2024-06-20",
        time: "14:00",
        location: "Tech Hub Downtown",
        category: "Workshop",
        image: generateEventImage("Machine Learning Workshop", "Workshop"),
        organizer: "ML Academy",
        capacity: 50,
      },
      {
        title: "Future of Automation",
        description: "Explore how automation is transforming industries. Panel discussions with experts and live demonstrations.",
        date: "2024-06-25",
        time: "10:00",
        location: "Digital Innovation Center",
        category: "Conference",
        image: generateEventImage("Future of Automation", "Conference"),
        organizer: "Automation Society",
        capacity: 300,
      },
      {
        title: "AI Ethics & Responsibility",
        description: "Important discussions on ethical AI development, bias mitigation, and responsible innovation in the age of AI.",
        date: "2024-07-01",
        time: "13:00",
        location: "University Auditorium",
        category: "Seminar",
        image: generateEventImage("AI Ethics & Responsibility", "Seminar"),
        organizer: "Ethics Institute",
        capacity: 200,
      },
      {
        title: "Startup AI Pitch Night",
        description: "Watch innovative AI startups pitch their ideas to investors. Networking and refreshments included.",
        date: "2024-07-05",
        time: "18:00",
        location: "Startup Incubator",
        category: "Networking",
        image: generateEventImage("Startup AI Pitch Night", "Networking"),
        organizer: "Venture Capitalists",
        capacity: 150,
      },
      {
        title: "Deep Learning Masterclass",
        description: "Advanced techniques in deep learning, CNNs, RNNs, and transformer architectures. Bring your laptop!",
        date: "2024-07-10",
        time: "09:30",
        location: "Tech University",
        category: "Workshop",
        image: generateEventImage("Deep Learning Masterclass", "Workshop"),
        organizer: "Deep Learning Lab",
        capacity: 75,
      },
      {
        title: "Neural Networks Explained",
        description: "Comprehensive introduction to neural networks, from basics to advanced concepts. Perfect for beginners and intermediate learners.",
        date: "2024-07-15",
        time: "11:00",
        location: "Online Event",
        category: "Workshop",
        image: generateEventImage("Neural Networks Explained", "Workshop"),
        organizer: "AI Learning Platform",
        capacity: 200,
      },
      {
        title: "Computer Vision Conference",
        description: "Explore the latest in computer vision, image recognition, and visual AI applications. Industry experts and research presentations.",
        date: "2024-07-20",
        time: "09:00",
        location: "Tech Convention Hall",
        category: "Conference",
        image: generateEventImage("Computer Vision Conference", "Conference"),
        organizer: "Vision AI Society",
        capacity: 400,
      },
      {
        title: "Natural Language Processing Bootcamp",
        description: "Intensive bootcamp on NLP, transformers, and language models. Hands-on coding sessions and real-world projects.",
        date: "2024-07-25",
        time: "10:00",
        location: "Coding Academy",
        category: "Workshop",
        image: generateEventImage("Natural Language Processing Bootcamp", "Workshop"),
        organizer: "NLP Experts",
        capacity: 60,
      },
      {
        title: "AI in Healthcare Symposium",
        description: "Discover how AI is revolutionizing healthcare: diagnostics, treatment plans, and patient care. Medical professionals welcome.",
        date: "2024-08-01",
        time: "14:00",
        location: "Medical Center",
        category: "Seminar",
        image: generateEventImage("AI in Healthcare Symposium", "Seminar"),
        organizer: "HealthTech Alliance",
        capacity: 250,
      },
      {
        title: "Robotics & AI Integration",
        description: "Learn about the intersection of robotics and AI. Live demonstrations of autonomous systems and intelligent machines.",
        date: "2024-08-05",
        time: "13:00",
        location: "Robotics Lab",
        category: "Technology",
        image: generateEventImage("Robotics & AI Integration", "Technology"),
        organizer: "Robotics Institute",
        capacity: 100,
      },
      {
        title: "AI for Business Leaders",
        description: "Strategic insights for executives on implementing AI in business. ROI, use cases, and transformation strategies.",
        date: "2024-08-10",
        time: "09:00",
        location: "Business Center",
        category: "Conference",
        image: generateEventImage("AI for Business Leaders", "Conference"),
        organizer: "Executive Forum",
        capacity: 300,
      },
      {
        title: "Reinforcement Learning Workshop",
        description: "Deep dive into RL algorithms, Q-learning, and policy gradients. Build your own RL agents in this hands-on session.",
        date: "2024-08-15",
        time: "10:00",
        location: "AI Research Lab",
        category: "Workshop",
        image: generateEventImage("Reinforcement Learning Workshop", "Workshop"),
        organizer: "RL Research Group",
        capacity: 40,
      },
      {
        title: "AI & Climate Change Solutions",
        description: "How AI can help solve climate challenges. Carbon tracking, energy optimization, and sustainable AI practices.",
        date: "2024-08-20",
        time: "15:00",
        location: "Environmental Center",
        category: "Seminar",
        image: generateEventImage("AI & Climate Change Solutions", "Seminar"),
        organizer: "GreenTech Initiative",
        capacity: 180,
      },
      {
        title: "AI Developer Meetup",
        description: "Monthly meetup for AI developers. Share projects, discuss challenges, and network with fellow developers.",
        date: "2024-08-25",
        time: "18:30",
        location: "Co-working Space",
        category: "Networking",
        image: generateEventImage("AI Developer Meetup", "Networking"),
        organizer: "Dev Community",
        capacity: 80,
      },
      {
        title: "GPT & Large Language Models",
        description: "Comprehensive overview of GPT models, fine-tuning techniques, and building LLM applications. Technical deep dive.",
        date: "2024-09-01",
        time: "11:00",
        location: "Tech University",
        category: "Workshop",
        image: generateEventImage("GPT & Large Language Models", "Workshop"),
        organizer: "LLM Research Lab",
        capacity: 120,
      },
      {
        title: "AI Security & Privacy Forum",
        description: "Critical discussions on AI security vulnerabilities, privacy concerns, and best practices for secure AI deployment.",
        date: "2024-09-05",
        time: "14:00",
        location: "Security Conference Center",
        category: "Seminar",
        image: generateEventImage("AI Security & Privacy Forum", "Seminar"),
        organizer: "CyberSec Alliance",
        capacity: 220,
      },
      {
        title: "Women in AI Summit",
        description: "Celebrating women leaders in AI. Keynote speakers, panel discussions, and networking opportunities.",
        date: "2024-09-10",
        time: "09:00",
        location: "Convention Center",
        category: "Conference",
        image: generateEventImage("Women in AI Summit", "Conference"),
        organizer: "Women in Tech",
        capacity: 500,
      },
      {
        title: "AI Startups Demo Day",
        description: "Watch 20 AI startups showcase their innovations. Investor pitches, product demos, and networking sessions.",
        date: "2024-09-15",
        time: "10:00",
        location: "Innovation Hub",
        category: "Networking",
        image: generateEventImage("AI Startups Demo Day", "Networking"),
        organizer: "Startup Accelerator",
        capacity: 300,
      },
      {
        title: "Edge AI & IoT Workshop",
        description: "Learn about deploying AI on edge devices and IoT systems. Real-world applications and optimization techniques.",
        date: "2024-09-20",
        time: "13:00",
        location: "IoT Innovation Lab",
        category: "Workshop",
        image: generateEventImage("Edge AI & IoT Workshop", "Workshop"),
        organizer: "IoT Research Center",
        capacity: 50,
      },
      {
        title: "AI in Finance & Trading",
        description: "Explore algorithmic trading, fraud detection, and financial AI applications. Industry experts share insights.",
        date: "2024-09-25",
        time: "10:00",
        location: "Financial District",
        category: "Conference",
        image: generateEventImage("AI in Finance & Trading", "Conference"),
        organizer: "FinTech Association",
        capacity: 350,
      },
      {
        title: "Generative AI Art & Design",
        description: "Creative applications of generative AI. Image generation, style transfer, and AI-assisted design workflows.",
        date: "2024-10-01",
        time: "15:00",
        location: "Art Gallery",
        category: "Workshop",
        image: generateEventImage("Generative AI Art & Design", "Workshop"),
        organizer: "Creative AI Collective",
        capacity: 90,
      },
      {
        title: "AI & Human Collaboration",
        description: "Exploring how humans and AI can work together effectively. Human-in-the-loop systems and augmentation.",
        date: "2024-10-05",
        time: "11:00",
        location: "Human-Computer Lab",
        category: "Seminar",
        image: generateEventImage("AI & Human Collaboration", "Seminar"),
        organizer: "HCI Research Group",
        capacity: 150,
      },
      {
        title: "Quantum Computing & AI",
        description: "The future of quantum machine learning. Quantum algorithms for AI and hybrid quantum-classical systems.",
        date: "2024-10-10",
        time: "14:00",
        location: "Quantum Research Facility",
        category: "Technology",
        image: generateEventImage("Quantum Computing & AI", "Technology"),
        organizer: "Quantum AI Labs",
        capacity: 120,
      },
      {
        title: "AI Career Development Day",
        description: "Career guidance for AI professionals. Resume reviews, interview tips, and networking with recruiters.",
        date: "2024-10-15",
        time: "12:00",
        location: "Career Center",
        category: "Networking",
        image: generateEventImage("AI Career Development Day", "Networking"),
        organizer: "Tech Careers",
        capacity: 200,
      },
      {
        title: "Autonomous Vehicles & AI",
        description: "Latest developments in self-driving technology. Sensor fusion, decision-making systems, and safety.",
        date: "2024-10-20",
        time: "09:00",
        location: "Automotive Research Center",
        category: "Technology",
        image: generateEventImage("Autonomous Vehicles & AI", "Technology"),
        organizer: "AutoTech Innovations",
        capacity: 280,
      },
      {
        title: "AI Open Source Summit",
        description: "Celebrating open source AI projects. Contribute, collaborate, and discover the best open source tools.",
        date: "2024-10-25",
        time: "10:00",
        location: "Developer Hub",
        category: "Conference",
        image: generateEventImage("AI Open Source Summit", "Conference"),
        organizer: "Open Source Foundation",
        capacity: 400,
      },
      {
        title: "AI in Education Conference",
        description: "How AI is transforming education. Personalized learning, intelligent tutoring, and educational technology.",
        date: "2024-11-01",
        time: "13:00",
        location: "Education Center",
        category: "Conference",
        image: generateEventImage("AI in Education Conference", "Conference"),
        organizer: "EdTech Alliance",
        capacity: 320,
      },
      {
        title: "AI Research Paper Review",
        description: "Critical review of latest AI research papers. Discussion sessions and author Q&A.",
        date: "2024-11-05",
        time: "15:00",
        location: "Research Institute",
        category: "Seminar",
        image: generateEventImage("AI Research Paper Review", "Seminar"),
        organizer: "AI Research Society",
        capacity: 100,
      },
      {
        title: "AI Hackathon 2024",
        description: "48-hour AI hackathon. Build innovative AI solutions, compete for prizes, and network with peers.",
        date: "2024-11-10",
        time: "09:00",
        location: "Hackathon Venue",
        category: "Workshop",
        image: generateEventImage("AI Hackathon 2024", "Workshop"),
        organizer: "Hackathon Organizers",
        capacity: 500,
      },
      {
        title: "AI & Blockchain Integration",
        description: "Explore the convergence of AI and blockchain technology. Smart contracts, decentralized AI, and tokenization.",
        date: "2024-11-15",
        time: "14:00",
        location: "Blockchain Innovation Hub",
        category: "Technology",
        image: generateEventImage("AI & Blockchain Integration", "Technology"),
        organizer: "Crypto AI Labs",
        capacity: 180,
      },
      {
        title: "Explainable AI Workshop",
        description: "Learn how to build transparent and interpretable AI systems. Model explainability techniques and best practices.",
        date: "2024-11-20",
        time: "10:00",
        location: "Research Center",
        category: "Workshop",
        image: generateEventImage("Explainable AI Workshop", "Workshop"),
        organizer: "XAI Research Group",
        capacity: 45,
      },
      {
        title: "AI in Agriculture Summit",
        description: "Revolutionizing farming with AI. Precision agriculture, crop monitoring, and sustainable food production.",
        date: "2024-11-25",
        time: "09:00",
        location: "Agricultural Innovation Center",
        category: "Conference",
        image: generateEventImage("AI in Agriculture Summit", "Conference"),
        organizer: "AgriTech Foundation",
        capacity: 250,
      },
      {
        title: "Federated Learning Masterclass",
        description: "Advanced techniques in federated learning for privacy-preserving AI. Distributed machine learning without data sharing.",
        date: "2024-12-01",
        time: "13:00",
        location: "Privacy Research Lab",
        category: "Workshop",
        image: generateEventImage("Federated Learning Masterclass", "Workshop"),
        organizer: "Privacy AI Institute",
        capacity: 60,
      },
      {
        title: "AI Music & Creative Arts",
        description: "Exploring AI-generated music, art, and creative content. Collaboration between AI and human artists.",
        date: "2024-12-05",
        time: "16:00",
        location: "Art & Technology Gallery",
        category: "Workshop",
        image: generateEventImage("AI Music & Creative Arts", "Workshop"),
        organizer: "Creative AI Collective",
        capacity: 120,
      },
      {
        title: "AI for Social Good Forum",
        description: "Using AI to address global challenges. Healthcare access, education, poverty reduction, and climate action.",
        date: "2024-12-10",
        time: "11:00",
        location: "Global Impact Center",
        category: "Seminar",
        image: generateEventImage("AI for Social Good Forum", "Seminar"),
        organizer: "Social Impact AI",
        capacity: 300,
      },
    ];

    // Only add events if database is empty or missing events
    if (eventCount === 0) {
      // Add all events
      const eventsToInsert = defaultEvents.map(event => ({
        ...event,
        createdBy: admin._id,
        registeredUsers: [],
      }));
      
      await Event.insertMany(eventsToInsert);
      console.log(`✅ Added ${defaultEvents.length} events to database`);
    } else {
      // Check which events are missing
      const existingEvents = await Event.find({}).select('title');
      const existingTitles = new Set(existingEvents.map(e => e.title));
      const missingEvents = defaultEvents.filter(e => !existingTitles.has(e.title));
      
      if (missingEvents.length > 0) {
        const eventsToInsert = missingEvents.map(event => ({
          ...event,
          createdBy: admin._id,
          registeredUsers: [],
        }));
        
        await Event.insertMany(eventsToInsert);
        console.log(`✅ Added ${missingEvents.length} missing events to database`);
      } else {
        console.log('✅ All events already exist in database');
      }
    }

    const finalEventCount = await Event.countDocuments();

    res.json({
      success: true,
      message: 'Database initialized successfully',
      data: {
        adminCreated: !adminExists,
        eventsCreated: eventCount === 0,
        totalEvents: finalEventCount,
        eventsAdded: finalEventCount - eventCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
