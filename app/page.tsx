"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  BookOpen,
  Lightbulb,
  FileText,
  List,
  Edit3,
  Save,
  Settings,
  ChevronRight,
  Plus,
  Check,
  ArrowLeft,
  ArrowRight,
  Download,
  Clock,
  Search,
  Brain,
  Focus,
  History,
  StickyNote,
  User,
  Zap,
  RefreshCw,
  Maximize2,
} from "lucide-react"

// Import components
import { VersionHistory } from "@/components/version-history"
import { QuickNotes } from "@/components/quick-notes"
import { RichTextEditor } from "@/components/rich-text-editor"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { projectApi } from "@/lib/api"

type Step = "creative" | "synopsis" | "outline" | "chapters" | "writing"
type ProjectStatus = "draft" | "in-progress" | "completed" | "paused"
type View = "dashboard" | "project"

interface Project {
  id: string  // 转换后的字符串ID，便于前端使用
  title: string
  genre: string
  status: ProjectStatus
  currentStep: Step
  progress: number
  wordCount: number
  targetWords: number
  description?: string
  lastModified: string
  createdAt: string
  completedSteps: Step[]
}

export default function AINovelPlatform() {
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentStep, setCurrentStep] = useState<Step>("creative")
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // 获取项目列表
  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await projectApi.getProjects()
      if (response.success && response.data) {
        // 转换API数据格式到本地格式
        const formattedProjects = response.data.map(project => ({
          id: project.id.toString(),  // 将数字ID转换为字符串
          title: project.title,
          genre: project.genre,
          status: project.status,
          currentStep: project.current_step as Step,
          progress: project.progress,
          wordCount: project.word_count,
          targetWords: project.target_words,
          description: project.description,
          lastModified: project.last_modified,
          createdAt: project.created_at,
          completedSteps: project.completed_steps as Step[]
        }))
        setProjects(formattedProjects)
      } else {
        // API调用失败，显示错误信息并使用默认数据
        console.error('Failed to fetch projects:', response.error)
        // 可以在这里添加用户友好的错误提示，比如toast通知
        throw new Error(response.error || 'API返回失败状态')
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error)
      // 使用默认数据作为后备
      setProjects([
        {
          id: "1",
          title: "时空守护者",
          genre: "科幻",
          status: "in-progress",
          currentStep: "writing",
          progress: 65,
          wordCount: 45000,
          targetWords: 250000,
          lastModified: "2024-01-20 14:30",
          createdAt: "2024-01-15",
          completedSteps: ["creative", "synopsis", "outline", "chapters"],
        },
        {
          id: "2",
          title: "星际商人传奇",
          genre: "太空歌剧",
          status: "in-progress",
          currentStep: "chapters",
          progress: 40,
          wordCount: 12000,
          targetWords: 300000,
          lastModified: "2024-01-19 09:15",
          createdAt: "2024-01-18",
          completedSteps: ["creative", "synopsis", "outline"],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // 页面初始化时获取项目列表
  useEffect(() => {
    fetchProjects()
  }, [])

  const steps = [
    { id: "creative", title: "创意输入", icon: Lightbulb, description: "设定题材风格" },
    { id: "synopsis", title: "故事梗概", icon: BookOpen, description: "AI生成梗概" },
    { id: "outline", title: "大纲制作", icon: FileText, description: "详细故事大纲" },
    { id: "chapters", title: "卷纲规划", icon: List, description: "章节级规划" },
    { id: "writing", title: "章节创作", icon: Edit3, description: "AI辅助写作" },
  ]

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project)
    setCurrentStep(project.currentStep)
    setCurrentView("project")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedProject(null)
  }

  const handleCreateProject = async (projectData: { title: string; target_words: number; genre: string; description?: string }) => {
    // 创建项目成功后，刷新项目列表
    await fetchProjects()
  }

  if (currentView === "dashboard") {
    return (
      <SimplifiedDashboard
        projects={projects}
        loading={loading}
        onProjectSelect={handleProjectSelect}
        onCreateProject={handleCreateProject}
      />
    )
  }

  return (
    <OptimizedWorkspace
      project={selectedProject!}
      currentStep={currentStep}
      steps={steps}
      onStepChange={setCurrentStep}
      onBackToDashboard={handleBackToDashboard}
      showVersionHistory={showVersionHistory}
      setShowVersionHistory={setShowVersionHistory}
    />
  )
}

