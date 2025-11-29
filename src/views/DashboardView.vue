<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useRisksStore } from '@/stores/risks'

const router = useRouter()
const store = useRisksStore()

function goToOpportunity(opportunity) {
  // Use opportunityID for query parameter
  router.push(`/opportunity/?id=${opportunity.opportunityID}`)
}

onMounted(() => {
  store.fetchOpportunities()
})
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 mb-6">Opportunities</h1>
    <p class="text-body-1 text-grey mb-6">Select an opportunity to manage its risks</p>

    <!-- Opportunities List -->
    <v-row v-if="store.opportunities.length">
      <v-col v-for="opp in store.opportunities" :key="opp._id" cols="12" md="6" lg="4">
        <v-card hover class="h-100" @click="goToOpportunity(opp)">
          <v-card-title class="d-flex align-center">
            <v-icon icon="mdi-briefcase" color="primary" class="mr-2" />
            {{ opp.name }}
          </v-card-title>
          <v-card-text>
            <div class="d-flex flex-wrap ga-2 mb-3">
              <v-chip size="small" color="primary" variant="outlined">
                {{ opp.salesStage }}
              </v-chip>
              <v-chip v-if="opp.expectedRevenueAmount" size="small" color="success" variant="outlined">
                {{ opp.expectedRevenueAmount.toLocaleString() }} {{ opp.currency }}
              </v-chip>
            </div>
            <div v-if="opp.closeDate" class="text-caption text-grey">
              <v-icon icon="mdi-calendar" size="small" class="mr-1" />
              Close: {{ new Date(opp.closeDate).toLocaleDateString() }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" variant="text">
              Manage Risks
              <v-icon icon="mdi-arrow-right" class="ml-1" />
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-card v-else-if="!store.loading">
      <v-card-text class="text-center py-12">
        <v-icon icon="mdi-briefcase-outline" size="64" color="grey" />
        <h3 class="text-h6 mt-4">No opportunities found</h3>
        <p class="text-body-2 text-grey">Opportunities will appear here once available</p>
      </v-card-text>
    </v-card>

    <!-- Loading -->
    <v-overlay :model-value="store.loading" class="align-center justify-center">
      <v-progress-circular indeterminate size="64" color="primary" />
    </v-overlay>
  </v-container>
</template>
