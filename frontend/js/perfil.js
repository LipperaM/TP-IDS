document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", e => e.preventDefault());
});

/*MODALES*/
const modalRegistro = document.getElementById("modalRegistro");
const modalLogin = document.getElementById("modalLogin");
const modalEliminar = document.getElementById("modalEliminar");
const modalEditar = document.getElementById("modalEditar");
const modalPost = document.getElementById("modal"); // evita ReferenceError

const openModalRegistro = document.getElementById("openModalRegistro");
const openModalLogin = document.getElementById("openModalLogin");
const openModalEliminar = document.getElementById("openModalEliminar");
const cerrarSesion = document.getElementById("logout");
const openModalEditar = document.getElementById("openModalEditar");

const closeRegistro = document.getElementById("closeRegistro");
const closeLogin = document.getElementById("closeLogin");
const closeEliminar = document.getElementById("closeEliminar");
const closeEditar = document.getElementById("closeEditar");

/*ABRIR MODALES*/
if (openModalRegistro) openModalRegistro.onclick = () => modalRegistro.style.display = "flex";
if (openModalLogin) openModalLogin.onclick = () => modalLogin.style.display = "flex";
if (openModalEliminar) openModalEliminar.onclick = () => modalEliminar.style.display = "flex";
if (openModalEditar) openModalEditar.onclick = () => modalEditar.style.display = "flex";

/*CERRAR MODALES*/
if (closeRegistro) closeRegistro.onclick = () => modalRegistro.style.display = "none";
if (closeLogin) closeLogin.onclick = () => modalLogin.style.display = "none";
if (closeEliminar) closeEliminar.onclick = () => modalEliminar.style.display = "none";
if (closeEditar) closeEditar.onclick = () => modalEditar.style.display = "none";

/*CLICK FUERA DEL MODAL*/
window.onclick = (e) => {
  if (e.target === modalRegistro) modalRegistro.style.display = "none";
  if (e.target === modalLogin) modalLogin.style.display = "none";
  if (e.target === modalEliminar) modalEliminar.style.display = "none";
  if (e.target === modalEditar) modalEditar.style.display = "none";
  if (e.target === modalPost) modalPost.style.display = "none";
};

/*OCULTAR BOTONES AL INICIO*/
if (openModalEliminar) openModalEliminar.classList.add("hidden");
if (openModalEditar) openModalEditar.classList.add("hidden");
if (cerrarSesion) cerrarSesion.classList.add("hidden");

/*MOSTRAR DATOS DEL USUARIO */
function mostrarDatosUsuario(data) {
  const divDatos = document.getElementById("datosUsuario");
  divDatos.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "datos-usuario";

  const fotoUsuario = document.createElement("img");
  fotoUsuario.className = "foto-perfil";
  fotoUsuario.src = data.escudo_url || "img/default-avatar.png";
  fotoUsuario.alt = "Foto de perfil";
  fotoUsuario.width = 90;

  const contenedor = document.createElement("div");
  contenedor.className = "datos";

  const hUsuario = document.createElement("h5");
  hUsuario.className = "usuario";
  hUsuario.textContent = data.usuario;

  const infoExtra = document.createElement("div");
  infoExtra.className = "info-extra";

  const hEquipo = document.createElement("h5");
  hEquipo.textContent = data.nombre;

  const hPais = document.createElement("h5");
  hPais.textContent = data.pais;

  const btnEditar = document.createElement("button");
  btnEditar.className = "boton";
  btnEditar.textContent = "Editar Perfil";
  btnEditar.onclick = () => modalEditar.style.display = "flex";

  infoExtra.appendChild(hEquipo);
  infoExtra.appendChild(hPais);
  infoExtra.appendChild(btnEditar);

  contenedor.appendChild(hUsuario);
  contenedor.appendChild(infoExtra);

  wrapper.appendChild(fotoUsuario);
  wrapper.appendChild(contenedor);

  divDatos.appendChild(wrapper);

  if (openModalRegistro) openModalRegistro.style.display = "none";
  if (openModalLogin) openModalLogin.style.display = "none";
  if (openModalEliminar) openModalEliminar.classList.remove("hidden");
  if (cerrarSesion) cerrarSesion.classList.remove("hidden");
  if (openModalEditar) openModalEditar.classList.remove("hidden");
}

