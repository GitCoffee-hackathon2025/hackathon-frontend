<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { perfil, info } from '@/views/User/assets/ItemAccountManagement'
import { UserRequisitions } from '@/requisitions/User'
import { UserStore } from '@/store/UserStore'

const userReq = UserRequisitions()
const userStore = UserStore()
const openEditString = ref<string>()

// Calcular o viewbox de cada svg
onMounted(async () => {
  await nextTick()
  const svgs = document.querySelectorAll('svg')
  await userReq.recover()
  window.addEventListener('resize', () => viewBoxSvg(svgs))
  viewBoxSvg(svgs)

  function viewBoxSvg(svgs: never[] | NodeListOf<SVGSVGElement>) {
    svgs.forEach((svg) => {
      const path = svg.querySelector('path')
      if (path) {
        const box = (path as SVGGraphicsElement).getBBox()
        svg.setAttribute('viewBox', `${box.x} ${box.y} ${box.width} ${box.height}`)
      }
    })
  }
})

function editInput(refKey: string) {
  openEditString.value = refKey
}

function openEdit(refKey: string) {
  return !(openEditString.value == refKey)
}

function cancelarEditacao(refKey: string) {
  if (openEditString.value == refKey) openEditString.value = ''
}
</script>

<template>
  <div class="account-container">
    <div class="profile-section">
      <h2>Perfil</h2>
      <div class="items-list">
        <div class="item-card" v-for="(item, index) in perfil" :key="index">
          <div :class="['field-container', { 'edit-mode': !openEdit(item.refKey) }]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              v-html="item.icon"
            ></svg>
            <input type="text" v-model="item.userInfo" :disabled="openEdit(item.refKey)" />
            <svg
              v-if="openEdit(item.refKey)"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              class="edit-icon"
              @click="editInput(item.refKey)"
            >
              <path
                d="M23.0951 5.79467C22.6652 6.22014 22.2479 6.63309 22.2353 7.04605C22.1973 7.44649 22.6273 7.85945 23.0319 8.24738C23.6388 8.87307 24.2331 9.43619 24.2079 10.0494C24.1826 10.6625 23.5377 11.3007 22.8928 11.9264L17.6705 17.1072L15.8749 15.3302L21.249 10.0243L20.0351 8.82301L18.2395 10.5875L13.4977 5.89478L18.3533 1.10199C18.8465 0.613952 19.6684 0.613952 20.1362 1.10199L23.0951 4.03022C23.5883 4.49323 23.5883 5.30663 23.0951 5.79467ZM0.701172 18.5713L12.7896 6.59555L17.5314 11.2882L5.44297 23.2639H0.701172V18.5713Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
    
    <div class="info-section">
      <h2>Informações</h2>
      <div class="items-list">
        <div class="item-card" v-for="(item, index) in info" :key="index">
          <div :class="['field-container', { 'edit-mode': !openEdit(item.refKey) }]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              v-html="item.icon"
            ></svg>
            <input type="text" v-model="item.userInfo" :disabled="openEdit(item.refKey)" />
            <svg
              v-if="openEdit(item.refKey)"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid meet"
              fill="none"
              class="edit-icon"
              @click="editInput(item.refKey)"
            >
              <path
                d="M23.0951 5.79467C22.6652 6.22014 22.2479 6.63309 22.2353 7.04605C22.1973 7.44649 22.6273 7.85945 23.0319 8.24738C23.6388 8.87307 24.2331 9.43619 24.2079 10.0494C24.1826 10.6625 23.5377 11.3007 22.8928 11.9264L17.6705 17.1072L15.8749 15.3302L21.249 10.0243L20.0351 8.82301L18.2395 10.5875L13.4977 5.89478L18.3533 1.10199C18.8465 0.613952 19.6684 0.613952 20.1362 1.10199L23.0951 4.03022C23.5883 4.49323 23.5883 5.30663 23.0951 5.79467ZM0.701172 18.5713L12.7896 6.59555L17.5314 11.2882L5.44297 23.2639H0.701172V18.5713Z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.account-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  font-family: 'Arial', sans-serif;
}

.profile-section, .info-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h2 {
  color: #333;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #007bff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.field-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.field-container svg:first-child {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  fill: #666;
}

.field-container input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 8px 0;
  background: transparent;
  color: #333;
}

.field-container input:disabled {
  color: #666;
  background: transparent;
}

.edit-icon {
  width: 18px;
  height: 18px;
  cursor: pointer;
  fill: #007bff;
  margin-left: 10px;
  transition: fill 0.2s ease;
}

.edit-icon:hover {
  fill: #0056b3;
}

.edit-mode input {
  background-color: #f8f9fa;
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

/* Responsividade */
@media (max-width: 768px) {
  .account-container {
    padding: 15px;
    gap: 30px;
  }
  
  .item-card {
    padding: 15px;
  }
  
  h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .field-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .field-container svg:first-child {
    margin-right: 0;
  }
  
  .edit-icon {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>