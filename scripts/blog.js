document.addEventListener('DOMContentLoaded', () => {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-input');
    const blogPosts = document.querySelectorAll('.blog-post');
    const featuredPosts = document.querySelectorAll('.featured-post');

    // Function to normalize category names
    function normalizeCategory(category) {
        return category.toLowerCase().replace(/[^a-z0-9]/g, '');
    }

    // Function to filter posts based on category and search term
    function filterPosts() {
        const selectedCategory = categoryFilter.value;
        const searchTerm = searchInput.value.toLowerCase();

        // Filter regular blog posts
        blogPosts.forEach(post => {
            const postTitle = post.querySelector('h3').textContent.toLowerCase();
            const postTags = Array.from(post.querySelectorAll('.tag'))
                .map(tag => normalizeCategory(tag.textContent));
            const postExcerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();

            const matchesCategory = selectedCategory === 'all' || 
                postTags.some(tag => tag.includes(normalizeCategory(selectedCategory)));
            const matchesSearch = postTitle.includes(searchTerm) || 
                postExcerpt.includes(searchTerm) ||
                postTags.some(tag => tag.includes(normalizeCategory(searchTerm)));

            post.style.display = matchesCategory && matchesSearch ? 'block' : 'none';
        });

        // Filter featured posts
        featuredPosts.forEach(post => {
            const postTitle = post.querySelector('h3').textContent.toLowerCase();
            const postTags = Array.from(post.querySelectorAll('.tag'))
                .map(tag => normalizeCategory(tag.textContent));
            const postExcerpt = post.querySelector('.post-excerpt').textContent.toLowerCase();

            const matchesCategory = selectedCategory === 'all' || 
                postTags.some(tag => tag.includes(normalizeCategory(selectedCategory)));
            const matchesSearch = postTitle.includes(searchTerm) || 
                postExcerpt.includes(searchTerm) ||
                postTags.some(tag => tag.includes(normalizeCategory(searchTerm)));

            post.style.display = matchesCategory && matchesSearch ? 'block' : 'none';
        });

        // Update pagination visibility
        updatePaginationVisibility();
    }

    // Function to update pagination visibility
    function updatePaginationVisibility() {
        const visiblePosts = document.querySelectorAll('.blog-post[style="display: block"]').length;
        const pagination = document.querySelector('.pagination');
        
        if (visiblePosts <= 6) {
            pagination.style.display = 'none';
        } else {
            pagination.style.display = 'flex';
        }
    }

    // Add event listeners
    categoryFilter.addEventListener('change', filterPosts);
    searchInput.addEventListener('input', filterPosts);

    // Initialize pagination
    const postsPerPage = 6;
    let currentPage = 1;
    const totalPosts = blogPosts.length;
    const totalPages = Math.ceil(totalPosts / postsPerPage);

    function updatePagination() {
        const pageNumber = document.querySelector('.page-number');
        const prevButton = document.querySelector('.pagination-btn:first-child');
        const nextButton = document.querySelector('.pagination-btn:last-child');

        pageNumber.textContent = `Page ${currentPage} of ${totalPages}`;
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        // Show/hide posts based on current page
        blogPosts.forEach((post, index) => {
            const startIndex = (currentPage - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;
            post.style.display = index >= startIndex && index < endIndex ? 'block' : 'none';
        });
    }

    // Add pagination event listeners
    document.querySelector('.pagination-btn:first-child').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });

    document.querySelector('.pagination-btn:last-child').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });

    // Initialize the page
    updatePagination();
    updatePaginationVisibility();
}); 