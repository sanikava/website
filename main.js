// Animate background dots with Anime.js
function animeBackground() {
  const container = document.getElementById('anime-dots');
  container.innerHTML = '';
  const dotCount = 30;
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'bg-dot neon-rainbow';
    const size = Math.random() * 16 + 12;
    dot.style.width = dot.style.height = `${size}px`;
    dot.style.background = `rgba(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.random()*0.5+0.3})`;
    dot.style.left = `${Math.random()*100}vw`;
    dot.style.top = `${Math.random()*100}vh`;
    container.appendChild(dot);
    anime({
      targets: dot,
      translateY: [`0`, `${Math.random()*50-25}px`],
      translateX: [`0`, `${Math.random()*50-25}px`],
      direction: 'alternate',
      loop: true,
      duration: Math.random()*4000+3000,
      easing: 'easeInOutSine'
    });
  }
}

// Three.js animated background (rotating TorusKnot)
function threeBackground() {
  const bg = document.getElementById('animated-bg');
  bg.innerHTML = '<canvas id="three-canvas"></canvas>';
  const canvas = document.getElementById('three-canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true});
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.TorusKnotGeometry(10, 3, 150, 20);
  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x00c6ff,
    roughness: 0.2,
    metalness: 0.8
  });
  const knot = new THREE.Mesh(geometry, material);
  scene.add(knot);

  scene.add(new THREE.AmbientLight(0x404040, 3));
  const pointLight = new THREE.PointLight(0xffffff, 2, 100);
  pointLight.position.set(25, 50, 50);
  scene.add(pointLight);

  camera.position.z = 40;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  function animate() {
    requestAnimationFrame(animate);
    knot.rotation.x += 0.012;
    knot.rotation.y += 0.015;
    renderer.render(scene, camera);
  }
  animate();
}

// ==== Portfolio Logic ====
const githubUsername = 'sanikava';
async function loadGitHubProfile() {
  const profileRes = await fetch(`https://api.github.com/users/${githubUsername}`);
  const profile = await profileRes.json();
  document.getElementById('avatar').src = profile.avatar_url;
  document.getElementById('username').textContent = profile.name || profile.login;
  document.getElementById('bio').textContent = profile.bio || '';
}

async function loadGitHubRepos() {
  const repoRes = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated`);
  const repos = await repoRes.json();
  const repoList = document.getElementById('repo-list');
  repoList.innerHTML = '';
  repos.slice(0, 10).forEach(repo => {
    const card = document.createElement('div');
    card.className = 'repo-card neon-rainbow';
    card.innerHTML = `
      <h3><a href="${repo.html_url}" target="_blank" class="neon-rainbow">${repo.name}</a></h3>
      <p>${repo.description || 'No description'}</p>
      <p><strong>⭐ ${repo.stargazers_count}</strong></p>
    `;
    repoList.appendChild(card);
  });
}

// ==== Blog Posts ====
const blogPosts = [
  {
    title: "Welcome to My Portfolio!",
    date: "2025-10-01",
    content: "I'm excited to launch my new portfolio site with animated backgrounds, auto-loaded GitHub projects, and more. Stay tuned for updates and tutorials!"
  },
  {
    title: "How I Built My Animated Portfolio",
    date: "2025-09-15",
    content: "Using Anime.js for DOM animations and Three.js for a 3D background, I created a vibrant, modern look. Check out the repo for code samples!"
  },
  {
    title: "Integrating Google Sheets as a Form Backend",
    date: "2025-09-10",
    content: "You can submit the contact form below and your message will be stored in my Google Sheet, thanks to a simple Sheets API integration!"
  }
];

function loadBlogPosts() {
  const blogContainer = document.getElementById('blog-posts');
  blogContainer.innerHTML = '';
  blogPosts.forEach(post => {
    const postDiv = document.createElement('div');
    postDiv.className = 'blog-post';
    postDiv.innerHTML = `
      <h3 class="neon-rainbow">${post.title}</h3>
      <small>${post.date}</small>
      <p>${post.content}</p>
    `;
    blogContainer.appendChild(postDiv);
  });
}

// ==== Google Sheets Contact Form Integration ====
// 1. Create a Google Sheet with columns: Name, Email, Message
// 2. Set up Google Apps Script for public web form endpoint: https://github.com/levinunnink/html-form-to-google-sheet
// 3. Replace YOUR_GOOGLE_SCRIPT_URL below with your endpoint

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-ZUzoY6mUoqMkE0fXiZ4_AZ13Zuz4F4UW7_dGqt16TFlheSGdANtzV64lsYwI06nQ/exec"; // <-- Replace with your Apps Script Web App URL

document.addEventListener('DOMContentLoaded', () => {
  animeBackground();
  threeBackground();
  loadGitHubProfile();
  loadGitHubRepos();
  loadBlogPosts();

    const dateInput = document.getElementById('form-date');
  const now = new Date();
  // Example: "2025-10-01 21:12:34"
  dateInput.value = now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, '0') + "-" +
    String(now.getDate()).padStart(2, '0') + " " +
    String(now.getHours()).padStart(2, '0') + ":" +
    String(now.getMinutes()).padStart(2, '0') + ":" +
     String(now.getSeconds()).padStart(2, '0');

  document.getElementById('contact-form').onsubmit = async (e) => {
    e.preventDefault();
    const formStatus = document.getElementById('form-status');
    formStatus.textContent = 'Sending...';
    const formData = new FormData(e.target);
    try {
      const res = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        formStatus.textContent = 'Message sent! Thank you!';
        e.target.reset();
      } else {
        formStatus.textContent = 'Something went wrong. Try again!';
      }
    } catch (err) {
      formStatus.textContent = 'Error sending. Check your connection!';
    }
    setTimeout(() => formStatus.textContent = '', 4000);
  };
});