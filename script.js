// ETAPE 1.1 - Récupération des données depuis l'API
const recupererDonnees = async () => {
    try {
      // Fait une requête fetch pour obtenir les données du back-end
      const reponse = await fetch("http://localhost:5678/api/works");
      
      // Convertit la réponse en format JSON
      const donneesTravaux = await reponse.json();
  
      // Appelle la fonction pour afficher les travaux dans la galerie
      afficherTravaux(donneesTravaux);
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
  
 
 

  

