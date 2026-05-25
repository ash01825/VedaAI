export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:4000'
export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export const api = {
  assignments: {
    list: () => fetch(`${API}/assignments`).then((r) => r.json()),
    get: (id: string) => fetch(`${API}/assignments/${id}`).then((r) => r.json()),
    create: (data: any) => {
      const isFormData = data instanceof FormData
      return fetch(`${API}/assignments`, {
        method: 'POST',
        headers: isFormData ? undefined : { 'Content-Type': 'application/json' },
        body: isFormData ? data : JSON.stringify(data),
      }).then((r) => r.json())
    },
    delete: (id: string) =>
      fetch(`${API}/assignments/${id}`, { method: 'DELETE' }).then((r) => r.json()),
    getGeneration: (id: string) =>
      fetch(`${API}/assignments/${id}/generation`).then((r) => r.json()),
  },
  pdf: {
    generate: (id: string) =>
      fetch(`${API}/pdf/${id}`, { method: 'POST' }).then((r) => r.json()),
    getStatus: (id: string) => fetch(`${API}/pdf/${id}`).then((r) => r.json()),
  },
}
