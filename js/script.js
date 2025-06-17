//////////////////////////////// Modify ////////////////////////////////
const roster_size = 4;
let team_roster = Array(roster_size).fill("None");
let team_actionbar = Array(roster_size).fill([]);
let team_memo_actionbar = Array(roster_size).fill([]);

characters = ['None', 'Castorice', 'Firefly', 'Fugue', 'Lingsha', 'March 7th - Preservation', 'Ruan Mei', 'Seele', 'Stelle - Remembrance', 'The Herta'];
memosprites = { 'Castorice': 'Pollux', 'Lingsha': 'Fuyuan', 'Stelle - Remembrance': 'Mem' };

const ruler_height = 600;
let pixel_per_av = 3; // Default = 3

const actionbar_height = 40;
////////////////////////////////////////////////////////////////

//////////////////////////////// Constant ////////////////////////////////
const gamemode_data = {
    1: {'Name':'Memory of Chaos','Cycle':20,'AV':2050},
    2: {'Name':'Pure Fiction','Cycle':4,'AV':450},
    3: {'Name':'Apocalyptic Shadow','Cycle':1,'AV':2000}
};
const backgrounds = {
    1: 'url("img/bg-moc.png")',
    2: 'url("img/bg-pf.png")',
    3: 'url("img/bg-as.png")'
};
const actionbar_colors = ['rgba(0, 162, 255, 0.5)','rgba(0, 255, 34, 0.5)','rgba(255, 0, 0, 0.5)','rgba(204, 0, 255, 0.5)'];

const advance_type = {
    advance_char: (char_index, av, advance) => { turn_advance(char_index, 'char', av, advance); },
    advance_memo: (char_index, av, advance) => { turn_advance(char_index, 'memo', av, advance); },
    advance_both: (char_index, av, advance) => { turn_advance(char_index, 'char', av, advance);
                                                 turn_advance(char_index, 'memo', av, advance); },
    advance_all:  (av, advance)             => {for(let i=0;i<roster_size;i++) { 
                                                    turn_advance(char_index, 'char', av, advance);
                                                    turn_advance(char_index, 'memo', av, advance); }}
}
////////////////////////////////////////////////////////////////

//////////////////////////////// Initialize ////////////////////////////////
test_spd = [90,161,160,104]
let char_modified_spd = Array(roster_size).fill([]);
let memo_modified_spd = Array(roster_size).fill([]);
update_roster();
generate_ruler(document.getElementById("gamemode-select").value);
init_actionbar_array();
render_rectangle();
////////////////////////////////////////////////////////////////

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
    team_roster[roster_position] = char;
    update_roster();
    init_actionbar_array();
    render_rectangle();
}

//////// UNCOMMENT for Modal coding ////////
// charselectmodal.classList.add("active");

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

// Roster button
function update_roster() {
    let rosterhtml = ""
    for (let i = 0; i < roster_size; i++) {
        let char_spd = document.getElementById(`char-${i}-spd`)?.value;
        let curr_html = `
          <div class="d-flex mb-1 align-items-center justify-content-end">
            <button type="button" class="char-btn mr-auto me-2" onclick="opencharselect(${i})">
              <img src="img/char/${team_roster[i]}.webp" alt="" width="100%" onerror="this.onerror=null;this.src='img/char/None.webp';">
              <div>${team_roster[i]}</div>
            </button>
            <div class="form-inline my-2 my-lg-0">
              <input class="form-control mr-sm-2" type="number" min="0" placeholder="Speed" aria-label="Speed" id="char-${i}-spd" onchange="init_actionbar_array(); render_rectangle();" ${char_spd != null ? `value="${char_spd}"` : ""}>
            </div>
          </div>
        `;
        if (team_roster[i] in memosprites) {
            curr_html += `
            <div class="d-flex align-items-center justify-content-end">
                <button type="button" class="memo-btn mr-auto me-2">
                <img src="img/char/${memosprites[team_roster[i]]}.webp" alt="" width="100%" onerror="this.onerror=null;this.src='img/char/None.webp';">
                <div>${memosprites[team_roster[i]]}</div>
                </button>
                <div class="form-inline my-2 my-lg-0">
                <input class="form-control form-control-sm mr-sm-2" type="number" min="0" placeholder="Speed" aria-label="Speed" id="char-${i}-memo-spd" onchange="init_actionbar_array(); render_rectangle();">
                </div>
            </div>
            `;
        }
        rosterhtml += `<div>${curr_html}</div>`;
    }
    if(team_roster.some(c => c in memosprites)) {
        document.body.style.paddingTop = '250px';
    }
    else {
        document.body.style.paddingTop = '170px';
    }
    document.getElementById('teamroster').innerHTML = rosterhtml;
}

