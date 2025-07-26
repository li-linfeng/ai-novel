// API配置
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'http://127.0.0.1:9502'  // 生产环境
    : '/api',  // 开发环境使用代理
  ENDPOINTS: {
    PROJECTS: '/projects',
    PROJECT_CONFIG: '/projects/create',
    CREATE_PROJECT: '/projects'
  }
}

// 完整的API URLs
export const API_URLS = {
  PROJECTS: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECTS}`,
  PROJECT_CONFIG: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROJECT_CONFIG}`,
  CREATE_PROJECT: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.CREATE_PROJECT}`
}
