     document.querySelectorAll('.accordion-header').forEach(item => {
            item.addEventListener('click', () => {
                const content = item.nextElementSibling;
                // Toggle the content display properly on each click
                if (content.style.display === 'block') {
                    content.style.display = 'none'; // If it's open, close it
                } else {
                    content.style.display = 'block'; // Otherwise, open it
                }
            });
        });

// Variables
let currentPage = 0;
const sectionsPerPage = 5; // Display 5 sections per page
const items = document.querySelectorAll('.accordion-item');
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
const accordionHeaders = document.querySelectorAll('.accordion-header');

// Function to toggle section visibility
function toggleAccordionContent(header) {
    const content = header.nextElementSibling;

    // Toggle the display of the content
    if (content.style.display === 'block') {
        content.style.display = 'none';
    } else {
        // Close all other sections before opening the clicked one
        document.querySelectorAll('.accordion-content').forEach(item => {
            item.style.display = 'none';
        });
        content.style.display = 'block';
    }
}

// Accordion logic to handle section toggle and completion tracking
accordionHeaders.forEach(header => {
    header.addEventListener('click', function () {
        const content = this.nextElementSibling;

        // Toggle the content display
        toggleAccordionContent(this);

        // Disable "Next" until the section is completed
        const nextButton = document.getElementById('nextPage');
        nextButton.disabled = true;

        // Mark completion after 5 seconds (for example, to show a green checkmark)
        setTimeout(() => {
            this.classList.add('completed');  // Add the green checkmark to the header
            nextButton.disabled = false;     // Enable the "Next" button after completion
        }, 5000);  // 5 seconds to complete the section
    });
});

// Pagination function to show only specific sections per page
function showPage(page) {
    const start = page * sectionsPerPage;
    const end = start + sectionsPerPage;

    // Hide all items, then show the items that belong to the current page
    items.forEach((item, index) => {
        item.style.display = (index >= start && index < end) ? 'block' : 'none';
    });

    // Enable/disable pagination buttons based on the current page
    prevButton.disabled = page === 0;
    nextButton.disabled = end >= items.length;
}

// Event listeners for pagination buttons
prevButton.addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        showPage(currentPage);
    }
});

nextButton.addEventListener('click', () => {
    if (currentPage < Math.floor(items.length / sectionsPerPage)) {
        currentPage++;
        showPage(currentPage);
    }
});

// Initialize pagination on page load
showPage(currentPage);

// Accordion: Ensure that only one section is expanded at a time
accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;

        // Toggle the display of the content
        if (content.style.display === 'block') {
            content.style.display = 'none';
        } else {
            // Close all other open sections before opening the clicked one
            document.querySelectorAll('.accordion-content').forEach(item => {
                item.style.display = 'none';
            });
            content.style.display = 'block';
        }
    });
});

