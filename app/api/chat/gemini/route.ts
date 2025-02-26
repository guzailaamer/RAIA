import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Extract system message and chat history
    const systemMessage = messages[0];
    const chatHistory = messages.slice(1);
    
    // Start chat with system context
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2048,
      },
    });

    // Send system message first
    await chat.sendMessage(systemMessage.content);
    
    // Add chat history
    for (let i = 0; i < chatHistory.length - 1; i++) {
      const msg = chatHistory[i];
      if (msg.role === 'user') {
        await chat.sendMessage(msg.content);
      }
    }
    
    // Send latest message
    const result = await chat.sendMessage(chatHistory[chatHistory.length - 1].content);
    const response = await result.response;
    
    return NextResponse.json({
      choices: [{
        message: {
          content: response.text(),
          role: 'assistant'
        }
      }]
    });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 


