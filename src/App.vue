<script setup lang="ts">
import SurveyForm from './components/SurveyForm.vue'
import SurveyStats from './components/SurveyStats.vue'
</script>

<template>
  <div class="app-container">
    <SurveyForm />
    <SurveyStats />
  </div>
</template>

<style>
.app-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
</style>