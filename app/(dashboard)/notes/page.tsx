"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

const courses = [
  {
    id: "notes",
    name: "Unit Wise Notes",
    subjects: [
      {
        id: "ds",
        name: "Data Structures",
        notes: [
          { id: "ds1", title: "Introduction", file: "/notes/bca/ds/intro.pdf" },
          { id: "ds2", title: "Linked List", file: "/notes/bca/ds/linkedlist.pdf" },
        ],
      },
      {
        id: "os",
        name: "Operating Systems",
        notes: [
          { id: "os1", title: "Processes", file: "/notes/bca/os/processes.pdf" },
          { id: "os2", title: "Memory Management", file: "/notes/bca/os/memory.pdf" },
        ],
      },
    ],
  },
  {
    id: "pyqs",
    name: "PYQs Solutions",
    subjects: [
      {
        id: "dbms",
        name: "Database Systems",
        notes: [
          { id: "db1", title: "ER Diagrams", file: "/notes/mcs/dbms/er.pdf" },
        ],
      },
    ],
  },
  {
    id: "livenotes",
    name: "Live Class Notes",
    subjects: [
      {
        id: "dbms",
        name: "Database Systems",
        notes: [
          { id: "db1", title: "ER Diagrams", file: "/notes/mcs/dbms/er.pdf" },
        ],
      },
    ],
  },
]

export default function NotesPage() {
  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 space-y-8">
      <h1 className="text-4xl font-bold text-gray-800">📚 Course Notes</h1>
      <p className="text-gray-600">Click on a course to explore subjects and download/view notes.</p>

      {courses.map((course) => (
        <Accordion key={course.id} type="single" collapsible className="w-full">
          <AccordionItem value={course.id} className="border rounded-xl shadow-sm mb-4">
            <AccordionTrigger className="text-xl font-semibold px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-t-xl">
              {course.name}
            </AccordionTrigger>
            <AccordionContent className="px-6 py-4 bg-white rounded-b-xl">
              {course.subjects.map((subject) => (
                <Accordion key={subject.id} type="single" collapsible className="mb-3">
                  <AccordionItem value={subject.id} className="border rounded-lg shadow-sm">
                    <AccordionTrigger className="text-lg px-5 py-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg">
                      {subject.name}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 py-4 bg-white rounded-b-lg">
                      <ul className="space-y-3">
                        {subject.notes.map((note) => (
                          <li
                            key={note.id}
                            className="flex items-center justify-between bg-gray-50 border p-4 rounded-lg shadow-sm hover:shadow-md transition"
                          >
                            <span className="font-medium text-gray-700">{note.title}</span>
                            <div className="space-x-3">
                              <Link href={note.file} target="_blank">
                                <button className="px-4 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow">
                                  View
                                </button>
                              </Link>
                              <a href={note.file} download>
                                <button className="px-4 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow">
                                  Download
                                </button>
                              </a>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  )
}
