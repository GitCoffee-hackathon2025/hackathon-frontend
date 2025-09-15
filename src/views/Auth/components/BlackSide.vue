<script setup lang="ts">
import { computed, defineProps } from 'vue'

const props = defineProps({
  route: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  father: {
    type: String,
    required: true,
  },
})

const componentClass = computed(() => {
  switch (props.father) {
    case 'register':
      return 'animRight'
      case 'login':
      return 'animLeft'
  }
  return ''
})
</script>

<template>
  <div>
    <router-link :to="{ name: props.route }" v-if="props.active" :class="componentClass">
      <svg
        class="back"
        xmlns="http://www.w3.org/2000/svg"
        width="35"
        height="21"
        viewBox="0 0 35 21"
        fill="currentColor"
      >
        <path
          d="M6.27812 10.2101L10.5875 14.4613C10.7487 14.6095 10.878 14.7882 10.9676 14.9867C11.0573 15.1852 11.1055 15.3995 11.1094 15.6169C11.1133 15.8342 11.0728 16.05 10.9903 16.2516C10.9078 16.4531 10.7849 16.6362 10.6291 16.7898C10.4734 16.9435 10.2878 17.0647 10.0835 17.1461C9.87921 17.2275 9.66039 17.2675 9.44011 17.2636C9.21982 17.2598 9.00257 17.2122 8.80132 17.1238C8.60007 17.0353 8.41895 16.9078 8.26875 16.7488L1.15937 9.73531L0 8.59158L1.15937 7.44784L8.26875 0.434385C8.57976 0.148495 8.99111 -0.00714589 9.41614 0.000252154C9.84118 0.0076502 10.2467 0.17751 10.5473 0.474045C10.8479 0.770581 11.0201 1.17064 11.0276 1.58994C11.0351 2.00924 10.8773 2.41504 10.5875 2.72185L6.27812 6.97309H27.8906C29.7761 6.97309 31.5844 7.712 32.9177 9.02728C34.251 10.3426 35 12.1265 35 13.9865C35 15.8466 34.251 17.6305 32.9177 18.9458C31.5844 20.2611 29.7761 21 27.8906 21H23.5156C23.0805 21 22.6632 20.8295 22.3555 20.526C22.0479 20.2224 21.875 19.8108 21.875 19.3815C21.875 18.9523 22.0479 18.5406 22.3555 18.2371C22.6632 17.9335 23.0805 17.763 23.5156 17.763H27.8906C28.9059 17.763 29.8796 17.3651 30.5975 16.6569C31.3154 15.9487 31.7188 14.9881 31.7188 13.9865C31.7188 12.985 31.3154 12.0244 30.5975 11.3162C29.8796 10.6079 28.9059 10.2101 27.8906 10.2101H6.27812Z"
        />
      </svg>
    </router-link>
    <h1>
      {{ props.message }}
    </h1>

    <svg
      class="svg-login"
      v-if="props.father == 'login'"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2s-2-.9-2-2s.9-2 2-2m3.9 6.1c-.4-.4-1.1-1.1-2.4-1.1H11C8.2 7 6 4.8 6 2H4c0 3.2 2.1 5.8 5 6.7V22h2v-6h2v6h2V10.1l4 3.9l1.4-1.4z"
      />
    </svg>
    <svg
      class="svg-register"
      v-if="props.father == 'register'"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M1.72 9.95a2.45 2.45 0 1 0 4.9 0a2.45 2.45 0 1 0-4.9 0m15.66 0a2.45 2.45 0 1 0 4.9 0a2.45 2.45 0 1 0-4.9 0M11.5 4.5a1 1 0 0 1-1-1v-2a1 1 0 0 1 2 0v2a1 1 0 0 1-1 1m5.87-1.62a1 1 0 0 0-1.41 0l-1.42 1.41a1 1 0 0 0 0 1.42a1 1 0 0 0 1.42 0l1.41-1.42a1 1 0 0 0 0-1.41M7.75 6A1 1 0 0 1 7 5.71L5.63 4.29A1 1 0 0 1 7 2.88l1.46 1.41a1 1 0 0 1 0 1.42a1 1 0 0 1-.71.29"
      />
      <path
        fill="currentColor"
        d="M16.4 23.5v-6.73a6.35 6.35 0 0 1-5.4-4.32l-.84-2.53A1.46 1.46 0 0 1 11.29 8a1.51 1.51 0 0 1 1.64 1.06l.82 2.45A3.41 3.41 0 0 0 17 13.86h4.3a2 2 0 0 1 2 2v7.64ZM9.54 12.92v-.13A3.4 3.4 0 0 1 7 13.86H2.71a2 2 0 0 0-2 2v7.64H7.6v-6.73a6.37 6.37 0 0 0 3.33-1.33a7.8 7.8 0 0 1-1.39-2.52"
      />
    </svg>
    <svg
      v-if="props.father == 'recover'"
      class="svg-recover"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      >
      <path
        fill="currentColor"
        d="M10 2a4 4 0 1 0 0 8a4 4 0 0 0 0-8m-4.991 9A2 2 0 0 0 3 13c0 1.691.833 2.966 2.135 3.797C6.183 17.465 7.53 17.845 9 17.96V17c0-.41.162-.78.441-1.059l2.58-2.58a4 4 0 0 1-.021-.424A3.7 3.7 0 0 1 12.53 11zm5.14 7.852A.48.48 0 0 0 10.5 19h2a.6.6 0 0 0 .273-.07a.37.37 0 0 0 .149-.172a1 1 0 0 0 .062-.235q.016-.125.016-.257V18q.36-.008.563-.023a.47.47 0 0 0 .304-.118a.46.46 0 0 0 .117-.297Q14 17.368 14 17h.5q.165 0 .266-.07a.5.5 0 0 0 .156-.172a.7.7 0 0 0 .07-.235q.015-.133.016-.273a3 3 0 0 1-.008-.227v-.195q.258.094.523.133q.266.039.54.039a2.87 2.87 0 0 0 2.078-.898q.405-.423.632-.961Q19 13.6 19 13q0-.625-.234-1.172a3 3 0 0 0-.641-.953a3 3 0 0 0-.953-.64A2.9 2.9 0 0 0 16 10q-.61.015-1.148.234a2.9 2.9 0 0 0-.954.625q-.414.407-.656.938a2.7 2.7 0 0 0-.242 1.14q0 .367.086.774l-2.938 2.937A.48.48 0 0 0 10 17v1.5q0 .203.148.352m7.132-7.133a.72.72 0 0 1 .219.531a.72.72 0 0 1-.219.531a.72.72 0 0 1-.531.219a.72.72 0 0 1-.531-.219a.72.72 0 0 1-.219-.531q0-.312.219-.531a.72.72 0 0 1 .531-.219q.312 0 .531.219"
      />
    </svg>
  </div>
