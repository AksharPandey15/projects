let ratioWidth = document.getElementById("ratio-width");
let ratioHeight = document.getElementById("ratio-height");
let width = document.getElementById("width");
let height = document.getElementById("height");
let img = document.getElementsByClassName("img")[0]; // Access the first element of the img class

let flags = {
    "1:1": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAAAIVBMVEXaKRz////YAADyxcT43+DYDgDurqz54+PxwcD76+vVAAAfglg+AAAAhUlEQVRoge3YywqAIBBG4Rovo77/A7duDJJwoOyctXwLF/7gthER0X9KYkoT7azxlOZ5uoTdFAQcHBwcHNwJ7/ZSpBWLl9afGli+lENXqRavpT81sKuiFhpN769K4lM8goODg6+Iez65rmPhOnOXV/WN9QcHBwcHXxZ3/bR0/W4lIqLXdwCRFQt18EtgwwAAAABJRU5ErkJggg==",
    "3:2": "data:image/png;base64,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",   // Example flag for 3:2 aspect ratio
    "1:2": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Flag_of_the_Republic_of_Abkhazia.svg/125px-Flag_of_the_Republic_of_Abkhazia.svg.png",   // Example flag for 4:3 aspect ratio
    "10:19": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg/125px-Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg.png",
    "11:20": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg/125px-Flag_of_the_United_States_%28DoS_ECA_Color_Standard%29.svg.png",
    "189:335": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_El_Salvador.svg/125px-Flag_of_El_Salvador.svg.png",
    "10:17": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Flag_of_Cape_Verde.svg/125px-Flag_of_Cape_Verde.svg.png",
    "11:28" : "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Emblem_of_Qatar_%282022%E2%80%93present%29.svg/85px-Emblem_of_Qatar_%282022%E2%80%93present%29.svg.png",
    "3:5": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Coat_of_arms_of_Lithuania.svg/85px-Coat_of_arms_of_Lithuania.svg.png",
    "5:8": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sol_de_Mayo-Bandera_de_Argentina.svg/100px-Sol_de_Mayo-Bandera_de_Argentina.svg.png",
    "2:3": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Flag_of_Portugal.svg/480px-Flag_of_Portugal.svg.png",  
    "18:25": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Flag_of_Iceland.svg/480px-Flag_of_Iceland.svg.png",
};

let calculateWidth = () => {
    let aspectRatio = ratioWidth.value / ratioHeight.value;
    width.value = parseFloat((height.value * aspectRatio).toFixed(2));
    checkAspectRatio(); // Check for flag display based on aspect ratio
};

let calculateHeight = () => {
    let aspectRatio = ratioWidth.value / ratioHeight.value;
    height.value = parseFloat((width.value / aspectRatio).toFixed(2));
    checkAspectRatio(); // Check for flag display based on aspect ratio
};

let checkAspectRatio = () => {
    let ratioString = `${ratioWidth.value}:${ratioHeight.value}`;
    if (flags[ratioString]) {
        img.src = flags[ratioString];  // Set the image source based on the matching aspect ratio
        img.style.display = "block";   // Show the image
    } else {
        img.style.display = "none";    // Hide the image if no match
    }
};

height.addEventListener("input", calculateWidth);
width.addEventListener("input", calculateHeight);
ratioHeight.addEventListener("input", calculateWidth);
ratioWidth.addEventListener("input", calculateHeight);

// Initial check to show/hide the image based on default ratio values
checkAspectRatio();
