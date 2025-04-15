
let playerCount = 0;
let players = [];
let scores = [];
let currentHole = 1;

function setPlayerCount(count) {
  playerCount = count;
  document.getElementById("startMenu").style.display = "none";
  showNameInputs();
}

function showNameInputs() {
  const container = document.getElementById("playerNames");
  container.innerHTML = "<h3>Enter Player Names:</h3>";
  for (let i = 0; i < playerCount; i++) {
    container.innerHTML += `<input type="text" id="player${i}" placeholder="Player ${i + 1}" /><br>`;
  }
  container.innerHTML += `<button onclick="startGame()">Start Game</button>`;
  container.style.display = "block";
}

function startGame() {
  players = [];
  scores = [];
  for (let i = 0; i < playerCount; i++) {
    const name = document.getElementById(`player${i}`).value.trim();
    if (!name) return alert("Enter all names.");
    players.push(name);
    scores.push({ name, total: 0, holes: Array(18).fill(null), points: Array(18).fill(1) });
  }

  document.getElementById("playerNames").style.display = "none";
  document.getElementById("game").style.display = "block";
  loadHole();
}

function loadHole() {
  document.getElementById("holeTitle").innerText = "Hole " + currentHole;
  const div = document.getElementById("scoreInputs");
  div.innerHTML = "";

  players.forEach((name, i) => {
    const score = scores[i].holes[currentHole - 1] ?? "";
    const point = scores[i].points[currentHole - 1] ?? 1;
    const negative = score < 0 ? "negative" : "";
    div.innerHTML += `
      <div>
        <label>${i + 1}. ${name}</label>
        <input type="number" id="input${i}" class="${negative}" value="${score}" oninput="validateHole()">
        <button onclick="toggleMinus(${i})">–</button>
        <label>Pts:</label>
        <button onclick="adjustPoint(${i}, -1)">-</button>
        <span id="point${i}">${point}</span>
        <button onclick="adjustPoint(${i}, 1)">+</button>
      </div>
    `;
  });

  validateHole();
}

function toggleMinus(index) {
  const input = document.getElementById("input" + index);
  let val = parseInt(input.value) || 0;
  val = -val;
  input.value = val;
  input.classList.toggle("negative", val < 0);
  validateHole();
}

function adjustPoint(index, delta) {
  const el = document.getElementById("point" + index);
  let val = parseInt(el.textContent) || 1;
  val += delta;
  if (val < 1) val = 1;
  el.textContent = val;
}

function validateHole() {
  let sum = 0;
  for (let i = 0; i < playerCount; i++) {
    const val = parseInt(document.getElementById("input" + i).value) || 0;
    sum += val;
  }
  document.getElementById("holeTotal").innerText = sum;
  document.getElementById("nextHoleBtn").disabled = sum !== 0;
}

function previousHole() {
  if (currentHole > 1) {
    currentHole--;
    loadHole();
  }
}

function nextHole() {
  for (let i = 0; i < playerCount; i++) {
    const score = parseInt(document.getElementById("input" + i).value) || 0;
    const point = parseInt(document.getElementById("point" + i).textContent) || 1;
    scores[i].holes[currentHole - 1] = score;
    scores[i].points[currentHole - 1] = point;
  }

  scores.forEach(p => {
    p.total = p.holes.reduce((sum, val) => sum + (val || 0), 0);
  });

  if (currentHole < 18) {
    currentHole++;
    loadHole();
  } else {
    showSummary();
  }
}

function showSummary() {
  const table = document.getElementById("summaryTable");
  table.innerHTML = "";
  const header = document.createElement("tr");
  header.innerHTML = "<th>Player</th>";
  for (let h = 1; h <= 18; h++) {
    header.innerHTML += `<th>${h}</th>`;
  }
  header.innerHTML += "<th>Total</th>";
  table.appendChild(header);

  scores.forEach((p, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${p.name}</td>`;
    p.holes.forEach(score => {
      const val = score !== null ? Math.abs(score) : "";
      const cls = score < 0 ? ' style="color:red;"' : "";
      row.innerHTML += `<td${cls}>${val}</td>`;
    });
    row.innerHTML += `<td>${p.total}</td>`;
    table.appendChild(row);
  });

  document.getElementById("game").style.display = "none";
  document.getElementById("summary").style.display = "block";
}

function backToGame() {
  document.getElementById("summary").style.display = "none";
  document.getElementById("game").style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("umbrellaBtn").addEventListener("click", function () {
    document.getElementById("umbrellaLogo").style.display = "block";
  });
});
