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
    <h1>EatSmart - Carte du Restaurant</h1>
  </header>

  <main class="menu-container">
    <p>Chargement du menu...</p>
  </main>
`

const menuContainer = document.querySelector<HTMLDivElement>('.menu-container')!

/**
 * Fonction qui récupère les articles depuis l'API
 * et les affiche dynamiquement
 */
async function chargerEtAfficherArticles() {

  try {

    // Requête vers l'API
    const response = await fetch(API_URL)

    // Vérification de la réponse HTTP
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`)
    }

    // Conversion JSON
    const articles: Article[] = await response.json()

    // -------- Besoin n°1 --------
    // Vérifier que les données arrivent bien
    console.log("Articles reçus depuis l'API :", articles)

    // Nettoyer le conteneur
    menuContainer.innerHTML = ""

    // Si aucun article
    if (articles.length === 0) {
      menuContainer.innerHTML = `<p>Aucun article disponible</p>`
      return
    }

    // -------- Besoin n°2 --------
    // Création dynamique des cartes
    articles.forEach(article => {

      const card = document.createElement('div')
      card.classList.add('card')

      const prixFormate = parseFloat(article.prix_article).toFixed(2)

      card.innerHTML = `
        <h2>${article.nom_article}</h2>
        <p>${article.description_article}</p>
        <p class="prix">${prixFormate} €</p>
      `

      menuContainer.appendChild(card)

    })

  }
  catch (error) {

    console.error("Erreur récupération API :", error)

    menuContainer.innerHTML = `
      <p class="error">
        Impossible de charger les articles.
        Vérifiez que le serveur PHP est lancé.
      </p>
    `
  }

}

// Lancement au chargement
chargerEtAfficherArticles()