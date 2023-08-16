const music = document.getElementById("audio");
const cover = document.getElementById("capaDisco");
const like = document.getElementById("like");
const currentProgress = document.getElementById("currentProgress");
const bar = document.getElementById("progressBar");
const nameMusic = document.getElementById("nomeMusica");
const band = document.getElementById("band");
const play = document.getElementById("playMusic");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const shuffleClick = document.getElementById("shuffle");
const repeat = document.getElementById("repeat");
const songTime = document.getElementById("songTime");
const totalTime = document.getElementById("totalTime");

const emptyHeaded = {
    nameMusic : "Empty Headed",
    band : "Lorraine Dietrich",
    file : "empty_headed",
    liked: false
};
const belive = {
    nameMusic : "I Belive in Miracles",
    band : "Ramones",
    file : "belive",
    liked: false 
};
const transylvania = {
    nameMusic : "Transylvania",
    band : "Iron Maiden",
    file : "transylvania",
    liked: false
};

let isPlaying = false;
let isShuffled = false;
let repeatOn = false;

const truePlaylist = JSON.parse(localStorage.getItem("playlist")) ?? [emptyHeaded, belive, transylvania];
//vai pegar um item de dentro do meu "LOCAL STORAGE"
let untruePlaylist = [...truePlaylist];
//"SPREAD": os "3 PONTINHOS" espalham objetos de uma "ARRAY", auxilia a criação de cópias de arrays 
let index = 0;

function playSong() {
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    //o "QUERRY" busca seletores('id' ou 'class') dentro de uma variável já especeficada
    music.play();
    isPlaying = true;
}

function pauseSong() {
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    //o "QUERRY" busca seletores('id' ou 'class') dentro de uma variável já especeficada
    music.pause();
    isPlaying = false;
}

function playPauseDecider() {
    if (isPlaying === true) {
        pauseSong();
    } 
    else {
        playSong();
    }
}

function startMusic() {
    cover.src = `images/${truePlaylist[index].file}.jpg`;
    music.src = `songs/${truePlaylist[index].file}.mp3`;
    nameMusic.innerText = truePlaylist[index].nameMusic;
    band.innerText = truePlaylist[index].band;
    //uso os COLCHETES para acessar uma variável dentro da array
    justLikeVisual();
}

function previousSong() {
    if (index === 0) {
        index = truePlaylist.length - 1;
    } 
    else {
        index -= 1;
    }
    startMusic();
    playSong();
}

function nextSong() {
    if (index === truePlaylist.length - 1) {
        index = 0;
    } 
    else {
        index += 1;
    }
    startMusic();
    playSong();
}

function updateProgress() {
    const barWidth = (music.currentTime / music.duration) * 100;
    currentProgress.style.setProperty("--progress", `${barWidth}%`);
    //o ".style" acessa valores advindos do CSS
    songTime.innerText = toHHMMSS(music.currentTime);
}

function skipFor(event) {
    const width = bar.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * music.duration;
    music.currentTime = jumpToTime;
}

function shuffleArray (preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
}

function shuffling() {
    if (isShuffled === false) {
        isShuffled = true;
        shuffleArray(untruePlaylist);
        shuffleClick.classList.add("buttonActive");
    } 
    else {
        isShuffled = false;
        untruePlaylist = [...truePlaylist];
        shuffleClick.classList.remove("buttonActive");
    }
}

function repeating() {
    if (repeatOn === false) {
        repeatOn = true;
        repeat.classList.add("buttonActive");
    }
    else {
        repeatOn = false;
        repeat.classList.remove("buttonActive");
    }
}

function nextOrRepeat() {
    if (repeatOn === false) {
        nextSong();
    }
    else {
        playSong();
    }
}

function toHHMMSS(originalNumber) {
    let hours = Math.floor(originalNumber / 3600);
    let min = Math.floor((originalNumber - hours * 3600) / 60);
    let seconds = Math.floor(originalNumber - hours * 3600 - min *60);

    //o "RETURN" entrega uma informação calculada pela "FUNCTION"
    //aqui ela calcula o tempo da música
    return (`${hours.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    //transformo o número em string com o "TO STRING"; posso editar ele como o "PADSTART", indico o número de casas decimais e, se tiver menos de duas(ex: 4s) ele vai botar o número entre parenteses na frente.
}

function updateTotalTime() {
    toHHMMSS(music.duration);
    totalTime.innerText = toHHMMSS(music.duration);
}

function justLikeVisual() {
    if (untruePlaylist[index].liked === true) {
        like.querySelector(".bi").classList.remove("bi-heart");
        like.querySelector(".bi").classList.add("bi-heart-fill");
        like.classList.add("buttonActive");
    } 
    else {
        like.querySelector(".bi").classList.add("bi-heart");
        like.querySelector(".bi").classList.remove("bi-heart-fill");
        like.classList.remove("buttonActive");
    }
}

function likeClicked() {
    if (untruePlaylist[index].liked === false) {
        untruePlaylist[index].liked = true;
    }
    else {
        untruePlaylist[index].liked = false;
    }
    justLikeVisual();
    localStorage.setItem("playlist", JSON.stringify(truePlaylist));

    //o "LOCAL STORAGE" possibilita o armazenamento de informações que não irão ser apagadas de modo algum
    //o "SET ITEM" auxilia, nele preciso colocar a palavra que eu quero como indentificação da informação e a informação de fato
}

startMusic();

play.addEventListener("click", playPauseDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
music.addEventListener("timeupdate", updateProgress);
music.addEventListener("ended", nextOrRepeat);
music.addEventListener("loadedmetadata", updateTotalTime);
bar.addEventListener("click", skipFor);
shuffleClick.addEventListener("click", shuffling);
repeat.addEventListener("click", repeating);
like.addEventListener("click", likeClicked);
//adicona eventos aos botões, aqui ele ficou com o evento de "CLICK" e retorn uma "FUNCTION" pré-definida 