document.querySelectorAll("form").forEach(form => {
  form.addEventListener("submit", e => e.preventDefault());
});

/*MODALES*/
const modalRegistro = document.getElementById("modalRegistro");
const modalLogin = document.getElementById("modalLogin");
const modalEliminar = document.getElementById("modalEliminar");
const modalEditar = document.getElementById("modalEditar");

const openModalRegistro = document.getElementById("openModalRegistro");
const openModalLogin = document.getElementById("openModalLogin");
const openModalEliminar = document.getElementById("openModalEliminar");
const openModalEditar = document.getElementById("openModalEditar");

const closeRegistro = document.getElementById("closeRegistro");
const closeLogin = document.getElementById("closeLogin");
const closeEliminar = document.getElementById("closeEliminar");
const closeEditar = document.getElementById("closeEditar");

/* Abrir modales */
if (openModalRegistro) openModalRegistro.onclick = () => modalRegistro.style.display = "flex";
if (openModalLogin) openModalLogin.onclick = () => modalLogin.style.display = "flex";
if (openModalEliminar) openModalEliminar.onclick = () => modalEliminar.style.display = "flex";
if (openModalEditar) openModalEditar.onclick = () => modalEditar.style.display = "flex";

/* Cerrar modales */
if (closeRegistro) closeRegistro.onclick = () => modalRegistro.style.display = "none";
if (closeLogin) closeLogin.onclick = () => modalLogin.style.display = "none";
if (closeEliminar) closeEliminar.onclick = () => modalEliminar.style.display = "none";
if (closeEditar) closeEditar.onclick = () => modalEditar.style.display = "none";

/* Click fuera del modal */
window.onclick = (e) => {
  if (e.target === modalRegistro) modalRegistro.style.display = "none";
  if (e.target === modalLogin) modalLogin.style.display = "none";
  if (e.target === modalEliminar) modalEliminar.style.display = "none";
  if (e.target === modalEditar) modalEditar.style.display = "none";
};

/* Ocultar botones al inicio */
if (openModalEliminar) openModalEliminar.classList.add("hidden");
if (openModalEditar) openModalEditar.classList.add("hidden");

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

    /* UI logged */
    if (openModalRegistro) openModalRegistro.style.display = "none";
    if (openModalLogin) openModalLogin.style.display = "none";
    if (openModalEliminar) openModalEliminar.classList.remove("hidden");
    if (openModalEditar) openModalEditar.classList.remove("hidden");
}

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

async function login(nombreUsuario, pass){
    try{
        const usuario = nombreUsuario;
        const contrasenia = pass;

        if (!usuario || !contrasenia) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const url = `http://localhost:3000/usuarios/${usuario}/${contrasenia}`;

        const response = await fetch(url, { method: "GET" });
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

        modalLogin.style.display = "none";
        mostrarDatosUsuario(data);

    }catch(err){
        console.log("Error:", err);
    }
}

/*REGISTRO*/
async function registrarse(event){
    if (event) event.preventDefault(); 
    
    try{
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

    }catch(err){
        console.log("Error:", err);
    }
}

/*ELIMINAR USUARIO*/
async function eliminarUsuario(){
    try{
        const contrasenia = document.getElementById("contraElim");
        const id = localStorage.getItem("idUsuario");
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
        window.location.reload();

    }catch(err){
        console.log("Error:", err);
    }
    
}

/*EDITAR USUARIO*/
async function editarUsuario(){
    try{
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

    }catch(err){
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

/*AL ABRIR LA PAGINA*/
document.addEventListener("DOMContentLoaded", () => {
  verificarSesion();
  getEquipos();
});