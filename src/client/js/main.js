import "../scss/styles.scss";
import "regenerator-runtime";

const profile = document.getElementById("profile");
const dropdown = document.getElementById("dropdown");

const handleProfile = () => {
  dropdown.classList.toggle("show");
};

profile.addEventListener("click", handleProfile);
