<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRisksStore } from '@/stores/risks'

const route = useRoute()
const store = useRisksStore()

const opportunityId = computed(() => route.params.id)

// Dialog state
const riskDialog = ref(false)
const deleteDialog = ref(false)
const editingRisk = ref(null)
const riskToDelete = ref(null)

// Form data
const riskForm = ref({
  title: '',
  description: '',
  impact: '',
  probability: '',
  status: '',
  owner: '',
})

const isEditing = computed(() => editingRisk.value !== null)

function resetForm() {
  riskForm.value = {
    title: '',
    description: '',
    impact: '',
    probability: '',
    status: '',
    owner: '',
  }
  editingRisk.value = null
}

function openCreateDialog() {
  resetForm()
  riskDialog.value = true
}

function openEditDialog(risk) {
  editingRisk.value = risk
  riskForm.value = {
    title: risk.title || '',
    description: risk.description || '',
    impact: risk.impact || '',
    probability: risk.probability || '',
    status: risk.status || '',
    owner: risk.owner || '',
  }
  riskDialog.value = true
}

function openDeleteDialog(risk) {
  riskToDelete.value = risk
  deleteDialog.value = true
}

async function saveRisk() {
  // Use opportunityID from the fetched opportunity (numeric ID like "227")
  const payload = {
    ...riskForm.value,
    opportunityID: store.currentOpportunity?.opportunityID || opportunityId.value,
  }

  if (isEditing.value) {
    await store.updateRisk(editingRisk.value.id, payload)
  } else {
    await store.createRisk(payload)
  }

  riskDialog.value = false
  resetForm()
}

async function confirmDelete() {
  if (riskToDelete.value) {
    await store.deleteRisk(riskToDelete.value.id)
    deleteDialog.value = false
    riskToDelete.value = null
  }
}

function getImpactColor(impact) {
  const colors = {
    'Very High': 'error',
    High: 'deep-orange',
    Medium: 'warning',
    Low: 'success',
    'Very Low': 'light-green',
  }
  return colors[impact] || 'grey'
}

function getProbabilityColor(probability) {
  const colors = {
    'Very High': 'error',
    High: 'deep-orange',
    Medium: 'warning',
    Low: 'success',
    'Very Low': 'light-green',
  }
  return colors[probability] || 'grey'
}

function getStatusColor(status) {
  const colors = {
    Open: 'error',
    'In Progress': 'warning',
    Mitigated: 'success',
    Accepted: 'info',
    Closed: 'grey',
  }
  return colors[status] || 'primary'
}

function getRiskLevelColor(level) {
  const colors = {
    Critical: 'error',
    High: 'deep-orange',
    Medium: 'warning',
    Low: 'success',
  }
  return colors[level] || 'grey'
}

async function loadData() {
  await Promise.all([
    store.fetchOpportunityById(opportunityId.value),
    store.fetchRisksByOpportunity(opportunityId.value),
    store.fetchValueHelp(),
  ])
}

watch(opportunityId, loadData)

onMounted(loadData)
</script>

