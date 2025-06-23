// DOM Elements
const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");

// State Variables
let ready = true;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let initialLoad = true;
let currentQuery = '';
let currentPage = 1;

// Configuration
let count = 5;
const apiKey = "IIoPsJo366zr-6X0kSXM4W7TOdNpvwCAXrz1ilos_Ds"; // Replace with test key only

// API URL Builder
function getApiUrl() {
    if (currentQuery) {
        return `https://api.unsplash.com/search/photos?query=${encodeURIComponent(currentQuery)}&page=${currentPage}&per_page=${count}&client_id=${apiKey}`;
    }
    return `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`;
}

// Search Handler
function handleSearch() {
    currentQuery = searchInput.value.trim();
    if (currentQuery) {
        currentPage = 1; // Fixed variable name (was currentpage)
        photosArray = [];
        imageContainer.innerHTML = '';
        initialLoad = true;
        getPhotos();
    }
}

// Image Load Tracking
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        initialLoad = false;
        count = 20;
    }
}

// Helper Function
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Display Photos
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photosArray.length;
    
    photosArray.forEach((photo) => {
        const item = document.createElement("a");
        setAttributes(item, {
            href: photo.links.html,
            target: "_blank",
            rel: "noopener noreferrer" // Security best practice
        });

        const img = document.createElement("img");
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description || "Unsplash Image",
            title: photo.alt_description || "",
            loading: "lazy"
        });

        img.addEventListener("load", imageLoaded);
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Fetch Photos
async function getPhotos() {
    if (!ready) return;
    
    ready = false;
    loader.hidden = false;
    
    try {
        const response = await fetch(getApiUrl()); // Use the function here
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        
        const data = await response.json();
        photosArray = currentQuery ? data.results : data;
        displayPhotos();
        currentPage++;
    } catch (error) {
        console.error("Failed to load photos:", error);
        ready = true;
        loader.hidden = true;
    }
}

// Event Listeners
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') handleSearch(); // Fixed: added parentheses
});

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        getPhotos();
    }
});

// Initial Load
getPhotos();