// Data storage
let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
let blogs = JSON.parse(localStorage.getItem('portfolioBlogs')) || [];

// Password system - CHANGE THIS PASSWORD TO SOMETHING SECURE!
const ADMIN_PASSWORD = "ADMIN_PASS";

// DOM Elements
const adminToggle = document.querySelector('.admin-btn');
const adminPanel = document.getElementById('admin-panel');
const closeAdmin = document.getElementById('close-admin');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Project form elements
const projectForm = document.getElementById('project-form');
const projectTitle = document.getElementById('project-title');
const projectDescription = document.getElementById('project-description');
const projectImage = document.getElementById('project-image');
const projectLink = document.getElementById('project-link');
const projectsList = document.getElementById('projects-list');

// Blog form elements
const blogForm = document.getElementById('blog-form');
const blogTitle = document.getElementById('blog-title');
const blogContent = document.getElementById('blog-content');
const blogImage = document.getElementById('blog-image');
const blogsList = document.getElementById('blogs-list');

// Display elements
const projectsContainer = document.getElementById('projects-container');
const blogsContainer = document.getElementById('blogs-container');

// Contact dropdown elements
const contactDropdown = document.querySelector('.dropdown');
const dropdownBtn = document.querySelector('.dropdown-toggle');

// Event Listeners Setup
function setupEventListeners() {
    // Admin Panel Toggle with Password
    if (adminToggle) {
        adminToggle.addEventListener('click', handleAdminToggle);
    }

    // Close admin panel
    if (closeAdmin) {
        closeAdmin.addEventListener('click', () => {
            adminPanel.classList.remove('active');
        });
    }

    // Tab Switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });

    // Project Form Submission
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmit);
    }

    // Blog Form Submission
    if (blogForm) {
        blogForm.addEventListener('submit', handleBlogSubmit);
    }

    // Contact dropdown
    if (dropdownBtn) {
        dropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            contactDropdown?.classList.toggle('active');
        });
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (contactDropdown && !contactDropdown.contains(e.target)) {
            contactDropdown.classList.remove('active');
        }
        
        // Close admin panel when clicking outside
        if (adminPanel.classList.contains('active') && 
            !adminPanel.contains(e.target) && 
            !adminToggle.contains(e.target)) {
            adminPanel.classList.remove('active');
        }
    });

    // Close dropdown on option click
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('click', () => {
            contactDropdown?.classList.remove('active');
        });
    });
}

// Admin Panel Functions
function handleAdminToggle() {
    const password = prompt("Enter admin password:");
    if (password === ADMIN_PASSWORD) {
        adminPanel.classList.add('active');
    } else if (password !== null) {
        alert("Incorrect password!");
    }
}

function handleTabSwitch(e) {
    const tabId = e.currentTarget.dataset.tab;
    
    // Update active tab button
    tabBtns.forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    
    // Update active tab content
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `${tabId}-tab`) {
            content.classList.add('active');
        }
    });
}

// Project Management
function handleProjectSubmit(e) {
    e.preventDefault();
    
    const newProject = {
        id: Date.now().toString(),
        title: projectTitle.value.trim(),
        description: projectDescription.value.trim(),
        image: projectImage.value.trim() || getDefaultProjectImage(),
        link: projectLink.value.trim() || '#'
    };
    
    if (!newProject.title || !newProject.description) {
        alert('Please fill in required fields');
        return;
    }
    
    projects.push(newProject);
    saveProjects();
    renderProjectsList();
    renderProjectsDisplay();
    projectForm.reset();
}

function renderProjectsList() {
    if (!projectsList) return;
    
    projectsList.innerHTML = projects.map(project => `
        <div class="item-card" data-id="${project.id}">
            <h4>${escapeHtml(project.title)}</h4>
            <p>${escapeHtml(project.description.substring(0, 100))}${project.description.length > 100 ? '...' : ''}</p>
            <div class="item-actions">
                <button class="edit-btn" onclick="editProject('${project.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteProject('${project.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderProjectsDisplay() {
    if (!projectsContainer) return;
    
    projectsContainer.innerHTML = projects.map(project => `
        <div class="project-card">
            <div class="project-image">
                <img src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)}">
            </div>
            <div class="project-content">
                <h3 class="project-title">${escapeHtml(project.title)}</h3>
                <p class="project-description">${escapeHtml(project.description)}</p>
                <a href="${escapeHtml(project.link)}" class="project-link" target="_blank">
                    View Project <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');
}

