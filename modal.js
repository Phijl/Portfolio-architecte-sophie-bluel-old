import { recupererDonnees, afficherTravaux } from "./script.js";

// Variable globale pour stocker les travaux
let works = [];

// Fonction pour fermer tous les modals
const fermerTousLesModals = () => {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.style.display = "none";
  });
};

// Fonction pour afficher le pop-up de confirmation
const afficherPopupConfirmation = (message) => {
  const confirmationPopup = document.getElementById("confirmationPopup");
  confirmationPopup.textContent = message;
  confirmationPopup.style.display = "block";
  console.log("projet ajouter");

  // Masquer le pop-up après 3 secondes
  setTimeout(() => {
    confirmationPopup.style.display = "none";
  }, 3000);
};

// Fonction pour supprimer un travail
const supprimerTravail = async (id) => {
  const reponse = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  });

  if (reponse.ok) {
    console.log("Le travail a été supprimé avec succès.");
    const elementTravailModal = document.querySelector(
      `.work-modal[data-id='${id}']`
    );
    if (elementTravailModal) {
      elementTravailModal.remove();
    }

    recupererDonnees();
    afficherTravaux(works);
  }
};

// Fonction pour supprimer un élément de la galerie principale
recupererDonnees();
afficherTravaux(works);

// Fonction pour afficher les travaux dans le modal
const afficherTravauxDansModal = (travaux) => {
  if (!travaux || travaux.length === 0) {
    console.error("Erreur: Aucune donnée de travaux disponible.");
    return;
  }

  const galerieModal = document.querySelector(".thumbnails");
  galerieModal.innerHTML = "";

  travaux.forEach((travail) => {
    const elementTravail = document.createElement("div");
    elementTravail.classList.add("work-modal");
    elementTravail.dataset.id = travail.id;

    const elementImageContainer = document.createElement("div");
    elementImageContainer.classList.add("image-container");

    const elementImage = document.createElement("img");
    elementImage.src = travail.imageUrl;
    elementImage.alt = travail.title;
    elementImage.classList.add("thumbnail-image");

    const elementCroix = document.createElement("span");
    elementCroix.innerHTML = "&times;";
    elementCroix.classList.add("close-icon");

    elementCroix.addEventListener("click", function (event) {
      event.stopPropagation();
      const travailId = travail.id;
      if (travailId) {
        const confirmation = confirm(
          "ATTENTION : Êtes-vous sûr de vouloir supprimer ce travail ?"
        );
        if (confirmation) {
          supprimerTravail(travailId);
        }
      }
    });

    elementImageContainer.appendChild(elementImage);
    elementImageContainer.appendChild(elementCroix);
    elementTravail.appendChild(elementImageContainer);
    galerieModal.appendChild(elementTravail);
  });
};

