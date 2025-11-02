import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { message, conversationHistory, userInfo, eventsInfo } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    // Build system prompt with context
    let systemPrompt = `You are a helpful AI assistant for an AI Summit events platform. Help users with:
- Event browsing and registration
- Account management and login
- Event categories, dates, and locations
- General questions about the platform

Be friendly, concise, and helpful. If users ask about events, registration, or account-related topics, provide specific guidance. Keep responses conversational and clear.`;

    // Add user context if available
    if (userInfo) {
      systemPrompt += `\n\nCurrent user context:
- Name: ${userInfo.name}
- Email: ${userInfo.email}
- Role: ${userInfo.role}`;
    }

    // Add events context if available
    if (eventsInfo && eventsInfo.length > 0) {
      const totalEvents = eventsInfo.length;
      const categories = [...new Set(eventsInfo.map((e: any) => e.category))];
      systemPrompt += `\n\nPlatform context:
- Total events available: ${totalEvents}
- Event categories: ${categories.join(', ')}
- You can reference specific events if users ask about them.`;
    }

    // Prepare messages for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory.map((msg: { sender: string; text: string }) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text
      })),
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to get AI response', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';

    return NextResponse.json({ message: aiMessage });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