// Simplified Dashboard
function SimplifiedDashboard({
  projects,
  loading,
  onProjectSelect,
  onCreateProject,
}: {
  projects: Project[]
  loading: boolean
  onProjectSelect: (project: Project) => void
  onCreateProject: (projectData: { title: string; target_words: number; genre: string; description?: string }) => void
}) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Desktop-optimized Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI小说创作平台</h1>
              <p className="text-sm text-gray-600">桌面版 v1.0</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <CreateProjectDialog onCreateProject={onCreateProject} />
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">开始您的创作之旅</h2>
            <p className="text-gray-600">选择一个项目继续创作，或创建新的故事</p>
          </div>

          {/* Search */}
          <div className="mb-8 max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="搜索项目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">加载项目中...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} onSelect={onProjectSelect} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">还没有项目</h3>
              <p className="text-gray-600 mb-6">创建您的第一个小说项目，开始AI辅助创作</p>
              <CreateProjectDialog 
                onCreateProject={onCreateProject}
                trigger={
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-5 w-5 mr-2" />
                    创建第一个项目
                  </Button>
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Enhanced Project Card
function ProjectCard({ project, onSelect }: { project: Project; onSelect: (project: Project) => void }) {
  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return "已完成"
      case "in-progress":
        return "进行中"
      case "paused":
        return "已暂停"
      default:
        return "草稿"
    }
  }

  return (
    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-sm">
                {project.genre}
              </Badge>
              <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">创作进度</span>
              <span className="font-semibold text-blue-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Word Count */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">字数统计</span>
            <span className="font-medium">
              {project.wordCount.toLocaleString()} / {project.targetWords.toLocaleString()}
            </span>
          </div>

          {/* Last Modified */}
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            最后修改：{project.lastModified.split(" ")[0]}
          </div>

          {/* Action Button */}
          <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => onSelect(project)}>
            继续创作
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Optimized Workspace
function OptimizedWorkspace({
  project,
  currentStep,
  steps,
  onStepChange,
  onBackToDashboard,
  showVersionHistory,
  setShowVersionHistory,
}: {
  project: Project
  currentStep: Step
  steps: any[]
  onStepChange: (step: Step) => void
  onBackToDashboard: () => void
  showVersionHistory: boolean
  setShowVersionHistory: (show: boolean) => void
}) {
  const [showQuickNotes, setShowQuickNotes] = useState(false)

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: ProjectStatus) => {
    switch (status) {
      case "completed":
        return "已完成"
      case "in-progress":
        return "进行中"
      case "paused":
        return "已暂停"
      default:
        return "草稿"
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "creative":
        return <CreativeInput />
      case "synopsis":
        return <SynopsisGeneration />
      case "outline":
        return <OutlineCreation />
      case "chapters":
        return <ChapterPlanning />
      case "writing":
        return <WritingEnvironment showVersionHistory={showVersionHistory} />
      default:
        return <CreativeInput />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Desktop-optimized Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBackToDashboard}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">{project.title}</h1>
              <Badge className={getStatusColor(project.status)}>{getStatusText(project.status)}</Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Save className="h-4 w-4 mr-2" />
              保存
            </Button>
            {currentStep === "writing" && (
              <Button variant="outline" size="sm" onClick={() => setShowVersionHistory(true)}>
                <History className="h-4 w-4 mr-2" />
                版本
              </Button>
            )}
            <Dialog open={showQuickNotes} onOpenChange={setShowQuickNotes}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <StickyNote className="h-4 w-4 mr-2" />
                  笔记
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>快速笔记</DialogTitle>
                </DialogHeader>
                <QuickNotes />
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              导出
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-72 bg-white border-r border-gray-200 p-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">创作流程</h2>
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.id
              const isCompleted = project.completedSteps.includes(step.id as Step)
              const isAccessible = isCompleted || project.completedSteps.length >= index || index === 0

              return (
                <div key={step.id} className="relative">
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-auto p-4 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : isCompleted
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : isAccessible
                            ? "text-gray-600 hover:bg-gray-50"
                            : "text-gray-400 cursor-not-allowed"
                    }`}
                    onClick={() => isAccessible && onStepChange(step.id as Step)}
                    disabled={!isAccessible}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div
                        className={`p-2 rounded-lg ${
                          isActive
                            ? "bg-blue-500"
                            : isCompleted
                              ? "bg-green-100"
                              : isAccessible
                                ? "bg-gray-100"
                                : "bg-gray-50"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <Icon
                            className={`h-5 w-5 ${
                              isActive ? "text-white" : isAccessible ? "text-gray-600" : "text-gray-400"
                            }`}
                          />
                        )}
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-medium">{step.title}</div>
                        <div
                          className={`text-sm ${
                            isActive
                              ? "text-blue-100"
                              : isCompleted
                                ? "text-green-600"
                                : isAccessible
                                  ? "text-gray-500"
                                  : "text-gray-400"
                          }`}
                        >
                          {step.description}
                        </div>
                      </div>
                      {!isCompleted && !isActive && isAccessible && <ChevronRight className="h-4 w-4 text-gray-400" />}
                    </div>
                  </Button>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-8 top-16 w-0.5 h-4 ${isCompleted ? "bg-green-300" : "bg-gray-200"}`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Project Info */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-gray-900 mb-3">项目概况</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>字数统计</span>
                <span className="font-medium">{project.wordCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>完成度</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden">{renderStepContent()}</main>
      </div>

      {/* Version History Dialog */}
      {showVersionHistory && (
        <VersionHistory
          isOpen={showVersionHistory}
          onClose={() => setShowVersionHistory(false)}
          chapterTitle="第1章：新人守护者"
        />
      )}
    </div>
  )
}

// Complete step components
function CreativeInput() {
  return (
    <div className="h-full p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">创意输入</h2>
          <p className="text-gray-600">设定您的小说题材、风格和基本信息，为AI创作提供方向</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本设定</CardTitle>
                <CardDescription>选择小说的基本属性</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="genre">题材类型</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择题材" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fantasy">奇幻</SelectItem>
                        <SelectItem value="romance">言情</SelectItem>
                        <SelectItem value="mystery">悬疑</SelectItem>
                        <SelectItem value="scifi">科幻</SelectItem>
                        <SelectItem value="historical">历史</SelectItem>
                        <SelectItem value="urban">都市</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="style">写作风格</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择风格" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="classical">古典优雅</SelectItem>
                        <SelectItem value="modern">现代简洁</SelectItem>
                        <SelectItem value="humorous">幽默风趣</SelectItem>
                        <SelectItem value="serious">严肃深刻</SelectItem>
                        <SelectItem value="poetic">诗意浪漫</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="length">目标字数</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择字数" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">短篇 (1-5万字)</SelectItem>
                        <SelectItem value="medium">中篇 (5-15万字)</SelectItem>
                        <SelectItem value="long">长篇 (15-50万字)</SelectItem>
                        <SelectItem value="series">系列 (50万字+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="audience">目标读者</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="选择读者群体" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="young">青少年</SelectItem>
                        <SelectItem value="adult">成年人</SelectItem>
                        <SelectItem value="general">大众读者</SelectItem>
                        <SelectItem value="literary">文学爱好者</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>创作想法</CardTitle>
                <CardDescription>详细描述您的创作灵感和想法</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="concept">核心概念</Label>
                  <Textarea
                    id="concept"
                    placeholder="描述您小说的核心概念、主题或独特之处..."
                    className="min-h-[100px]"
                  />
                </div>
                <div>
                  <Label htmlFor="characters">主要角色</Label>
                  <Textarea
                    id="characters"
                    placeholder="简单描述主要角色的性格、背景或特点..."
                    className="min-h-[80px]"
                  />
                </div>
                <div>
                  <Label htmlFor="setting">故事背景</Label>
                  <Textarea id="setting" placeholder="描述故事发生的时代、地点、世界观..." className="min-h-[80px]" />
                </div>
                <div>
                  <Label htmlFor="inspiration">灵感来源</Label>
                  <Textarea id="inspiration" placeholder="分享触发这个创意的灵感来源..." className="min-h-[60px]" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">创作助手</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  灵感生成器
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BookOpen className="h-4 w-4 mr-2" />
                  题材推荐
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <User className="h-4 w-4 mr-2" />
                  角色生成器
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">热门标签</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["玄幻", "仙侠", "武侠", "都市", "现实", "军事", "历史", "游戏", "体育", "科幻", "悬疑", "轻小说", "同人"].map((tag) => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer hover:bg-blue-100">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">创作提示</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>💡 详细的创意描述有助于AI生成更符合您期望的故事梗概</p>
                  <p>📝 可以参考您喜欢的作品风格来描述写作风格</p>
                  <p>🎯 明确的目标读者有助于确定故事的复杂度和表达方式</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" disabled>
            <ArrowLeft className="h-4 w-4 mr-2" />
            上一步
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            生成故事梗概
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function SynopsisGeneration() {
  const synopses = [
    {
      id: 1,
      title: "时空守护者",
      summary:
        "在2087年的未来世界，时空管理局的新人守护者林晨意外发现了一个时空裂缝，这个裂缝连接着古代的修仙世界。当两个世界的命运交织在一起时，林晨必须在科技与修仙之间找到平衡，阻止即将到来的时空崩塌。",
      themes: ["科幻", "修仙", "时空穿越"],
      tone: "紧张刺激",
      length: "预计25万字",
    },
    {
      id: 2,
      title: "星际商人传奇",
      summary:
        "在银河系边缘的贸易站，年轻的商人艾莉亚继承了祖父的星际货船。然而，她很快发现这艘船隐藏着一个古老的秘密——它是通往失落文明的钥匙。在追求财富与探索未知之间，艾莉亚将开启一段改变银河系格局的冒险。",
      themes: ["太空歌剧", "冒险", "商业"],
      tone: "轻松幽默",
      length: "预计30万字",
    },
    {
      id: 3,
      title: "数字世界的守望者",
      summary:
        "在虚拟现实技术高度发达的2090年，程序员陈墨发现自己可以在数字世界中获得超能力。当现实与虚拟的界限开始模糊，一个神秘的AI开始威胁两个世界的存在时，陈墨必须成为连接两个世界的桥梁。",
      themes: ["赛博朋克", "AI", "虚拟现实"],
      tone: "深沉思辨",
      length: "预计20万字",
    },
  ]

  return (
    <div className="h-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">故事梗概</h2>
          <p className="text-gray-600">AI已为您生成多个故事梗概，请选择最符合您创意的版本</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {synopses.map((synopsis) => (
            <Card
              key={synopsis.id}
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300"
            >
              <CardHeader>
                <CardTitle className="text-xl">{synopsis.title}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  {synopsis.themes.map((theme) => (
                    <Badge key={theme} variant="secondary">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 leading-relaxed">{synopsis.summary}</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <strong>风格:</strong> {synopsis.tone}
                  </div>
                  <div>
                    <strong>篇幅:</strong> {synopsis.length}
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button size="sm" className="flex-1">
                    选择此梗概
                  </Button>
                  <Button size="sm" variant="outline">
                    编辑
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Generation Controls */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>生成控制</CardTitle>
            <CardDescription>调整参数重新生成梗概</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label>创意程度</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择创意程度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">保守 - 贴近原创意</SelectItem>
                    <SelectItem value="balanced">平衡 - 适度发挥</SelectItem>
                    <SelectItem value="creative">创新 - 大胆想象</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>复杂程度</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择复杂程度" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple">简单 - 单线剧情</SelectItem>
                    <SelectItem value="medium">中等 - 多线交织</SelectItem>
                    <SelectItem value="complex">复杂 - 多重反转</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>生成数量</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择生成数量" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3个梗概</SelectItem>
                    <SelectItem value="5">5个梗概</SelectItem>
                    <SelectItem value="8">8个梗概</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                重新生成
              </Button>
              <Button variant="outline">
                <Edit3 className="h-4 w-4 mr-2" />
                自定义梗概
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回创意输入
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            制作详细大纲
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function OutlineCreation() {
  return (
    <div className="h-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">大纲制作</h2>
          <p className="text-gray-600">基于选定的故事梗概，制作详细的故事大纲</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Outline */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>《时空守护者》- 故事大纲</CardTitle>
                <CardDescription>2087年清晨，时空管理局总部的宏伟建筑，林晨怀着忐忑心情前来报到修仙 | 预计25万字 | 三幕式结构</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Act 1 */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-xl font-semibold mb-3">第一幕：觉醒 (1-8万字)</h3>
                    <div className="space-y-3">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">开场设定</h4>
                        <p className="text-sm text-gray-700">
                          2087年，时空管理局，林晨作为新人守护者的日常工作。展现未来科技世界的设定。
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">触发事件</h4>
                        <p className="text-sm text-gray-700">
                          在一次例行巡查中，林晨发现异常的时空波动，意外触碰到时空裂缝。
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">初次穿越</h4>
                        <p className="text-sm text-gray-700">
                          林晨被吸入裂缝，来到古代修仙世界，遇到修仙者，了解修仙体系。
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">能力觉醒</h4>
                        <p className="text-sm text-gray-700">
                          林晨发现自己在修仙世界也能使用科技装备，两种力量开始融合。
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Act 2 */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-xl font-semibold mb-3">第二幕：探索 (9-18万字)</h3>
                    <div className="space-y-3">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">两界危机</h4>
                        <p className="text-sm text-gray-700">时空裂缝扩大，两个世界开始相互影响，引发连锁反应。</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">盟友与敌人</h4>
                        <p className="text-sm text-gray-700">林晨在两个世界都遇到盟友和敌人，了解到更深层的阴谋。</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">力量成长</h4>
                        <p className="text-sm text-gray-700">
                          林晨学会融合科技与修仙，实力快速提升，但也面临更大挑战。
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">真相揭露</h4>
                        <p className="text-sm text-gray-700">发现时空裂缝的真正原因，以及背后隐藏的古老秘密。</p>
                      </div>
                    </div>
                  </div>

                  {/* Act 3 */}
                  <div className="border-l-4 border-red-500 pl-4">
                    <h3 className="text-xl font-semibold mb-3">第三幕：决战 (19-25万字)</h3>
                    <div className="space-y-3">
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">最终对决</h4>
                        <p className="text-sm text-gray-700">林晨面对最终BOSS，运用融合的力量进行决战。</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">牺牲与成长</h4>
                        <p className="text-sm text-gray-700">关键时刻的选择和牺牲，角色的最终成长和蜕变。</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">世界重塑</h4>
                        <p className="text-sm text-gray-700">修复时空裂缝，两个世界恢复平衡，新秩序的建立。</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">开放结局</h4>
                        <p className="text-sm text-gray-700">为续集留下伏笔，林晨的新使命和未来的可能性。</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">大纲工具</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  添加情节点
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Edit3 className="h-4 w-4 mr-2" />
                  编辑大纲
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  导出大纲
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  参考模板
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">角色关系</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="font-medium">林晨</div>
                    <div className="text-gray-600">主角，时空守护者</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <div className="font-medium">玄机真人</div>
                    <div className="text-gray-600">修仙界导师</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded">
                    <div className="font-medium">艾娃</div>
                    <div className="text-gray-600">AI助手，后期觉醒</div>
                  </div>
                  <div className="p-3 bg-red-50 rounded">
                    <div className="font-medium">时空吞噬者</div>
                    <div className="text-gray-600">最终反派</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">世界设定</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>未来世界:</strong> 2087年，高科技社会
                  </div>
                  <div>
                    <strong>修仙世界:</strong> 古代仙侠，灵气充沛
                  </div>
                  <div>
                    <strong>力量体系:</strong> 科技+修仙融合
                  </div>
                  <div>
                    <strong>核心冲突:</strong> 时空稳定vs混沌
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回梗概选择
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            制作章节卷纲
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChapterPlanning() {
  const chapters = [
    { id: 1, title: "新人守护者", status: "planned", words: 0, target: 3000 },
    { id: 2, title: "异常波动", status: "planned", words: 0, target: 3500 },
    { id: 3, title: "时空裂缝", status: "planned", words: 0, target: 4000 },
    { id: 4, title: "修仙世界", status: "planned", words: 0, target: 3800 },
    { id: 5, title: "力量觉醒", status: "planned", words: 0, target: 4200 },
  ]

  return (
    <div className="h-full p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">卷纲规划</h2>
          <p className="text-gray-600">制作章节级别的详细卷纲，为具体写作做准备</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chapter List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>第一卷：觉醒之路</CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    添加章节
                  </Button>
                </div>
                <CardDescription>共5章，预计18,500字</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chapters.map((chapter) => (
                    <div key={chapter.id} className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          第{chapter.id}章：{chapter.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant={chapter.status === "completed" ? "default" : "secondary"}>
                            {chapter.status === "completed" ? "已完成" : "待写作"}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-3">
                        <p>
                          林晨作为时空管理局的新人守护者，开始他的第一天工作。通过日常巡查展现未来世界的科技设定，为后续的冒险做铺垫。重点描写时空管理局的工作环境和林晨的性格特点。
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">目标字数: {chapter.target.toLocaleString()} 字</div>
                        <div className="text-gray-500">
                          当前进度: {chapter.words}/{chapter.target} (
                          {Math.round((chapter.words / chapter.target) * 100)}%)
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${Math.round((chapter.words / chapter.target) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chapter Detail */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>第1章详细卷纲：新人守护者</CardTitle>
                <CardDescription>预计3,000字 | 开场设定章节</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">主要场景</Label>
                      <div className="mt-1 text-sm text-gray-600">时空管理局总部、林晨的宿舍、训练场</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">出场角色</Label>
                      <div className="mt-1 text-sm text-gray-600">林晨、导师陈博士、同期学员</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">关键情节</Label>
                      <div className="mt-1 text-sm text-gray-600">新人报到、能力测试、首次任务分配</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">伏笔设置</Label>
                      <div className="mt-1 text-sm text-gray-600">林晨的特殊体质、古老预言的提及</div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-sm font-medium mb-2 block">章节大纲</Label>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                          1
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">开场描写 (500字)</div>
                          <div className="text-sm text-gray-600">
                            2087年清晨，时空管理局总部的宏伟建筑，林晨怀着忐忑心情前来报到
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                          2
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">入职流程 (800字)</div>
                          <div className="text-sm text-gray-600">
                            办理入职手续，了解时空管理局的组织架构和工作职责，展现世界观设定
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                          3
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">能力测试 (1000字)</div>
                          <div className="text-sm text-gray-600">
                            进行时空感知能力测试，林晨展现出异于常人的天赋，引起导师注意
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium">
                          4
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">任务分配 (700字)</div>
                          <div className="text-sm text-gray-600">
                            获得第一个巡查任务，与同期学员的互动，为下一章的冒险做铺垫
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">卷纲工具</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  添加新卷
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <List className="h-4 w-4 mr-2" />
                  章节排序
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  批量生成
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  导出卷纲
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">进度统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>总章节数</span>
                    <span className="font-medium">5章</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>已完成</span>
                    <span className="font-medium">0章</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>目标字数</span>
                    <span className="font-medium">18,500字</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>当前字数</span>
                    <span className="font-medium">0字</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm font-medium">
                    <span>完成度</span>
                    <span>0%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">写作提醒</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>📝 每章建议3000-5000字</p>
                  <p>🎯 确保每章都有明确的目标</p>
                  <p>🔗 注意章节间的连贯性</p>
                  <p>⚡ 每章结尾留下悬念</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回大纲制作
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            开始章节创作
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function WritingEnvironment({ showVersionHistory }: { showVersionHistory: boolean }) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  return (
    <div className="h-full flex flex-col">
      {/* Writing Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">第1章：新人守护者</h2>
            <p className="text-sm text-gray-600">目标: 3,000字 | 当前: 1,247字 | 进度: 41.6%</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Brain className="h-4 w-4 mr-2" />
              AI助手
            </Button>
            <Button variant="outline" size="sm">
              <Focus className="h-4 w-4 mr-2" />
              专注模式
            </Button>
            <Button variant="outline" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              <Maximize2 className="h-4 w-4 mr-2" />
              {isFullscreen ? "退出全屏" : "全屏"}
            </Button>
          </div>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "41.6%" }}></div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Rich Text Writing Area */}
        <div className="flex-1 p-6">
          <Card className="h-full">
            <CardContent className="p-6 h-full">
              <RichTextEditor />
            </CardContent>
          </Card>
        </div>

        {/* Simplified Right Sidebar - 只保留最必要的功能 */}
        <aside className="w-64 bg-gray-50 border-l p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">AI助手</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <Zap className="h-4 w-4 mr-2" />
                续写建议
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="sm">
                <Edit3 className="h-4 w-4 mr-2" />
                改写润色
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">写作统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>今日字数</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>写作时长</span>
                  <span className="font-medium">1小时23分</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
