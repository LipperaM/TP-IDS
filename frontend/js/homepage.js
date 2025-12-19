let todosLosPosts = [];


async function cargarPosts() {
  const response = await fetch(`${API_URL}/posts`);
  todosLosPosts = await response.json();
  renderizarPosts(todosLosPosts);
}


function renderizarPosts(posts) {
  const container = document.querySelector(".post-container");
  container.innerHTML = "";

  posts.forEach(post => {
    const card = document.createElement("div");
    card.className = "card w-75 mb-3";

    const idUsuarioLogeado = localStorage.getItem("idUsuario");
    const esMio = Number(idUsuarioLogeado) === post.id_usuario;


    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">@${post.usuario}</h5>
        <span class="badge text-bg-secondary">#${post.categoria}</span>
        <p class="card-text">${post.texto}</p>

        <!-- BOTONES (SOLO DOS) -->
        <div class="d-flex gap-2 mt-2">
          <a href="#" class="btn btn-primary like-btn" data-post-id="${post.id}">Like</a>
          <a href="#" class="btn btn-primary comment-btn" data-post-id="${post.id}">Comentar</a>

          ${
            esMio
              ? `
                <a href="#" class="btn btn-warning edit-post" data-id="${post.id}">
                  Editar
                </a>
                <a href="#" class="btn btn-danger delete-post" data-id="${post.id}">
                  Borrar
                </a>
              `
              : ""
          }
        </div>

        <!-- STATS -->
        <div class="mt-2 text-muted small">
          <span id="like-count-${post.id}">❤️ 0</span> · 
          <span class="toggle-comments" data-post-id="${post.id}" style="cursor:pointer">
            💬 <span id="comment-count-${post.id}">${post.cantidad_comentarios}</span> Comentarios
          </span> ·
          <span>${new Date(post.creado_en).toLocaleString("es-AR", { timeZone:"America/Argentina/Buenos_Aires" })}</span>
        </div>

        <!-- COMENTARIOS ABAJO -->
        <div class="comments-container mt-3" id="comments-${post.id}" style="display:none;"></div>
      </div>
    `;
      
    container.appendChild(card);

    const id_usuario = localStorage.getItem("idUsuario");
    
    fetch(`${API_URL}/likes/posts/${post.id}`)
      .then(r => r.json())
      .then(d => {
        document.getElementById(`like-count-${post.id}`).textContent = `❤️ ${d.likes}`;
      });

    fetch(`${API_URL}/likes/posts/${post.id}/me?id_usuario=${id_usuario}`)
      .then(r => r.json())
      .then(d => {
        card.querySelector(".like-btn").textContent = d.like ? "Deslikear" : "Like";
      });
  });

  // like unlike
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", async e => {
      e.preventDefault();

      const id_usuario = localStorage.getItem("idUsuario");

      if (!id_usuario) {
        alert("⚠️ Tenés que iniciar sesión para dar like");
        return;
      }

      const postId = btn.dataset.postId;

      const me = await fetch(
        `${API_URL}/likes/posts/${postId}/me?id_usuario=${id_usuario}`
      ).then(r => r.json());

      await fetch(`${API_URL}/likes/posts/${postId}`, {
        method: me.like ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario })
      });

      const d = await fetch(`${API_URL}/likes/posts/${postId}`).then(r => r.json());
      document.getElementById(`like-count-${postId}`).textContent = `❤️ ${d.likes}`;
      btn.textContent = me.like ? "Like" : "Deslikear";
    });
  });
}

async function cargarComentarios(postId) {
  const res = await fetch(`${API_URL}/comentarios/post/${postId}`);
  const comentarios = await res.json();
  const container = document.getElementById(`comments-${postId}`);
  container.innerHTML = "";
  const idUsuarioLogeado = localStorage.getItem("idUsuario");

  comentarios.forEach(c => {
    const div = document.createElement("div");
    div.className = "border-top pt-2";
    const esMio = Number(idUsuarioLogeado) === c.id_usuario;

    div.innerHTML = `
      <b>@${c.usuario}</b>: <span class="comment-text">${c.texto}</span>
      ${
        esMio
          ? `
            <button class="btn btn-sm btn-link edit-comment" data-id="${c.id}">
              Editar
            </button>
            <button class="btn btn-sm btn-link text-danger delete-comment" data-id="${c.id}">
              Borrar
            </button>
          `
          : ""
      }
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
  let currentCommentId = null;
  let isEditingComment = false;
  const commentModalEl = document.getElementById("commentModal");
  const commentModalInstance = new bootstrap.Modal(commentModalEl);
  const commentModalInput = document.getElementById("modalCommentText");
  const commentModalBtn = document.getElementById("modalSubmitComment");
  const commentModalTitle = commentModalEl.querySelector(".modal-title");
  const resetCommentModal = () => {
    isEditingComment = false;
    currentCommentId = null;
    commentModalTitle.textContent = "Nuevo comentario";
    commentModalBtn.textContent = "Enviar";
    commentModalInput.value = "";
  };
  commentModalEl.addEventListener("hidden.bs.modal", resetCommentModal);

  // nuevo modal de comentario
  document.addEventListener("click", e => {
    if (!e.target.classList.contains("comment-btn")) return;

    const id_usuario = localStorage.getItem("idUsuario");
    if (!id_usuario) {
      alert("⚠️ Tenés que iniciar sesión para comentar");
      return;
    }

    currentPostId = e.target.dataset.postId;
    resetCommentModal();
    commentModalInstance.show();
  });

  // enviar / update comentario
  commentModalBtn.addEventListener("click", async () => {
    const texto = commentModalInput.value.trim();
    const id_usuario = localStorage.getItem("idUsuario");

    if (!id_usuario) {
      alert("⚠️ Tenés que iniciar sesión para comentar");
      return;
    }

    if (!texto) {
      alert("⚠️ El comentario no puede estar vacío");
      return;
    }

    if (!currentPostId) {
      alert("Error: no se pudo identificar el post");
      return;
    }

    if (isEditingComment && currentCommentId) {
      await fetch(`${API_URL}/comentarios/${currentCommentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, id_usuario })
      });
    } else {
      await fetch(`${API_URL}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_post: currentPostId, id_usuario, texto })
      });
    }

    await cargarComentarios(currentPostId);
    commentModalInstance.hide();
  });

  // clickear para ver comentarios
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

  // edicion o borrar comentario
  document.addEventListener("click", async e => {
    const id_usuario = localStorage.getItem("idUsuario");

    if (e.target.classList.contains("delete-comment")) {
      const id = e.target.dataset.id;
      const postId = e.target.closest(".card").querySelector(".comment-btn").dataset.postId;
      await fetch(`${API_URL}/comentarios/${id}`, { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
                id_usuario: id_usuario
            })
      });
      cargarComentarios(postId);
    }

    if (e.target.classList.contains("edit-comment")) {
      const id = e.target.dataset.id;
      const postId = e.target.closest(".card").querySelector(".comment-btn").dataset.postId;
      const commentTextEl = e.target.closest(".border-top").querySelector(".comment-text");
      const texto = commentTextEl ? commentTextEl.textContent.trim() : "";

      isEditingComment = true;
      currentCommentId = id;
      currentPostId = postId;
      commentModalTitle.textContent = "Editar comentario";
      commentModalBtn.textContent = "Actualizar";
      commentModalInput.value = texto;
      commentModalInstance.show();
    }
  });

  //editar Post
  document.addEventListener("click", async e => {
    if (!e.target.classList.contains("edit-post")) return;

    e.preventDefault();

    const postId = e.target.dataset.id;
    const postCard = e.target.closest(".card");
    const textoActual = postCard.querySelector(".card-text").textContent.trim();
    const categoriaActual = postCard.querySelector(".badge").textContent.replace('#', '').trim();

    // abrir modal con contenido actual del post
    const modal = document.getElementById("modal");
    const postText = document.getElementById("postText");
    const categoriaBtn = document.getElementById("categoria-btn");
    const postBtn = document.getElementById("postBtn");

    postText.value = textoActual;
    categoriaBtn.textContent = categoriaActual;
    modal.style.display = "flex";

    // cambiar funcionalidad del botón a "Actualizar"
    postBtn.textContent = "Actualizar";
    postBtn.dataset.editMode = "true";
    postBtn.dataset.postId = postId;
  });

  //eliminar Post
  document.addEventListener("click", async e => {

    if (!e.target.classList.contains("delete-post")) return;

    e.preventDefault();

    const confirmar = confirm("¿Seguro que querés borrar este post?");
    if (!confirmar) return;

    const id = e.target.dataset.id;
    const id_usuario = localStorage.getItem("idUsuario");

    await fetch(`${API_URL}/posts`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, id_usuario })
    });

    cargarPosts();
  });

});
