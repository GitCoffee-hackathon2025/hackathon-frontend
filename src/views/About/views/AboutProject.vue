<script setup lang="ts">
import { computed } from 'vue'

type Tech = {
  id: string
  name: string
  url: string
  logo?: string
  logoUri?: string
}


const techs: Tech[] = [
  {
    id: 'vue',
    name: 'Vue',
    url: 'https://vuejs.org/',

    logo: ``,
  },
  {
    id: 'mysql',
    name: 'MySQL',
    url: 'https://www.mysql.com/',
  },
  {
    id: 'node',
    name: 'Node.js',
    url: 'https://nodejs.org/',
  },
  {
    id: 'vite',
    name: 'Vite',
    url: 'https://vite.dev/',
  },
  {
    id: 'fastify',
    name: 'Fastify',
    url: 'https://www.fastify.io/',
  },
  {
    id: 'ts',
    name: 'TypeScript',
    url: 'https://www.typescriptlang.org/',
  },
]

function hashToColor(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  const hue = Math.abs(h) % 360
  return `hsl(${hue} 62% 45%)`
}

function svgDataUri(name: string) {
  const label =
    name
      .replace(/^@/, '')
      .split(/[\\/\\-_.\\s]+/)
      .map((p) => p[0]?.toUpperCase() ?? '')
      .slice(0, 2)
      .join('') || 'PK'

  const bg = hashToColor(name)
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'>
    <rect width='100%' height='100%' rx='18' fill='${bg}' />
    <text x='50%' y='50%' dominant-baseline='central' text-anchor='middle'
      font-family='Inter, Roboto, Arial, sans-serif' font-size='48' fill='white' font-weight='700'>${label}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function svgInnerToDataUri(innerSvg: string, viewBox = '0 0 30 30') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${innerSvg}</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

const items = computed(() =>
  techs.map((t) => {
    const logoUri =
      t.logoUri ??
      (t.logo ? svgInnerToDataUri(t.logo, '0 0 128 128') : svgDataUri(t.name))

    return {
      ...t,
      logoUri,
    }
  }),
)
</script>

<template>
  <section class="tech-cards" aria-label="Tecnologias">
    <ul class="grid">
      <li v-for="t in items" :key="t.id" class="card">
        <a
          :href="t.url"
          target="_blank"
          rel="noopener noreferrer"
          class="thumb"
          :aria-label="`Abrir site oficial de ${t.name}`"
        >
          <img :src="t.logoUri" :alt="`Logotipo de ${t.name}`" class="logo" />
        </a>

        <div class="info">
          <a :href="t.url" target="_blank" rel="noopener noreferrer" class="name">{{ t.name }}</a>
          <small class="link">Abrir página oficial</small>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.tech-cards {
  padding: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.card {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding: 0.75rem;
  border-radius: 12px;
  background: linear-gradient(180deg, var(--color-white));
  box-shadow:  var(--shadow-default);
  transition:
    transform 0.12s ease,
     0.12s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow:  var(--shadow-default);
  }

  .thumb {
    width: 56px;
    height: 56px;
    flex: 0 0 56px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    overflow: hidden;
    background: linear-gradient(180deg, rgba(255,255,255,0.6));
  }

  .logo {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    object-fit: contain;
    display: block;
    margin: 4px;
    background: transparent;
  }

  .info {
    display: flex;
    flex-direction: column;
  }
  .name {
    font-weight: 700;
    color: var(--color-gray-dark);
    text-decoration: none;
  }
  .name:hover {
    text-decoration: underline;
  }
  .link {
    color: var(--color-input);
    font-size: 0.82rem;
  }
}
</style>
