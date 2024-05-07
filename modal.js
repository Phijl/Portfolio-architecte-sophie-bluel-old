let work
// Fonction pour supprimer un travail
const supprimerTravail = async (id) => {
    try {
        // Fait une requête fetch pour supprimer le travail avec l'ID spécifié
        const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE'
        });
        
        // Vérifie si la suppression a réussi
        if (reponse.ok) {
            // Actualise les travaux affichés dans le modal après la suppression
            await recupererTravauxDepuisBackend();
            console.log("Le travail a été supprimé avec succès.");
        } else {
            console.error("Erreur lors de la suppression du travail.");
        }
    } catch (erreur) {
        console.error("Une erreur s'est produite lors de la suppression du travail :", erreur);
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
        elementTravail.dataset.id = travail.id; // Ajoute l'ID du travail comme attribut data-id

        // Crée un élément div pour contenir l'image et la croix
        const elementImageContainer = document.createElement("div");
        elementImageContainer.classList.add("image-container");

        // Crée un élément img pour afficher l'image du travail
        const elementImage = document.createElement("img");
        elementImage.src = travail.imageUrl;
        elementImage.alt = travail.title;
        elementImage.classList.add("thumbnail-image"); // Ajoute la classe thumbnail-image à l'image

        // Crée un élément span pour la croix de suppression
        const elementCroix = document.createElement("span");
        elementCroix.innerHTML = "&times;"; // Utilise le symbole '×' pour la croix
        elementCroix.classList.add("close-icon"); // Ajoute une classe pour le style CSS

        // Fonction pour afficher une boîte de dialogue personnalisée
        const afficherBoiteDialogue = (message, callback) => {
        const boiteDialogue = document.createElement("div");
        boiteDialogue.classList.add("custom-dialog");
    
        const contenu = document.createElement("div");
        contenu.textContent = message;
        boiteDialogue.appendChild(contenu);
    
        const boutonOui = document.createElement("button");
        boutonOui.textContent = "Oui";
        boutonOui.addEventListener("click", () => {
            callback(true);
            document.body.removeChild(boiteDialogue);
        });
        boiteDialogue.appendChild(boutonOui);
    
    const boutonNon = document.createElement("button");
    boutonNon.textContent = "Non";
    boutonNon.addEventListener("click", () => {
        callback(false);
        document.body.removeChild(boiteDialogue);
    });
    boiteDialogue.appendChild(boutonNon);
    
    document.body.appendChild(boiteDialogue);
};
        // Ajoute un événement de clic à la croix pour supprimer le travail
        elementCroix.addEventListener("click", function(event) {
            event.stopPropagation(); // Empêche la propagation du clic à l'élément de travail
            const travailId = travail.id;
            if (travailId) {
                if (confirm(" ATTENTION : Êtes-vous sûr de vouloir supprimer ce travail ?")) {
                    supprimerTravail(travailId);
                }
            }
        });

        // Ajoute l'image et la croix à l'élément du travail dans le modal
        elementImageContainer.appendChild(elementImage);
        elementImageContainer.appendChild(elementCroix);
        elementTravail.appendChild(elementImageContainer);

        // Ajoute l'élément du travail à la galerie dans le modal
        galerieModal.appendChild(elementTravail);
    });
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

// Événement DOMContentLoaded
document.addEventListener("DOMContentLoaded", async function() {
    // Récupérer la fenêtre modale
    const modal = document.getElementById("modal");

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

    // Récupérer les travaux depuis le backend et les afficher dans le modal
    await recupererTravauxDepuisBackend();
});
