"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertTriangle, Download } from "lucide-react"

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  projectTitle: string
  exportProgress: number
  setExportProgress: (progress: number) => void
  isExporting: boolean
  setIsExporting: (exporting: boolean) => void
}

export function ExportDialog({
  isOpen,
  onClose,
  projectTitle,
  exportProgress,
  setExportProgress,
  isExporting,
  setIsExporting,
}: ExportDialogProps) {
  const [exportStatus, setExportStatus] = useState<"idle" | "exporting" | "success" | "error">("idle")

  useEffect(() => {
    if (isOpen && isExporting) {
      setExportStatus("exporting")
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setExportProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setExportStatus("success")
          }, 500)
        }
      }, 200)

      return () => clearInterval(interval)
    } else if (isOpen && !isExporting) {
      setExportStatus("idle")
      setExportProgress(0)
    }
  }, [isOpen, isExporting, setExportProgress])

  const handleExport = () => {
    setIsExporting(true)
    setExportStatus("exporting")
  }

  const handleClose = () => {
    setIsExporting(false)
    setExportProgress(0)
    setExportStatus("idle")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>导出项目</DialogTitle>
          <DialogDescription>
            将您的项目 <strong>{projectTitle}</strong> 导出为多种格式
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {exportStatus === "idle" && <p className="text-gray-600">选择导出格式：</p>}

          {exportStatus === "exporting" && (
            <div className="space-y-2">
              <p className="text-gray-600">正在导出...</p>
              <Progress value={exportProgress} />
              <p className="text-sm text-gray-500">已完成 {exportProgress}%</p>
            </div>
          )}

          {exportStatus === "success" && (
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <p>导出成功！</p>
            </div>
          )}

          {exportStatus === "error" && (
            <div className="flex items-center space-x-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <p>导出失败，请重试</p>
            </div>
          )}
        </div>

        <DialogFooter>
          {exportStatus === "idle" ? (
            <Button onClick={handleExport} disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              开始导出
            </Button>
          ) : (
            <Button onClick={handleClose} disabled={isExporting}>
              关闭
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