</template>

<style lang="scss" scoped>
div {
  position: relative;
  min-height: 400px;
  background-color: var(--color-gray-dark);
  grid-column: 1 / 31;
  grid-row: 1 / 31;
  overflow: hidden;
  a {
    position: absolute;
    z-index: 3;
    top: 20px;
    left: 10px;
    svg {
      &.back {
        color: var(--color-white);
        width: calc(var(--icon-size) * 1.8);
      }
    }
  }

  svg {
    color: var(--color-white);
    &.svg-login {
      position: absolute;
      top: 50px;
      left: 60%;
      transform: translateX(-50%);
      width: 300px;
      height: 300px;
    }

    &.svg-register {
      position: absolute;
      top: clamp(0px, 30%, 5px);
      left: 50%;
      transform: translateX(-50%);
      width: clamp(250px ,58vw, 350px);
      height: clamp(250px ,58vw, 350px);
    }
    &.svg-recover {
      position: absolute;
      top: calc(20px - 10vw);
      left: 50%;
      transform: translateX(-50%);
      width: 55vw;
      height: 55vw;
    }
  }

  h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: var(--text-xxl);
    color: var(--color-white);
  }
}

@media (min-width: 992px) {
  div {
    width: 50vw;
    height: 100vh;
    a {
      position: fixed;
      z-index: 3;
      svg {
        fill: var(--color-gray-dark);
        width: calc(var(--icon-size) * 1.2);
      }
    }
    svg {
      color: var(--color-white);
      &.svg-login {
        position: absolute;
        top: 55%;
        left: 50%;
        transform: translateX(-50%);
        width: 40vw;
        height: 40vw;
      }

      &.svg-register {
        position: absolute;
        top: 60%;
        left: 50%;
        transform: translateX(-50%);
width: clamp(300px, 40vw, 500px );
height: clamp(300px, 40vw, 500px );
      }
      &.svg-recover {
        position: absolute;
        top: 350px;
        left: 50%;
        transform: translateX(-50%);
        width: 20vw;
        height: 20vw;
      }
    }
  }

  .animRight {
    left: 51vw;
    animation: leftToRight 1s ease;
  }

  @keyframes leftToRight {
    0% {
      left: 10px;
    }
    100% {
      left: 51vw;
    }
  }

  .animLeft {
    left: 10px;
    animation: rightToLeft 1s ease;
  }

  @keyframes rightToLeft {
    0% {
      left: 51vw;
    }
    100% {
      left: 10px;
    }
  }
}
</style>
