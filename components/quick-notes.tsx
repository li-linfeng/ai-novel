"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { StickyNote, Plus, X, Pin, Clock } from "lucide-react"

interface QuickNote {
  id: string
  content: string
  createdAt: string
  isPinned: boolean
  color: "yellow" | "blue" | "green" | "pink" | "purple"
  relatedProject?: string
}

export function QuickNotes() {
  const [notes, setNotes] = useState<QuickNote[]>([
    {
      id: "1",
      content: "主角在第三章需要展现更多的内心挣扎，可以通过回忆童年的片段来体现",
      createdAt: "2024-01-20 14:30",
      isPinned: true,
      color: "yellow",
      relatedProject: "时空守护者",
    },
    {
      id: "2",
      content: "反派的台词：'你以为拯救一个世界就能弥补失去的一切吗？'",
      createdAt: "2024-01-20 10:15",
      isPinned: false,
      color: "blue",
      relatedProject: "时空守护者",
    },
  ])

  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")

  const colorClasses = {
    yellow: "bg-yellow-100 border-yellow-200",
    blue: "bg-blue-100 border-blue-200",
    green: "bg-green-100 border-green-200",
    pink: "bg-pink-100 border-pink-200",
    purple: "bg-purple-100 border-purple-200",
  }

  const addNote = () => {
    if (newNoteContent.trim()) {
      const newNote: QuickNote = {
        id: Date.now().toString(),
        content: newNoteContent,
        createdAt: new Date().toLocaleString(),
        isPinned: false,
        color: "yellow",
      }
      setNotes([newNote, ...notes])
      setNewNoteContent("")
      setIsAddingNote(false)
    }
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const togglePin = (id: string) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, isPinned: !note.isPinned } : note)))
  }

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <StickyNote className="h-5 w-5 text-yellow-600" />
          <h3 className="font-semibold">快速笔记</h3>
          <Badge variant="secondary">{notes.length}</Badge>
        </div>
        <Dialog open={isAddingNote} onOpenChange={setIsAddingNote}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">添加快速笔记</h3>
              <Textarea
                placeholder="记录您的想法..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddingNote(false)}>
                  取消
                </Button>
                <Button onClick={addNote}>保存</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
        {sortedNotes.map((note) => (
          <Card key={note.id} className={`${colorClasses[note.color]} border-2 relative group`}>
            <CardContent className="p-3">
              {note.isPinned && <Pin className="absolute top-2 right-2 h-3 w-3 text-gray-600" />}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => togglePin(note.id)}>
                  <Pin className={`h-3 w-3 ${note.isPinned ? "text-blue-600" : "text-gray-400"}`} />
                </Button>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => deleteNote(note.id)}>
                  <X className="h-3 w-3 text-red-500" />
                </Button>
              </div>
              <p className="text-sm text-gray-800 mb-2 pr-8">{note.content}</p>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {note.createdAt.split(" ")[0]}
                </span>
                {note.relatedProject && (
                  <Badge variant="secondary" className="text-xs">
                    {note.relatedProject}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">暂无笔记，点击上方按钮添加</p>
        </div>
      )}
    </div>
  )
}
