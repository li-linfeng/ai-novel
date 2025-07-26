"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lightbulb, Plus, Search, Star, Bookmark, Trash2, Edit } from "lucide-react"

interface Inspiration {
  id: string
  title: string
  content: string
  type: "idea" | "character" | "scene" | "dialogue" | "worldbuilding" | "plot"
  tags: string[]
  createdAt: string
  isFavorite: boolean
  source?: string
  relatedProject?: string
}

export function InspirationManager() {
  const [inspirations, setInspirations] = useState<Inspiration[]>([
    {
      id: "1",
      title: "时空裂缝的视觉描述",
      content: "裂缝边缘闪烁着蓝紫色的光芒，像是被撕裂的现实织物，透过缝隙可以看到另一个世界的景象...",
      type: "scene",
      tags: ["科幻", "视觉描述", "时空"],
      createdAt: "2024-01-20",
      isFavorite: true,
      relatedProject: "时空守护者",
    },
    {
      id: "2",
      title: "反派角色动机",
      content:
        "他并不是纯粹的邪恶，而是因为失去了最重要的人，才选择了这条道路。他相信只有重塑世界，才能找回失去的一切。",
      type: "character",
      tags: ["角色设定", "反派", "动机"],
      createdAt: "2024-01-19",
      isFavorite: false,
      relatedProject: "时空守护者",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const [isAddingNew, setIsAddingNew] = useState(false)

  const typeColors = {
    idea: "bg-yellow-100 text-yellow-800",
    character: "bg-blue-100 text-blue-800",
    scene: "bg-green-100 text-green-800",
    dialogue: "bg-purple-100 text-purple-800",
    worldbuilding: "bg-orange-100 text-orange-800",
    plot: "bg-red-100 text-red-800",
  }

  const typeLabels = {
    idea: "创意想法",
    character: "角色灵感",
    scene: "场景描述",
    dialogue: "对话灵感",
    worldbuilding: "世界观",
    plot: "情节构思",
  }

  const filteredInspirations = inspirations.filter((inspiration) => {
    const matchesSearch =
      inspiration.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspiration.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inspiration.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === "all" || inspiration.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">灵感库</h2>
          <p className="text-gray-600">收集和管理您的创作灵感</p>
        </div>
        <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              添加灵感
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>添加新灵感</DialogTitle>
            </DialogHeader>
            <AddInspirationForm onClose={() => setIsAddingNew(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="搜索灵感..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={selectedType} onValueChange={setSelectedType}>
          <TabsList>
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="idea">创意</TabsTrigger>
            <TabsTrigger value="character">角色</TabsTrigger>
            <TabsTrigger value="scene">场景</TabsTrigger>
            <TabsTrigger value="plot">情节</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Inspirations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInspirations.map((inspiration) => (
          <InspirationCard key={inspiration.id} inspiration={inspiration} />
        ))}
      </div>

      {filteredInspirations.length === 0 && (
        <div className="text-center py-12">
          <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无灵感记录</h3>
          <p className="text-gray-600 mb-4">开始记录您的创作灵感吧</p>
          <Button onClick={() => setIsAddingNew(true)}>
            <Plus className="h-4 w-4 mr-2" />
            添加第一个灵感
          </Button>
        </div>
      )}
    </div>
  )
}

function InspirationCard({ inspiration }: { inspiration: Inspiration }) {
  const typeColors = {
    idea: "bg-yellow-100 text-yellow-800",
    character: "bg-blue-100 text-blue-800",
    scene: "bg-green-100 text-green-800",
    dialogue: "bg-purple-100 text-purple-800",
    worldbuilding: "bg-orange-100 text-orange-800",
    plot: "bg-red-100 text-red-800",
  }

  const typeLabels = {
    idea: "创意想法",
    character: "角色灵感",
    scene: "场景描述",
    dialogue: "对话灵感",
    worldbuilding: "世界观",
    plot: "情节构思",
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={typeColors[inspiration.type]}>{typeLabels[inspiration.type]}</Badge>
              {inspiration.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            </div>
            <CardTitle className="text-lg">{inspiration.title}</CardTitle>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-sm mb-3 line-clamp-3">{inspiration.content}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {inspiration.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{inspiration.createdAt}</span>
          {inspiration.relatedProject && (
            <span className="flex items-center">
              <Bookmark className="h-3 w-3 mr-1" />
              {inspiration.relatedProject}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function AddInspirationForm({ onClose }: { onClose: () => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">标题</label>
        <Input placeholder="给这个灵感起个标题..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">类型</label>
        <select className="w-full p-2 border rounded-md">
          <option value="idea">创意想法</option>
          <option value="character">角色灵感</option>
          <option value="scene">场景描述</option>
          <option value="dialogue">对话灵感</option>
          <option value="worldbuilding">世界观</option>
          <option value="plot">情节构思</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">内容</label>
        <Textarea placeholder="详细描述您的灵感..." className="min-h-[120px]" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">标签</label>
        <Input placeholder="用逗号分隔多个标签..." />
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          取消
        </Button>
        <Button onClick={onClose}>保存灵感</Button>
      </div>
    </div>
  )
}
