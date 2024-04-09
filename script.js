let works;

// ETAPE 1.1 - Récupération des données depuis l'API
const recupererDonnees = async () => {
    try {
        // Fait une requête fetch pour obtenir les données du back-end
        const reponse = await fetch("http://localhost:5678/api/works");

        // Convertit la réponse en format JSON
        works = await reponse.json();

        // Appelle la fonction pour afficher les travaux dans la galerie
        afficherTravaux(works);
    } catch (erreur) {
        // Gère les erreurs en affichant un message dans la console
        console.error("Une erreur s'est produite lors de la récupération des données :", erreur);
    }
};
  
  // Fonction pour afficher les travaux dans la galerie
  const afficherTravaux = (travaux) => {
    // Sélectionne l'élément HTML représentant la galerie
    const galerie = document.querySelector(".gallery");
  
    // Supprime le contenu HTML actuel de la galerie
    galerie.innerHTML = "";
  
    // Parcourt les travaux et les ajoute dynamiquement à la galerie
    travaux.forEach((travail) => {
      // Crée un élément div pour chaque travail
      const elementTravail = document.createElement("div");
      elementTravail.classList.add("work");
  
      // Crée un élément img pour afficher l'image du travail
      const elementImage = document.createElement("img");
      elementImage.src = travail.imageUrl;
      elementImage.alt = travail.title;
  
      // Crée un élément h3 pour afficher le titre du travail
      const elementTitre = document.createElement("h3");
      elementTitre.textContent = travail.title;
  
      // Ajoute l'image et le titre à l'élément du travail
      elementTravail.appendChild(elementImage);
      elementTravail.appendChild(elementTitre);
  
      // Ajoute l'élément du travail à la galerie
      galerie.appendChild(elementTravail);
    });
  };
  
  // Appelle la fonction recupererDonnees pour récupérer et afficher les travaux
  recupererDonnees();


//Étape 1.2 - Réalisation du filtre des travaux :

// Récupération des categories depuis l'API
const reponseCategories = await fetch("http://localhost:5678/api/categories");
const categories = await reponseCategories.json();


// Création des filtres
let filters = []
filters.push("Tous")
categories.forEach(element => {
  filters.push(element.name)
});
console.log(filters);

// La fonction generateFilters est responsable de la création des filtres HTML pour les catégories de travaux
function generateFilters(filters) {
  for (let i = 0; i < filters.length; i++) {
    const categorie = filters[i];
    // Récupération de l'élément du DOM pour afficher les travaux
    const sectionFilters = document.querySelector('.filters');
    // Création d’une div dédiée à chaque catégorie
    const filterCategory = document.createElement("div");
    filterCategory.dataset.id = filters[i].id;
    // Parti HTML 
    filterCategory.innerHTML = categorie;
    // Parti CSS
    filterCategory.classList.add("filter");
    // On ajoute le "nouveau filtre" dans le filtre du DOM
    sectionFilters.appendChild(filterCategory);
  }
}
generateFilters(filters);

// Bouton cliquable
const buttonCategories = document.querySelectorAll(".filter");

buttonCategories.forEach(buttonCategory => {
    buttonCategory.addEventListener("click", function () {
        const selectedCategory = buttonCategory.innerText;
        
        // Vérifie si la catégorie active est "Tous"
        if (selectedCategory === "Tous") {
            afficherTravaux(works);
        } else {
            // Filtre en fonction de la categorie active
            const filteredWorks = works.filter(work => work.category.name === selectedCategory);
            afficherTravaux(filteredWorks);
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('login-form');
  
  loginForm.addEventListener(function (event) {
      event.preventDefault(); // Empêcher la soumission du formulaire par défaut

      // Récupérer les valeurs des champs email et mot de passe
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Construire l'objet de données à envoyer au serveur
      const data = {
          email: email,
          password: password
      };

      // Envoi des données au serveur
      fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          body: JSON.stringify(data)
      })
      .then(response => {
          if (response.ok) {
              return response.json();
          } else {
              throw new Error('Erreur lors de la soumission des données');
          }
      })
      .then(data => {
          // Traitement de la réponse du serveur si nécessaire
          console.log('Réponse du serveur:', data);
      })
      .catch(error => {
          console.error('Erreur:', error);
      });

      // Effacer les champs du formulaire après la soumission
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
  });
});