/*POSTS USUARIO*/
let todosLosPostsUsuario = [];

async function cargarPosts() {
  try {
    const idUsuario = localStorage.getItem("idUsuario");
    console.log("ID Usuario:", idUsuario);

    if (!idUsuario) {
      renderizarPosts([]);
      return;
    }

    const response = await fetch("http://localhost:3000/posts");
    const todosLosPosts = await response.json();
    console.log("Todos los posts:", todosLosPosts);

    todosLosPostsUsuario = todosLosPosts.filter(post => post.id_usuario == idUsuario);
    console.log("Posts del usuario:", todosLosPostsUsuario);

    renderizarPosts(todosLosPostsUsuario);
  } catch (err) {
    console.error("Error al cargar los posts del usuario.", err);
  }
}

function renderizarPosts(posts) {
  const container = document.querySelector(".post-usuario-container");
  if (!container) return;
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

          ${esMio
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

      const id_usuario = localStorage.getItem("idUsuario");

      if (!id_usuario) {
        alert("⚠️ Tenés que iniciar sesión para dar like");
        return;
      }

      const postId = btn.dataset.postId;

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
  const busquedaInput = busquedaForm?.querySelector('input[type="search"]');

  if (busquedaForm && busquedaInput) {
    busquedaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const textoBusqueda = busquedaInput.value.trim().toLowerCase();
      if (textoBusqueda === '') {
        renderizarPosts(todosLosPostsUsuario);
      } else {
        const postsFiltrados = todosLosPostsUsuario.filter(post =>
          post.usuario.toLowerCase().includes(textoBusqueda) ||
          post.categoria.toLowerCase().includes(textoBusqueda) ||
          post.texto.toLowerCase().includes(textoBusqueda)
        );
        renderizarPosts(postsFiltrados);
      }
    });
  }

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
      await fetch(`http://localhost:3000/comentarios/${currentCommentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ texto, id_usuario })
      });
    } else {
      await fetch("http://localhost:3000/comentarios", {
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
      await fetch(`http://localhost:3000/comentarios/${id}`, {
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

    // cambiar boton a actualiz 
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

    await fetch("http://localhost:3000/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, id_usuario })
    });

    cargarPosts();
  });

});


/*SESIÓN PERSISTENTE*/
async function verificarSesion() {
  const id = localStorage.getItem("idUsuario");
  if (!id) return;

  try {
    const response = await fetch(`http://localhost:3000/usuarios/${id}`);
    const data = await response.json();

    if (!data || data.error) {
      localStorage.removeItem("idUsuario");
      return;
    }

    mostrarDatosUsuario(data);

  } catch (err) {
    console.error("Error al verificar sesión:", err);
  }
}

/*LOGIN*/
async function login(nombreUsuario, pass) {
  try {
    const usuario = nombreUsuario;
    const contrasenia = pass;

    if (!usuario || !contrasenia) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const url = `http://localhost:3000/usuarios/login`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ usuario, contrasenia })
    });
    const data = await response.json();

    console.log("Respuesta del login:", data);

    if (data === "Contrasenia incorrecta") {
      alert("Contraseña incorrecta");
      return;
    }
    if (data === "Usuario no encontrado") {
      alert("El usuario no existe");
      return;
    }
    else {
      console.log("Login OK!", data);
    }

    localStorage.setItem("idUsuario", data.id);
    if (data.administrador === 1) {
      localStorage.setItem("admin", "1");
    } else {
      localStorage.removeItem("admin");
    }

    modalLogin.style.display = "none";
    modalRegistro.style.display = "none";
    mostrarDatosUsuario(data);
    cargarPosts();

  } catch (err) {
    console.log("Error:", err);
  }
}

