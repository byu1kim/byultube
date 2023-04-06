const video = document.getElementById("video");
const video_output = document.getElementById("video_output");
const thumb = document.getElementById("thumb");
const thumb_output = document.getElementById("img_output");

const ph = document.getElementById("placeholder");
console.log("rhi");
function loadVideo(event) {
  video_output.src = URL.createObjectURL(event.target.files[0]);
  ph.style.display = "none";
}

function loadImg(event) {
  thumb_output.src = URL.createObjectURL(event.target.files[0]);
}

if (video) {
  video.addEventListener("change", loadVideo);
}
if (thumb) {
  thumb.addEventListener("change", loadImg);
}
