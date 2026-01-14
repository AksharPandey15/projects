const jokeBtn = document.getElementById("jokeBtn");
const jokeDisplay = document.getElementById("joke");

jokeBtn.addEventListener("click", getJoke);

async function getJoke() {
  try {
    const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
    const data = await response.json();

    if (data.type === 'single') {
      jokeDisplay.textContent = data.joke;
    } else {
      jokeDisplay.textContent = `${data.setup} - ${data.delivery}`;
    }
  } catch (error) {
    jokeDisplay.textContent = "Oops! Something went wrong. Try again later.";
  }
}
