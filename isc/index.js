let startTime, endTime;
let imageSize = "";
let image = new Image();
let bitSpeed = document.getElementById("bits"),
    kbSpeed = document.getElementById("kbs"),
    mbSpeed = document.getElementById("mbs"),
    info = document.getElementById("info");

let totalBitSpeed = 0;
let totalKbSpeed = 0;
let totalMbSpeed = 0;
let numTests = 1;
let testCompleted = 0;

// Get random image from unsplash.com
let imageApi = "https://plus.unsplash.com/premium_photo-1673292293042-cafd9c8a3ab3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bmF0dXJlfGVufDB8fDB8fHww";

// When image loads
image.onload = async function () {
    endTime = new Date().getTime();

    // Get image size
    await fetch(imageApi).then((response) => {
        imageSize = response.headers.get("content-length");
        // Another Function to Calculate Speed
        calculateSpeed();
    });
};

// Function to calculate speed
function calculateSpeed() {
    // Time taken in seconds
    let timeDuration = (endTime - startTime) / 1000; // The time taken to load it Divide it by 1000
    // Total bits
    let loadedBits = imageSize * 8; 
    let speedInBts = loadedBits / timeDuration;
    let speedInKbs = speedInBts / 1024;
    let speedInMbs = speedInKbs / 1024;

    totalBitSpeed += speedInBts;
    totalKbSpeed += speedInKbs;
    totalMbSpeed += speedInMbs;

    testCompleted++;

    // If all tests completed (we get 5 image then calculate average)
    if (testCompleted === numTests) {
        let averageSpeedInBps = (totalBitSpeed / numTests).toFixed(2);
        let averageSpeedInKbps = (totalKbSpeed / numTests).toFixed(2);
        let averageSpeedInMbps = (totalMbSpeed / numTests).toFixed(2);

        // Display average speeds
        bitSpeed.innerHTML += `${averageSpeedInBps}`;
        kbSpeed.innerHTML += `${averageSpeedInKbps}`;
        mbSpeed.innerHTML += `${averageSpeedInMbps}`;
        info.innerHTML = "Test Completed!";
    } else {
        // Run the next test
        startTime = new Date().getTime();
        image.src = imageApi;
    }
}

// Initial function to start tests
const init = async () => {
    info.innerHTML = "Testing...";
    startTime = new Date().getTime();
    image.src = imageApi;
};

// Run tests when window loads
window.onload = () => {
    for (let i = 0; i < numTests; i++) {
        init();
    }
};