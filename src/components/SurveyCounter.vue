<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../firebase/config';

const totalSurveys = ref(0);
const isLoading = ref(true);

const loadTotalSurveys = async () => {
  try {
    const surveysRef = collection(db, 'surveys');
    const snapshot = await getCountFromServer(surveysRef);
    totalSurveys.value = snapshot.data().count;
  } catch (error) {
    console.error('Error loading survey count:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadTotalSurveys();
});
</script>

<template>
  <div class="counter-container">
    <div class="counter-card">
      <h3>Total de encuestados</h3>
      <div v-if="isLoading" class="loading">
        Cargando...
      </div>
      <div v-else class="count">
        {{ totalSurveys }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.counter-container {
  margin-bottom: 2rem;
}

.counter-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h3 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
}

.count {
  font-size: 2.5rem;
  font-weight: bold;
  color: #646cff;
}

.loading {
  color: #666;
  font-style: italic;
}
</style>