const timerRef = document.querySelector(".current-time");
const hourInput = document.getElementById("hour-input");
const minuteInput = document.getElementById("minute-input");
const secInput = document.getElementById("second-input");
const ampmSelect = document.getElementById("ampm");

const activeAlarms = document.querySelector(".alarms-list");
const setAlarm = document.getElementById("set");
const clearAllButton = document.querySelector(".clear");
const alarmSound = new Audio("./h.mp3");

let alarmIndex = 0;
let alarmsArray = [];

// Helper function to append a leading zero to single-digit values
const appendZero = (value) => (value < 10 ? "0" + value : value);

// Function to display the time and trigger alarms
const displayTimer = () => {
    const date = new Date();
    let currentHour = date.getHours();
    const currentMinute = date.getMinutes();
    const currentSecond = date.getSeconds();

    // Convert to 12-hour format
    const ampm = currentHour >= 12 ? "PM" : "AM";
    currentHour = currentHour % 12;
    currentHour = currentHour ? currentHour : 12; // the hour '0' should be '12'
    const currentTime = `${appendZero(currentHour)}:${appendZero(currentMinute)}:${appendZero(currentSecond)} ${ampm}`;
    timerRef.textContent = currentTime;

    // Check if it's time to trigger alarms (including seconds)
    alarmsArray.forEach((alarm) => {
        if (alarm.isActive && alarm.time === currentTime) {
            alarmSound.play();
        }
    });
};

// Function to create a new alarm
const createAlarm = (hour, minute, second) => {
    alarmIndex += 1;

    // Create an alarm object
    const alarmObj = {
        id: `${alarmIndex}_${hour}_${minute}_${second}`,
        time: `${appendZero(hour)}:${appendZero(minute)}:${appendZero(second)} ${ampmSelect.value}`,
        isActive: false
    };

    // Add alarm to the array and create its UI representation
    alarmsArray.push(alarmObj);
    const alarmDiv = document.createElement("div");
    alarmDiv.className = "alarm";
    alarmDiv.dataset.id = alarmObj.id;

    // Inner HTML for the alarm display
    alarmDiv.innerHTML = `
        <span>${alarmObj.time}</span>
       <label class="switch">
  <input type="checkbox" class="toggle-input">
  <span class="slider"></span>
  <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAIG/8QAIxAAAgIABQQDAAAAAAAAAAAAAQMCBAAREiExBUFRcROBsf/EABQBAQAAAAAAAAAAAAAAAAAAAAX/xAAWEQADAAAAAAAAAAAAAAAAAAAAEiL/2gAMAwEAAhEDEQA/AMBTp03dNglMVuttjqnKQ2UPOfntkOThbqVVUJ12BKnogZQZpy+Ucc8knwePWJrWqyqEHVmrTahEBqpbBoAH1n635wt3a9mjN1p8X2pw0qVEbKB/CO/c4OphSVP/2Q==" class="off">
  <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAQABADASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAQIEBf/EACMQAAEDAwQDAQEAAAAAAAAAAAQBAgUDESEAEjFBBlFhMkL/xAAUAQEAAAAAAAAAAAAAAAAAAAAF/8QAGBEAAwEBAAAAAAAAAAAAAAAAABIiMUH/2gAMAwEAAhEDEQA/AM+Bg4mS8coRccMOdNG01qVyH/kRvHPKKmMdr8uujPwUTG+NkRpw1AKWCbvHKa2zTGphc9u9p0q+rLqeMl4kSCGkYgtoE0HTahIz3bWGNanPrdyqWzn7p5ibh5CArnyZNMyVLpK0QSkt2BNXtVX+7ol1wuLJiyaHt+6Kyp//2Q==" class="on">
</label>

        <button class="deleteButton"><i class="fa-solid fa-trash-can"></i></button>
    `;

    // Add event listener to the checkbox for toggling the alarm
    alarmDiv.querySelector(".toggle-input").addEventListener("change", () => toggleAlarm(alarmObj));

    // Add event listener to the delete button
    alarmDiv.querySelector(".deleteButton").addEventListener("click", () => deleteAlarm(alarmObj));

    // Add the alarm UI to the list of active alarms
    activeAlarms.appendChild(alarmDiv);
};

// Function to toggle the alarm's active state
const toggleAlarm = (alarm) => {
    alarm.isActive = !alarm.isActive;
    if (alarm.isActive) {
        const currentTime = new Date().toLocaleTimeString("en-US", { hour12: true });
        if (alarm.time === currentTime) {
            alarmSound.play()
        }
    } else {
        alarmSound.pause();
    }
};

// Function to delete an alarm
const deleteAlarm = (alarm) => {
    const index = alarmsArray.indexOf(alarm);
    if (index > -1) {
        alarmsArray.splice(index, 1);
        document.querySelector(`[data-id="${alarm.id}"]`).remove();
    }
};

// Event listener for clearing all alarms
clearAllButton.addEventListener("click", () => {
    alarmsArray = [];
    activeAlarms.innerHTML = "";
});

// Event listener for setting a new alarm
setAlarm.addEventListener("click", () => {
    // Parse the input values, default to 0 if empty or NaN
    let hour = parseInt(hourInput.value) || 0;
    let minute = parseInt(minuteInput.value) || 0;
    let second = parseInt(secInput.value) || 0;

    // Validate the input values
    if (hour < 1 || hour > 12 || minute < 0 || minute > 59 || second < 0 || second > 59) {
        alert(`Invalid time. Please enter valid values for hours (1-12), minutes (0-59), and seconds (0-59).`);
        return;
    }

    // Check if an alarm with the same time already exists (including seconds)
    if (!alarmsArray.some(alarm => alarm.time === `${appendZero(hour)}:${appendZero(minute)}:${appendZero(second)} ${ampmSelect.value}`)) {
        createAlarm(hour, minute, second);
    } else {
        alert("An alarm for this time already exists.");
    }

    // Clear input fields
    [hourInput.value, minuteInput.value, secInput.value] = ["", "", ""];
});

// Initialize the timer and input fields
window.onload = () => {
    setInterval(displayTimer, 1000);
    [hourInput.value, minuteInput.value, secInput.value] = ["", "", ""];
};
