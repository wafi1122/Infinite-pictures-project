const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = true; // Start ready to load initial photos
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
let initialLoad = true;

// Reduced count to avoid rate limiting
const count = 5;
const apiKey = "hmHjZQI8T87ejSDQJbxwPHEizEQkKcoy1JKpf7u_UNI";
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        initialLoad = false;
        count = 20;
    }
}

function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

function displayPhotos() {
    imagesLoaded = 0; // Fixed typo here
    totalImages = photosArray.length;
    
    photosArray.forEach((photo) => {
        const item = document.createElement("a");
        setAttributes(item, {
            href: photo.links.html,
            target: "_blank",
        });

        const img = document.createElement("img");
        setAttributes(img, {
            src: photo.urls.regular,
            alt: photo.alt_description || "Unsplash Image",
            title: photo.alt_description || "",
            loading: "lazy" // Added for performance
        });

        img.addEventListener("load", imageLoaded);
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

async function getPhotos() {
    if (!ready) return;
    
    ready = false;
    loader.hidden = false;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }
        photosArray = await response.json();
        displayPhotos();
    } catch (error) {
        console.error("Failed to load photos:", error);
        ready = true; // Allow retry on error
        loader.hidden = true;
    }
}

window.addEventListener("scroll", () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        getPhotos();
    }
});

// Initial load
getPhotos();