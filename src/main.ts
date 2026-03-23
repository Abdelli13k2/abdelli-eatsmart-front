import './style.css'

// Interface représentant un article reçu depuis l'API
interface Article {
  id_article: number
  nom_article: string
  description_article: string
  prix_article: string
  id_categorie: string
}

// URL de l'API PHP
const API_URL = "http://localhost/eatsmart-abdelli/article"

// Récupération du conteneur principal
const app = document.querySelector<HTMLDivElement>('#app')!

// Structure HTML de base
app.innerHTML = `
  <header>
    <h1>
      EatSmart - Carte du Restaurant 
      (<span id="nb-plats">0</span> plats)
    </h1>
    <p id="message">Chargement du message...</p>
  </header>
  <div class="content-wrapper">
  <main class="menu-container">
    <p>Chargement du menu...</p>
  </main>

  <aside class="cart-container">
        <h2>Votre Panier</h2>
        <div id="cart-items">
          <p>Votre panier est vide</p>
        </div>
        <hr>
        <div class="cart-total">
          <strong>Total : <span id="total-prix">0.00</span>€</strong>
        </div>
  </aside>
  </div>
`;

const message = document.querySelector<HTMLParagraphElement>('#message')!
const menuContainer = document.querySelector<HTMLDivElement>('.menu-container')!
const nbPlatsElement = document.querySelector<HTMLSpanElement>('#nb-plats')!
const panier: Article[] = []

/**
 * Charger le message du jour
 */
async function chargerMessageDuJour() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    const data = await response.json()
    message.textContent = `Message du jour : ${data.title}`
  } catch (error) {
    message.textContent = "Impossible de charger le message du jour"
  }
}

/**
 * Affichage dynamique + total propre
 */
function afficherPanier() {
  const cartItems = document.getElementById("cart-items")!
  const totalSpan = document.getElementById("total-prix")!

  if (panier.length === 0) {
    cartItems.innerHTML = "<p>Votre panier est vide</p>"
    totalSpan.textContent = "0.00"
    return
  }

  //  Génération HTML propre
  cartItems.innerHTML = panier.map(plat => {
    const prix = parseFloat(plat.prix_article)

    return `
      <div class="cart-item">
        <span>${plat.nom_article}</span>
        <span>${prix.toFixed(2)}€</span>
      </div>
    `
  }).join("")

  //  Calcul du total (propre)
  const total = panier.reduce((sum, plat) => {
    return sum + parseFloat(plat.prix_article)
  }, 0)

  //  Besoin n°7 : 2 décimales
  totalSpan.textContent = total.toFixed(2)
}

/**
 * Charger et afficher les articles
 */
async function chargerEtAfficherArticle() {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

    const articles: Article[] = await response.json()
    console.log("Articles reçus depuis l'API :", articles)

    menuContainer.innerHTML = ""
    nbPlatsElement.textContent = articles.length.toString()

    if (articles.length === 0) {
      menuContainer.innerHTML = `<p>Aucun article disponible</p>`
      return
    }

    articles.forEach((article, index) => {
      const card = document.createElement('div')
      card.classList.add('card')

      const prixFormate = parseFloat(article.prix_article).toFixed(2)
      const prix = parseFloat(article.prix_article)
      const BonPLan = prix < 10 ? '<p class="bon plan">🔥 Bon Plan</p>' : ""

      card.innerHTML = `
        <h2>${article.nom_article}</h2>
        <strong>
          <p>${article.description_article}</p>
          <p class="prix">${prixFormate} €</p>
          ${BonPLan}
        </strong>
        <button class="btn-order">Ajouter</button>
      `

      menuContainer.appendChild(card)

      const btn = card.querySelector<HTMLButtonElement>('.btn-order')!
      btn.addEventListener('click', () => {
        console.log(`Bouton n°${index} cliqué`)
        console.log(`Plat ajouté : ${article.nom_article}`)

        panier.push(article)

        console.log("État du panier :", panier)

        //  Mise à jour UI + total
        afficherPanier()
      })
    })

  } catch (error) {
    console.error("Erreur récupération API :", error)
    menuContainer.innerHTML = `
      <p class="error">
        Impossible de charger les articles.
        Vérifiez que le serveur PHP est lancé.
      </p>
    `
  }
}

// Lancer les fonctions
chargerEtAfficherArticle()
chargerMessageDuJour()