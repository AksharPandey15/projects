import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    GoogleAuthProvider 
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBUcaNMTWdrLZ6eSDIMuOzbBOcf-xfV6Ms",
    authDomain: "myonlyori-cdf5a.firebaseapp.com",
    projectId: "myonlyori-cdf5a",
    storageBucket: "myonlyori-cdf5a.firebasestorage.app",
    messagingSenderId: "421118965539",
    appId: "1:421118965539:web:53aa7ccfdcdf6ba4e2be96",
    measurementId: "G-4DWVVYPE8T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const googleProvider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("container");
    const signInButton = document.getElementById("login");
    const signUpButton = document.getElementById("register");

    // Toggle between sign-in and sign-up forms
    signInButton.addEventListener("click", () => container.classList.remove("active"));
    signUpButton.addEventListener("click", () => container.classList.add("active"));

    // Handle Sign-Up
    document.querySelector(".sign-up form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = e.target.querySelector("input[type='email']").value;
        const password = e.target.querySelector("input[type='password']").value;

        createUserWithEmailAndPassword(auth, email, password)
            .then(() => {
                container.classList.remove("active"); // Switch to sign-in form after sign-up
            })
            .catch((error) => {
                console.error("Sign-up error:", error.message);
            });
    });

    // Handle Sign-In
    document.querySelector(".sign-in form").addEventListener("submit", (e) => {
        e.preventDefault();
        const email = e.target.querySelector("input[type='email']").value;
        const password = e.target.querySelector("input[type='password']").value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                // Redirect to index.html and include user email in query string
                window.location.href = `index.html?email=${encodeURIComponent(user.email)}`;
            })
            .catch((error) => {
                console.error("Sign-in error:", error.message);
            });
    });

    // Handle Google Sign-In
    document.getElementById("google").addEventListener("click", (e) => {
        e.preventDefault();

        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;
                // Redirect to index.html and include user email in query string
                window.location.href = `index.html?email=${encodeURIComponent(user.email)}`;
            })
            .catch((error) => {
                console.error("Google Sign-in error:", error.message);
            });
    });
});
