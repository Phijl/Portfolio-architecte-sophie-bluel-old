document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");

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
});
