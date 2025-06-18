document.addEventListener('DOMContentLoaded', () => {
    const shortcuts = document.getElementById('keyboard-shortcuts');
    let currentLinkIndex = -1;
    let currentHeadingIndex = -1;
    
    // Only select links to post, project, and series single pages
    const links = Array.from(document.querySelectorAll('a[href]')).filter(link => {
        const href = link.getAttribute('href');
        // Exclude special links, "see all" links, footer links, and only include single pages
        return !href.startsWith('#') && 
               !href.startsWith('javascript:') && 
               !href.startsWith('mailto:') && 
               !href.startsWith('tel:') &&
               !link.classList.contains('see-all-link') && // Exclude "see all" links
               !link.closest('.footer-nav') && // Exclude footer navigation links
               (href.includes('/posts/') || 
                href.includes('/projects/') || 
                href.includes('/series/'));
    });
    
    // Get all headings in the article
    const headings = Array.from(document.querySelectorAll('article h2, article h3'));
    
    // Function to update active link
    function updateActiveLink(index) {
        // Remove active class from all links
        links.forEach(link => link.classList.remove('keyboard-active'));
        
        // Add active class to current link
        if (index >= 0 && index < links.length) {
            links[index].classList.add('keyboard-active');
            links[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    // Function to update active heading
    function updateActiveHeading(index) {
        // Remove active class from all headings
        headings.forEach(heading => heading.classList.remove('keyboard-active'));
        
        // Add active class to current heading
        if (index >= 0 && index < headings.length) {
            headings[index].classList.add('keyboard-active');
            headings[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
    
    // Function to toggle shortcuts panel
    function toggleShortcuts() {
        const backdrop = document.querySelector('.keyboard-shortcuts-backdrop');
        shortcuts.classList.toggle('visible');
        backdrop.classList.toggle('visible');
    }
    
    // Function to toggle theme
    function toggleTheme(theme) {
        document.documentElement.classList.remove('theme-loaded');
        requestAnimationFrame(() => {
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            document.documentElement.classList.add('theme-loaded');
            
            // Dispatch custom event for theme change
            document.dispatchEvent(new CustomEvent('themeChanged', { 
                detail: { theme: theme }
            }));
        });
    }
    
    // Function to navigate to home
    function goToHome() {
        // Store current theme before navigation
        const currentTheme = document.documentElement.getAttribute('data-theme');
        localStorage.setItem('theme', currentTheme);
        window.location.href = '/';
    }
    
    // Function to navigate to about
    function goToAbout() {
        window.location.href = '/about/';
    }

    // Function to navigate to next post/project
    function goToNext() {
        const nextLink = document.querySelector('a[rel="next"]');
        if (nextLink) {
            window.location.href = nextLink.href;
        }
    }
    
    // Function to navigate to previous post/project
    function goToPrevious() {
        const prevLink = document.querySelector('a[rel="prev"]');
        if (prevLink) {
            window.location.href = prevLink.href;
        }
    }

    // Add click handler for theme switch
    const themeSwitch = document.querySelector('.theme-switch');
    if (themeSwitch) {
        themeSwitch.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            toggleTheme(isDark ? 'light' : 'dark');
        });
    }
    
    // Keyboard event listener
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts if user is typing in an input or textarea
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key.toLowerCase()) {
            case 'h':
                e.preventDefault();
                goToHome();
                break;
                
            case 'a':
                e.preventDefault();
                goToAbout();
                break;
                
            case 'j':
                e.preventDefault();
                if (headings.length > 0) {
                    // If we're on a post/article page, navigate headings
                    currentHeadingIndex = (currentHeadingIndex + 1) % headings.length;
                    updateActiveHeading(currentHeadingIndex);
                } else {
                    // Otherwise, navigate links
                    currentLinkIndex = (currentLinkIndex + 1) % links.length;
                    updateActiveLink(currentLinkIndex);
                }
                break;
                
            case 'k':
                e.preventDefault();
                if (headings.length > 0) {
                    // If we're on a post/article page, navigate headings
                    currentHeadingIndex = (currentHeadingIndex - 1 + headings.length) % headings.length;
                    updateActiveHeading(currentHeadingIndex);
                } else {
                    // Otherwise, navigate links
                    currentLinkIndex = (currentLinkIndex - 1 + links.length) % links.length;
                    updateActiveLink(currentLinkIndex);
                }
                break;
                
            case 'n':
                e.preventDefault();
                goToNext();
                break;
                
            case 'p':
                e.preventDefault();
                goToPrevious();
                break;
                
            case '0':
                e.preventDefault();
                toggleTheme('dark');
                break;
                
            case '1':
                e.preventDefault();
                toggleTheme('light');
                break;
                
            case '?':
                if (e.shiftKey) {
                    e.preventDefault();
                    toggleShortcuts();
                }
                break;
                
            case 'enter':
                if (headings.length > 0) {
                    // If we're on a post/article page, scroll to the current heading
                    if (currentHeadingIndex >= 0 && currentHeadingIndex < headings.length) {
                        headings[currentHeadingIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                } else {
                    // Otherwise, follow the current link
                    if (currentLinkIndex >= 0 && currentLinkIndex < links.length) {
                        links[currentLinkIndex].click();
                    }
                }
                break;
                
            case 'escape':
                shortcuts.classList.remove('visible');
                document.querySelector('.keyboard-shortcuts-backdrop').classList.remove('visible');
                break;
        }
    });
    
    // Close shortcuts panel when clicking outside
    document.addEventListener('click', (e) => {
        if (shortcuts.classList.contains('visible') && !shortcuts.contains(e.target)) {
            shortcuts.classList.remove('visible');
        }
    });
}); 