const explorerBtn = document.querySelector('.btn-explorer');
const featureSection = document.querySelector('.feature-section');

if (explorerBtn){
    explorerBtn.addEventListener("click", function(){
        featureSection.scrollIntoView({ behavior: 'smooth' });
    });
}

const tousBtn = document.querySelector('.btn-tous');

if (tousBtn) {
    tousBtn.addEventListener("click", function(){
        window.location.href = "cer.html";
    });
}

const connexionBtn = document.querySelector('.connexion');

if (connexionBtn) {
    connexionBtn.addEventListener("click", function(){
        window.location.href = "connexion.html";
    });
}

const heroSearchBtn = document.querySelector('#hero-search-btn');
const heroSearchInput = document.querySelector('#hero-search');

if (heroSearchBtn){
    heroSearchBtn.addEventListener("click", function(){
        const searchValue = heroSearchInput.value;
        window.location.href = "cer.html?recherche=" + searchValue;
    });
}

const urlParams = new URLSearchParams(window.location.search);
const rechercheDepuisAccueil = urlParams.get('recherche');

function appliquerFiltres() {
    const motRecherche = cerSearchInput ? cerSearchInput.value.toLowerCase() : "";

    const niveauxCoches = [];
    document.querySelectorAll('.niveaux input[type="checkbox"]:checked').forEach(function(checkbox) {
        niveauxCoches.push(checkbox.value);
    });

    const specialitesCochees = [];
    document.querySelectorAll('.specialites input[type="checkbox"]:checked').forEach(function(checkbox) {
        specialitesCochees.push(checkbox.value);
    });

    const cerCards = document.querySelectorAll('.cer-card');

    cerCards.forEach(function(card) {
        const titre = card.querySelector('h3').textContent.toLowerCase();

        const correspondTitre = titre.includes(motRecherche);
        const correspondNiveau = niveauxCoches.length === 0 || niveauxCoches.includes(card.dataset.niveau);
        const correspondSpecialite = specialitesCochees.length === 0 || specialitesCochees.includes(card.dataset.specialite);

        if (correspondTitre && correspondNiveau && correspondSpecialite) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

const cerSearchInput = document.querySelector('#cer-search');

if (cerSearchInput) {
    cerSearchInput.addEventListener('input', appliquerFiltres);
}

const niveauCheckboxes = document.querySelectorAll('.niveaux input[type="checkbox"]');
niveauCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', appliquerFiltres);
});

const specialiteCheckboxes = document.querySelectorAll('.specialites input[type="checkbox"]');
specialiteCheckboxes.forEach(function(checkbox) {
    checkbox.addEventListener('change', appliquerFiltres);
});

if (rechercheDepuisAccueil) {
    cerSearchInput.value = rechercheDepuisAccueil;
    appliquerFiltres();
}

const favoriButtons = document.querySelectorAll('.favori-btn');

const favorisSauvegardes = JSON.parse(localStorage.getItem('favoris')) || [];

favoriButtons.forEach(function(button) {
    const card = button.closest('.cer-card');
    const titre = card.querySelector('h3').textContent;

    if (favorisSauvegardes.includes(titre)) {
        button.textContent = "❤️";
    }
});

favoriButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const card = this.closest('.cer-card');
        const titre = card.querySelector('h3').textContent;

        let favoris = JSON.parse(localStorage.getItem('favoris')) || [];

        if (this.textContent === "🤍") {
            this.textContent = "❤️";
            favoris.push(titre);
        } else {
            this.textContent = "🤍";
            favoris = favoris.filter(function(t) {
                return t !== titre;
            });
        }

        localStorage.setItem('favoris', JSON.stringify(favoris));
    });
});

const favorisPageCards = document.querySelectorAll('.cer-card');

if (favorisPageCards.length > 0 && window.location.pathname.includes('favoris.html')) {

    const favorisListe = JSON.parse(localStorage.getItem('favoris')) || [];

    favorisPageCards.forEach(function(card) {
        const titre = card.querySelector('h3').textContent;

        if (favorisListe.includes(titre)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

if (window.location.pathname.includes('favoris.html')) {

    const unfavoriButtons = document.querySelectorAll('.favori-btn');

    unfavoriButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const card = this.closest('.cer-card');
            const titre = card.querySelector('h3').textContent;

            let favoris = JSON.parse(localStorage.getItem('favoris')) || [];

            favoris = favoris.filter(function(t) {
                return t !== titre;
            });

            localStorage.setItem('favoris', JSON.stringify(favoris));

            card.style.display = "none";
        });
    });

}

