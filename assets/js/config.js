// assets/js/config.js

// Dynamic BASE_URL detection based on the current hostname
let BASE_URL = './';
var RAW_CONTENT_BASE_URL = './';
window.RAW_CONTENT_BASE_URL = './';

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

// Cloudflare R2 Media CDN URL
// If set to empty string '', images are served locally from relative paths.
// When configured (e.g. 'https://pub-xxx.r2.dev'), images load from Cloudflare R2 CDN.
window.R2_MEDIA_BASE_URL = 'https://pub-605e081f469a43f5a38ba5dd98d4ff8f.r2.dev';

window.getImageUrl = function(relativePath) {
    if (!relativePath) return 'assets/img/book-placeholder.png';
    let cleanPath = String(relativePath).trim();
    if (cleanPath.startsWith('./')) cleanPath = cleanPath.slice(2);
    if (cleanPath.startsWith('/')) cleanPath = cleanPath.slice(1);
    
    // Return early if already an absolute HTTP/HTTPS URL
    if (cleanPath.startsWith('http://') || cleanPath.startsWith('https://')) {
        return cleanPath;
    }
    
    // Ensure path starts with 'books/' if it refers to a book asset
    const fullPath = cleanPath.startsWith('books/') ? cleanPath : `books/${cleanPath}`;
    
    if (window.R2_MEDIA_BASE_URL && window.R2_MEDIA_BASE_URL.trim() !== '') {
        const baseUrl = window.R2_MEDIA_BASE_URL.endsWith('/') ? window.R2_MEDIA_BASE_URL : window.R2_MEDIA_BASE_URL + '/';
        return baseUrl + fullPath;
    }
    const isGitHub = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
    const rawBase = typeof RAW_CONTENT_BASE_URL !== 'undefined' ? RAW_CONTENT_BASE_URL : './';
    return (isGitHub ? rawBase : (typeof BASE_URL !== 'undefined' ? BASE_URL : './')) + cleanPath;
};

// Auto-redirect from file:// protocol to local HTTP server if localhost:8080 is running
if (typeof window !== 'undefined' && window.location.protocol === 'file:') {
    try {
        fetch('http://localhost:8080/manifest.json', { mode: 'cors' })
            .then(res => {
                if (res.ok || res.status === 200) {
                    const page = window.location.pathname.split('/').pop() || 'index.html';
                    const target = `http://localhost:8080/${page}${window.location.search}${window.location.hash}`;
                    window.location.href = target;
                }
            })
            .catch(() => {});
    } catch (e) {}
}

