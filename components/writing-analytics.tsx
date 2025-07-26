"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Clock, Target, Flame, BookOpen, PenTool, Zap } from "lucide-react"

interface WritingSession {
  date: string
  duration: number // minutes
  wordCount: number
  project: string
  mood: "excellent" | "good" | "average" | "poor"
}

interface WritingGoal {
  type: "daily" | "weekly" | "monthly"
  target: number
  current: number
  unit: "words" | "hours"
}

export function WritingAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week")

  // Mock data
  const writingSessions: WritingSession[] = [
    { date: "2024-01-20", duration: 120, wordCount: 1500, project: "时空守护者", mood: "excellent" },
    { date: "2024-01-19", duration: 90, wordCount: 800, project: "时空守护者", mood: "good" },
    { date: "2024-01-18", duration: 60, wordCount: 600, project: "星际商人传奇", mood: "average" },
  ]

  const goals: WritingGoal[] = [
    { type: "daily", target: 1000, current: 1500, unit: "words" },
    { type: "weekly", target: 7000, current: 4200, unit: "words" },
    { type: "monthly", target: 30000, current: 15600, unit: "words" },
  ]

  const stats = {
    totalWords: 156780,
    totalHours: 234,
    averageWordsPerHour: 670,
    currentStreak: 7,
    longestStreak: 23,
    projectsCompleted: 2,
    averageSessionLength: 85, // minutes
    mostProductiveHour: "14:00-15:00",
    favoriteGenre: "科幻",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">写作分析</h2>
          <p className="text-gray-600">了解您的创作习惯和进展</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedPeriod === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("week")}
          >
            本周
          </Button>
          <Button
            variant={selectedPeriod === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("month")}
          >
            本月
          </Button>
          <Button
            variant={selectedPeriod === "year" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod("year")}
          >
            本年
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="goals">目标</TabsTrigger>
          <TabsTrigger value="habits">习惯</TabsTrigger>
          <TabsTrigger value="achievements">成就</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <PenTool className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">总字数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalWords.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">总时长</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalHours}小时</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">平均效率</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.averageWordsPerHour}</p>
                    <p className="text-xs text-gray-500">字/小时</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Flame className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">连续天数</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.currentStreak}</p>
                    <p className="text-xs text-gray-500">天</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Writing Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                写作趋势
              </CardTitle>
              <CardDescription>过去7天的写作数据</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between space-x-2">
                {[1200, 800, 1500, 600, 1100, 900, 1300].map((words, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div
                      className="bg-blue-500 rounded-t w-full transition-all hover:bg-blue-600"
                      style={{ height: `${(words / 1500) * 200}px` }}
                    />
                    <div className="text-xs text-gray-600 mt-2">
                      {new Date(Date.now() - (6 - index) * 24 * 60 * 60 * 1000).toLocaleDateString("zh-CN", {
                        weekday: "short",
                      })}
                    </div>
                    <div className="text-xs font-medium">{words}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>最近写作记录</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {writingSessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{session.project}</div>
                        <div className="text-sm text-gray-600">{session.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{session.wordCount} 字</div>
                      <div className="text-sm text-gray-600">{session.duration} 分钟</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {goals.map((goal, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{goal.type === "daily" ? "日" : goal.type === "weekly" ? "周" : "月"}目标</span>
                    <Target className="h-5 w-5 text-blue-600" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>进度</span>
                      <span>{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>
                        {goal.current.toLocaleString()} {goal.unit === "words" ? "字" : "小时"}
                      </span>
                      <span>目标: {goal.target.toLocaleString()}</span>
                    </div>
                    {goal.current >= goal.target && <Badge className="bg-green-100 text-green-800">已完成 🎉</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="habits" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>写作习惯分析</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">平均写作时长</span>
                  <span className="font-medium">{stats.averageSessionLength} 分钟</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">最高效时段</span>
                  <span className="font-medium">{stats.mostProductiveHour}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">最长连续天数</span>
                  <span className="font-medium">{stats.longestStreak} 天</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">偏好题材</span>
                  <span className="font-medium">{stats.favoriteGenre}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>写作心情统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { mood: "excellent", label: "状态极佳", count: 12, color: "bg-green-500" },
                    { mood: "good", label: "状态良好", count: 18, color: "bg-blue-500" },
                    { mood: "average", label: "状态一般", count: 8, color: "bg-yellow-500" },
                    { mood: "poor", label: "状态不佳", count: 3, color: "bg-red-500" },
                  ].map((item) => (
                    <div key={item.mood} className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="flex-1 text-sm">{item.label}</span>
                      <span className="text-sm font-medium">{item.count} 次</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "初出茅庐", description: "完成第一个1000字", icon: "🌱", unlocked: true },
              { title: "勤奋作家", description: "连续写作7天", icon: "📝", unlocked: true },
              { title: "马拉松选手", description: "单次写作超过3小时", icon: "🏃", unlocked: true },
              { title: "高产作家", description: "月产量超过50000字", icon: "🚀", unlocked: false },
              { title: "完美主义者", description: "完成一部完整作品", icon: "💎", unlocked: false },
              { title: "夜猫子", description: "深夜写作超过10次", icon: "🦉", unlocked: true },
            ].map((achievement, index) => (
              <Card key={index} className={achievement.unlocked ? "border-yellow-200 bg-yellow-50" : "opacity-60"}>
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{achievement.icon}</div>
                  <h3 className="font-semibold mb-2">{achievement.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  {achievement.unlocked ? (
                    <Badge className="bg-yellow-100 text-yellow-800">已解锁</Badge>
                  ) : (
                    <Badge variant="secondary">未解锁</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
