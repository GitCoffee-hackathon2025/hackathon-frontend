import { onUnmounted } from 'vue'
import { UserStore } from '@/store/UserStore'
const user = UserStore()

export default {
  setup() {
    onUnmounted(() => {
      
    })
  },
}
