document.getElementById("searchButton").addEventListener("click", fetchWord);

function fetchWord() {
    const word = document.getElementById("wordInput").value;
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Word not found');
            }
            return response.json();
        })
        .then(data => {
            displayWord(data[0]);
            document.getElementById("error-message").style.display = "none";
        })
        .catch(error => {
            displayError();
            document.getElementById("error-message").innerText = error.message;
            document.getElementById("error-message").style.display = "block";
            document.getElementById("word-container").style.display = "none";
        });
}

function displayWord(data) {
    document.getElementById("word").innerText = data.word;
    document.getElementById("phonetic").innerText = data.phonetic || '';
    
    // Set audio source
    const audioSource = data.phonetics.find(phonetic => phonetic.audio);
    if (audioSource) {
        const pronunciationElement = document.getElementById("pronunciation");
        const pronunciationSource = document.getElementById("pronunciationSource");
        pronunciationSource.src = audioSource.audio;
        pronunciationElement.load(); // Load the new audio source
    }

    const meaningsContainer = document.getElementById("meanings");
    meaningsContainer.innerHTML = '';

    data.meanings.forEach(meaning => {
        const partOfSpeech = document.createElement("h3");
        partOfSpeech.innerText = meaning.partOfSpeech;
        meaningsContainer.appendChild(partOfSpeech);

        meaning.definitions.forEach(def => {
            const definition = document.createElement("p");
            definition.innerText = `${def.definition}`;
            meaningsContainer.appendChild(definition);
        });
    });

    document.getElementById("word-container").style.display = "block";
}

// Function to display error
function displayError() {
    document.getElementById("word").innerText = "Error";
    document.getElementById("phonetic").innerText = "";
    document.getElementById("meanings").innerHTML = ''; // Clear meanings
    const pronunciationElement = document.getElementById("pronunciation");
    const pronunciationSource = document.getElementById("pronunciationSource");
    pronunciationSource.src = ""; // Clear audio source
    pronunciationElement.load(); // Reload to clear any previous audio
}
