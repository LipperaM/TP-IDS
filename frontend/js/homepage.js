let todosLosPosts = [];

async function cargarPosts() {
  try {
    const response = await fetch("http://localhost:3000/posts");
    todosLosPosts = await response.json();
    renderizarPosts(todosLosPosts);
  } catch (err) {
    console.error("Error al cargar los posts.", err);
  }
}

function renderizarPosts(posts) {
  const container = document.querySelector(".post-container");
  container.innerHTML = "";

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "card w-75 mb-3";
    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">@${post.usuario}</h5>
        <span class="category-label badge text-bg-secondary">#${post.categoria}</span>
        <p class="card-text">${post.texto}</p>
      </div>
      <div class="post-actions">
        <div class="buttons">
          <a href="#" class="btn btn-primary like-btn" data-post-id="${post.id}">Like</a>
          <span class="like-count" id="like-count-${post.id}">0 likes</span>
          <a href="#" class="btn btn-primary">Comentar</a>
        </div>
        <p class="date-time">${new Date(post.creado_en).toLocaleString('es-AR')}</p>
      </div>`;
    container.appendChild(card);

    // Obtener la cantidad de likes real y actualizar el span
    fetch(`http://localhost:3000/likes/posts/${post.id}`)
      .then(response => response.json())
      .then(data => {
        const likeSpan = document.getElementById(`like-count-${post.id}`);
        likeSpan.textContent = `${data.likes} likes`;
      })
      .catch(err => console.error("Error al obtener likes:", err));
  });

  // Agregar funcionalidad de Like al hacer click
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const postId = btn.dataset.postId;
      const id_usuario = localStorage.getItem("idUsuario");

      fetch(`http://localhost:3000/likes/posts/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario })
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => Promise.reject(err));
        }
        return response.json();
      })
      .then(() => {
        // Actualizar el contador de likes
        return fetch(`http://localhost:3000/likes/posts/${postId}`);
      })
      .then(response => response.json())
      .then(data => {
        const likeSpan = document.getElementById(`like-count-${postId}`);
        likeSpan.textContent = `${data.likes} likes`;
      })
      .catch(err => console.error("Error al dar like:", err));
    });
  });
}


document.addEventListener("DOMContentLoaded", () => {
  cargarPosts();

  const busquedaForm = document.querySelector('form[role="search"]');
  const busquedaInput = busquedaForm.querySelector('input[type="search"]');

  busquedaForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const textoBusqueda = busquedaInput.value.trim().toLowerCase();

    if (textoBusqueda === '') {
      renderizarPosts(todosLosPosts);
    } else {
      const postsFiltrados = todosLosPosts.filter(post => {
        return post.usuario.toLowerCase().includes(textoBusqueda) ||
                post.categoria.toLowerCase().includes(textoBusqueda) ||
                post.texto.toLowerCase().includes(textoBusqueda);
      });

      renderizarPosts(postsFiltrados);
    }
  });
});


