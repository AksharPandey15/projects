let dictionary = window.alienDictionary || {};
let reverseDictionary = {};

// Create reverse dictionary
for (const eng in dictionary) {
    const alien = dictionary[eng];
    if (!reverseDictionary[alien]) {
        reverseDictionary[alien] = eng;
    }
}

// Elements
const englishInput = document.getElementById('english-input');
const alienInput = document.getElementById('alien-input');
const btnToAlien = document.getElementById('btn-to-alien');
const btnToEnglish = document.getElementById('btn-to-english');
const clearEng = document.getElementById('clear-eng');
const clearAlien = document.getElementById('clear-alien');
const dictGrid = document.getElementById('dictionary-grid');
const searchDict = document.getElementById('search-dict');

// Helper to escape regex
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getNormalizations(word) {
    const chunks = word.match(/(.)\1*/g);
    if (!chunks) return [word];
    
    let results = [""];
    for (let chunk of chunks) {
        let char = chunk[0];
        let len = chunk.length;
        let newResults = [];
        
        for (let prefix of results) {
            if (len >= 2) {
                newResults.push(prefix + char + char);
            }
            newResults.push(prefix + char);
        }
        results = newResults;
    }
    return results;
}

function translate(text, dict) {
    if (!text.trim()) return '';
    let resultText = text.toLowerCase();
    
    const tokens = resultText.split(/([^a-z0-9']+)/i);
    let out = [];
    let i = 0;
    
    const maxWords = 4; // Max words to look ahead for multi-word phrases
    
    while (i < tokens.length) {
        if (!tokens[i].match(/[a-z0-9']/i)) {
            out.push(tokens[i]);
            i++;
            continue;
        }
        
        let matched = false;
        for (let lookahead = maxWords; lookahead >= 1; lookahead--) {
            let phraseTokens = [];
            let wordsCount = 0;
            let isValidPhrase = true;
            let j = i;
            
            while (j < tokens.length && wordsCount < lookahead) {
                phraseTokens.push(tokens[j]);
                if (tokens[j].match(/[a-z0-9']/i)) {
                    wordsCount++;
                } else {
                    if (tokens[j].match(/[^ \t]/) && wordsCount > 0 && wordsCount < lookahead) {
                        isValidPhrase = false;
                        break;
                    }
                }
                j++;
            }
            
            if (isValidPhrase && wordsCount === lookahead) {
                let lookupKey = phraseTokens.filter(t => t.match(/[a-z0-9']/i)).join(" ").toLowerCase();
                
                if (dict[lookupKey]) {
                    out.push(dict[lookupKey]);
                    i = j;
                    matched = true;
                    break;
                } else if (wordsCount === 1) {
                    const norms = getNormalizations(lookupKey);
                    for (let normKey of norms) {
                        if (dict[normKey]) {
                            out.push(dict[normKey]);
                            i = j;
                            matched = true;
                            break;
                        }
                    }
                    if (matched) break;
                }
            }
        }
        
        if (!matched) {
            out.push(tokens[i]);
            i++;
        }
    }
    
    let finalStr = out.join('');
    if (finalStr.length > 0) {
        finalStr = finalStr.charAt(0).toUpperCase() + finalStr.slice(1);
    }
    return finalStr;
}

// Event Listeners
btnToAlien.addEventListener('click', () => {
    alienInput.value = translate(englishInput.value, dictionary);
    animateFlash(alienInput);
});

btnToEnglish.addEventListener('click', () => {
    alienInput.value = alienInput.value.toLowerCase();
    englishInput.value = translate(alienInput.value, reverseDictionary);
    animateFlash(englishInput);
});

clearEng.addEventListener('click', () => englishInput.value = '');
clearAlien.addEventListener('click', () => alienInput.value = '');

// Dictionary rendering (Limited for performance)
function renderDictionary(filter = '') {
    dictGrid.innerHTML = '';
    
    if (Object.keys(dictionary).length === 0) {
         dictGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: #ff5555;">Dictionary is empty. Make sure language.js loaded correctly.</div>';
         return;
    }

    let count = 0;
    const filterLower = filter.toLowerCase();
    
    for (const eng in dictionary) {
        const alien = dictionary[eng];
        if (eng.includes(filterLower) || alien.includes(filterLower)) {
            const div = document.createElement('div');
            div.className = 'dict-item';
            div.innerHTML = `
                <div class="dict-eng">${eng}</div>
                <div class="dict-alien">${alien}</div>
            `;
            div.addEventListener('click', () => {
                englishInput.value += (englishInput.value ? ' ' : '') + eng;
            });
            dictGrid.appendChild(div);
            
            count++;
            if (count >= 100) {
                break; // Limit render to 100 items
            }
        }
    }
    
    if(count === 100) {
        const info = document.createElement('div');
        info.style.gridColumn = '1/-1';
        info.style.textAlign = 'center';
        info.style.color = 'var(--text-muted)';
        info.innerText = 'Showing top 100 results... Type to search more.';
        dictGrid.appendChild(info);
    }
}

searchDict.addEventListener('input', (e) => {
    renderDictionary(e.target.value);
});

function animateFlash(element) {
    element.style.transition = 'none';
    element.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    setTimeout(() => {
        element.style.transition = 'background-color 0.5s ease';
        element.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    }, 50);
}

// Init
renderDictionary();
