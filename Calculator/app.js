let display = document.getElementById('display');
let currentInput = '0';
let lastOperator = '';
let newNumber = true;
let lastNumber = 0;

// Add keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    if (key >= '0' && key <= '9' || key === '.') {
        appendNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        calculate();
    } else if (key === 'Backspace') {
        backspace();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});

function appendNumber(num) {
    if (newNumber) {
        currentInput = num;
        newNumber = false;
    } else {
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (!newNumber) {
        calculate();
    }
    lastOperator = operator;
    lastNumber = parseFloat(currentInput);
    newNumber = true;
}

function calculate() {
    if (lastOperator && !newNumber) {
        const currentNumber = parseFloat(currentInput);
        let result;
        
        switch(lastOperator) {
            case '+':
                result = lastNumber + currentNumber;
                break;
            case '-':
                result = lastNumber - currentNumber;
                break;
            case '*':
                result = lastNumber * currentNumber;
                break;
            case '/':
                if (currentNumber === 0) {
                    result = '♾️';
                } else {
                    result = lastNumber / currentNumber;
                }
                break;
        }
        
        currentInput = result.toString();
        lastOperator = '';
        newNumber = true;
        updateDisplay();
    }
}

function clearDisplay() {
    currentInput = '0';
    lastOperator = '';
    lastNumber = 0;
    newNumber = true;
    updateDisplay();
}

function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
        newNumber = true;
    }
    updateDisplay();
}

function updateDisplay() {
    display.textContent = currentInput;
} 