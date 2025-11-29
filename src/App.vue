<script setup>
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(false)

const navigationItems = [{ title: 'Opportunities', icon: 'mdi-briefcase', to: '/' }]
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Opportunity Risks Management</v-toolbar-title>
      <v-spacer />
      <v-btn icon="mdi-magnify" />
      <v-btn icon="mdi-bell" />
      <v-menu>
        <template #activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar color="secondary" size="32">
              <v-icon icon="mdi-account" />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item prepend-icon="mdi-account" title="Profile" />
          <v-list-item prepend-icon="mdi-cog" title="Settings" />
          <v-divider />
          <v-list-item prepend-icon="mdi-logout" title="Logout" />
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
      <v-list-item
        prepend-icon="mdi-shield-alert"
        title="Risk Manager"
        subtitle="v1.0.0"
        nav
      >
        <template #append>
          <v-btn
            :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'"
            variant="text"
            @click.stop="rail = !rail"
          />
        </template>
      </v-list-item>

      <v-divider />

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in navigationItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :to="item.to"
          color="primary"
        />
      </v-list>

      <template #append>
        <v-divider />
        <v-list density="compact" nav>
          <v-list-item prepend-icon="mdi-help-circle" title="Help" />
          <v-list-item prepend-icon="mdi-cog" title="Settings" />
        </v-list>
      </template>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Snackbar for notifications -->
    <v-snackbar />
  </v-app>
</template>

<style>
html,
body {
  overflow-y: auto !important;
}
</style>
