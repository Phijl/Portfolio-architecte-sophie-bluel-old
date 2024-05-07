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



//Étape 3.3 : Envoi d’un nouveau projet au back-end via le formulaire de la modale
// Fonction pour ouvrir le modal d'ajout de photo
const ouvrirAjouterPhotoModal = () => {
    // Récupérer la fenêtre modale
    const modal = document.getElementById("modal");

    // Modifier le titre du modal
    modal.querySelector("h4").textContent = "Ajouter une photo";

    // Modifier le contenu du modal pour afficher le formulaire d'ajout de photo
    const contenuModal = modal.querySelector(".modal-content");
    contenuModal.innerHTML = `
    <div class="modal-content">
    <span class="close">&times;</span>
    <div><img id="arrow" class="arrow" src="assets/icons/fleche.png" alt="arrow"></div>
    <h4>Ajouter une photo</h4>
    <form id="ajouterPhotoForm">
        <div class="upload-container">
        <div class="image-upload">
    <img src="assets/icons/image.png" alt="Image preview">
    <label for="image-input" class="image-label" title="+ Ajouter une photo">
        <button class="photo" id="add-photo-button">+ Ajouter photo</button>
    </label>
    <input type="file" id="image-input" accept="image/*" style="display: none;">
    <p class="modalp">jpg, png. Taille maximale : 4 Mo.</p>
</div>  
        </div>
        <button id="valider">Valider</button>
    </form>
</div>

    `;
    document.getElementById('add-photo-button').addEventListener('click', function() {
        document.getElementById('image-input').click();
    });
    
    // Afficher le modal
    modal.style.display = "block";

    // Gérer la sélection d'une image
    const imageInput = contenuModal.querySelector("#image-input");
    const imagePreview = contenuModal.querySelector("#image-preview");
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Ajouter un événement de fermeture sur la croix
    const closeModalBtn = contenuModal.querySelector(".modal .close");
    closeModalBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    console.log(ouvrirAjouterPhotoModal);
    
    // Gérer la soumission du formulaire d'ajout de photo
const formulaireAjoutPhoto = contenuModal.querySelector("#ajouterPhotoForm");
formulaireAjoutPhoto.addEventListener("submit", (event) => {
    event.preventDefault();
    // Code pour traiter l'ajout de la photo ici
});


    // Vérifier si l'élément de flèche existe avant d'ajouter l'événement
    const backArrow = contenuModal.querySelector(".arrow");
    if (backArrow) {
        // Fonction pour gérer le retour en arrière dans le modal
        const retourArriereDansModal = () => {
            // Fermer le modal actuel
            modal.style.display = "none";
console.log(modal.style.display);
            // Réafficher les travaux dans le modal
            recupererTravauxDepuisBackend();
        };

        // Ajouter un événement pour la flèche de retour
        backArrow.addEventListener("click", retourArriereDansModal);
    }
};

// Événement DOMContentLoaded
document.addEventListener("DOMContentLoaded", async function() {
    // Récupérer le bouton "Ajouter une photo"
    const addPhotoBtn = document.getElementById("addPhotoBtn");

    // Ajouter un écouteur d'événement pour ouvrir le modal d'ajout de photo
    addPhotoBtn.addEventListener("click", ouvrirAjouterPhotoModal);
});
