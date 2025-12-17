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
          <a href="#" class="btn btn-primary comment-btn" data-post-id="${post.id}">Comentar</a>
        </div>
        <div class="post-stats">
          <span class="like-count" id="like-count-${post.id}">❤️ 0</span>
          <span class="comment-count" id="comment-count-${post.id}">💬 0</span>
          <span class="date-time">${new Date(post.creado_en).toLocaleString('es-AR')}</span>
        </div>
      </div>`;
    container.appendChild(card);

    const id_usuario = localStorage.getItem("idUsuario");

    // cantidad liks
    fetch(`http://localhost:3000/likes/posts/${post.id}`)
      .then(res => res.json())
      .then(data => {
        const likeSpan = document.getElementById(`like-count-${post.id}`);
        likeSpan.textContent = `❤️ ${data.likes}`;
      })
      .catch(err => console.error("Error al obtener likes:", err));

    // verificacion de like
    fetch(`http://localhost:3000/likes/posts/${post.id}/me?id_usuario=${id_usuario}`)
      .then(res => res.json())
      .then(data => {
        const btn = card.querySelector(".like-btn");
        if (data.like) {
          btn.textContent = "Deslikear";
        } else {
          btn.textContent = "Like";
        }
      });
  });

  // like unlike
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const postId = btn.dataset.postId;
      const id_usuario = localStorage.getItem("idUsuario");

      // verificacion
      fetch(`http://localhost:3000/likes/posts/${postId}/me?id_usuario=${id_usuario}`)
        .then(res => res.json())
        .then(data => {
          if (data.like) {
            // cambio por deslik
            return fetch(`http://localhost:3000/likes/posts/${postId}`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_usuario })
            });
          } else {
            // like no dado
            return fetch(`http://localhost:3000/likes/posts/${postId}`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_usuario })
            });
          }
        })
        .then(() => fetch(`http://localhost:3000/likes/posts/${postId}`))
        .then(res => res.json())
        .then(data => {
          const likeSpan = document.getElementById(`like-count-${postId}`);
          likeSpan.textContent = `❤️ ${data.likes}`;
          btn.textContent = btn.textContent === "Like" ? "Deslikear" : "Like";
        })
        .catch(err => console.error("Error al actualizar like:", err));
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



