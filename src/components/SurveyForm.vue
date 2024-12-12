<script setup lang="ts">
import { ref } from 'vue';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const questions = [
  '¿Qué tan satisfecho está con la interfaz de usuario del software?',
'¿Cómo calificaría el rendimiento del software?',
'¿Qué tan fácil fue navegar por el software?',
'¿Cómo calificaría la confiabilidad del software?',
'¿Qué probabilidad hay de que recomiende este software a otras personas?'
];

const ratings = ref(Array(questions.length).fill(3));
const submitted = ref(false);

const submitSurvey = async () => {
  try {
    const timestamp = new Date();
    await addDoc(collection(db, 'surveys'), {
      ratings: ratings.value,
      timestamp: timestamp
    });
    submitted.value = true;
  } catch (error) {
    console.error('Error submitting survey:', error);
  }
};
</script>

<template>
  <div class="survey-container">
    <h1>Encuesta experiencia de usuario</h1>
    
    <div v-if="!submitted" class="survey-form">
      <div v-for="(question, index) in questions" :key="index" class="question-container">
        <p>{{ question }}</p>
        <div class="rating-container">
          <button 
            v-for="rating in 5" 
            :key="rating"
            :class="['rating-button', { active: ratings[index] === rating }]"
            @click="ratings[index] = rating"
          >
            {{ rating }}
          </button>
        </div>
      </div>
      
      <button class="submit-button" @click="submitSurvey">Enviar encuesta</button>
    </div>
    
    <div v-else class="success-message">
      <h2>Gracias por dejar su opinión!</h2>
      <p>Tus respuestas serán recordadas</p>
    </div>
  </div>
</template>

<style scoped>
.survey-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.question-container {
  margin-bottom: 2rem;
}

.rating-container {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.rating-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #646cff;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rating-button.active {
  background: #646cff;
  color: white;
}

.submit-button {
  margin-top: 2rem;
  padding: 1rem 2rem;
  background: #646cff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
}

.success-message {
  text-align: center;
  padding: 2rem;
}
</style>