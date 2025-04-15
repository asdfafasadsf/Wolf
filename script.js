
function setPlayerCount(count) {
  const menu = document.getElementById("startMenu");
  const names = document.getElementById("playerNames");
  menu.style.display = "none";
  names.style.display = "block";
  names.innerHTML = "<h3>Enter Player Names:</h3>";
  for (let i = 0; i < count; i++) {
    names.innerHTML += `<input type="text" placeholder="Player ${i + 1}" id="player${i}" /><br>`;
  }
  names.innerHTML += '<button onclick="alert(\'Names collected — continue game logic here\')">Start Game</button>';
}
