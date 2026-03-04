import './style.css'

interface Plat {
  id: number;
  nom: string;
  description: string
  prix: number;
}

const carte: Plat[] = [
  {
    id: 1,
    nom: "Anchois 23cm",
    description: "saucetomate premium, origan, huile d'olive extra vierge, anchois, olive",
    prix: 7.9,
  },
  {
    id: 2,
    nom: "Emmental 23cm",
    description: "saucetomate premium, origan, huile d'olive extra vierge, emmental, basilic, olive",
    prix: 7.9,
  },
  {
    id: 3,
    nom: "Margherita 23cm",
    description: "saucetomate premium, origan, huile d'olive extra vierge, mozzarella",
    prix: 7.9,
  }
]

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <header>
    <h1>EatSmart - Carte du Restaurant</h1>
  </header>
  <main class="menu-container"></main>
`

const menuContainer = document.querySelector('.menu-container')!

carte.forEach((plat) => {
  const card = document.createElement('div')
  card.classList.add('card')

  card.innerHTML = `
    <h2>${plat.nom}</h2>
    <p>${plat.description}</p>
    <p><strong>${plat.prix.toFixed(2)} €</strong></p>
  `
  menuContainer.appendChild(card)
})