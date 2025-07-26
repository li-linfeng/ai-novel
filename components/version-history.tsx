"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { History, GitBranch, Eye, RotateCcw, Copy, Clock } from "lucide-react"

interface Version {
  id: string
  timestamp: string
  wordCount: number
  changes: string
  content: string
  isAutoSave: boolean
}

interface VersionHistoryProps {
  isOpen: boolean
  onClose: () => void
  chapterTitle: string
}

export function VersionHistory({ isOpen, onClose, chapterTitle }: VersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)
  const [showComparison, setShowComparison] = useState(false)

  // Mock version data
  const versions: Version[] = [
    {
      id: "v1",
      timestamp: "2024-01-20 15:30:25",
      wordCount: 1247,
      changes: "当前版本",
      content: "2087年的清晨，第一缕阳光透过智能玻璃幕墙洒进时空管理局总部大厅...",
      isAutoSave: false,
    },
    {
      id: "v2",
      timestamp: "2024-01-20 15:15:10",
      wordCount: 1180,
      changes: "添加了陈博士的对话",
      content: "2087年的清晨，第一缕阳光透过智能玻璃幕墙洒进时空管理局总部大厅...",
      isAutoSave: true,
    },
    {
      id: "v3",
      timestamp: "2024-01-20 14:45:33",
      wordCount: 950,
      changes: "完善了环境描写",
      content: "2087年的清晨，第一缕阳光透过智能玻璃幕墙洒进时空管理局总部大厅...",
      isAutoSave: true,
    },
    {
      id: "v4",
      timestamp: "2024-01-20 14:20:15",
      wordCount: 720,
      changes: "初始版本",
      content: "林晨站在时空管理局的大厅中...",
      isAutoSave: false,
    },
  ]

  const handleRestore = (versionId: string) => {
    // 恢复到指定版本的逻辑
    console.log("恢复到版本:", versionId)
    onClose()
  }

  const handleCompare = (versionId: string) => {
    setSelectedVersion(versionId)
    setShowComparison(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <History className="h-5 w-5 mr-2" />
            版本历史 - {chapterTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[60vh]">
          {/* Version List */}
          <div className="w-1/2 pr-4">
            <ScrollArea className="h-full">
              <div className="space-y-3">
                {versions.map((version, index) => (
                  <Card
                    key={version.id}
                    className={`cursor-pointer transition-colors ${
                      selectedVersion === version.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedVersion(version.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <GitBranch className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">版本 {versions.length - index}</span>
                          {version.isAutoSave && (
                            <Badge variant="secondary" className="text-xs">
                              自动保存
                            </Badge>
                          )}
                          {index === 0 && <Badge className="text-xs bg-green-100 text-green-800">当前</Badge>}
                        </div>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        <div className="flex items-center mb-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {version.timestamp}
                        </div>
                        <div>字数: {version.wordCount}</div>
                        <div>变更: {version.changes}</div>
                      </div>

                      <div className="flex space-x-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => handleCompare(version.id)}>
                          <Eye className="h-3 w-3 mr-1" />
                          预览
                        </Button>
                        {index !== 0 && (
                          <Button size="sm" variant="outline" onClick={() => handleRestore(version.id)}>
                            <RotateCcw className="h-3 w-3 mr-1" />
                            恢复
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Copy className="h-3 w-3 mr-1" />
                          复制
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          <Separator orientation="vertical" />

          {/* Content Preview */}
          <div className="w-1/2 pl-4">
            {selectedVersion ? (
              <div className="h-full">
                <div className="mb-4">
                  <h3 className="font-semibold">
                    版本预览 - {versions.find((v) => v.id === selectedVersion)?.timestamp}
                  </h3>
                  <p className="text-sm text-gray-600">
                    字数: {versions.find((v) => v.id === selectedVersion)?.wordCount}
                  </p>
                </div>
                <ScrollArea className="h-[calc(100%-60px)]">
                  <div className="prose prose-sm max-w-none">
                    <p className="leading-relaxed">{versions.find((v) => v.id === selectedVersion)?.content}</p>
                  </div>
                </ScrollArea>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>选择一个版本查看内容</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">共 {versions.length} 个版本</div>
          <div className="flex space-x-2">
            {showComparison && (
              <Button variant="outline" onClick={() => setShowComparison(false)}>
                对比版本
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>
              关闭
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
