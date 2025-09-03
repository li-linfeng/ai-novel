import { API_URLS } from './config'

// API響應類型定義 - 後端實際返回格式
export interface BackendResponse<T = any> {
  code: number
  data?: T
  message?: string
}

// 前端統一響應格式
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// 項目相關接口類型
export interface ProjectCreateData {
  title: string
  genre: string
  target_words: number
  description?: string
}

interface GenreItem {
  id: number
  name: string
  parent_id: number
  children?: GenreItem[]
}

export interface ProjectConfig {
  genre: GenreItem[]  // 後端返回的字段名是 genre
  [key: string]: any
}

export interface Project {
  id: number  // 後端返回的是數字ID
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

// HTTP請求工具函數
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

    // 嘗試解析JSON響應
    let backendResponse: BackendResponse<T>
    try {
      backendResponse = await response.json()
    } catch (parseError) {
      // 如果響應不是JSON格式，創建一個默認的響應對象
      // 注意：不能再次讀取response.text()，因為body stream已經被消費
      backendResponse = {
        code: response.status,
        message: `HTTP ${response.status} ${response.statusText}`
      }
    }

    // 基於HTTP狀態碼判斷成功與否
    if (response.ok) {
      // 2xx狀態碼錶示成功
      return {
        success: true,
        data: backendResponse.data,
        message: backendResponse.message
      }
    } else {
      // 4xx和5xx狀態碼錶示異常，彈出message信息
      return {
        success: false,
        error: backendResponse.message || `請求失敗，狀態碼: ${response.status}`
      }
    }
  } catch (error) {
    console.error('API request failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '請求失敗'
    }
  }
}

// API接口函數
export const projectApi = {
  // 獲取項目列表
  async getProjects(): Promise<ApiResponse<Project[]>> {
    return request<Project[]>(API_URLS.PROJECTS, {
      method: 'GET'
    })
  },

  // 獲取項目配置
  async getProjectConfig(): Promise<ApiResponse<ProjectConfig>> {
    return request<ProjectConfig>(API_URLS.PROJECT_CONFIG, {
      method: 'GET'
    })
  },

  // 創建項目
  async createProject(data: ProjectCreateData): Promise<ApiResponse<Project>> {
    return request<Project>(API_URLS.CREATE_PROJECT, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}
