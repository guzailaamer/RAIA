"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Mail, Phone, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    bio: "Experienced software engineer with a passion for AI and machine learning.",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle profile update logic here
    console.log("Profile updated:", profile)
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="relative h-24 w-24">
                <img src="/placeholder.svg?height=96&width=96" alt="Profile" className="rounded-full object-cover" />
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">Manage your account settings</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-y-0 left-0 w-10 bg-muted/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-y-0 left-0 w-10 bg-muted/50" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="absolute inset-y-0 left-0 w-10 bg-muted/50" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} rows={4} />
            </div>

            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

