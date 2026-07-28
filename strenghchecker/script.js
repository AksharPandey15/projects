const passwordInput = document.getElementById('password');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    let strength = getPasswordStrength(password);

    updateStrengthUI(strength);
});

function getPasswordStrength(password) {
    let strength = 0;

    // Length-based criteria
    if (password.length >= 8) strength++; // Length: 8 or more
    if (password.length >= 12) strength++; // Length: 12 or more
    if (password.length >= 16) strength++; // Length: 16 or more
    if (password.length >= 20) strength++; // Length: 20 or more
    if (password.length >= 24) strength++; // Length: 24 or more
    if (password.length >= 30) strength++; // Length: 30 or more

    // Complexity-based criteria
    if (/[a-z]/.test(password)) strength++; // Lowercase letter
    if (/[A-Z]/.test(password)) strength++; // Uppercase letter
    if (/[0-9]/.test(password)) strength++; // Number
    if (/[^A-Za-z0-9]/.test(password)) strength++; // Special character

    // Increase strength more for extremely strong passwords (more than just length and complexity)
    if (password.length >= 35) strength++; // Length: 35 or more
    if (/[A-Za-z0-9!@#$%^&*()_+]/.test(password)) strength++; // More diverse set of characters
    if (password.length >= 40) strength++; // Length: 40 or more

    return strength;
}

function updateStrengthUI(strength) {
    // Reset the strength bar and text
    strengthBar.style.width = "100%";
    strengthBar.innerHTML = `<div id="very-weak"></div><div id="weak"></div><div id="medium"></div><div id="strong"></div><div id="very-strong"></div><div id="ultimate"></div><div id="godlike"></div><div id="extremely-godlike"></div><div id="hacker"></div><div id="super-hacker"></div><div id="god"></div>`;
    strengthText.textContent = "Password Strength: ";
    strengthText.className = "";

    // Apply strength colors and text based on the strength score
    if (strength <= 2) {
        strengthBar.children[0].style.width = '100%'; // Very Weak
        strengthText.textContent = "Password Strength: Very Weak";
        strengthText.classList.add("very-weak");
    } else if (strength === 3) {
        strengthBar.children[1].style.width = '100%'; // Weak
        strengthText.textContent = "Password Strength: Weak";
        strengthText.classList.add("weak");
    } else if (strength === 4) {
        strengthBar.children[2].style.width = '100%'; // Medium
        strengthText.textContent = "Password Strength: Medium";
        strengthText.classList.add("medium");
    } else if (strength === 5) {
        strengthBar.children[3].style.width = '100%'; // Strong
        strengthText.textContent = "Password Strength: Strong";
        strengthText.classList.add("strong");
    } else if (strength === 6) {
        strengthBar.children[4].style.width = '100%'; // Very Strong
        strengthText.textContent = "Password Strength: Very Strong";
        strengthText.classList.add("very-strong");
    } else if (strength === 7) {
        strengthBar.children[5].style.width = '100%'; // Ultimate
        strengthText.textContent = "Password Strength: Ultimate";
        strengthText.classList.add("ultimate");
    } else if (strength === 8) {
        strengthBar.children[6].style.width = '100%'; // Godlike
        strengthText.textContent = "Password Strength: Godlike";
        strengthText.classList.add("godlike");
    } else if (strength === 9) {
        strengthBar.children[7].style.width = '100%'; // Extremely Godlike
        strengthText.textContent = "Password Strength: Extremely Godlike";
        strengthText.classList.add("extremely-godlike");
    } else if (strength === 10) {
        strengthBar.children[8].style.width = '100%'; // Hacker
        strengthText.textContent = "Password Strength: Hacker";
        strengthText.classList.add("hacker");
    } else if (strength === 11) {
        strengthBar.children[9].style.width = '100%'; // Super Hacker
        strengthText.textContent = "Password Strength: Super Hacker";
        strengthText.classList.add("super-hacker");
    } else if (strength >= 12) {
        strengthBar.children[10].style.width = '100%'; // God
        strengthText.textContent = "Password Strength: God";
        strengthText.classList.add("god");
    }
}
