"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Focus, Play, Pause, Square, Volume2, VolumeX, Settings, Target } from "lucide-react"

interface FocusSession {
  duration: number // minutes
  wordTarget?: number
  currentWords: number
  isActive: boolean
  isPaused: boolean
  startTime?: Date
  elapsedTime: number // seconds
}

export function FocusMode() {
  const [session, setSession] = useState<FocusSession>({
    duration: 25,
    wordTarget: 500,
    currentWords: 0,
    isActive: false,
    isPaused: false,
    elapsedTime: 0,
  })

  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (session.isActive && !session.isPaused) {
      interval = setInterval(() => {
        setSession((prev) => ({
          ...prev,
          elapsedTime: prev.elapsedTime + 1,
        }))
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [session.isActive, session.isPaused])

  const startSession = () => {
    setSession((prev) => ({
      ...prev,
      isActive: true,
      isPaused: false,
      startTime: new Date(),
    }))
  }

  const pauseSession = () => {
    setSession((prev) => ({
      ...prev,
      isPaused: !prev.isPaused,
    }))
  }

  const stopSession = () => {
    setSession((prev) => ({
      ...prev,
      isActive: false,
      isPaused: false,
      elapsedTime: 0,
      currentWords: 0,
    }))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const remainingTime = Math.max(0, session.duration * 60 - session.elapsedTime)
  const progress = ((session.duration * 60 - remainingTime) / (session.duration * 60)) * 100
  const wordProgress = session.wordTarget ? (session.currentWords / session.wordTarget) * 100 : 0

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="text-center space-y-6">
          {/* Header */}
          <div className="flex items-center justify-center space-x-2">
            <Focus className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-semibold">专注模式</h3>
          </div>

          {/* Timer Display */}
          <div className="space-y-4">
            <div className="text-4xl font-mono font-bold text-gray-900">{formatTime(remainingTime)}</div>
            <Progress value={progress} className="w-full h-2" />
            <div className="text-sm text-gray-600">
              {session.isActive ? (session.isPaused ? "已暂停" : "专注中...") : "准备开始"}
            </div>
          </div>

          {/* Word Target */}
          {session.wordTarget && (
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Target className="h-4 w-4" />
                <span>
                  字数目标: {session.currentWords} / {session.wordTarget}
                </span>
              </div>
              <Progress value={wordProgress} className="w-full h-1" />
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-center space-x-3">
            {!session.isActive ? (
              <Button onClick={startSession} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                开始专注
              </Button>
            ) : (
              <>
                <Button onClick={pauseSession} variant="outline">
                  {session.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </Button>
                <Button onClick={stopSession} variant="outline">
                  <Square className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Settings */}
          <div className="flex items-center justify-center space-x-4 text-sm">
            <Button variant="ghost" size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Settings */}
          {showSettings && (
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium mb-2">专注时长</label>
                <div className="flex space-x-2">
                  {[15, 25, 45, 60].map((duration) => (
                    <Button
                      key={duration}
                      size="sm"
                      variant={session.duration === duration ? "default" : "outline"}
                      onClick={() => setSession((prev) => ({ ...prev, duration }))}
                      disabled={session.isActive}
                    >
                      {duration}分
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">字数目标</label>
                <div className="flex space-x-2">
                  {[300, 500, 800, 1000].map((target) => (
                    <Button
                      key={target}
                      size="sm"
                      variant={session.wordTarget === target ? "default" : "outline"}
                      onClick={() => setSession((prev) => ({ ...prev, wordTarget: target }))}
                      disabled={session.isActive}
                    >
                      {target}字
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tips */}
          {!session.isActive && (
            <div className="text-xs text-gray-500 space-y-1">
              <p>💡 专注模式可以帮助您保持写作状态</p>
              <p>🔕 建议关闭通知和干扰源</p>
              <p>☕ 准备好水和小食，避免中途离开</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
