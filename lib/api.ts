import { API_URLS } from './config'

// API响应类型定义 - 后端实际返回格式
export interface BackendResponse<T = any> {
  code: number
  data?: T
  message?: string
}

// 前端统一响应格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 项目相关接口类型
export interface ProjectCreateData {
  title: string
  genre: string
  target_words: number
  description?: string
}

export interface ProjectConfig {
  genre: string[]  // 后端返回的字段名是 genre
  [key: string]: any
}

export interface Project {
  id: number  // 后端返回的是数字ID
  title: string
  genre: string
  status: 'draft' | 'in-progress' | 'completed' | 'paused'
  current_step: string
  progress: number
  word_count: number
  target_words: number
  description?: string
  last_modified: string
  created_at: string
  updated_at?: string
  completed_steps: string[]
}

// HTTP请求工具函数
async function request<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    // 尝试解析JSON响应
    let backendResponse: BackendResponse<T>
    try {
      backendResponse = await response.json()
    } catch (parseError) {
      // 如果响应不是JSON格式，创建一个默认的响应对象
      const textResponse = await response.text()
      backendResponse = {
        code: response.status,
        message: textResponse || `HTTP ${response.status} ${response.statusText}`
      }
    }

    // 基于HTTP状态码判断成功与否
    if (response.ok) {
      // 2xx状态码表示成功
      return {
        success: true,
        data: backendResponse.data,
        message: backendResponse.message
      }
    } else {
      // 4xx和5xx状态码表示异常，弹出message信息
      return {
        success: false,
        error: backendResponse.message || `请求失败，状态码: ${response.status}`
      }
    }
  } catch (error) {
    console.error('API request failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '请求失败'
    }
  }
}

// API接口函数
export const projectApi = {
  // 获取项目列表
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return request<Project[]>(API_URLS.PROJECTS, {
      method: 'GET'
    })
  },

  // 获取项目配置
  async getProjectConfig(): Promise<ApiResponse<ProjectConfig>> {
    return request<ProjectConfig>(API_URLS.PROJECT_CONFIG, {
      method: 'GET'
    })
  },

  // 创建项目
  async createProject(data: ProjectCreateData): Promise<ApiResponse<Project>> {
    return request<Project>(API_URLS.CREATE_PROJECT, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}
