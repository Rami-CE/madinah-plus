const BASE = import.meta.env.VITE_API_URL ?? ''

let token = null

export function setToken(next) {
  token = next || null
}

export function getToken() {
  return token
}

class ApiError extends Error {
  constructor(status, message) {
    super(message || `Request failed (${status})`)
    this.status = status
  }
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...options, headers })
  const text = await res.text()
  let body = null
  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }

  if (!res.ok) {
    const message = body && typeof body === 'object' ? body.error || body.message : text
    throw new ApiError(res.status, message)
  }
  return body
}

function get(path) {
  return request(path)
}

function post(path, body) {
  return request(path, { method: 'POST', body: body == null ? undefined : JSON.stringify(body) })
}

function patch(path, body) {
  return request(path, { method: 'PATCH', body: JSON.stringify(body) })
}

export const api = {
  login: (email, password, role) => post('/api/auth/login', { email, password, role }),
  me: () => get('/api/auth/me'),
  getCity: () => get('/api/city'),
  getPriorities: () => get('/api/city/priorities'),
  getMonitoring: () => get('/api/city/monitoring'),
  getAccessibilityStats: () => get('/api/city/accessibility-statistics'),
  getHousing: () => get('/api/housing'),
  getHousingById: (id) => get(`/api/housing/${id}`),
  updateInspection: (id, itemKey, status) => patch(`/api/housing/${id}/inspection/${itemKey}`, { status }),
  improve: (id) => post(`/api/housing/${id}/improve`),
  certify: (id) => post(`/api/housing/${id}/certify`),
  issueConditional: (id) => post(`/api/housing/${id}/conditional`),
  getBusinesses: () => get('/api/businesses'),
  getRoutes: () => get('/api/routes'),
  getFeedback: () => get('/api/feedback'),
  submitFeedback: (category, text) => post('/api/feedback', { category, text }),
}

export { ApiError }
