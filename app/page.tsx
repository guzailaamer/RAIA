import Link from "next/link"
import { ArrowRight, MessageSquare, Upload, Video } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="text-xl font-bold">Interview-AI</div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Your Real-Time
            <span className="block text-primary">AI Interview Assistant</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
            Automatically get an answer to every job interview question with advanced AI technology. Practice and
            improve your interview skills with real-time feedback.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="gap-2">
                Try For Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <Video className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Real-time Interview</h3>
                <p className="text-center text-muted-foreground">
                  Practice with our AI interviewer in real-time video sessions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <MessageSquare className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">AI Feedback</h3>
                <p className="text-center text-muted-foreground">
                  Get instant feedback and suggestions to improve your responses
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center gap-4 p-6">
                <Upload className="h-12 w-12 text-primary" />
                <h3 className="text-xl font-semibold">Resume Analysis</h3>
                <p className="text-center text-muted-foreground">
                  Upload your resume for personalized interview preparation
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

