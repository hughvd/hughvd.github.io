document.addEventListener('DOMContentLoaded', () => {
    // Get all section links
    const sectionLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.notes-section');

    // Function to update active link
    function updateActiveLink() {
        const scrollPosition = window.scrollY;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop - 100; // Offset for better UX
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                sectionLinks.forEach(link => link.classList.remove('active'));
                sectionLinks[index].classList.add('active');
            }
        });
    }

    // Add click event listeners to section links
    sectionLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLink);

    // Initial update of active link
    updateActiveLink();

    // Handle mobile navigation
    const sidebar = document.querySelector('.notes-sidebar');
    const sidebarHeader = document.querySelector('.sidebar-header');

    if (window.innerWidth <= 768) {
        // Make sidebar collapsible on mobile
        sidebarHeader.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }
}); 