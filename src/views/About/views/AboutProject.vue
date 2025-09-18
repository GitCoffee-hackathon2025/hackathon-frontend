<script setup lang="ts">
import { computed } from 'vue'

type Tech = {
  id: string
  name: string
  url: string
  logo?: string
}

/**
 * Lista das tecnologias solicitadas.
 * URLs apontam para as páginas oficiais (ver fontes no final).
 */
const techs: Tech[] = [
  {
    id: 'vue',
    name: 'Vue',
    url: 'https://vuejs.org/',
    logo: `<path fill="#41b883" d="M1.791 3.851L12 21.471L22.209 3.936V3.85H18.24l-6.18 10.616L5.906 3.851z"/><path fill="#35495e" d="m5.907 3.851l6.152 10.617L18.24 3.851h-3.723L12.084 8.03L9.66 3.85z"/>`,
  },
  { id: 'mysql', name: 'MySQL', url: 'https://www.mysql.com/', logo:`` },
  { id: 'node', name: 'Node.js', url: 'https://nodejs.org/' },
  { id: 'vite', name: 'Vite', url: 'https://vite.dev/' },
  { id: 'fastify', name: 'Fastify', url: 'https://www.fastify.io/' },
  { id: 'ts', name: 'TypeScript', url: 'https://www.typescriptlang.org/', logo: `<path fill="#007acc" d="M1.5 63.91v62.5h125v-125H1.5zm100.73-5a15.56 15.56 0 0 1 7.82 4.5a20.6 20.6 0 0 1 3 4c0 .16-5.4 3.81-8.69 5.85c-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 0 0-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.6 4.6 0 0 0 .54 2.34c.83 1.73 2.38 2.76 7.24 4.86c8.95 3.85 12.78 6.39 15.16 10c2.66 4 3.25 10.46 1.45 15.24c-2 5.2-6.9 8.73-13.83 9.9a38.3 38.3 0 0 1-9.52-.1a23 23 0 0 1-12.72-6.63c-1.15-1.27-3.39-4.58-3.25-4.82a9 9 0 0 1 1.15-.73L82 101l3.59-2.08l.75 1.11a16.8 16.8 0 0 0 4.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 0 0 .69-6.92c-1-1.39-3-2.56-8.59-5c-6.45-2.78-9.23-4.5-11.77-7.24a16.5 16.5 0 0 1-3.43-6.25a25 25 0 0 1-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.7 31.7 0 0 1 9.49.26zm-29.34 5.24v5.12H56.66v46.23H45.15V69.26H28.88v-5a49 49 0 0 1 .12-5.17C29.08 59 39 59 51 59h21.83z"/>` },
]

/**
 * Gera cor determinística a partir de uma string (nome).
 */
function hashToColor(s: string) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  const hue = Math.abs(h) % 360
  return `hsl(${hue} 62% 45%)`
}

/**
 * Gera um data URI SVG contendo as iniciais do nome -> evita chamadas externas.
 */
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

const items = computed(() =>
  techs.map((t) => ({
    ...t,
    logoUri: t.logo ?? svgDataUri(t.name),
  })),
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
          <svg
          class="logo"
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            v-html="t.logo"
          ></svg>
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
  box-shadow: 0 1px 4px rgba(2, 6, 23, 0.04);
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(2, 6, 23, 0.08);
  }

  .thumb {
    width: 56px;
    height: 56px;
    flex: 0 0 56px;
    display: block;
  }
  .logo {
    width: 56px;
    height: 56px;
    border-radius: 10px;
    object-fit: cover;
    display: block;
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
