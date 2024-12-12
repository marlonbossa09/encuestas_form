<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Bar } from 'vue-chartjs';
import SurveyCounter from './SurveyCounter.vue';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const isLoading = ref(true);
const error = ref<string | null>(null);

const chartData = ref({
  labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
  datasets: [{
    label: 'Average Rating',
    backgroundColor: '#646cff',
    data: [0, 0, 0, 0, 0]
  }]
});

const chartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 5,
      ticks: {
        stepSize: 1
      }
    }
  },
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      callbacks: {
        label: function(context: any) {
          return `Average Rating: ${context.parsed.y.toFixed(2)}`;
        }
      }
    }
  }
};

const loadStats = async () => {
  try {
    isLoading.value = true;
    error.value = null;
    
    const surveysRef = collection(db, 'surveys');
    const snapshot = await getDocs(surveysRef);
    
    if (snapshot.empty) {
      error.value = 'No survey data available';
      return;
    }

    const sums = [0, 0, 0, 0, 0];
    const counts = [0, 0, 0, 0, 0];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.ratings && Array.isArray(data.ratings)) {
        data.ratings.forEach((rating: number, index: number) => {
          if (index < 5 && typeof rating === 'number') {
            sums[index] += rating;
            counts[index]++;
          }
        });
      }
    });

    const averages = sums.map((sum, index) => 
      counts[index] > 0 ? sum / counts[index] : 0
    );

    chartData.value = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'],
      datasets: [{
        label: 'Average Rating',
        backgroundColor: '#646cff',
        data: averages
      }]
    };

  } catch (error) {
    console.error('Error loading stats:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadStats();
});
</script>

<template>
  <div class="stats-container">
    <h2>Survey Statistics</h2>
    
    <SurveyCounter />
    
    <div v-if="isLoading" class="loading">
      Cargando estadisticas...
    </div>
    
    <div v-else-if="error" class="error">
      {{ error }}
    </div>
    
    <div v-else class="chart-wrapper">
      <Bar 
        :data="chartData" 
        :options="chartOptions" 
      />
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}

.chart-wrapper {
  margin-top: 2rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  margin-top: 2rem;
}

.error {
  color: #dc3545;
}

h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 1rem;
}
</style>