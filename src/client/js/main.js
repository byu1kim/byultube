import "../scss/styles.scss";
import "regenerator-runtime";

const body = document.body;
const profile = document.getElementById("profile");
const dropdown = document.getElementById("dropdown");
const startvideo = document.getElementById("startvideo");
const videodrop = document.getElementById("videodrop");

const handleProfile = () => {
  dropdown.classList.toggle("show");
  videodrop.classList.remove("show");
};

const handleVideo = () => {
  videodrop.classList.toggle("show");
  dropdown.classList.remove("show");
};

profile.addEventListener("click", handleProfile);
startvideo.addEventListener("click", handleVideo);
