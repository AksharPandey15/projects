// Get elements from the DOM
const form = document.getElementById('expense-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const totalBalance = document.getElementById('total-balance');
const expensesList = document.getElementById('expenses');

// Initialize expenses array and load from localStorage if available
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

// Function to update the balance and display expenses
function updateUI() {
    // Calculate the total balance
    let balance = expenses.reduce((total, expense) => total + expense.amount, 0);
    totalBalance.textContent = balance.toFixed(2);

    // Clear the list
    expensesList.innerHTML = '';

    // Loop through expenses and display them
    expenses.forEach(expense => {
        const listItem = document.createElement('li');
        listItem.classList.add(expense.type);
        listItem.innerHTML = `${expense.description} <span>$${expense.amount.toFixed(2)}</span>`;
        expensesList.appendChild(listItem);
    });
}

// Event listener for the form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get the input values
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);

    // Validate inputs
    if (description === '' || isNaN(amount) || amount === 0) {
        alert('Please enter a valid description and amount.');
        return;
    }

    // Determine the type of expense (income or expense)
    const type = amount < 0 ? 'expense' : 'income';

    // Create a new expense object
    const newExpense = {
        description: description,
        amount: amount,
        type: type
    };

    // Add the new expense to the expenses array
    expenses.push(newExpense);

    // Save the updated expenses array to localStorage
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Clear the input fields
    descriptionInput.value = '';
    amountInput.value = '';

    // Update the UI
    updateUI();
});

// Initial UI update
updateUI();