const fermerBtn = document.querySelector('.fermer');

if (fermerBtn) {
    fermerBtn.addEventListener("click", function() {
        window.location.href = "gestion.html";
    });
}

const enregistrerBtn = document.querySelector('#enregistrer-btn');

if (enregistrerBtn) {
    enregistrerBtn.addEventListener('click', function() {
        const titre = document.querySelector('#titre').value;
        const niveau = document.querySelector('#niveau').value;
        const description = document.querySelector('#description').value;

        if (titre.trim() === "" || niveau === "") {
            alert("Merci de remplir au moins le titre et le niveau.");
            return;
        }

        const specialites = [];
        document.querySelectorAll('.specialite-cb:checked').forEach(function(checkbox) {
            specialites.push(checkbox.value);
        });

        const nouveauCER = {
            titre: titre,
            niveau: niveau,
            specialites: specialites,
            description: description,
            date: new Date().toLocaleDateString('fr-FR')
        };

        const cersExistants = JSON.parse(localStorage.getItem('cers')) || [];

        cersExistants.push(nouveauCER);

        localStorage.setItem('cers', JSON.stringify(cersExistants));

        alert("CER enregistre !");
        window.location.href = "gestion.html";
        
    });

}

const cerTableBody = document.querySelector('.cer-table tbody');

if (cerTableBody) {

    const cersSauvegardes = JSON.parse(localStorage.getItem('cers')) || [];

    cersSauvegardes.forEach(function(cer) {
        const nouvelleLigne = document.createElement('tr');
        nouvelleLigne.dataset.titre = cer.titre;

        nouvelleLigne.innerHTML = `
            <td>${cer.titre}</td>
            <td>${cer.specialites.join(', ')}</td>
            <td>${cer.niveau}</td>
            <td>${cer.date}</td>
            <td>
                <div class="actions">
                    <button class="editer">Editer</button>
                    <button class="supprimer">Supprimer</button>
                </div>
            </td>
        `;

        cerTableBody.appendChild(nouvelleLigne);

    });

    cerTableBody.addEventListener('click', function(event) {

        if (event.target.classList.contains('supprimer')) {
            const ligne = event.target.closest('tr');
            const titreLigne = ligne.dataset.titre;
            
            if (titreLigne) {
                let cers = JSON.parse(localStorage.getItem('cers')) || [];
                cers = cers.filter(function(cer) {
                    return cer.titre !== titreLigne;
                });
                localStorage.setItem('cers', JSON.stringify(cers));
            }

            ligne.remove();

        }
        if (event.target.classList.contains('editer')) {
            window.location.href = "add-cer.html";
        }
    });
}

//connexion.html
const eyeBtn = document.querySelector('.eye');
const passwordInput = document.querySelector('#password');

if (eyeBtn) {
    eyeBtn.addEventListener('click', function() {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
        } else {
            passwordInput.type = "password";
        }
    });
}

const connexionSubmitBtn = document.querySelector('#connexion');
const emailInput = document.querySelector("#email");

if (connexionSubmitBtn) {
    connexionSubmitBtn.addEventListener("click", function() {
        const email = emailInput.value;
        const password = passwordInput.value;

        if (email.trim() === "" || password.trim() === "") {
            alert("Merci de remplir votre email et votre mot de passe.");
            return;
        }

        alert("Connexion reussie !");
        window.location.href = "index.html";

    });

}

const creerCompteBtn = document.querySelector('#creerCompte');

if (creerCompteBtn) {
    creerCompteBtn.addEventListener('click', function() {
        const nom = document.querySelector('#nom').value;
        const email = document.querySelector('#email').value;
        const niveau = document.querySelector('#niveau').value;
        const password = document.querySelector('#password').value;
        const message = document.querySelector('#message');

        if (nom.trim() === "" || email.trim() === "" || niveau === "" || password.trim() === "") {
            message.textContent = "Merci de remplir tous les champs"
            message.style.color = "red";
            return;
        }

        const nouvelUtilisateur = {
            nom: nom,
            email: email,
            niveau: niveau,
            password: password
        };

        localStorage.setItem('utilisateur', JSON.stringify(nouvelUtilisateur));

        message.textContent = "Compte cree avec succes !";
        message.style.color = "green";

        setTimeout(function() {
            window.location.href = "connexion.html";
        }, 1500);

    })
}

