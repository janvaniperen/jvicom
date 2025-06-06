document.addEventListener('DOMContentLoaded', () => {
    const toc = document.querySelector('.table-of-contents');
    if (!toc) return;

    // Get all headings from the article
    const headings = document.querySelectorAll('article h2, article h3, article h4, article h5, article h6');
    if (!headings.length) return;

    // Get all links from the TOC
    const tocLinks = toc.querySelectorAll('a');
    if (!tocLinks.length) return;

    // Create an array of sections (a heading and all content until the next heading)
    const sections = [];
    
    // Process headings to create sections
    headings.forEach((heading, index) => {
        if (!heading.id) return;
        
        // Get the link corresponding to this heading
        const link = toc.querySelector(`a[href="#${heading.id}"]`);
        if (!link) return;
        
        // Create a section object
        const section = {
            heading: heading,
            link: link,
            content: [],
            start: heading.getBoundingClientRect().top + window.scrollY,
            end: null
        };
        
        // Add all elements between this heading and the next one to the content
        let nextElement = heading.nextElementSibling;
        while (nextElement && 
              !(nextElement.tagName === 'H2' || 
                nextElement.tagName === 'H3' || 
                nextElement.tagName === 'H4' || 
                nextElement.tagName === 'H5' || 
                nextElement.tagName === 'H6')) {
            section.content.push(nextElement);
            nextElement = nextElement.nextElementSibling;
        }
        
        // Set the end of this section
        if (index < headings.length - 1) {
            section.end = headings[index + 1].getBoundingClientRect().top + window.scrollY;
        } else {
            // If this is the last heading, set the end to the end of the article
            const article = document.querySelector('article');
            section.end = article.getBoundingClientRect().bottom + window.scrollY;
        }
        
        sections.push(section);
    });

    // Function to update active section based on scroll position
    function updateActiveSection() {
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;
        const visibleTop = scrollTop;
        const visibleBottom = scrollTop + viewportHeight;
        
        // Remove active and visible classes from all TOC links and their parent li
        tocLinks.forEach(link => {
            link.classList.remove('active');
            const li = link.parentElement;
            li.classList.remove('visible', 'continuous-top', 'continuous-bottom');
        });
        
        // Find all sections that are currently in view
        // A section is in view if any part of it is in the viewport
        const visibleSections = sections.filter(section => {
            const sectionTop = section.start;
            const sectionBottom = section.end;
            
            // Section is visible if:
            // 1. Section start is in viewport
            // 2. Section end is in viewport
            // 3. Section spans the entire viewport
            return (sectionTop >= visibleTop && sectionTop < visibleBottom) || 
                   (sectionBottom > visibleTop && sectionBottom <= visibleBottom) ||
                   (sectionTop <= visibleTop && sectionBottom >= visibleBottom);
        });
        
        // Find the most visible section to mark as active
        let mostVisibleSection = null;
        let maxVisibleArea = 0;
        
        visibleSections.forEach(section => {
            const sectionTop = Math.max(section.start, visibleTop);
            const sectionBottom = Math.min(section.end, visibleBottom);
            const visibleArea = sectionBottom - sectionTop;
            
            if (visibleArea > maxVisibleArea) {
                maxVisibleArea = visibleArea;
                mostVisibleSection = section;
            }
        });
        
        // Mark visible sections in the TOC
        visibleSections.forEach(section => {
            const li = section.link.parentElement;
            
            // Mark as visible
            li.classList.add('visible');
            
            // Mark the most visible section as active
            if (section === mostVisibleSection) {
                section.link.classList.add('active');
            }
        });
        
        // Create continuous border effect
        createContinuousBorder();
    }

    // Function to create continuous border effect
    function createContinuousBorder() {
        const visibleItems = toc.querySelectorAll('li.visible');
        
        // First remove all continuous class markers
        toc.querySelectorAll('li.continuous-top, li.continuous-bottom').forEach(item => {
            item.classList.remove('continuous-top', 'continuous-bottom');
        });
        
        // Skip if no visible items
        if (visibleItems.length === 0) return;
        
        // Process each visible item
        visibleItems.forEach((item, index) => {
            const prev = index > 0 ? visibleItems[index - 1] : null;
            const next = index < visibleItems.length - 1 ? visibleItems[index + 1] : null;
            
            // Check if this item is adjacent to the previous visible item
            if (prev && isAdjacent(prev, item)) {
                prev.classList.add('continuous-bottom');
                item.classList.add('continuous-top');
            }
            
            // Check if this item is adjacent to the next visible item
            if (next && isAdjacent(item, next)) {
                item.classList.add('continuous-bottom');
                next.classList.add('continuous-top');
            }
        });
    }
    
    // Helper function to check if two elements are adjacent in the DOM
    function isAdjacent(el1, el2) {
        // Check if they're siblings
        if (el1.nextElementSibling === el2) {
            return true;
        }
        
        // Check if the next element's parent is a sibling of this element's parent
        if (el1.parentNode.nextElementSibling === el2.parentNode) {
            return true;
        }
        
        // Check if they're in the same nested structure
        if (el1.parentNode === el2.parentNode) {
            const siblings = Array.from(el1.parentNode.children);
            const index1 = siblings.indexOf(el1);
            const index2 = siblings.indexOf(el2);
            return Math.abs(index1 - index2) === 1;
        }
        
        return false;
    }

    // Update on initial load
    updateActiveSection();
    
    // Update on scroll
    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateActiveSection);
    });
    
    // Update when window is resized (section boundaries might change)
    window.addEventListener('resize', () => {
        // Recalculate section boundaries
        sections.forEach((section, index) => {
            section.start = section.heading.getBoundingClientRect().top + window.scrollY;
            
            if (index < sections.length - 1) {
                section.end = sections[index + 1].heading.getBoundingClientRect().top + window.scrollY;
            } else {
                const article = document.querySelector('article');
                section.end = article.getBoundingClientRect().bottom + window.scrollY;
            }
        });
        
        updateActiveSection();
    });
}); 