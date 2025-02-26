"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, Send, Video, X, Loader2, MessageSquare } from "lucide-react"
import { sendChatMessage } from '@/lib/chat-service'
import { useAuth } from "@/contexts/AuthContext"
import { TranscriptionService } from "@/lib/transcription-service"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type Transcript = {
  id: string;
  speaker: 'interviewer' | 'interviewee';
  text: string;
  timestamp: number;
}

const formatGeminiResponse = (text: string) => {
  // Format bold text
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Format terms and definitions
  text = text.replace(/(\w+):\s/g, '<strong class="font-semibold">$1: </strong>');
  
  // Format bullet points
  text = text.replace(/• (.*?)(?=(?:• |\n|$))/g, '<li>$1</li>');
  if (text.includes('<li>')) {
    text = '<ul class="list-disc pl-4 space-y-2">' + text + '</ul>';
  }

  // Format numbered lists (handles both "1." and "1. 1." formats)
  text = text.replace(/(?:^\d+\.\s*\d+\.|^\d+\.)\s*(.*?)(?=(?:\d+\.\s*\d+\.|\d+\.|\n|$))/gm, '<li>$1</li>');
  if (text.match(/\d+\./)) {
    text = '<ol class="list-decimal pl-4 space-y-2">' + text + '</ol>';
  }

  // Add spacing between paragraphs
  text = text.replace(/\n\n/g, '</p><p class="mb-4">');
  text = '<p class="mb-4">' + text + '</p>';

  // Clean up any double-wrapped paragraphs
  text = text.replace(/<p class="mb-4">(\s*)<\/p>/g, '');

  return text;
};

// Define the type for the event
interface TranscriptEvent {
  TranscriptEvent: {
    Transcript: {
      Results: Array<{
        IsPartial: boolean;
        Alternatives: Array<{
          Transcript: string;
        }>;
      }>;
    };
  };
}

