import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://opportunity-risks-api-54042023114.us-central1.run.app/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export const risksApi = {
  // Get all risks with optional filters
  getAll(params = {}) {
    return apiClient.get('/risks', { params })
  },

  // Get risks by opportunity ID
  getByOpportunity(opportunityId) {
    return apiClient.get('/risks', { params: { opportunityID: opportunityId } })
  },

  // Create a new risk
  create(risk) {
    return apiClient.post('/risks', risk)
  },

  // Update an existing risk (PATCH)
  update(id, risk) {
    return apiClient.patch(`/risks/${id}`, risk)
  },

  // Delete a risk
  delete(id) {
    return apiClient.delete(`/risks/${id}`)
  },

  // Get value help (dropdown options)
  getValueHelp() {
    return apiClient.get('/risks/value-help')
  },
}

export const opportunitiesApi = {
  // Get all opportunities
  getAll(params = {}) {
    return apiClient.get('/opportunities', { params })
  },

  // Get a single opportunity by ID
  getById(id) {
    return apiClient.get(`/opportunities/${id}`)
  },

  // Get risks associated with an opportunity
  getRisks(opportunityId) {
    return apiClient.get(`/opportunities/${opportunityId}/risks`)
  },
}

export default apiClient
