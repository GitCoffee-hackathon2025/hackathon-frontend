<script setup lang="ts">
interface Member {
  name: string
  github: string
  avatar: string
}

const members: Member[] = [
  {
    name: 'João Silva',
    github: 'https://github.com/octocat',
    avatar: 'https://github.com/octocat.png'
  },
  {
    name: 'Maria Souza',
    github: 'https://github.com/torvalds',
    avatar: 'https://github.com/torvalds.png'
  },
  {
    name: 'Carlos Lima',
    github: 'https://github.com/gaearon',
    avatar: 'https://github.com/gaearon.png'
  },
  {
    name: 'Ana Pereira',
    github: 'https://github.com/sindresorhus',
    avatar: 'https://github.com/sindresorhus.png'
  }
]
</script>

<template>
  <div class="team">
    <ul>
      <li v-for="(member, index) in members" :key="index">
        <a :href="member.github" target="_blank" rel="noopener noreferrer">
          <img :src="member.avatar" :alt="`Foto de ${member.name}`" />
          <span>{{ member.name }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
@use '@/assets/color.scss';
@use '@/assets/input.scss';

.team {
  width: 100%;
  padding: 1rem;

  ul {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    justify-items: center;
  }

  li {
    width: 100%;
    max-width: 200px;
    background-color: var(--color-gray-dark);
    box-shadow: var(--shadow-default);
    border-radius: 0.5rem;
    overflow: hidden;
    text-align: center;
    transition: transform 0.2s ease;

    &:hover {
      transform: translateY(-3px);
    }

    a {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--color-white);

      img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: var(--shadow-default);
      }

      span {
        font-size: var(--text-sm);
        font-weight: bold;
      }
    }
  }
}

/* Desktop (>=768px) */
@media (min-width: 768px) {
  .team ul {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