export default function InterviewRoom() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [meetLink, setMeetLink] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isMicOff, setIsMicOff] = useState(false);
  const [deviceStream, setDeviceStream] = useState<MediaStream | null>(null);
  const [transcripts, setTranscripts] = useState<Transcript[]>([
    {
      id: '1',
      speaker: 'interviewer',
      text: 'Hello! Could you introduce yourself?',
      timestamp: Date.now()
    },
    {
      id: '2',
      speaker: 'interviewee',
      text: 'Hi! I am a software engineer with 3 years of experience.',
      timestamp: Date.now() + 1000
    }
  ])
  const [isTranscribing, setIsTranscribing] = useState(false)
  const transcriptionService = useRef<TranscriptionService>(new TranscriptionService());
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (user) {
      const meetUrl = `https://meet.google.com/lookup/${user.uid}`;
      setMeetLink(meetUrl);
    }
  }, [user]);

  const startDeviceStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setDeviceStream(stream);
    } catch (error) {
      console.error("Error accessing devices:", error);
    }
  };

  useEffect(() => {
    startDeviceStream();
    return () => {
      if (deviceStream) {
        deviceStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCapture = async () => {
    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });

      if (videoRef.current) {
        videoRef.current.srcObject = displayStream;
      }

      setStream(displayStream);
      setIsCapturing(true);
    } catch (error) {
      console.error("Error starting capture:", error);
      alert("Failed to start capture. Please ensure you've granted screen sharing permission.");
    }
  };

  const endCapture = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setStream(null);
    setIsCapturing(false);
  };

  const toggleCamera = async () => {
    if (deviceStream) {
      const videoTrack = deviceStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!isCameraOff);
      }
    }
  };

  const toggleMic = async () => {
    if (deviceStream) {
      const audioTrack = deviceStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOff(!isMicOff);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const response = await sendChatMessage([...messages, userMessage]);
      
      const formattedContent = formatGeminiResponse(response.choices[0].message.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: formattedContent
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startTranscription = async () => {
    if (!stream) return;

    try {
      setIsTranscribing(true);

      // Initialize transcription service
      transcriptionService.current = new TranscriptionService();

      // Set up audio processing
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(1024, 1, 1);

      source.connect(processor);
      processor.connect(audioContext.destination);

      // Create a readable stream from audio data
      const audioStream = new ReadableStream({
        start(controller) {
          processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmData = new Int16Array(inputData.length);
            for (let i = 0; i < inputData.length; i++) {
              pcmData[i] = inputData[i] * 0x7fff;
            }
            controller.enqueue(pcmData.buffer);
          };
        },
        cancel() {
          processor.disconnect();
          source.disconnect();
          audioContext.close();
        },
      });

      // Start transcription
      const response = await transcriptionService.current.startTranscription(audioStream);

      // Handle transcription results
      if (response.TranscriptResultStream) {
        for await (const event of response.TranscriptResultStream) {
          if (event.TranscriptEvent?.Transcript?.Results?.[0]) {
            const result = event.TranscriptEvent.Transcript.Results[0];
            if (!result.IsPartial) {
              const newTranscript = {
                id: Date.now().toString(),
                speaker: result.ChannelId === "0" ? "interviewer" : "interviewee" as 'interviewer' | 'interviewee',
                text: result.Alternatives?.[0].Transcript || "",
                timestamp: Date.now(),
              };
              setTranscripts((prev) => [...prev, newTranscript]);
            }
          }
        }
      } else {
        console.error("TranscriptResultStream is undefined");
      }

    } catch (error) {
      console.error("Failed to start transcription:", error);
      setIsTranscribing(false);
    }
  };

  const stopTranscription = () => {
    if (transcriptionService.current) {
      // Clean up transcription
      transcriptionService.current.stopTranscription();
    }
    setIsTranscribing(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center justify-between border-b px-6">
        <h1 className="text-lg font-semibold">Interview Session</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant={isCameraOff ? "destructive" : "ghost"} 
            size="icon"
            onClick={toggleCamera}
            disabled={!deviceStream}
          >
            <Video className="h-4 w-4" />
          </Button>
          <Button 
            variant={isMicOff ? "destructive" : "ghost"} 
            size="icon"
            onClick={toggleMic}
            disabled={!deviceStream}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-2 gap-4 p-4">
        <div className="col-span-1 flex flex-col gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="border-b px-4 py-2 flex flex-row justify-between items-center">
              <h2 className="font-semibold">Video Call</h2>
              <Button 
                onClick={isCapturing ? endCapture : startCapture}
                variant={isCapturing ? "destructive" : "default"}
                size="sm"
              >
                {isCapturing ? "End Capture" : "Start Capture"}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                className="w-full aspect-video object-contain bg-black"
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader className="border-b px-4 py-2 flex flex-row justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <h2 className="font-semibold">Live Transcription</h2>
              </div>
              <Button
                onClick={isTranscribing ? stopTranscription : startTranscription}
                variant={isTranscribing ? "destructive" : "default"}
                size="sm"
                className="gap-2"
              >
                {isTranscribing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Stop
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Start
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[200px]">
                <div className="flex flex-col gap-2 p-3">
                  {transcripts.map((transcript) => (
                    <div
                      key={transcript.id}
                      className={`flex ${transcript.speaker === 'interviewer' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`rounded-lg px-3 py-1.5 max-w-[80%] ${
                          transcript.speaker === 'interviewer'
                            ? 'bg-muted text-muted-foreground'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <div className="text-xs opacity-70 mb-0.5">
                          {transcript.speaker === 'interviewer' ? 'Interviewer' : 'You'}
                        </div>
                        <p className="text-sm">{transcript.text}</p>
                      </div>
                    </div>
                  ))}
                  {isTranscribing && (
                    <div className="flex items-center gap-2 text-muted-foreground justify-center">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <p className="text-xs">Transcribing...</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-200">
          <CardHeader className="border-b px-4 py-2">
            <h2 className="font-semibold">Chat</h2>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[calc(100vh-9rem)]">
              <div className="flex flex-col gap-4 p-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted prose prose-sm max-w-none"
                      }`}
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>Please wait while Gemini answers your question!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
            <Separator />
            <form onSubmit={handleSubmit} className="flex items-center gap-2 p-4">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Type your message..." 
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

