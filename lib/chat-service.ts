import { useInterviewContext } from './interview-context'

export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export async function sendChatMessage(messages: Message[]) {
  const context = useInterviewContext.getState()
  
  // Create system message with context
  const systemMessage: Message = {
    role: 'system',
    content: `You are an AI interviewer conducting a job interview. Here's the context:
    
Company: ${context.company}
Position: Software Engineer
Job Description: ${context.jobDescription}
Candidate's Resume: ${context.resume}

Please conduct the interview in ${context.language}. Ask relevant questions based on the job description and candidate's background. Provide constructive feedback and evaluate answers professionally.`
  }

  const response = await fetch('/api/chat/gemini', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      messages: [systemMessage, ...messages]
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send message');
  }

  return response.json();
} 