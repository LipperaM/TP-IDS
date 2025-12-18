let todosLosPosts = [];


async function cargarPosts() {
  const response = await fetch("http://localhost:3000/posts");
  todosLosPosts = await response.json();
  renderizarPosts(todosLosPosts);
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
        <span class="badge text-bg-secondary">#${post.categoria}</span>
        <p class="card-text">${post.texto}</p>

        <!-- BOTONES (SOLO DOS) -->
        <div class="d-flex gap-2 mt-2">
          <a href="#" class="btn btn-primary like-btn" data-post-id="${post.id}">Like</a>
          <a href="#" class="btn btn-primary comment-btn" data-post-id="${post.id}">Comentar</a>
        </div>

        <!-- STATS -->
        <div class="mt-2 text-muted small">
          <span id="like-count-${post.id}">❤️ 0</span> · 
          <span class="toggle-comments" data-post-id="${post.id}" style="cursor:pointer">
            💬 <span id="comment-count-${post.id}">0</span> Comentarios
          </span> ·
          <span>${new Date(post.creado_en).toLocaleString("es-AR")}</span>
        </div>

        <!-- COMENTARIOS ABAJO -->
        <div class="comments-container mt-3" id="comments-${post.id}" style="display:none;"></div>
      </div>
    `;
      
    container.appendChild(card);

    const id_usuario = localStorage.getItem("idUsuario");

    
    fetch(`http://localhost:3000/likes/posts/${post.id}`)
      .then(r => r.json())
      .then(d => {
        document.getElementById(`like-count-${post.id}`).textContent = `❤️ ${d.likes}`;
      });

    
    fetch(`http://localhost:3000/likes/posts/${post.id}/me?id_usuario=${id_usuario}`)
      .then(r => r.json())
      .then(d => {
        card.querySelector(".like-btn").textContent = d.like ? "Deslikear" : "Like";
      });
  });

  // like unlike
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", async e => {
      e.preventDefault();
      const postId = btn.dataset.postId;
      const id_usuario = localStorage.getItem("idUsuario");

      const me = await fetch(
        `http://localhost:3000/likes/posts/${postId}/me?id_usuario=${id_usuario}`
      ).then(r => r.json());

      await fetch(`http://localhost:3000/likes/posts/${postId}`, {
        method: me.like ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario })
      });

      const d = await fetch(`http://localhost:3000/likes/posts/${postId}`).then(r => r.json());
      document.getElementById(`like-count-${postId}`).textContent = `❤️ ${d.likes}`;
      btn.textContent = me.like ? "Like" : "Deslikear";
    });
  });
}

async function cargarComentarios(postId) {
  const res = await fetch(`http://localhost:3000/comentarios/post/${postId}`);
  const comentarios = await res.json();
  const container = document.getElementById(`comments-${postId}`);
  container.innerHTML = "";

  comentarios.forEach(c => {
    const div = document.createElement("div");
    div.className = "border-top pt-2";
    div.innerHTML = `
      <b>@${c.usuario}</b>: ${c.texto}
      <button class="btn btn-sm btn-link edit-comment" data-id="${c.id}">Editar</button>
      <button class="btn btn-sm btn-link text-danger delete-comment" data-id="${c.id}">Borrar</button>
    `;
    container.appendChild(div);
  });

  document.getElementById(`comment-count-${postId}`).textContent = comentarios.length;
}

document.addEventListener("DOMContentLoaded", () => {
  cargarPosts();

  // Filtrado de posts search bar
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
  })

  let currentPostId = null;

  // nuevo modal de comentario (chequear tamaño)
  document.addEventListener("click", e => {
    if (e.target.classList.contains("comment-btn")) {
      currentPostId = e.target.dataset.postId;
      new bootstrap.Modal(document.getElementById("commentModal")).show();
    }
  });

  // send comentario
  document.getElementById("modalSubmitComment").addEventListener("click", async () => {
    const texto = document.getElementById("modalCommentText").value.trim();
    const id_usuario = localStorage.getItem("idUsuario");
    if (!texto || !currentPostId) return;

    await fetch("http://localhost:3000/comentarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_post: currentPostId, id_usuario, texto })
    });

    document.getElementById("modalCommentText").value = "";
    await cargarComentarios(currentPostId);
    bootstrap.Modal.getInstance(document.getElementById("commentModal")).hide();
  });

  // clickear para ver coment
  document.addEventListener("click", async e => {
    if (e.target.closest(".toggle-comments")) {
      const el = e.target.closest(".toggle-comments");
      const postId = el.dataset.postId;
      const cont = document.getElementById(`comments-${postId}`);

      if (cont.style.display === "none") {
        await cargarComentarios(postId);
        cont.style.display = "block";
      } else {
        cont.style.display = "none";
      }
    }
  });

  // edicion o borrar comen
  document.addEventListener("click", async e => {
    if (e.target.classList.contains("delete-comment")) {
      const id = e.target.dataset.id;
      const postId = e.target.closest(".card").querySelector(".comment-btn").dataset.postId;
      await fetch(`http://localhost:3000/comentarios/${id}`, { method: "DELETE" });
      cargarComentarios(postId);
    }

    if (e.target.classList.contains("edit-comment")) {
      const id = e.target.dataset.id;
      const postId = e.target.closest(".card").querySelector(".comment-btn").dataset.postId;
      const texto = prompt("Editar comentario:");
      if (!texto) return;

      await fetch(`http://localhost:3000/comentarios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto })
      });
      cargarComentarios(postId);
    }
  });
});







