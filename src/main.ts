import './style.css'

// Interface représentant un article
interface Article {
  id_article: number
  nom_article: string
  description_article: string
  prix_article: string
  id_categorie: string
  inclus_menu: string
}

// URL de l'API PHP
const API_URL = "http://localhost/eatsmart-abdelli/article"

// Récupération du conteneur principal
const app = document.querySelector<HTMLDivElement>('#app')!

// Injection de la structure HTML de base
app.innerHTML = `
  <header>
    <h1>
      EatSmart - Carte du Restaurant 
      (<span id="nb-plats">0</span> plats)
    </h1>
    <p id="message">Chargement du message...</p>
  </header>

  <div class="content-wrapper">

    <!-- Zone du menu -->
    <main class="menu-container">
      <p>Chargement du menu...</p>
    </main>

    <!-- Zone du panier -->
    <aside class="cart-container">
      <h2>Votre Panier</h2>

      <!-- Liste des articles du panier -->
      <div id="cart-items">
        <p>Votre panier est vide</p>
      </div>

      <hr>

      <!-- Total du panier -->
      <div class="cart-total">
        <strong>Total : <span id="total-prix">0.00</span>€</strong>
      </div>

      <button id="btn-valider">Valider la commande</button>
      <button id="btn-vider">Vider le panier</button>

    </aside>
  </div>
`



// Récupération des éléments du DOM
const message = document.querySelector<HTMLParagraphElement>('#message')!
const menuContainer = document.querySelector<HTMLDivElement>('.menu-container')!
const nbPlatsElement = document.querySelector<HTMLSpanElement>('#nb-plats')!

// Tableau représentant le panier
const panier: Article[] = []

/**
 * Fonction : chargerMessageDuJour
 * Récupère un message depuis une API externe
 */
async function chargerMessageDuJour() {
  try {
    // Appel API
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')

    // Conversion en JSON
    const data = await response.json()

    // Affichage du message
    message.textContent = `Message du jour : ${data.title}`

  } catch (error) {
    // Gestion d'erreur
    message.textContent = "Impossible de charger le message du jour"
  }
}

/**
 * Fonction : afficherPanier
 * Met à jour l'affichage du panier + total
 */
function afficherPanier() {

  // Récupération des éléments HTML du panier
  const cartItems = document.getElementById("cart-items")!
  const totalSpan = document.getElementById("total-prix")!

  // Si panier vide
  if (panier.length === 0) {
    cartItems.innerHTML = "<p>Votre panier est vide</p>"
    totalSpan.textContent = "0.00"
    return
  }

  // Génération du HTML des articles
  cartItems.innerHTML = panier.map(plat => {

    // Conversion du prix (string → number)
    const prix = parseFloat(plat.prix_article)

    return `
      <div class="cart-item">
        <span>${plat.nom_article}</span>
        <span>${prix.toFixed(2)}€</span>
      </div>
    `
  }).join("")

  // Calcul du total du panier
  const total = panier.reduce((sum, plat) => {
    return sum + parseFloat(plat.prix_article)
  }, 0)

  // Affichage du total avec 2 décimales
  totalSpan.textContent = total.toFixed(2)
}

/**
 * Fonction : chargerEtAfficherArticle
 * Récupère les articles depuis l'API
 * et les affiche dynamiquement
 */
async function chargerEtAfficherArticle() {
  try {
    // Appel API
    const response = await fetch(API_URL)

    // Vérification erreur HTTP
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`)

    // Conversion JSON → tableau d'articles
    const articles: Article[] = await response.json()

    console.log("Articles reçus depuis l'API :", articles)

    // Nettoyage du container
    menuContainer.innerHTML = ""

    // Mise à jour du nombre de plats
    nbPlatsElement.textContent = articles.length.toString()

    // Si aucun article
    if (articles.length === 0) {
      menuContainer.innerHTML = `<p>Aucun article disponible</p>`
      return
    }

    // Boucle sur chaque article
    articles.forEach((article, index) => {

      // Création de la carte HTML
      const card = document.createElement('div')
      card.classList.add('card')

      // Formatage du prix
      const prixFormate = parseFloat(article.prix_article).toFixed(2)
      const prix = parseFloat(article.prix_article)

      // Condition "Bon Plan"
      const BonPLan = prix < 10 ? '<p class="bon plan">🔥 Bon Plan</p>' : ""

      // Contenu HTML de la carte
      card.innerHTML = `
      <h2>${article.nom_article}</h2>

      <strong>
        <p>${article.description_article}</p>

        <p class="prix">${prixFormate} €</p>

        <p class="menu">
          Menu : ${article.inclus_menu ?? 'aucun'}
        </p>

        ${BonPLan}
      </strong>
      <button class="btn-order">Ajouter</button>
    `
      // Ajout au DOM
      menuContainer.appendChild(card)

      // Gestion du bouton "Ajouter"
      const btn = card.querySelector<HTMLButtonElement>('.btn-order')!

      btn.addEventListener('click', () => {

        console.log(`Bouton n°${index} cliqué`)
        console.log(`Plat ajouté : ${article.nom_article}`)

        // Ajout au panier
        panier.push(article)

        console.log("État du panier :", panier)

        // Mise à jour de l'affichage
        afficherPanier()
      })
    })

  } catch (error) {

    // Gestion erreur API
    console.error("Erreur récupération API :", error)

    menuContainer.innerHTML = `
      <p class="error">
        Impossible de charger les articles.
        Vérifiez que le serveur PHP est lancé.
      </p>
    `
  }
}
chargerEtAfficherArticle()
chargerMessageDuJour()

// Sélectionne le bouton "Valider" dans le DOM et ajoute un écouteur d'événement au clic
const btnValider = document.getElementById("btn-valider")!

btnValider.addEventListener("click", () => {
  // Affiche un message dans la console lorsque le bouton est cliqué
  console.log("Bouton Valider commande cliqué")
})

// Sélectionne le bouton "Vider" dans le DOM et ajoute un écouteur d'événement au clic
const btnVider = document.getElementById("btn-vider")!

btnVider.addEventListener("click", () => {
   // Affiche un message dans la console lorsque le bouton est cliqué
  console.log("Panier vidé")

  // Vide le tableau
  panier.length = 0

  // Met à jour l'affichage
  afficherPanier()
})
