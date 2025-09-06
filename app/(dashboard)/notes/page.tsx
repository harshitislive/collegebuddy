"use client"

import { useEffect, useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import UnlockContent from "@/components/features/unlock-content"
import { NoteCategory } from "@prisma/client"

type NoteWithRelations = {
  id: string
  title: string
  fileUrl: string
  category: NoteCategory
  subjectId: string
  subject: {
    name: string
    course: {
      id: string
      title: string
    }
  }
}

export default function NotesPage() {
  const [loading, setLoading] = useState(true)
  const [isLocked, setIsLocked] = useState(false)
  const [notes, setNotes] = useState<NoteWithRelations[]>([])

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch("/api/notes")

        if (res.status === 403) {
          setIsLocked(true)
          return
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        setNotes(data.notes)
      } catch (err) {
        console.error("Failed to fetch notes:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotes()
  }, [])

  // ✅ Fix grouping using subjectId (from API response)
  const grouped = notes.reduce((acc: any, note) => {
    const category = note.category
    if (!acc[category]) acc[category] = {}
    if (!acc[category][note.subjectId]) {
      acc[category][note.subjectId] = {
        id: note.subjectId,
        name: note.subject.name,
        course: note.subject.course.title,
        notes: [],
      }
    }
    acc[category][note.subjectId].notes.push({
      id: note.id,
      title: note.title,
      fileUrl: note.fileUrl,
    })
    return acc
  }, {})

  const categories = [
    { id: "UNIT", name: "Unit Wise Notes" },
    { id: "PYQ", name: "PYQs Solutions" },
    { id: "LIVE", name: "Live Class Notes" },
    { id: "EBOOKS", name: "E-Books" },
    { id: "Others", name: "Others" },
  ]

  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading notes...</p>
  }

  return (
    <UnlockContent isLocked={isLocked} fullPage>
      <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
        <h1 className="text-4xl font-bold text-gray-800">📚 Course Notes</h1>
        <p className="text-gray-600">
          Click on a category to explore subjects and download/view notes.
        </p>

        {categories.map((cat) => (
          <Accordion key={cat.id} type="single" collapsible className="w-full">
            <AccordionItem
              value={cat.id}
              className="border rounded-xl shadow-sm mb-4"
            >
              <AccordionTrigger className="text-xl font-semibold px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-t-xl">
                {cat.name}
              </AccordionTrigger>
              <AccordionContent className="px-6 py-4 bg-white rounded-b-xl">
                {grouped[cat.id] ? (
                  <Accordion type="single" collapsible className="w-full">
                    {Object.values(grouped[cat.id]).map((subject: any) => (
                      <AccordionItem
                        key={subject.id}
                        value={subject.id}
                        className="border rounded-lg shadow-sm mb-3"
                      >
                        <AccordionTrigger className="text-lg px-5 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg">
                          {subject.name}{" "}
                          <span className="ml-2 text-sm text-gray-500">
                            ({subject.course})
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-5 py-4 bg-white rounded-b-lg">
                          <ul className="space-y-3">
                            {subject.notes.map((note: any) => (
                              <li
                                key={note.id}
                                className="flex items-center justify-between bg-gray-50 border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                              >
                                <span className="font-medium text-gray-700">
                                  {note.title}
                                </span>
                                <div className="space-x-3">
                                  {/* 👀 View File */}
                                  <a
                                    href={note.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow"
                                  >
                                    View
                                  </a>
                                  {/* ⬇️ Download File */}
                                  <a
                                    href={note.fileUrl}
                                    download
                                    className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow"
                                  >
                                    Download
                                  </a>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-gray-500">No notes available.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </UnlockContent>
  )
}
