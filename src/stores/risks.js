import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { risksApi, opportunitiesApi } from '@/services/api'

export const useRisksStore = defineStore('risks', () => {
  // State
  const risks = ref([])
  const currentRisk = ref(null)
  const opportunities = ref([])
  const currentOpportunity = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const valueHelp = ref({
    impact: [],
    probability: [],
    status: [],
  })

  // Filters
  const filters = ref({
    status: null,
    impact: null,
    probability: null,
    search: '',
  })

  // Getters
  const filteredRisks = computed(() => {
    return risks.value.filter((risk) => {
      if (filters.value.status && risk.status !== filters.value.status) return false
      if (filters.value.impact && risk.impact !== filters.value.impact) return false
      if (filters.value.probability && risk.probability !== filters.value.probability) return false
      if (
        filters.value.search &&
        !risk.description?.toLowerCase().includes(filters.value.search.toLowerCase())
      )
        return false
      return true
    })
  })

  const risksByStatus = computed(() => {
    const grouped = {}
    risks.value.forEach((risk) => {
      const status = risk.status || 'unknown'
      if (!grouped[status]) grouped[status] = []
      grouped[status].push(risk)
    })
    return grouped
  })

  const highImpactRisks = computed(() => {
    return risks.value.filter(
      (risk) => risk.impact === 'High' || risk.impact === 'Very High',
    )
  })

  // Actions
  async function fetchRisks(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await risksApi.getAll(params)
      // API returns { status, data: { risks: [...] } }
      risks.value = response.data.data?.risks || response.data.risks || []
    } catch (err) {
      error.value = err.message || 'Failed to fetch risks'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchRisksByOpportunity(opportunityId) {
    loading.value = true
    error.value = null
    try {
      const response = await opportunitiesApi.getRisks(opportunityId)
      // API returns { status, data: { risks: [...] } }
      risks.value = response.data.data?.risks || response.data.risks || []
    } catch (err) {
      error.value = err.message || 'Failed to fetch risks'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createRisk(riskData) {
    loading.value = true
    error.value = null
    try {
      const response = await risksApi.create(riskData)
      // API returns { status, data: { risk } }
      const newRisk = response.data.data?.risk || response.data.data || response.data
      risks.value.push(newRisk)
      return newRisk
    } catch (err) {
      error.value = err.message || 'Failed to create risk'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateRisk(id, riskData) {
    loading.value = true
    error.value = null
    try {
      const response = await risksApi.update(id, riskData)
      // API returns { status, data: { risk } }
      const updatedRisk = response.data.data?.risk || response.data.data || response.data
      const index = risks.value.findIndex((r) => r.id === id)
      if (index !== -1) {
        risks.value[index] = updatedRisk
      }
      return updatedRisk
    } catch (err) {
      error.value = err.message || 'Failed to update risk'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRisk(id) {
    loading.value = true
    error.value = null
    try {
      await risksApi.delete(id)
      risks.value = risks.value.filter((r) => r.id !== id)
    } catch (err) {
      error.value = err.message || 'Failed to delete risk'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchValueHelp() {
    try {
      const response = await risksApi.getValueHelp()
      // API returns { status, data: { impactLevels, probabilityLevels, statusTypes } }
      const data = response.data.data || response.data
      valueHelp.value = {
        impact: data.impactLevels?.map((item) => item.code) || [],
        probability: data.probabilityLevels?.map((item) => item.code) || [],
        status: data.statusTypes?.map((item) => item.code) || [],
      }
    } catch (err) {
      error.value = err.message || 'Failed to fetch value help'
    }
  }

  async function fetchOpportunities() {
    loading.value = true
    error.value = null
    try {
      const response = await opportunitiesApi.getAll()
      // API returns { status, data: { opportunities: [...] } }
      opportunities.value = response.data.data?.opportunities || response.data.data || []
    } catch (err) {
      error.value = err.message || 'Failed to fetch opportunities'
    } finally {
      loading.value = false
    }
  }

  async function fetchOpportunityById(id) {
    loading.value = true
    error.value = null
    try {
      const response = await opportunitiesApi.getById(id)
      // API returns { status, data: { opportunity } }
      currentOpportunity.value = response.data.data?.opportunity || response.data.data || response.data
      return currentOpportunity.value
    } catch (err) {
      error.value = err.message || 'Failed to fetch opportunity'
      throw err
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {
      status: null,
      impact: null,
      probability: null,
      search: '',
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    risks,
    currentRisk,
    opportunities,
    currentOpportunity,
    loading,
    error,
    valueHelp,
    filters,
    // Getters
    filteredRisks,
    risksByStatus,
    highImpactRisks,
    // Actions
    fetchRisks,
    fetchRisksByOpportunity,
    createRisk,
    updateRisk,
    deleteRisk,
    fetchValueHelp,
    fetchOpportunities,
    fetchOpportunityById,
    setFilters,
    clearFilters,
    clearError,
  }
})
