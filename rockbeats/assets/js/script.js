const gameState = {
    progression: [],
    elements: {},
    submittedInputs: new Set(),
  };
  
  function initializeElements() {
    gameState.elements = {
      input: document.getElementById("input"),
      submit: document.getElementById("submit"),
      item1: document.getElementById("item1"),
      emoji: document.getElementById("emoji"),
      maindiv: document.querySelector(".main"),
    };
  }
  
  function showLoading() {
    gameState.elements.emoji.classList.add("loading-animation");
    gameState.elements.input.disabled = true;
    gameState.elements.submit.disabled = true;
  }
  
  function hideLoading() {
    gameState.elements.emoji.classList.remove("loading-animation");
    gameState.elements.input.disabled = false;
    gameState.elements.submit.disabled = false;
  }
  
  async function results(item2, item1) {
    showLoading();
    item1 = item1.toLowerCase();
    item2 = item2.toLowerCase();
    const url = "https://api.ch3n.cc/whatbeatspaper/compare";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item1, item2 }),
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      hideLoading();
  
      if (data.result) {
        gameState.progression.unshift(item2);
        beats(item2, item1, data.explanation, data.emoji);
      } else {
        gameState.progression.unshift(`${item2} 😵`);
        doesnotbeat(item1, item2, data.explanation);
      }
    } catch (error) {
      hideLoading();
      console.error("Error fetching data:", error);
      gameState.elements.item1.textContent = "Error";
      gameState.elements.emoji.textContent = "❌";
    }
  }
  
  function formatProgression() {
    if (gameState.progression.length <= 1) {
      return gameState.progression[0] || "";
    }
  
    return gameState.progression.reduce((acc, curr, idx) => {
      const cleanCurr = curr.replace(" 😵", "");
      if (idx === gameState.progression.length - 1) {
        return acc + cleanCurr;
      }
      return acc + cleanCurr + " 🤜 ";
    }, "");
  }
  
  function doesnotbeat(beaten, beater, reason) {
    const html = `
      <p class="item"><span id='item2'>${beater}</span></p>
      <p class="item red">does <span class='bold'>&nbsp;not&nbsp;</span> beat</p>
      <center>
        <p class="item"><span id='item1'>${beaten}</span></p>
        <br>
        <p class="gessedtext">${reason}</p>
        <div id="emoji" class="emoji">❌</div>
        <br>
        <p class="guessedtext">Already Guessed:</p>
        <p class="progression">${formatProgression()}</p>
        <button onclick="window.location.reload()" class="tryagain">Try Again</button>
      </center>
    `;
    gameState.elements.maindiv.innerHTML = html;
  }
  
  function beats(beater, beaten, reason, emoji) {
    const html = `
      <p class="item"><span id='item2'>${beater}</span></p>
      <p class="item green">beats</p>
      <center>
        <p class="item"><span id='item1'>${beaten}</span></p>
        <br>
        <p class="gessedtext">${reason}</p>
        <div id="emoji" class="emoji">${emoji}</div>
        <br>
        <p class="guessedtext">Already Guessed:</p>
        <p class="progression">${formatProgression()}</p>
        <button onclick="continueGame('${beater}', '${emoji}')" class="tryagain">Continue</button>
      </center>
    `;
    gameState.elements.maindiv.innerHTML = html;
  }
  
  function continueGame(newItem, emoji) {
    const html = `
      <p class="whatbeats">What Beats</p>
      <p class="item"><span id='item1'>${newItem}</span>?</p>
      <div id="emoji" class="emoji">${emoji}</div>
      <center>
        <input type="text" id="input" class="input" autocomplete="off" />
        <button id="submit" class="submit">Go</button>
        <br><br>
        <p class="guessedtext">Already Guessed:</p>
        <p class="progression">${formatProgression()}</p>
      </center>
    `;
    gameState.elements.maindiv.innerHTML = html;
    initializeElements();
    attachEventListeners();
  }
  
  function submitHandler() {
    const value = gameState.elements.input.value;
    const firstitem = gameState.elements.item1.textContent;
  
    const validPattern = /^[A-Za-z\s]+$/;
    if (!validPattern.test(value)) {
      alert("just use letters and spaces nothing else");
      return;
    }
  
    if (value.trim() !== "") {
      if (gameState.submittedInputs.has(value.toLowerCase())) {
        alert("youve already submitted this think of somthing else");
        return;
      }
      gameState.submittedInputs.add(value.toLowerCase());
      results(value, firstitem);
    }
  }
  
  function keypressHandler(e) {
    if (e.key === "Enter") {
      const value = gameState.elements.input.value;
      const firstitem = gameState.elements.item1.textContent;
  
      const validPattern = /^[A-Za-z\s]+$/;
      if (!validPattern.test(value)) {
        alert("just use letters and spaces nothing else");
        return;
      }
  
      if (value.trim() !== "") {
        if (gameState.submittedInputs.has(value.toLowerCase())) {
          alert("youve already submitted this think of somthing else");
          return;
        }
        gameState.submittedInputs.add(value.toLowerCase());
        results(value, firstitem);
      }
    }
  }
  
  function attachEventListeners() {
    gameState.elements.submit.addEventListener("click", submitHandler);
    gameState.elements.input.addEventListener("keypress", keypressHandler);
  }
  document.addEventListener("DOMContentLoaded", function () {
    initializeElements();
    attachEventListeners();
    document.addEventListener("keydown", function (e) {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "b",
          "a",
          "Control",
          "Alt",
          "Backspace",
        ].includes(e.key) ||
        e.metaKey
      )
        return;
  
      gameState.elements.input.focus();
    });
  });
  
  window.continueGame = continueGame;
  
  async function toggle() {
    const item1 = gameState.elements.item1.textContent;
    const item2 = gameState.elements.input.value;
  
    if (!item1 || !item2) {
      console.error("Both item1 and item2 must be provided.");
      return;
    }
  
    try {
      const response = await fetch(
        `https://api.ch3n.cc/whatbeatspaper/compare/toggle?item1=${encodeURIComponent(
          item1
        )}&item2=${encodeURIComponent(item2)}`,
        {
          method: "POST",
        }
      );
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log("Toggled result:", data);
    } catch (error) {
      console.error("Error toggling result:", error);
    }
  }