document.addEventListener('DOMContentLoaded', () => {
    // Initialize code highlighting
    initializeCodeHighlighting();

    // Load related posts
    loadRelatedPosts();

    // Add table of contents
    addTableOfContents();
});

// Function to initialize code highlighting
function initializeCodeHighlighting() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        // Add line numbers
        const lines = block.innerHTML.split('\n');
        const numberedLines = lines.map((line, index) => {
            return `<span class="line-number">${index + 1}</span>${line}`;
        }).join('\n');
        
        block.innerHTML = numberedLines;

        // Add copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = 'Copy';
        copyButton.addEventListener('click', () => {
            const code = block.textContent;
            navigator.clipboard.writeText(code).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            });
        });

        block.parentElement.style.position = 'relative';
        block.parentElement.appendChild(copyButton);
    });
}

// Function to load related posts
function loadRelatedPosts() {
    const relatedPostsGrid = document.querySelector('.related-posts-grid');
    if (!relatedPostsGrid) return;

    // Example related posts data (replace with actual data)
    const relatedPosts = [
        {
            title: 'Related Post 1',
            excerpt: 'Brief description of the related post...',
            date: 'March 10, 2024',
            link: '#'
        },
        {
            title: 'Related Post 2',
            excerpt: 'Brief description of the related post...',
            date: 'March 5, 2024',
            link: '#'
        }
    ];

    // Create and append related post cards
    relatedPosts.forEach(post => {
        const card = document.createElement('article');
        card.className = 'related-post-card';
        card.innerHTML = `
            <h3>${post.title}</h3>
            <div class="post-meta">
                <span class="post-date">${post.date}</span>
            </div>
            <p>${post.excerpt}</p>
            <a href="${post.link}" class="read-more">Read More</a>
        `;
        relatedPostsGrid.appendChild(card);
    });
}

// Function to add table of contents
function addTableOfContents() {
    const content = document.querySelector('.post-content');
    if (!content) return;

    const headings = content.querySelectorAll('h2, h3');
    if (headings.length < 3) return; // Only add TOC if there are enough headings

    const toc = document.createElement('nav');
    toc.className = 'table-of-contents';
    toc.innerHTML = '<h2>Table of Contents</h2><ul></ul>';

    const tocList = toc.querySelector('ul');
    let currentLevel = 0;
    let currentList = tocList;

    headings.forEach((heading, index) => {
        const level = parseInt(heading.tagName[1]);
        const id = `heading-${index}`;
        heading.id = id;

        if (level > currentLevel) {
            const newList = document.createElement('ul');
            currentList.lastElementChild.appendChild(newList);
            currentList = newList;
        } else if (level < currentLevel) {
            currentList = tocList;
        }

        const listItem = document.createElement('li');
        listItem.innerHTML = `<a href="#${id}">${heading.textContent}</a>`;
        currentList.appendChild(listItem);
        currentLevel = level;
    });

    content.insertBefore(toc, content.firstChild);
}

// Add smooth scrolling for table of contents links
document.addEventListener('click', (e) => {
    if (e.target.matches('.table-of-contents a')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}); 