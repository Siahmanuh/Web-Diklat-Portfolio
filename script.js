// Data storage (in a real app, this would be a backend/database)
let projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
let blogs = JSON.parse(localStorage.getItem('portfolioBlogs')) || [];

// DOM Elements
// Admin Panel Toggle from Navigation
const adminToggle = document.querySelector('.admin-nav-btn');
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

// Admin Panel Toggle
// Admin Panel Toggle from Navigation

adminToggle.addEventListener('click', () => {
    adminPanel.classList.add('active');
});

closeAdmin.addEventListener('click', () => {
    adminPanel.classList.remove('active');
});

// Rest of your existing JavaScript for projects, blogs, etc.
// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        
        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active tab content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            }
        });
    });
});

// Project Management
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProject = {
        id: Date.now().toString(),
        title: projectTitle.value,
        description: projectDescription.value,
        image: projectImage.value || 'https://via.placeholder.com/300x200?text=Project+Image',
        link: projectLink.value || '#'
    };
    
    projects.push(newProject);
    saveProjects();
    renderProjectsList();
    renderProjectsDisplay();
    projectForm.reset();
});

function renderProjectsList() {
    projectsList.innerHTML = '';
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'item-card';
        projectElement.innerHTML = `
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="item-actions">
                <button class="edit-btn" data-id="${project.id}">Edit</button>
                <button class="delete-btn" data-id="${project.id}">Delete</button>
            </div>
        `;
        
        projectsList.appendChild(projectElement);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.delete-btn[data-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            deleteProject(id);
        });
    });
    
    document.querySelectorAll('.edit-btn[data-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            editProject(id);
        });
    });
}

function deleteProject(id) {
    projects = projects.filter(project => project.id !== id);
    saveProjects();
    renderProjectsList();
    renderProjectsDisplay();
}

function editProject(id) {
    const project = projects.find(p => p.id === id);
    if (project) {
        projectTitle.value = project.title;
        projectDescription.value = project.description;
        projectImage.value = project.image;
        projectLink.value = project.link;
        
        // Remove the project from the list
        deleteProject(id);
    }
}

function saveProjects() {
    localStorage.setItem('portfolioProjects', JSON.stringify(projects));
}

// Blog Management
blogForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newBlog = {
        id: Date.now().toString(),
        title: blogTitle.value,
        content: blogContent.value,
        image: blogImage.value || 'https://via.placeholder.com/300x200?text=Blog+Image',
        date: new Date().toLocaleDateString()
    };
    
    blogs.push(newBlog);
    saveBlogs();
    renderBlogsList();
    renderBlogsDisplay();
    blogForm.reset();
});

function renderBlogsList() {
    blogsList.innerHTML = '';
    
    blogs.forEach(blog => {
        const blogElement = document.createElement('div');
        blogElement.className = 'item-card';
        blogElement.innerHTML = `
            <h4>${blog.title}</h4>
            <p>${blog.content.substring(0, 100)}...</p>
            <div class="item-actions">
                <button class="edit-btn" data-id="${blog.id}">Edit</button>
                <button class="delete-btn" data-id="${blog.id}">Delete</button>
            </div>
        `;
        
        blogsList.appendChild(blogElement);
    });
    
    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.delete-btn[data-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            deleteBlog(id);
        });
    });
    
    document.querySelectorAll('.edit-btn[data-id]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            editBlog(id);
        });
    });
}

function deleteBlog(id) {
    blogs = blogs.filter(blog => blog.id !== id);
    saveBlogs();
    renderBlogsList();
    renderBlogsDisplay();
}

function editBlog(id) {
    const blog = blogs.find(b => b.id === id);
    if (blog) {
        blogTitle.value = blog.title;
        blogContent.value = blog.content;
        blogImage.value = blog.image;
        
        // Remove the blog from the list
        deleteBlog(id);
    }
}

function saveBlogs() {
    localStorage.setItem('portfolioBlogs', JSON.stringify(blogs));
}

// Display Projects and Blogs on Main Site
function renderProjectsDisplay() {
    projectsContainer.innerHTML = '';
    
    projects.forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.className = 'project-card';
        projectElement.innerHTML = `
            <div class="project-image" style="background-image: url('${project.image}')"></div>
            <div class="project-content">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.link}" class="project-link" target="_blank">View Project</a>
            </div>
        `;
        
        projectsContainer.appendChild(projectElement);
    });
}

function renderBlogsDisplay() {
    blogsContainer.innerHTML = '';
    
    blogs.forEach(blog => {
        const blogElement = document.createElement('div');
        blogElement.className = 'blog-card';
        blogElement.innerHTML = `
            <div class="blog-image" style="background-image: url('${blog.image}')"></div>
            <div class="blog-content">
                <h3>${blog.title}</h3>
                <p>${blog.content.substring(0, 150)}...</p>
                <a href="#" class="read-more">Read More</a>
            </div>
        `;
        
        blogsContainer.appendChild(blogElement);
    });
}

// Contact Dropdown Functionality
const contactDropdown = document.querySelector('.contact-dropdown');
const dropdownBtn = document.querySelector('.dropdown-btn');

dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    contactDropdown.classList.toggle('active');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!contactDropdown.contains(e.target)) {
        contactDropdown.classList.remove('active');
    }
});

// Close dropdown when clicking on a contact option
document.querySelectorAll('.contact-option').forEach(option => {
    option.addEventListener('click', () => {
        contactDropdown.classList.remove('active');
    });
});

// Initialize the application
function init() {
    renderProjectsList();
    renderBlogsList();
    renderProjectsDisplay();
    renderBlogsDisplay();
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', init);