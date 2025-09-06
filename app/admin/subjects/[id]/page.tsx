"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import SubjectManager from "./subject-manager"

type Subject = {
  id: string
  name: string
  course: {
    id: string
    title: string
  }
}

export default function SubjectDetailPage() {
  const params = useParams<{ id: string }>()
  const [subject, setSubject] = useState<Subject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await fetch(`/api/subjects/${params.id}`)
        if (!res.ok) throw new Error("Failed to fetch subject")
        const data = await res.json()
        setSubject(data)
      } catch (err) {
        console.error(err)
        setSubject(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSubject()
  }, [params.id])

  if (loading) {
    return <p className="text-gray-500">Loading...</p>
  }

  if (!subject) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h1 className="text-xl font-bold">❌ Subject not found</h1>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{subject.name}</h1>
      <p className="text-gray-600">📘 Course: {subject.course.title}</p>

      {/* Client-side manager for CRUD */}
      <div className="mt-6">
        <SubjectManager subjectId={subject.id} />
      </div>
    </div>
  )
}
