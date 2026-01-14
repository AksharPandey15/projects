document.getElementById('bmiForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get the values from the inputs
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100; // convert cm to meters

    // Check if the inputs are valid
    if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
        alert("Please enter valid weight and height.");
        return;
    }

    // Calculate BMI
    const bmi = (weight / (height * height)).toFixed(2);

    // Display the result
    document.getElementById('bmiResult').textContent = bmi;
    
    let category = "";
    if (bmi < 18.5) {
        category = "Underweight";
    } else if (bmi >= 18.5 && bmi < 24.9) {
        category = "Normal weight";
    } else if (bmi >= 25 && bmi < 29.9) {
        category = "Overweight";
    } else {
        category = "Obesity";
    }

    document.getElementById('bmiCategory').textContent = category;
});
