
 // The Cat API configuration
const CAT_API_KEY = 'live_P7kQifh0zRvyVVRjlWm6kxTfA1ZdC8VyqrjjzB8wSaHWZz4S3XzlEVUzrJbFVZQX'; // Public API key
const BASE_URL = 'https://api.thecatapi.com/v1';

// DOM Elements
const breedSelect = document.getElementById('breed-select');
const loadMoreBtn = document.getElementById('load-more');
const catGallery = document.getElementById('cat-gallery');
const loadingIndicator = document.getElementById('loading');

// State variables
let currentPage = 1;
let currentBreed = '';
let isLoading = false;

// Fetch breeds
async function fetchBreeds() {
    try {
        const response = await fetch(`${BASE_URL}/breeds`, { 
            headers: { 'x-api-key': CAT_API_KEY } 
        });
        const breeds = await response.json();

        // Populate breed dropdown
        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching breeds:', error);
    }
}

// Fetch cat images
async function fetchCatImages() {
    if (isLoading) return;

    isLoading = true;
    loadingIndicator.style.display = 'block';
    loadMoreBtn.disabled = true;

    try {
        const url = new URL(`${BASE_URL}/images/search`);
        url.searchParams.append('limit', '12');
        url.searchParams.append('page', currentPage.toString());

        if (currentBreed) {
            url.searchParams.append('breed_ids', currentBreed);
        }

        const response = await fetch(url.toString(), {
            headers: {
                'x-api-key': CAT_API_KEY
            }
        });
        const images = await response.json();

        // Clear gallery if it's the first page
        if (currentPage === 1) {
            catGallery.innerHTML = '';
        }

        // Create and append cat cards
        images.forEach(image => {
            const catCard = document.createElement('div');
            catCard.classList.add('cat-card');

            const img = document.createElement('img');
            img.src = image.url;
            img.alt = 'Cat Image';

            const breedInfo = document.createElement('div');
            breedInfo.classList.add('breed-info');

            // Display breed information if available
            if (image.breeds && image.breeds.length > 0) {
                breedInfo.textContent = image.breeds[0].name;
            } else {
                breedInfo.textContent = 'Unknown Breed';
            }

            catCard.appendChild(img);
            catCard.appendChild(breedInfo);
            catGallery.appendChild(catCard);
        });

        currentPage++;
    } catch (error) {
        console.error('Error fetching cat images:', error);
    } finally {
        isLoading = false;
        loadingIndicator.style.display = 'none';
        loadMoreBtn.disabled = false;
    }
}

// Event Listeners
loadMoreBtn.addEventListener('click', fetchCatImages);

breedSelect.addEventListener('change', (e) => {
    currentBreed = e.target.value;
    currentPage = 1;
    fetchCatImages();
});

// Initial setup
fetchBreeds();
fetchCatImages();
