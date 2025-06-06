console.log("test");

const charselectbtn = document.getElementById("charselectbtn");
const closecharselectbtn = document.getElementById("closecharselectbtn");
const charselectmodal = document.getElementById("charselectmodal");

document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('../img/bg-moc.png')`;

function opencharselect() { charselectmodal.classList.add("active"); };
closecharselectbtn.addEventListener("click", () => { charselectmodal.classList.remove("active"); });

//////// UNCOMMENT for Modal coding ////////
// charselectmodal.classList.add("active");


const backgrounds = {
      1: 'url("../img/bg-moc.png")',
      2: 'url("../img/bg-pf.png")',
      3: 'url("../img/bg-as.png")'
    };

// Select Gamemode
const gamemodeselect = document.getElementById("gamemode-select");
gamemodeselect.addEventListener('change', () => {
    const gamemode = gamemodeselect.value;
    console.log(gamemode,backgrounds[gamemode]);
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), ${backgrounds[gamemode]}`;
});

// Roster button
let rosterhtml = ""
for(let i=0; i<4; i++) {
    rosterhtml += `
        <div>   
          <div class="d-flex mb-1 align-items-center justify-content-end">
            <button type="button" class="char-btn mr-auto me-2" onclick="opencharselect()">
              <img src="../img/notfound.png" alt="" width="100%">
              <div>Char${i+1}</div>
            </button>
            <form class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="number" min="0" placeholder="Speed" aria-label="Speed">
            </form>
          </div>
          <div class="d-flex align-items-center justify-content-end">
            <button type="button" class="memo-btn mr-auto me-2">
              <img src="../img/notfound.png" alt="" width="100%">
              <div>Memo${i+1}</div>
            </button>
            <form class="form-inline my-2 my-lg-0">
              <input class="form-control form-control-sm mr-sm-2" type="number" min="0" placeholder="Speed" aria-label="Speed">
            </form>
          </div>
        </div>
    `
}
document.getElementById('teamroster').innerHTML = rosterhtml;