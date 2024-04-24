document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Empêche la soumission du formulaire par défaut

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Envoie la requête POST à l'API Swagger
            fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, password: password })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur de connexion");
                }
                return response.json();
            })
            .then(data => {
                // Stocker les informations d'authentification dans un cookie ou dans le stockage local
                // Par exemple, si l'API renvoie un jeton d'authentification :
                const authToken = data.token;
                localStorage.setItem("authToken", authToken);
                
                // Rediriger l'utilisateur vers la page d'accueil avec le paramètre d'URL indiquant qu'il est connecté
                window.location.href = "index.html?loggedin=true";
            })
            .catch(error => {
                // Gérer les erreurs
                console.error("Erreur lors de la connexion:", error.message);
                // Afficher un message d'erreur à l'utilisateur
                alert("Les informations utilisateur / mot de passe ne sont pas correctes.");
            });
        });
    }

    // Fonction pour vérifier si l'utilisateur est connecté
    const isLoggedIn = () => {
        return localStorage.getItem("authToken") !== null;
    };

    // Fonction pour mettre à jour l'affichage du bouton de connexion/déconnexion
    const updateLoginButton = () => {
        const loginButton = document.getElementById("loginButton");
        if (isLoggedIn()) {
            loginButton.innerHTML = '<a href="#">Log Out</a>';
        } else {
            loginButton.innerHTML = '<a href="login.html">Log In</a>';
        }
    };

    // Mettre à jour l'affichage du bouton lors du chargement de la page
    updateLoginButton();

    // Gestionnaire d'événement pour le clic sur le bouton de connexion/déconnexion
    const loginButton = document.getElementById("loginButton");
    if (loginButton) {
        loginButton.addEventListener("click", function(event) {
            event.preventDefault(); // Empêche le lien par défaut de se déclencher
            if (isLoggedIn()) {
                logout();
            } else {
                window.location.href = "login.html";
            }
        });
    }

    // Fonction pour déconnecter l'utilisateur
    const logout = () => {
        localStorage.removeItem("authToken");
        updateLoginButton(); // Mettre à jour l'affichage du bouton après la déconnexion
        window.location.href = "login.html";
    };
});
