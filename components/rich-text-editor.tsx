"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react"

export function RichTextEditor() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [selectedText, setSelectedText] = useState("")

  // 初始化编辑器内容
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = `
        <div class="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <h4 class="font-medium mb-2">章节提示</h4>
          <p class="text-sm text-gray-700">
            本章重点：介绍主角林晨和时空管理局的设定，展现未来世界的科技感，为后续冒险做铺垫。
          </p>
        </div>

        <div class="writing-content space-y-4 text-gray-800 leading-relaxed">
          <p>
            2087年的清晨，第一缕阳光透过智能玻璃幕墙洒进时空管理局总部大厅。这座高达三百层的巨型建筑如同一根银色的针，直插云霄，它的存在本身就是人类科技发展的奇迹。
          </p>

          <p>
            林晨站在大厅中央，仰望着头顶那个巨大的全息投影——银河系的实时三维模型正在缓缓旋转，无数光点代表着各个时空节点的状态。作为一名刚刚通过选拔的新人守护者，他即将开始自己的第一天工作。
          </p>

          <p>"紧张吗？"一个温和的声音从身后传来。</p>

          <p>
            林晨转过身，看到一位中年男子正微笑着走向他。男子身穿标准的管理局制服，胸前的徽章显示着他的身份——陈博士，时空理论研究部主任，同时也是新人培训的负责人。
          </p>

          <p>"有一点，"林晨诚实地回答，"毕竟这是我梦寐以求的工作。"</p>

          <p>
            陈博士点点头，"这很正常。每个新人都会有这种感觉。不过我相信，以你在选拔中展现出的天赋，你会很快适应的。"
          </p>

          <div class="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500 my-6">
            <p class="text-sm text-gray-700">
              <strong>AI建议：</strong> 
              可以在这里加入更多关于时空管理局工作性质的描述，让读者更好地理解这个世界的设定。
            </p>
          </div>

          <p class="text-gray-400 italic">[ 继续写作... ]</p>
        </div>
      `
    }
  }, [])

  // 执行格式化命令
  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  // 处理文本选择
  const handleSelection = () => {
    const selection = window.getSelection()
    if (selection) {
      setSelectedText(selection.toString())
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 工具栏 */}
      <div className="border-b p-3 bg-gray-50">
        <div className="flex items-center space-x-1 flex-wrap gap-2">
          {/* 文本格式 */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => executeCommand("bold")} className="h-8 w-8 p-0">
              <Bold className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => executeCommand("italic")} className="h-8 w-8 p-0">
              <Italic className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => executeCommand("underline")} className="h-8 w-8 p-0">
              <Underline className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* 对齐方式 */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => executeCommand("justifyLeft")} className="h-8 w-8 p-0">
              <AlignLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => executeCommand("justifyCenter")} className="h-8 w-8 p-0">
              <AlignCenter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => executeCommand("justifyRight")} className="h-8 w-8 p-0">
              <AlignRight className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* 列表 */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("insertUnorderedList")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("insertOrderedList")}
              className="h-8 w-8 p-0"
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => executeCommand("formatBlock", "blockquote")}
              className="h-8 w-8 p-0"
            >
              <Quote className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* 撤销重做 */}
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => executeCommand("undo")} className="h-8 w-8 p-0">
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => executeCommand("redo")} className="h-8 w-8 p-0">
              <Redo className="h-4 w-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* 字体大小 */}
          <select
            className="text-sm border rounded px-2 py-1"
            onChange={(e) => executeCommand("fontSize", e.target.value)}
          >
            <option value="3">正文</option>
            <option value="4">大号</option>
            <option value="5">标题</option>
            <option value="6">大标题</option>
          </select>

          {/* 颜色 */}
          <input
            type="color"
            className="w-8 h-8 border rounded cursor-pointer"
            onChange={(e) => executeCommand("foreColor", e.target.value)}
            title="文字颜色"
          />
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="flex-1 overflow-y-auto">
        <div
          ref={editorRef}
          contentEditable
          className="h-full p-6 prose max-w-none focus:outline-none"
          style={{
            minHeight: "100%",
            lineHeight: "1.8",
            fontSize: "16px",
            fontFamily: '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
          }}
          onMouseUp={handleSelection}
          onKeyUp={handleSelection}
          suppressContentEditableWarning={true}
        />
      </div>

      {/* 状态栏 */}
      <div className="border-t p-2 bg-gray-50 text-sm text-gray-600 flex justify-between items-center">
        <div>字数统计: 1,247 字 | 段落: 8 段</div>
        <div>{selectedText && `已选择: ${selectedText.length} 字符`}</div>
      </div>
    </div>
  )
}