// Select Gamemode
function generate_ruler(gamemode) {
    let curr_html = `<h3>Combat Actions (${gamemode_data[gamemode]['Name']})</h3>
                    <div class="ruler-container">`;
    if(gamemode == 1 || gamemode == 2) {
        for(let i=1; i<= gamemode_data[gamemode]['Cycle']; i++) {
            curr_html += `<div class="slot pe-1">Cycle ${i}</div>`
        }
        curr_html += `<div class="ruler-overlay pt-5" id="ruler-overlay">
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

                .ruler-overlay {
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

document.getElementById("gamemode-select").addEventListener('change', () => {
    let gamemode = document.getElementById("gamemode-select").value;
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), ${backgrounds[gamemode]}`;
    generate_ruler(gamemode);
    init_actionbar_array();
    render_rectangle();
}
);

// Action bar
function init_actionbar_array() {
    for(let i=0; i<roster_size; i++) {
        let char_spd = 134+(5*i);
        // Comment for test
        char_spd = document.getElementById(`char-${i}-spd`).value;
        char_modified_spd[i] = char_spd;
        let char_av =  10000/char_spd;
        let rectangle_width = char_av * pixel_per_av
        // Floor division >>> 7/2 | 0 = 3 <--- I have no idea how did it do that
        console.log(gamemode_data[document.getElementById("gamemode-select").value]['AV'])
        let total_rectangle = (gamemode_data[document.getElementById("gamemode-select").value]['AV']*pixel_per_av) / rectangle_width | 0
        team_actionbar[i] = Array(total_rectangle).fill(rectangle_width);
        if (team_roster[i] in memosprites) {
            let memo_spd = 90+(5*i);
            // Comment for test
            memo_spd = document.getElementById(`char-${i}-memo-spd`).value;
            memo_modified_spd[i] = memo_spd;
            let memo_av =  10000/memo_spd;
            let rectangle_width = memo_av * pixel_per_av
            let total_rectangle = (gamemode_data[document.getElementById("gamemode-select").value]['AV']*pixel_per_av) / rectangle_width | 0
            team_memo_actionbar[i] = Array(total_rectangle).fill(rectangle_width);
        }
    }
}

function render_rectangle() {
    let ruler_overlay = document.getElementById('ruler-overlay');
    let overlay_curr_html = ''
    for(let i=0; i<roster_size; i++) {
        if(team_roster[i] === "None") continue;
        let curr_html = '';
        curr_html += `<div class="d-flex" id="char-${i}-actionbar">${get_rectangle(team_actionbar[i],'char',i)}</div>`;
        if(team_roster[i] in memosprites) {
            curr_html += `<div class="d-flex" id="char-${i}-memo-actionbar">${get_rectangle(team_memo_actionbar[i],'memo',i)}</div>`;
        }
        curr_html = `<div>${curr_html}</div>`;
        overlay_curr_html += `<div class="mb-5">${curr_html}</div>`;
    }
    ruler_overlay.innerHTML = overlay_curr_html;
}

function get_rectangle(array, type, color) {
    let rectangle_height = {'char':actionbar_height, 'memo':actionbar_height/2}
    let curr_html = '';
    for(let i=0;i<array.length;i++) {
        curr_html += `<div class="char-actionbar" id="${type}-actionbar-${i}" class="d-flex" style="width:${array[i]}px; height: ${rectangle_height[type]}px; background-color: ${actionbar_colors[color]};"></div>`;
    }
    return curr_html;
}

function adjust_av(char_index, type, arr) {
    function sum_arr(arr) { return arr.reduce((sum, val) => sum + val, 0); }
    let gamemode = document.getElementById("gamemode-select").value;
    let modded_spd = (type == 'char')? char_modified_spd[char_index] : memo_modified_spd[char_index];
    let modded_av = (10000 / modded_spd) * pixel_per_av;
    if(sum_arr(arr) < (gamemode_data[gamemode]['AV'] * pixel_per_av)) {
        while((sum_arr(arr) + modded_av) <= (gamemode_data[gamemode]['AV'] * pixel_per_av)) {
            arr.push(modded_av);
        }
    }
    else if(sum_arr(arr) > (gamemode_data[gamemode]['AV'] * pixel_per_av)) {
        while(sum_arr(arr) > (gamemode_data[gamemode]['AV'] * pixel_per_av)) {
            arr.pop();
        }
    }
    return arr;
}

function find_index_by_sum(arr, target) {
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (sum + arr[i] >= target) {
      return { index: i, prev: sum };
    }
    sum += arr[i];
  }
  return { index: arr.length, prev: sum };
}

function turn_advance(char_index, type, av, advance) {
    let advanced_char = (type == 'char')? team_actionbar[char_index] : team_memo_actionbar[char_index];
    av = av * pixel_per_av;
    advance = 1 - advance;
    let av_data = find_index_by_sum(advanced_char, av);
    let new_av_width = (((advanced_char[av_data.index] * advance) + av_data.prev) <= av)? (av - av_data.prev) : (advanced_char[av_data.index] * advance)
    advanced_char[av_data.index] = new_av_width;
    advanced_char = adjust_av(char_index, type, advanced_char);
    render_rectangle();
}