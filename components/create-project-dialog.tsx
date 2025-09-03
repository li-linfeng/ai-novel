"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Loader2 } from "lucide-react"
import { projectApi, type ProjectCreateData } from "@/lib/api"

interface GenreItem {
  id: number
  name: string
  parent_id: number
  children?: GenreItem[]
}

interface ProjectFormData {
  title: string
  target_words: number
  genre: string  // 保存选中的子类题材名称
  genre_id?: number  // 保存选中的子类题材ID
  parent_genre?: string  // 保存父类题材名称
  description?: string
}

interface ProjectFormErrors {
  title?: string
  target_words?: string
  genre?: string
  description?: string
}

interface CreateProjectDialogProps {
  onCreateProject: (projectData: ProjectFormData) => void
  trigger?: React.ReactNode
}

export function CreateProjectDialog({ onCreateProject, trigger }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [genres, setGenres] = useState<GenreItem[]>([])
  const [selectedParentGenre, setSelectedParentGenre] = useState<string>("")
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    target_words: 100000,
    genre: "",
    genre_id: undefined,
    parent_genre: undefined,
    description: ""
  })
  const [errors, setErrors] = useState<ProjectFormErrors>({})

  // 获取项目配置（如题材选项）
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)
        const response = await projectApi.getProjectConfig()
        if (response.success && response.data?.genre && Array.isArray(response.data.genre)) {
          const genreData = response.data.genre as GenreItem[]
          if (genreData.every(item => 
            typeof item === 'object' && 
            'id' in item && 
            'name' in item && 
            'parent_id' in item
          )) {
            setGenres(genreData)
            // 重置选择
            setSelectedParentGenre("")
            setFormData(prev => ({
              ...prev,
              genre: "",
              genre_id: undefined,
              parent_genre: undefined
            }))
          } else {
            throw new Error('题材数据格式不正确')
          }
        } else {
          throw new Error(response.error || '获取题材列表失败')
        }
      } catch (error) {
        console.error('Failed to fetch project config:', error)
        setErrors(prev => ({
          ...prev,
          genre: error instanceof Error ? error.message : '获取题材列表失败'
        }))
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchConfig()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 表单验证
    const newErrors: ProjectFormErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = "项目名称不能为空"
    }
    
    if (!selectedParentGenre) {
      newErrors.genre = "请选择主题材"
    } else if (!formData.genre) {
      newErrors.genre = "请选择子题材"
    }
    
    if (formData.target_words < 1000) {
      newErrors.target_words = "预估字数不能少于1000字"
    }
    
    if (formData.target_words > 10000000) {
      newErrors.target_words = "预估字数不能超过1000万字"
    }
    
    setErrors(newErrors)
    
    // 如果没有错误，提交表单
    if (Object.keys(newErrors).length === 0) {
      setLoading(true)
      
      try {
        const createData: ProjectCreateData = {
          title: formData.title,
          genre: formData.genre,
          target_words: formData.target_words,
          description: formData.description
        }
        
        const response = await projectApi.createProject(createData)
        
        if (response.success) {
          // 调用父组件的回调函数
          onCreateProject(formData)
          setOpen(false)
          // 重置表单
          resetForm()
        } else {
          // 显示后端返回的错误信息（4xx/5xx状态码的message）
          setErrors({ title: response.error || '创建项目失败' })
        }
      } catch (error) {
        console.error('Create project failed:', error)
        setErrors({ title: '创建项目时发生错误' })
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setSelectedParentGenre("")
    setFormData({
      title: "",
      target_words: 100000,
      genre: "",
      genre_id: undefined,
      parent_genre: undefined,
      description: ""
    })
    setErrors({})
  }

  const handleCancel = () => {
    setOpen(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            新建项目
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">创建新项目</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 项目名称 */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              项目名称 <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="请输入项目名称"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={errors.title ? "border-red-500" : ""}
              disabled={loading}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* 预估字数 */}
          <div className="space-y-2">
            <Label htmlFor="target_words" className="text-sm font-medium">
              预估字数 <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="target_words"
                type="number"
                placeholder="100000"
                min="1000"
                max="10000000"
                step="1000"
                value={formData.target_words}
                onChange={(e) => setFormData({ ...formData, target_words: parseInt(e.target.value) || 0 })}
                className={errors.target_words ? "border-red-500" : ""}
                disabled={loading}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">字</span>
            </div>
            {errors.target_words && <p className="text-sm text-red-500">{errors.target_words}</p>}
            <p className="text-xs text-gray-500">建议：短篇小说 1-5万字，中篇小说 5-15万字，长篇小说 15万字以上</p>
          </div>

          {/* 题材选择（两级） */}
          <div className="space-y-4">
            {/* 主题材 */}
            <div className="space-y-2">
              <Label htmlFor="parent-genre" className="text-sm font-medium">
                主题材 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={selectedParentGenre}
                onValueChange={(value) => {
                  setSelectedParentGenre(value)
                  setFormData(prev => ({
                    ...prev,
                    genre: "",
                    genre_id: undefined,
                    parent_genre: value
                  }))
                }}
                disabled={loading}
              >
                <SelectTrigger 
                  className={`${errors.genre ? "border-red-500" : ""} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <SelectValue placeholder={loading ? "加载中..." : "请选择主题材"} />
                </SelectTrigger>
                <SelectContent>
                  {genres.length > 0 ? (
                    genres.map((genre) => (
                      <SelectItem key={genre.id} value={genre.name}>
                        {genre.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-gray-500">
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          加载中...
                        </div>
                      ) : (
                        "暂无可选题材"
                      )}
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* 子题材 */}
            {selectedParentGenre && (
              <div className="space-y-2">
                <Label htmlFor="sub-genre" className="text-sm font-medium">
                  子题材 <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.genre}
                  onValueChange={(value) => {
                    const parentGenre = genres.find(g => g.name === selectedParentGenre)
                    const subGenre = parentGenre?.children?.find(c => c.name === value)
                    setFormData(prev => ({
                      ...prev,
                      genre: value,
                      genre_id: subGenre?.id
                    }))
                  }}
                  disabled={loading}
                >
                  <SelectTrigger 
                    className={`${errors.genre ? "border-red-500" : ""} ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <SelectValue placeholder="请选择子题材" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.find(g => g.name === selectedParentGenre)?.children?.map((subGenre) => (
                      <SelectItem key={subGenre.id} value={subGenre.name}>
                        {subGenre.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {errors.genre && <p className="text-sm text-red-500">{errors.genre}</p>}
          </div>

          {/* 项目描述（可选） */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              项目描述 <span className="text-gray-400">(可选)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="简单描述您的项目构想..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="resize-none"
              disabled={loading}
            />
          </div>

          {/* 按钮组 */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
              取消
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  创建中...
                </>
              ) : (
                '创建项目'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}