<template>
  <v-container fluid>
    <!-- Header -->
    <div class="d-flex align-center mb-6">
      <div>
        <h1 class="text-h4">
          {{ store.currentOpportunity?.name || 'Opportunity Risks' }}
        </h1>
        <p v-if="store.currentOpportunity?.description" class="text-body-2 text-grey mt-1">
          {{ store.currentOpportunity.description }}
        </p>
      </div>
      <v-spacer />
      <v-btn color="primary" @click="openCreateDialog">
        <v-icon icon="mdi-plus" class="mr-2" />
        Add Risk
      </v-btn>
    </div>

    <!-- Stats -->
    <v-row class="mb-6">
      <v-col cols="12" sm="6" md="3">
        <v-card color="primary" variant="tonal">
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-alert-circle" size="40" class="mr-3" />
            <div>
              <div class="text-h5 font-weight-bold">{{ store.risks.length }}</div>
              <div class="text-body-2">Total Risks</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="error" variant="tonal">
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-alert-octagon" size="40" class="mr-3" />
            <div>
              <div class="text-h5 font-weight-bold">{{ store.highImpactRisks.length }}</div>
              <div class="text-body-2">High Impact</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="warning" variant="tonal">
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-progress-clock" size="40" class="mr-3" />
            <div>
              <div class="text-h5 font-weight-bold">
                {{ store.risksByStatus['Open']?.length || 0 }}
              </div>
              <div class="text-body-2">Open</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-card color="success" variant="tonal">
          <v-card-text class="d-flex align-center">
            <v-icon icon="mdi-shield-check" size="40" class="mr-3" />
            <div>
              <div class="text-h5 font-weight-bold">
                {{ store.risksByStatus['Mitigated']?.length || 0 }}
              </div>
              <div class="text-body-2">Mitigated</div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Risks Table -->
    <v-card>
      <v-card-title class="d-flex align-center">
        <v-icon icon="mdi-table" class="mr-2" />
        Risks
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="[
            { title: 'Title', key: 'title', width: '18%' },
            { title: 'Description', key: 'description', width: '22%' },
            { title: 'Impact', key: 'impact', width: '10%' },
            { title: 'Probability', key: 'probability', width: '10%' },
            { title: 'Status', key: 'status', width: '10%' },
            { title: 'Owner', key: 'owner', width: '12%' },
            { title: 'Risk Level', key: 'riskLevel', width: '10%' },
            { title: 'Actions', key: 'actions', sortable: false, width: '8%' },
          ]"
          :items="store.filteredRisks"
          :loading="store.loading"
          item-value="id"
          hover
        >
          <template #item.description="{ item }">
            <span class="text-truncate d-inline-block" style="max-width: 200px">
              {{ item.description || '-' }}
            </span>
          </template>

          <template #item.impact="{ item }">
            <v-chip :color="getImpactColor(item.impact)" size="small" label>
              {{ item.impact || '-' }}
            </v-chip>
          </template>

          <template #item.probability="{ item }">
            <v-chip :color="getProbabilityColor(item.probability)" size="small" label>
              {{ item.probability || '-' }}
            </v-chip>
          </template>

          <template #item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small" label>
              {{ item.status || '-' }}
            </v-chip>
          </template>

          <template #item.riskLevel="{ item }">
            <v-chip :color="getRiskLevelColor(item.riskLevel)" size="small" label>
              {{ item.riskLevel || '-' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn icon="mdi-pencil" size="small" variant="text" @click="openEditDialog(item)" />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="openDeleteDialog(item)"
            />
          </template>

          <template #no-data>
            <div class="text-center py-8">
              <v-icon icon="mdi-alert-circle-outline" size="64" color="grey" />
              <p class="text-h6 mt-4">No risks found</p>
              <p class="text-body-2 text-grey">Add your first risk for this opportunity</p>
              <v-btn color="primary" class="mt-4" @click="openCreateDialog"> Add Risk </v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Create/Edit Risk Dialog -->
    <v-dialog v-model="riskDialog" max-width="600" persistent>
      <v-card>
        <v-card-title>
          {{ isEditing ? 'Edit Risk' : 'Add New Risk' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveRisk">
            <v-text-field
              v-model="riskForm.title"
              label="Title"
              variant="outlined"
              class="mb-4"
              required
            />

            <v-textarea
              v-model="riskForm.description"
              label="Description"
              rows="3"
              variant="outlined"
              class="mb-4"
            />

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="riskForm.impact"
                  :items="store.valueHelp.impact"
                  label="Impact"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="riskForm.probability"
                  :items="store.valueHelp.probability"
                  label="Probability"
                  variant="outlined"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="riskForm.status"
                  :items="store.valueHelp.status"
                  label="Status"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="riskForm.owner"
                  label="Owner"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="riskDialog = false; resetForm()">
            Cancel
          </v-btn>
          <v-btn color="primary" variant="flat" :loading="store.loading" @click="saveRisk">
            {{ isEditing ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title>Delete Risk</v-card-title>
        <v-card-text>
          Are you sure you want to delete this risk? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" :loading="store.loading" @click="confirmDelete">
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Loading Overlay -->
    <v-overlay :model-value="store.loading && !riskDialog" class="align-center justify-center">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>

    <!-- Error Snackbar -->
    <v-snackbar v-model="store.error" color="error" timeout="5000">
      {{ store.error }}
      <template #actions>
        <v-btn variant="text" @click="store.clearError()">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