function deleteProject(id) {
    if (confirm('Are you sure you want to delete this project?')) {
        projects = projects.filter(project => project.id !== id);
        saveProjects();
        renderProjectsList();
        renderProjectsDisplay();
    }
}

function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    projectTitle.value = project.title;
    projectDescription.value = project.description;
    projectImage.value = project.image;
    projectLink.value = project.link;
    
    // Remove the project from the list
    deleteProject(id);
}

// Blog Management
function handleBlogSubmit(e) {
    e.preventDefault();
    
    const newBlog = {
        id: Date.now().toString(),
        title: blogTitle.value.trim(),
        content: blogContent.value.trim(),
        image: blogImage.value.trim() || getDefaultBlogImage(),
        date: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    };
    
    if (!newBlog.title || !newBlog.content) {
        alert('Please fill in required fields');
        return;
    }
    
    blogs.push(newBlog);
    saveBlogs();
    renderBlogsList();
    renderBlogsDisplay();
    blogForm.reset();
}

function renderBlogsList() {
    if (!blogsList) return;
    
    blogsList.innerHTML = blogs.map(blog => `
        <div class="item-card" data-id="${blog.id}">
            <h4>${escapeHtml(blog.title)}</h4>
            <p>${escapeHtml(blog.content.substring(0, 100))}${blog.content.length > 100 ? '...' : ''}</p>
            <div class="item-actions">
                <button class="edit-btn" onclick="editBlog('${blog.id}')">Edit</button>
                <button class="delete-btn" onclick="deleteBlog('${blog.id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function renderBlogsDisplay() {
    if (!blogsContainer) return;
    
    blogsContainer.innerHTML = blogs.map(blog => `
        <div class="blog-card">
            <div class="blog-image">
                <img src="${escapeHtml(blog.image)}" alt="${escapeHtml(blog.title)}">
            </div>
            <div class="blog-content">
                <div class="blog-meta">
                    <span class="blog-date">
                        <i class="far fa-calendar"></i> ${escapeHtml(blog.date)}
                    </span>
                </div>
                <h3 class="blog-title">${escapeHtml(blog.title)}</h3>
                <p class="blog-excerpt">${escapeHtml(blog.content.substring(0, 150))}...</p>
                <a href="#" class="read-more" onclick="showBlogContent('${blog.id}')">
                    Read More <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `).join('');
}

function deleteBlog(id) {
    if (confirm('Are you sure you want to delete this blog post?')) {
        blogs = blogs.filter(blog => blog.id !== id);
        saveBlogs();
        renderBlogsList();
        renderBlogsDisplay();
    }
}

function editBlog(id) {
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;
    
    blogTitle.value = blog.title;
    blogContent.value = blog.content;
    blogImage.value = blog.image;
    
    // Remove the blog from the list
    deleteBlog(id);
}

function showBlogContent(id) {
    const blog = blogs.find(b => b.id === id);
    if (blog) {
        alert(blog.title + '\n\n' + blog.content);
    }
}

// Storage Functions
function saveProjects() {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

function saveBlogs() {
    localStorage.setItem('portfolioBlogs', JSON.stringify(blogs));
}

// Helper Functions
function getDefaultProjectImage() {
    return 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=80';
}

function getDefaultBlogImage() {
    return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=80';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isDisplayed = navMenu.style.display === 'flex';
        navMenu.style.display = isDisplayed ? 'none' : 'flex';
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update mobile menu state
            if (window.innerWidth <= 768 && navMenu) {
                navMenu.style.display = 'none';
            }
        }
    });
});

// Active navigation link tracking
function setupNavTracking() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    if (!sections.length || !navLinks.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '0px 0px -50% 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// Initialize the application
function init() {
    setupEventListeners();
    renderProjectsList();
    renderBlogsList();
    renderProjectsDisplay();
    renderBlogsDisplay();
    setupNavTracking();
}

// Make functions available globally
window.editProject = editProject;
window.deleteProject = deleteProject;
window.editBlog = editBlog;
window.deleteBlog = deleteBlog;
window.showBlogContent = showBlogContent;

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
