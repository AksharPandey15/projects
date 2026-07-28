// Select DOM elements
const habitInput = document.getElementById('habit-input');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitsList = document.getElementById('habits-list');

// Load saved habits from local storage
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// Function to render habits
const renderHabits = () => {
  habitsList.innerHTML = '';
  habits.forEach((habit, index) => {
    const habitItem = document.createElement('div');
    habitItem.className = `habit-item ${habit.completed ? 'completed' : ''}`;
    habitItem.innerHTML = `
      <span>${habit.name}</span>
      <button class="toggle-btn">${habit.completed ? 'Undo' : 'Done'}</button>
      <button class="delete-btn">Delete</button>
    `;

    // Toggle completion
    habitItem.querySelector('.toggle-btn').addEventListener('click', () => {
      habits[index].completed = !habits[index].completed;
      saveAndRender();
    });

    // Delete habit
    habitItem.querySelector('.delete-btn').addEventListener('click', () => {
      habits.splice(index, 1);
      saveAndRender();
    });

    habitsList.appendChild(habitItem);
  });
};

// Function to save to local storage and render
const saveAndRender = () => {
  localStorage.setItem('habits', JSON.stringify(habits));
  renderHabits();
};

// Add new habit
addHabitBtn.addEventListener('click', () => {
  const habitName = habitInput.value.trim();
  if (habitName) {
    habits.push({ name: habitName, completed: false });
    habitInput.value = '';
    saveAndRender();
  }
});

// Initial render
renderHabits();
