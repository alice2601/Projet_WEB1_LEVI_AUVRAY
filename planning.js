const transiDays = {
    "lundi":0,
    "mardi":1,
    "mercredi":2,
    "jeudi":3,
    "vendredi":4
};

const promoclik ={
    "Prépa 1":1,
    "Prépa 2":2, 
    "Ingé 1":3, 
    "Ingé 2":4, 
    "Ingé 3":5, 
    "BTS tec":6, 
    "Bachelor tec":7, 
    "Master tec":8,
    "BTS marketing":9,
    "Bachelor marketing":10,
    "Master marketing":11,

};

let planningData = null;
const page = window.location.href;
const param = new URL(page).searchParams;
const promo = param.get("promo");

function fetchJSON(url) {
    return fetch(url)
        .then(reponse => {
            if (!reponse.ok) {
                throw new Error('Network response was not ok');
            }
            return reponse.json();
        })
        .then(data => {
            if (Object.keys(data).length === 0 && data.constructor === Object) {
                throw new Error('Empty Json or malformed Json');
            }
            console.log(data);
            return data;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
            throw error;
        });
}

function planningAccess(data, jour, heure, promo) {
    return data?.[promo]?.[transiDays[jour]]?.[heure] ?? null;
}

async function loadplanning() {
    console.log("start planning load");

    if (!promo) {
        console.error("Paramètre promo manquant dans l'URL");
        return;
    }
    const savedPlanning = localStorage.getItem("planningData");

    if (savedPlanning) {
        planningData = JSON.parse(savedPlanning);
        console.log("planning chargé depuis localStorage");
    } else {
        planningData = await fetchJSON("../json/planning.json");
        console.log("planning chargé depuis planning.json");
    }

    console.log(planningData);
    renderplanning();

    };

function renderplanning(){
    let days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];

    days.forEach(day => {
        let horaires_html = document.querySelectorAll('#' + day + ' div');

        horaires_html.forEach(horaire_html => {
            let horaire = horaire_html.className;
            let cours = planningAccess(planningData, day, horaire, promo);
            console.log(cours);
            horaire_html.innerHTML = "";

            if (cours && cours.length === 3) {
                let title = document.createElement("h3");
                title.textContent = cours[0];

                let num = document.createElement("p");
                num.textContent = cours[2] + '/' + cours[1];

                horaire_html.appendChild(title);
                horaire_html.appendChild(num);
            }
        });
    })
};

console.log("running...");
console.log(promo);

document.addEventListener("DOMContentLoaded", async function () {
    console.log("DOM prêt !");
    await loadplanning();
    console.log("Planning prêt !");
    const form = document.getElementById("infoForm");

    if (form){
        form.addEventListener ("submit", function(e) {
        e.preventDefault();

        const num= form.elements["numero_etudiant"].value;
        const day= form.elements["day"].value;
        const horaire= form.elements["horaire"].value;

        if(!num || day ==="" || horaire ===""){
            alert("Veuillez remplir tous les champs.");
            return;
        }

        const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
        const dayName = days[day];

        let cours = planningAccess(planningData, dayName, horaire, promo);

        if(!cours){
            alert("Cours introuvable");
            return;
        }

        if(cours[2]>=cours[1]){
            alert("trop de personnes dans ce cours");
            return;

        }
        else{
            cours[2] += 1;
            localStorage.setItem("planningData", JSON.stringify(planningData));
            renderplanning();
            console.log("numéro étudiant :", num);
            console.log("jours :", day);
            console.log("horaire:", horaire); 
            alert("place ajoutée");
            return;

        }

        })
    }
});