/*REGISTRO*/
async function registrarse(event) {
  if (event) event.preventDefault();

  try {
    const usuario = document.getElementById("usuario");
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const pais = document.getElementById("pais");
    const id_equipo = document.getElementById("equipo");
    const mail = document.getElementById("mail");
    const contrasenia = document.getElementById("contrasenia");
    let foto_url = "foto";

    const response = await fetch("http://localhost:3000/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: usuario.value,
        nombre: nombre.value,
        apellido: apellido.value,
        mail: mail.value,
        pais: pais.value,
        id_equipo: id_equipo.value,
        contrasenia: contrasenia.value,
        foto_url: foto_url
      })
    });

    const post = await response.json();
    console.log(post);

    if (post === "El usuario ya existe") {
      alert("El usuario ya existe");
      return;
    }
    if (post === "El mail ya fue registrado") {
      alert("El mail ya fue registrado");
      return;
    }
    if (post === "Todos los campos son obligatorios") {
      alert("Todos los campos son obligatorios");
      return;
    }
    if (post === "La contraseña debe tener al menos 8 caracteres") {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    if (post === "Formato de mail invalido") {
      alert("Formato de mail invalido");
      return;
    }
    if (!post.ok) {
      alert("Error al registrarse");
      return;
    }

    login(usuario.value, contrasenia.value);

  } catch (err) {
    console.log("Error:", err);
  }
}

/*ELIMINAR USUARIO*/
async function eliminarUsuario() {

  const confirmar = confirm(
    "⚠️¿Seguro que querés eliminar tu cuenta?"
  );
  const contrasenia = document.getElementById("contraElim");
  const confirmarContra = document.getElementById("contraConfirm");
  const id = localStorage.getItem("idUsuario");

  if (!confirmar) return;

  if (!contrasenia.value || !confirmarContra.value) {
    alert("Todos los campos son obligatorios");
    return;
  }

  if(contrasenia.value !== confirmarContra.value){
      alert("Los datos no coinciden");
      return;
  }

  try {
    
    console.log(id);
    const response = await fetch("http://localhost:3000/usuarios", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        contrasenia: contrasenia.value
      })
    });

    const borrar = await response.json();
    console.log(borrar);

    if (borrar === "Contrasenia incorrecta") {
      alert("Contraseña incorrecta");
      return;
    }
    if (borrar === "Todos los campos son obligatorios") {
      alert("Todos los campos son obligatorios");
      return;
    }

    localStorage.removeItem("idUsuario");
    localStorage.removeItem("admin");
    window.location.reload();

  } catch (err) {
    console.log("Error:", err);
  }

}

/*EDITAR USUARIO*/
async function editarUsuario() {

  const confirmar = confirm(
    "¿Seguro que querés editar estos datos?"
  );

  if (!confirmar) return;

  try {
    const id = localStorage.getItem("idUsuario");
    const usuarioNuevo = document.getElementById("editUsuario");
    const nombreNuevo = document.getElementById("editNombre");
    const apellidoNuevo = document.getElementById("editApellido");
    const paisNuevo = document.getElementById("editPais");
    const mailNuevo = document.getElementById("editMail");
    console.log(mailNuevo.textContent);
    const contraseniaNuevo = document.getElementById("editPass");

    const response = await fetch("http://localhost:3000/usuarios", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: id,
        usuario: usuarioNuevo.value,
        nombre: nombreNuevo.value,
        apellido: apellidoNuevo.value,
        mail: mailNuevo.value,
        pais: paisNuevo.value,
        contrasenia: contraseniaNuevo.value,
      })
    });

    const post = await response.json();
    console.log(post);

    modalEditar.style.display = "none";
    verificarSesion();

  } catch (err) {
    console.log("Error:", err);
  }
}

/*TRAER EQUIPOS*/
async function getEquipos() {
  const url = "http://localhost:3000/equipos";

  const response = await fetch(url, { method: "GET" });
  const equipos = await response.json();

  const select = document.getElementById("equipo");

  equipos.forEach(equipo => {
    const option = document.createElement("option");
    option.value = equipo.id;
    option.textContent = equipo.nombre;

    select.appendChild(option);
  });

}

/*LOG OUT*/
function logOut() {
  localStorage.removeItem("idUsuario");
  localStorage.removeItem("admin");
  window.location.reload();
}

/*AL ABRIR LA PAGINA*/
document.addEventListener("DOMContentLoaded", () => {
  verificarSesion();
  getEquipos();

  const params = new URLSearchParams(window.location.search);
  const action = params.get("action");

  if (action === "registro") {
    modalRegistro.style.display = "flex";
  }

  if (action === "login") {
    modalLogin.style.display = "flex";
  }

  history.replaceState(null, "", "profile.html");

});

