"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Download, Edit, Save, User, BookOpen, Mail } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function ProfilePage() {
  const [mode, setMode] = useState<"card" | "resume" | "edit">("card")

  // Profile Data
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@email.com")
  const [course, setCourse] = useState("BCA - Semester 2")
  const [bio, setBio] = useState("Passionate learner, exploring programming & new technologies.")
  const [skills, setSkills] = useState("JavaScript, React, Python, SQL")
  const [education, setEducation] = useState("XYZ University, 2nd Semester")
  const profileRef = useRef<HTMLDivElement>(null)

  // Download as PDF
  const handleDownload = async () => {
    if (profileRef.current) {
      const canvas = await html2canvas(profileRef.current)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight)
      pdf.save("profile.pdf")
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      {/* Mode Switch */}
      <div className="flex gap-4">
        <Button variant={mode === "card" ? "default" : "outline"} onClick={() => setMode("card")}>Card Mode</Button>
        <Button variant={mode === "resume" ? "default" : "outline"} onClick={() => setMode("resume")}>Resume Mode</Button>
        <Button variant={mode === "edit" ? "default" : "outline"} onClick={() => setMode("edit")}>Edit Mode</Button>
      </div>

      {/* Card Mode */}
      {mode === "card" && (
        <Card ref={profileRef} className="shadow-xl rounded-2xl w-full md:w-1/2 mx-auto">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="w-28 h-28 mb-4">
              <AvatarImage src="https://via.placeholder.com/150" alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-gray-500 flex items-center gap-2"><Mail className="w-4 h-4" /> {email}</p>
            <p className="text-gray-500 flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course}</p>
            <p className="mt-4 text-gray-700">{bio}</p>
            <Button className="mt-6 flex items-center gap-2" onClick={handleDownload}>
              <Download className="w-4 h-4" /> Download
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Resume Mode */}
      {mode === "resume" && (
        <div ref={profileRef} className="bg-white shadow-lg rounded-2xl p-6 space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-6">
            <Avatar className="w-28 h-28">
              <AvatarImage src="https://via.placeholder.com/150" alt={name} />
              <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-gray-500 flex items-center gap-2"><Mail className="w-4 h-4" /> {email}</p>
              <p className="text-gray-500 flex items-center gap-2"><BookOpen className="w-4 h-4" /> {course}</p>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">About Me</h3>
            <p className="text-gray-700">{bio}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Skills</h3>
            <p className="text-gray-700">{skills}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Education</h3>
            <p className="text-gray-700">{education}</p>
          </div>
          <Button className="flex items-center gap-2" onClick={handleDownload}>
            <Download className="w-4 h-4" /> Download Resume
          </Button>
        </div>
      )}

      {/* Edit Mode */}
      {mode === "edit" && (
        <Card className="shadow-lg rounded-2xl w-full md:w-2/3 mx-auto">
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <label>Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label>Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label>Course</label>
              <Input value={course} onChange={(e) => setCourse(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label>Bio</label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label>Skills</label>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label>Education</label>
              <Input value={education} onChange={(e) => setEducation(e.target.value)} />
            </div>
            <Button className="w-full flex items-center gap-2" onClick={() => setMode("card")}>
              <Save className="w-4 h-4" /> Save Profile
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
