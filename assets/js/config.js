// assets/js/config.js

// Dynamic BASE_URL detection based on the current hostname
let BASE_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Local development
    BASE_URL = './';
} else if (window.location.hostname.includes('github.io')) {
    // GitHub Pages - images are served from the same domain but raw content needs different URL
    BASE_URL = './';
} else {
    // Default to local
    BASE_URL = './';
}

// For image requests specifically, we might need the raw content URL
const RAW_CONTENT_BASE_URL = 'https://raw.githubusercontent.com/StarleyBy/Starley-CS-Library/main/';
