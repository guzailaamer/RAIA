"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Globe } from "lucide-react"
import { useInterviewContext } from "@/lib/interview-context"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ResumeUploadModal } from "@/components/resume-upload-modal"

export default function InterviewSetup() {
  const router = useRouter()
  const { setContext } = useInterviewContext()
  const [showResumeModal, setShowResumeModal] = useState(false)
  const [formData, setFormData] = useState({
    company: "",
    jobDescription: "",
    language: "English",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setContext(formData)
    setShowResumeModal(true)
  }

  const handleResumeUpload = async (resumeText: string) => {
    try {
      setContext({ resume: resumeText })
      router.push('/interview/room')
    } catch (error) {
      console.error("Error handling resume upload:", error)
    }
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Interview Setup (30 min)</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <Input
                placeholder="Microsoft..."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Description</label>
              <Textarea
                placeholder="Software Engineer versed in Python, SQL, and AWS..."
                value={formData.jobDescription}
                onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {formData.language}
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="ghost" type="button" onClick={() => router.back()}>
              Close
            </Button>
            <Button type="submit">Next</Button>
          </CardFooter>
        </form>
      </Card>

      {showResumeModal && (
        <ResumeUploadModal 
          onUpload={handleResumeUpload}
          onClose={() => setShowResumeModal(false)}
        />
      )}
    </div>
  )
}

