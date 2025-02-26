import Link from "next/link"
import { MessageSquare, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-8 text-3xl font-bold">Welcome to Interview-AI</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>AI Interview Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Real-time AI Interview Assistant powered by Gemini. Practice your interview skills with instant feedback.
            </p>
            <Link href="/interview/setup?model=gemini">
              <Button className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Start Interview
              </Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Apply Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              Let our AI agent help you apply to jobs by automatically answering screening questions.
            </p>
            <Button variant="outline" className="gap-2">
              <Send className="h-4 w-4" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

