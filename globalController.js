const routes = {
  "home": "home.html",
  "/PROJECTS/FPS_System": "/PROJECTS/FPS_System/project.html",
  "/PROJECTS/Egg_Hatching_System": "/PROJECTS/Egg_Hatching_System/project.html",
  "/PROJECTS/Fly_System": "/PROJECTS/Fly_System/project.html",
  "/PROJECTS/TDS_System": "/PROJECTS/TDS_System/project.html",
  "/PROJECTS/Jeepney_Passenger": "/PROJECTS/Jeepney_Passenger/project.html",
  "/PROJECTS/Case_Unveiled": "/PROJECTS/Case_Unveiled/project.html",
};

const pageCache = {};

window.location.hash = "#home";

let rafID = null;

function mediaController() {

    const controls = document.getElementById("main-media-controls");

    const video = document.querySelector(".main-media");
    const seekbar = document.getElementById("main-media-controls-slider");
    const smoothingFactor = 0.1;

    const volumeButton = document.getElementById("controls-volume");
    const playpausebutton = document.getElementById("controls-playpause");
    const progressText = document.getElementById("controls-progresstext");

  
    let progress = 0;

    function formatTime(t){
        const mins = Math.floor(t/60);
        const secs = Math.floor(t%60);

        return (String(mins).padStart(2,"0")+":"+String(secs).padStart(2,"0"));
    }

    function updateSeekbar(){
        const targetTime = video.currentTime;
        const duration = video.duration || 1;

        progress = progress + (targetTime - progress) * smoothingFactor;

        const percentage = (progress/duration) * 100
        seekbar.value = percentage;
        seekbar.style.setProperty("--progress", percentage+"%")

        rafID = requestAnimationFrame(updateSeekbar);
    }

    rafID = requestAnimationFrame(updateSeekbar)

    video.addEventListener("timeupdate", ()=>{
      progressText.querySelector("span").innerHTML = formatTime(video.currentTime)+" / "+formatTime(video.duration);
    })

    seekbar.addEventListener("input", () => {
      console.log("EEE")
      const time = (seekbar.value / 100) * video.duration;
      video.currentTime = time;
      progress = time;
    });

    volumeButton.addEventListener("click", ()=>{
        if (video.muted === true){
            video.muted = false;
            volumeButton.querySelector("i").classList.replace("bi-volume-mute-fill", "bi-volume-up-fill");
        } else {
            video.muted = true;
            volumeButton.querySelector("i").classList.replace("bi-volume-up-fill", "bi-volume-mute-fill");
        }
    })

    playpausebutton.addEventListener("click", ()=>{
        if (!video.paused){
            video.pause();
            playpausebutton.querySelector("i").classList.replace("bi-pause-fill", "bi-play-fill");
        } else {
            video.play().catch(()=>{});
            playpausebutton.querySelector("i").classList.replace("bi-play-fill", "bi-pause-fill");
        }   
    })

    video.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
 
}

function previewContent(){
  const contents = document.querySelectorAll(".works-content");

  contents.forEach(content => {
    const video = content.querySelector(".works-content-video");

    function startPreview(){
      video.style.opacity = "1";
      video.currentTime = 4;
      video.play().catch(()=>{});
    }
    function stopPreview(){
      video.pause();
      video.style.opacity = "0";
    }

    content.onmouseenter = startPreview;
    content.onmouseleave = stopPreview;

    video.addEventListener("timeupdate", ()=>{
      if (!video.paused && video.currentTime >= 10){
        stopPreview();
      }
    })

  });
}

function cleanup() {
  if (rafID) {
    cancelAnimationFrame(rafID);
    rafID = null;
  }
}

async function loadPage(route) {
  const app = document.getElementById("main-card");
  cleanup();
  console.log(route)
  const file = routes[route];

  app.classList.add("fade-out");

  await new Promise(r => setTimeout(r, 300));

  if (!file) {
    app.innerHTML = "<h1 style='color: rgb(180,180,180)'>Not found</h1>";
    return;
  }
  if (!pageCache[file]) {
    const res = await fetch(file);
    pageCache[file] = await res.text();
  }

  app.innerHTML = pageCache[file];
  
  if (route==="home"){
    previewContent();
  } else {
    mediaController();
  }

  await new Promise(r => setTimeout(r, 400));

  app.classList.remove("fade-out");
}

function router() {
    const hash = window.location.hash || "#home";
    const path = hash.slice(1); 

    if (path === "home") {
        loadPage("home");
    } else {
        loadPage(path);
    }
}

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