// Fonction pour récupérer les travaux depuis le backend
const recupererTravauxDepuisBackend = async () => {
  try {
    const reponse = await fetch("http://localhost:5678/api/works", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    const travaux = await reponse.json();
    works = travaux; // Assignez les travaux récupérés à la variable globale `works`
    afficherTravauxDansModal(travaux);
  } catch (erreur) {
    console.error(
      "Une erreur s'est produite lors de la récupération des travaux depuis le backend :",
      erreur
    );
  }
};

// Fonction pour ajouter un projet dynamiquement à la galerie principale
const ajouterProjetGalerie = (travail) => {
  const galerie = document.querySelector(".gallery");

  const elementTravail = document.createElement("div");
  elementTravail.classList.add("work");
  elementTravail.dataset.id = travail.id;

  const elementImage = document.createElement("img");
  elementImage.src = travail.imageUrl;
  elementImage.alt = travail.title;

  const elementTitre = document.createElement("h3");
  elementTitre.textContent = travail.title;

  elementTravail.appendChild(elementImage);
  elementTravail.appendChild(elementTitre);
  galerie.appendChild(elementTravail);

  ajouterEvenementSuppression(travail.id);
};

// Gérer la soumission du formulaire d'ajout de photo
const ajouterEvenementSuppression = (id) => {
  const elementTravail = document.querySelector(`.work[data-id='${id}']`);
  if (elementTravail) {
    const elementCroix = document.createElement("span");
    elementCroix.innerHTML = "&times;";
    elementCroix.classList.add("close-icon");

    elementCroix.addEventListener("click", function (event) {
      event.stopPropagation();
      const travailId = id;
      if (travailId) {
        const confirmation = confirm(
          "ATTENTION : Êtes-vous sûr de vouloir supprimer ce travail ?"
        );
        if (confirmation) {
          supprimerTravail(travailId);
        }
      }
    });

    elementTravail.appendChild(elementCroix);
  }
};

// Fonction pour vérifier la validité du formulaire
const checkFormValidity = () => {
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const image = document.getElementById("image-input").files[0];
  const validerBtn = document.getElementById("valider");

  if (title && category && category !== "" && image) {
    validerBtn.disabled = false;
    validerBtn.style.background = "#1D6154";
  } else {
    validerBtn.disabled = true;
    validerBtn.style.background = "#A7A7A7";
  }
};

// Fonction pour récupérer les catégories depuis le backend
const recupererCategories = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/categories");
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des catégories");
    }
    const categories = await response.json();
    const categorySelect = document.getElementById("category");
    categorySelect.innerHTML =
      '<option value="">Sélectionnez une catégorie</option>';

    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des catégories :",
      error
    );
  }
};

const ouvrirAjouterPhotoModal = async () => {
  fermerTousLesModals();
  const modal = document.getElementById("addPhotoModal");
  modal.style.display = "block";

  document
    .getElementById("add-photo-button")
    .addEventListener("click", function () {
      document.getElementById("image-input").click();
    });

  const imageInput = document.querySelector("#image-input");
  const imagePreview = document.getElementById("image-preview");
  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
    checkFormValidity();
  });

  const closeModalBtn = modal.querySelector(".close");
  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  const backArrow = modal.querySelector(".arrow");
  if (backArrow) {
    backArrow.addEventListener("click", () => {
      modal.style.display = "none";
      document.getElementById("modal").style.display = "block";
    });
  }

  await recupererCategories();
  checkFormValidity();
};

const formulaireAjoutPhoto = document.querySelector("#ajouterPhotoForm");
formulaireAjoutPhoto.addEventListener("submit", async (event) => {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const category = document.getElementById("category").value;
  const image = document.getElementById("image-input").files[0];

  if (!title || !category || !image) {
    alert("Tous les champs sont requis.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: formData,
    });

    if (response.ok) {
      const travail = await response.json();
      ajouterProjetGalerie(travail);
      works.push(travail);
      await recupererTravauxDepuisBackend();
      const modal = document.getElementById("addPhotoModal");
      modal.style.display = "none";
      afficherPopupConfirmation("Projet ajouté avec succès!");
    } else {
      alert("Erreur lors de l'ajout du projet.");
    }
  } catch (error) {
    console.error("Une erreur s'est produite :", error);
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const openModalBtn = document.getElementById("openModalBtn");
  const modal = document.getElementById("modal");

  openModalBtn.addEventListener("click", function () {
    fermerTousLesModals();
    modal.style.display = "block";
  });

  const addPhotoBtn = document.getElementById("addPhotoBtn");
  addPhotoBtn.addEventListener("click", ouvrirAjouterPhotoModal);

  const closeModalBtns = document.querySelectorAll(".modal .close");
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      btn.closest(".modal").style.display = "none";
    });
  });

  window.addEventListener("click", function (event) {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none";
    }
  });

  document.getElementById("title").addEventListener("input", checkFormValidity);
  document
    .getElementById("category")
    .addEventListener("change", checkFormValidity);
  document
    .getElementById("image-input")
    .addEventListener("change", checkFormValidity);

  await recupererTravauxDepuisBackend();
});
