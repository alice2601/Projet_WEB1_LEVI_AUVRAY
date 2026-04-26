document.getElementById("btnMdp").addEventListener("click", function () {
  const mdp = document.getElementById("mdp").value;
  const carte = document.getElementById("carte");
  const message = document.getElementById("message");

  if (mdp === "I solemnly swear that I am up to no good") {
    carte.style.display = "block";
    message.textContent = "";
  } else {
    carte.style.display = "none";
    message.textContent = "Mot de passe incorrect";
  }
});