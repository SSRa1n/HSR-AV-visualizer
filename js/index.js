console.log("test");

const charselectbtn = document.getElementById("charselectbtn");
const closecharselectbtn = document.getElementById("closecharselectbtn");
const charselectmodal = document.getElementById("charselectmodal");

document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('../img/bg-moc.png')`;

charselectbtn.addEventListener("click", () => { charselectmodal.classList.add("active"); });
closecharselectbtn.addEventListener("click", () => { charselectmodal.classList.remove("active"); });
// charselectmodal.classList.add("active");

const backgrounds = {
      1: 'url("../img/bg-moc.png")',
      2: 'url("../img/bg-pf.png")',
      3: 'url("../img/bg-as.png")'
    };

const gamemodeselect = document.getElementById("gamemode-select");
gamemodeselect.addEventListener('change', () => {
    const gamemode = gamemodeselect.value;
    console.log(gamemode,backgrounds[gamemode])
    document.body.style.background = `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), ${backgrounds[gamemode]}`;
});