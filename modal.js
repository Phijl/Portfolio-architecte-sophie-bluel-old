let works;
document.addEventListener("DOMContentLoaded", function() {
    // Récupérer la fenêtre modale
    const modal = document.getElementById("modal");

    // Vérifier si l'utilisateur est connecté
    if (isLoggedIn()) {
        // Récupérer le bouton qui ouvre la fenêtre modale
        const openModalBtn = document.getElementById("openModalBtn");

        // Afficher la fenêtre modale lorsque l'utilisateur clique sur le bouton "Modifier"
        openModalBtn.addEventListener("click", function() {
            modal.style.display = "block";
        });

        // Récupérer le bouton de fermeture (croix)
        const closeModalBtn = document.querySelector(".modal .close");

        // Fermer la fenêtre modale lorsque l'utilisateur clique sur la croix
        closeModalBtn.addEventListener("click", function() {
            modal.style.display = "none";
        });

        // Fermer la fenêtre modale lorsque l'utilisateur clique en dehors de la fenêtre modale
        window.addEventListener("click", function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});

// Fonction pour vérifier si l'utilisateur est connecté
const isLoggedIn = () => {
    // Implémentez votre logique de vérification de connexion ici
    // Par exemple, vous pouvez vérifier si un jeton d'authentification est présent dans le stockage local
    return localStorage.getItem("authToken") !== null;
};

// Fonction pour récupérer les travaux depuis le backend
const recupererTravauxDepuisBackend = async () => {
    try {
        // Fait une requête fetch pour obtenir les données des travaux depuis le backend
        const reponse = await fetch("http://localhost:5678/api/works");
        
        // Convertit la réponse en format JSON
        const travaux = await reponse.json();
        
        // Appelle la fonction pour afficher les travaux dans le modal
        afficherTravauxDansModal(travaux);
    } catch (erreur) {
        // Gère les erreurs en affichant un message dans la console
        console.error("Une erreur s'est produite lors de la récupération des travaux depuis le backend :", erreur);
    }
};

// Fonction pour afficher les travaux dans le modal
const afficherTravauxDansModal = (travaux) => {
    // Assurez-vous que des travaux sont disponibles
    if (!travaux || travaux.length === 0) {
        console.error("Erreur: Aucune donnée de travaux disponible.");
        return;
    }

    // Sélectionne l'élément HTML représentant la galerie dans le modal
    const galerieModal = document.querySelector(".thumbnails");

    // Supprime le contenu HTML actuel de la galerie dans le modal
    galerieModal.innerHTML = "";

    // Parcourt les travaux et les ajoute dynamiquement à la galerie dans le modal
    travaux.forEach((travail) => {
        // Crée un élément div pour chaque travail
        const elementTravail = document.createElement("div");
        elementTravail.classList.add("work-modal");

        // Crée un élément img pour afficher l'image du travail
        const elementImage = document.createElement("img");
        elementImage.src = travail.imageUrl;
        elementImage.alt = travail.title;
        elementImage.classList.add("thumbnail-image"); // Ajoute la classe thumbnail-image à l'image

        // Ajoute l'image à l'élément du travail dans le modal
        elementTravail.appendChild(elementImage);

        // Ajoute l'élément du travail à la galerie dans le modal
        galerieModal.appendChild(elementTravail);
    });
};

// Écouteur d'événement pour le clic sur le bouton "Modifier"
const boutonModifier = document.getElementById("openModalBtn");
if (boutonModifier) {
    boutonModifier.addEventListener("click", async () => {
        // Récupérer les travaux depuis le backend et les afficher dans le modal
        await recupererTravauxDepuisBackend();
        
        // Afficher le modal
        const modal = document.getElementById("modal");
        modal.style.display = "block";
    });
}




