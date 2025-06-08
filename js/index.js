const charselectbtn = document.getElementById("charselectbtn");
const closecharselectbtn = document.getElementById("closecharselectbtn");
const charselectmodal = document.getElementById("charselectmodal");

document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('img/bg-moc.png')`;

let roster_position = 0;

function opencharselect(pos) {
    roster_position = pos;
    charselectmodal.classList.add("active");
}
closecharselectbtn.addEventListener("click", () => { charselectmodal.classList.remove("active"); });

function select_character(char) {
    charselectmodal.classList.remove("active");
    selected_char[roster_position] = char;
    update_roster();
}

//////// UNCOMMENT for Modal coding ////////
// charselectmodal.classList.add("active");

characters = ['None', 'Castorice', 'Firefly', 'Fugue', 'Lingsha', 'March 7th - Preservation', 'Ruan Mei', 'Seele', 'Stelle - Remembrance', 'The Herta'];
memosprites = { 'Castorice': 'Pollux', 'Lingsha': 'Fuyuan', 'Stelle - Remembrance': 'Mem' };
charmodallist = document.getElementById('charmodallist');
charlist = '';
for (const c of characters) {
    charlist += `
    <button type="button" class="char-btn charselect d-flex flex-column" onclick="select_character('${c}')">
        <img src="img/char/${c}.webp" alt="" width="100%" onerror="this.onerror=null;this.src='img/char/None.webp';">
        <div>${c}</div>
    </button>
    `;
}
charmodallist.innerHTML = charlist;

const roster_size = 4;
let selected_char = ['None', 'None', 'None', 'None'];

update_roster();

// Roster button
function update_roster() {
    let rosterhtml = ""
    for (let i = 0; i < roster_size; i++) {
        curr_html = `
          <div class="d-flex mb-1 align-items-center justify-content-end">
            <button type="button" class="char-btn mr-auto me-2" onclick="opencharselect(${i})">
              <img src="img/char/${selected_char[i]}.webp" alt="" width="100%" onerror="this.onerror=null;this.src='img/char/None.webp';">
              <div>${selected_char[i]}</div>
            </button>
            <form class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="number" min="0" placeholder="Speed" aria-label="Speed">
            </form>
          </div>
        `;
        if (selected_char[i] in memosprites) {
            curr_html += `
            <div class="d-flex align-items-center justify-content-end">
                <button type="button" class="memo-btn mr-auto me-2">
                <img src="img/char/${memosprites[selected_char[i]]}.webp" alt="" width="100%" onerror="this.onerror=null;this.src='img/char/None.webp';">
                <div>${memosprites[selected_char[i]]}</div>
                </button>
                <form class="form-inline my-2 my-lg-0">
                <input class="form-control form-control-sm mr-sm-2" type="number" min="0" placeholder="Speed" aria-label="Speed">
                </form>
            </div>
            `;
        }
        rosterhtml += `<div>${curr_html}</div>`;
    }
    if(selected_char.some(c => c in memosprites)) {
        document.body.style.paddingTop = '250px';
    }
    else {
        document.body.style.paddingTop = '170px';
    }
    document.getElementById('teamroster').innerHTML = rosterhtml;
}

// Select Gamemode
const backgrounds = {
    1: 'url("img/bg-moc.png")',
    2: 'url("img/bg-pf.png")',
    3: 'url("img/bg-as.png")'
};
const gamemode_data = {1: {'Name':'Memory of Chaos','Cycle':20}, 2: {'Name':'Pure Fiction','Cycle':4}, 3: {'Name':'Apocalyptic Shadow','Cycle':0}};
const ruler_height = 600;
let pixel_per_av = 3;
function generate_ruler(gamemode) {
    curr_html = `<h3>Combat Actions (${gamemode_data[gamemode]['Name']})</h3>
                    <div class="ruler-container">`;
    if(gamemode == 1 || gamemode == 2) {
        for(let i=1; i<= gamemode_data[gamemode]['Cycle']; i++) {
            curr_html += `<div class="slot pe-1">Cycle ${i}</div>`
        }
        curr_html += `<div class="overlay-element pt-5">
                <!-- Overlay element here -->
             </div>
             </div>
             <style>
                    /* Ruler */
                .ruler-container {
                    position: relative;
                    height: ${ruler_height}px;
                    display: flex;
                    width: calc(${150*pixel_per_av}px + ${gamemode_data[gamemode]['Cycle']-1} * ${100*pixel_per_av}px);
                    background-color: rgba(0,0,0,0.5);
                    border: 1px solid #ccc;
                    margin-top: 2rem;
                }
                .slot {
                    height: 100%;
                    border-right: 1px solid #999;
                    display: flex;
                    align-items: start;
                    justify-content: end;
                    font-size: 16px;
                    white-space: nowrap;
                background-image: 
                    linear-gradient(to right, rgba(128,128,128,0.3) 1px, transparent 1px);
                background-size: ${10*pixel_per_av}px 100%;
                background-repeat: repeat-x;
                }
                .slot:first-child {
                    width: ${150*pixel_per_av}px;
                }
                .slot:not(:first-child) {
                    width: ${100*pixel_per_av}px;
                }

                .overlay-element {
                    position: absolute;
                    top: 0;
                    left: 0; /* example: slot 3 (${150*pixel_per_av} + ${100*pixel_per_av}*1) */
                }

                /* Ruler */
            </style>
             `
             ;
    }
    else if(gamemode == 3) {
        curr_html += `<p style="font-size:100px;"><b>In progress...</b></p><br><p style="font-size:20px;">yea I'm not doing it anytime soon</p>`
    }
    document.getElementById('combatactionbar').innerHTML = curr_html;
}
const gamemodeselect = document.getElementById("gamemode-select");
gamemodeselect.addEventListener('change', () => {
    const gamemode = gamemodeselect.value;
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), ${backgrounds[gamemode]}`;
    console.log(gamemode);
    generate_ruler(gamemode);
}
);
generate_ruler(gamemodeselect.value);