// Étape 2.2 : Authentification de l’utilisateur
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Empêcher la soumission du formulaire par défaut
  
        // Récupérer les valeurs des champs email et mot de passe
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
  
        // Construire l'objet de données à envoyer au serveur
        const data = {
            email: email,
            password: password
        };
        console.log(data)
  
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
  