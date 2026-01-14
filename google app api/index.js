// Set map
function initialize() {
    var mapOptions = {
        zoom: 10,
        center: new google.maps.LatLng(28.430605942417355, 77.50738315491509),
        // Type of map (ROADMAP, SATELLITE, HYBRID, TERRAIN)
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        minZoom: 2
    };

    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var infoWindow = new google.maps.InfoWindow();

    var marker = new google.maps.Marker({
        // Cordinates for Iran, Zanjan
        position: new google.maps.LatLng(28.430605942417355, 77.50738315491509),
        map: map,
        title: 'Home'
    });

    marker.addListener('click', function () {
        infoWindow.setContent(marker.title);
        infoWindow.open(map, marker);
    });

    google.maps.event.addDomListener(window, "resize", function () {
        map.setCenter(mapOptions.center);
    });


}
// Initialize a counter for the logs
let logCounter = 0;

document.addEventListener('keydown', function(event) {
    // Check for the "Ctrl + E" key combination
    if (event.ctrlKey && event.key === 'e') {
        // Prevent default behavior (like browser shortcuts)
        event.preventDefault();

        // Reveal the secret option
        var secretOption = document.getElementById('lboze');
        if (secretOption.style.display === 'none' || secretOption.style.display === '') {
            secretOption.style.display = 'block';  // Show the element

            // Logging logic based on the current logCounter
            if (logCounter < 20) {
                console.log("ok");
            } else if (logCounter < 50) {
                console.log("Stop");
            } else if (logCounter < 90) {
                console.log("Stop it already");
            } else if (logCounter < 140) {
                console.log("STOP ITTTTTTTTTT");
            } else if (logCounter < 150) {
                console.log("Try I Will not give up");
            } else if (logCounter < 250) {
                console.log("PHEW!! You have Press CTRL+e for 250 times");
            } else if (logCounter < 299) {
                console.log("Nope I Will not give up 299 times");
            } else if (logCounter < 300) {
                console.log("BRUH 300. LOL it is 300");
            } else if (logCounter < 333) {
                console.log("I AM THE DEVIL");
            } else if (logCounter < 400) {
                console.log(logCounter);
            } else if (logCounter < 500) {
                console.log("100 more than again forever counter");
            } else if (logCounter < 1000) {
                console.log(logCounter);
            } else if (logCounter < 1111) {
                console.log("Well Hello There");
            } else if (logCounter < 3333) {
                console.log("Hello There I am the Devil that one is evil");
            } else if (logCounter < 3334) {
                console.log("That's Scary");
            } else if (logCounter < 3335) {
                console.log("100 more than Counter");
            } else if (logCounter < 3435) {
                console.log(logCounter);
            } else if (logCounter < 4000) {
                console.log("You are on fire! Keep it up!");
            } else if (logCounter < 5000) {
                console.log("Wow, you're dedicated! Are you sure you want to keep going?");
            } else if (logCounter < 10000) {
                console.log("Ten thousand? You're amazing!");
            } else if (logCounter < 100000) {
                console.log("You’ve entered the legendary realm of CTRL+e presses!");
            } else if (logCounter < 1000000) {
                console.log("You have pressed CTRL+e " + logCounter + " times!");
            } else if (logCounter < 10000000) {
                console.log("A million? You're a true legend!");
            } else if (logCounter < 100000000) {
                console.log("This is getting insane! You're unstoppable!");
            } else if (logCounter < 1000000000) {
                console.log("One billion presses! Are you a robot?");
            } else if (logCounter < 5000000000) {
                console.log("Wow! You're in a league of your own!");
            } else if (logCounter < 10000000000) {
                console.log("Ten billion? This is beyond epic!");
            } else if (logCounter < 50000000000) {
                console.log("Fifty billion! You must have a secret!");
            } else if (logCounter < 100000000000) {
                console.log("One hundred billion? You're a myth now!");
            } else if (logCounter < 500000000000) {
                console.log("Half a trillion presses! You're a legend!");
            } else if (logCounter < 1000000000000){
                console.log("You've reached the ultimate level of CTRL+e presses! Infinite mastery!");
            } else if (logCounter < 10000000000000000) {
                console.log("Bruh Either from this just play Roblox")
            } else {
                console.log("Play Roblox Man Now this is for infinty and No Other Message. I hope you will take ScreenShot of this it is impossible. Oh Well Here is the COunter " + logCounter)
            }
            
            logCounter++; // Increment the log counter after logging
        } else {
            secretOption.style.display = 'none';   // Hide the element

            // Logging logic based on the current logCounter
            if (logCounter < 20) {
                console.log("ok");
            } else if (logCounter < 50) {
                console.log("Stop");
            } else if (logCounter < 90) {
                console.log("Stop it already");
            } else if (logCounter < 140) {
                console.log("STOP ITTTTTTTTTT");
            } else if (logCounter < 150) {
                console.log("Try I Will not give up");
            } else if (logCounter < 250) {
                console.log("PHEW!! You have Press CTRL+e for 250 times");
            } else if (logCounter < 299) {
                console.log("Nope I Will not give up 299 times");
            } else if (logCounter < 300) {
                console.log("BRUH 300. LOL it is 300");
            } else if (logCounter < 333) {
                console.log("I AM THE DEVIL");
            } else if (logCounter < 400) {
                console.log(logCounter);
            } else if (logCounter < 500) {
                console.log("100 more than again forever counter");
            } else if (logCounter < 1000) {
                console.log(logCounter);
            } else if (logCounter < 1111) {
                console.log("Well Hello There");
            } else if (logCounter < 3333) {
                console.log("Hello There I am the Devil that one is evil");
            } else if (logCounter < 3334) {
                console.log("That's Scary");
            } else if (logCounter < 3335) {
                console.log("100 more than Counter");
            } else if (logCounter < 3435) {
                console.log(logCounter);
            } else if (logCounter < 4000) {
                console.log("You are on fire! Keep it up!");
            } else if (logCounter < 5000) {
                console.log("Wow, you're dedicated! Are you sure you want to keep going?");
            } else if (logCounter < 10000) {
                console.log("Ten thousand? You're amazing!");
            } else if (logCounter < 100000) {
                console.log("You’ve entered the legendary realm of CTRL+e presses!");
            } else if (logCounter < 1000000) {
                console.log("You have pressed CTRL+e " + logCounter + " times!");
            } else if (logCounter < 10000000) {
                console.log("A million? You're a true legend!");
            } else if (logCounter < 100000000) {
                console.log("This is getting insane! You're unstoppable!");
            } else if (logCounter < 1000000000) {
                console.log("One billion presses! Are you a robot?");
            } else if (logCounter < 5000000000) {
                console.log("Wow! You're in a league of your own!");
            } else if (logCounter < 10000000000) {
                console.log("Ten billion? This is beyond epic!");
            } else if (logCounter < 50000000000) {
                console.log("Fifty billion! You must have a secret!");
            } else if (logCounter < 100000000000) {
                console.log("One hundred billion? You're a myth now!");
            } else if (logCounter < 500000000000) {
                console.log("Half a trillion presses! You're a legend!");
            } else if (logCounter < 1000000000000){
                console.log("You've reached the ultimate level of CTRL+e presses! Infinite mastery! But wait theres more " + logCounter);
            } else if (logCounter < 10000000000000000) {
                console.log("Bruh Either from this just play Roblox")
            } else {
                console.log("Play Roblox Man Now this is for infinty and No Other Message. I hope you will take ScreenShot of this it is impossible. Oh Well Here is the COunter " + logCounter)
            }
            logCounter++; // Increment the log counter after logging
        }
    }
});


google.maps.event.addDomListener(window, 'load', initialize);