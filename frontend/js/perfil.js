document.querySelectorAll("form").forEach(form => {
    form.addEventListener("submit", e => e.preventDefault());
});


const modalRegistro = document.getElementById("modalRegistro");
const modalLogin = document.getElementById("modalLogin");
const modalEliminar = document.getElementById("modalEliminar");
const modalEditar = document.getElementById("modalEditar");

const openModalRegistro = document.getElementById("openModalRegistro");
const openModalLogin = document.getElementById("openModalLogin");
const openModalEliminar = document.getElementById("openModalEliminar");

const closeRegistro = document.getElementById("closeRegistro");
const closeLogin = document.getElementById("closeLogin");
const closeEliminar = document.getElementById("closeEliminar");
const closeEditar = document.getElementById("closeEditar");

if (openModalRegistro) openModalRegistro.onclick = () => modalRegistro.style.display = "flex";
if (openModalLogin) openModalLogin.onclick = () => modalLogin.style.display = "flex";
if (openModalEliminar) openModalEliminar.onclick = () => modalEliminar.style.display = "flex";


window.onclick = (e) => {
    if (e.target === modalRegistro) modalRegistro.style.display = "none";
    if (e.target === modalLogin) modalLogin.style.display = "none";
    if (e.target === modalEliminar) modalEliminar.style.display = "none";
    if (e.target === modalEditar) modalEditar.style.display = "none";
};

async function registrarse(event){
    if (event) event.preventDefault(); 
    console.log("Registrando...");

    try{
        const usuario = document.getElementById("usuario");
        const nombre = document.getElementById("nombre");
        const apellido = document.getElementById("apellido");
        const pais = document.getElementById("pais");
        const equipo = document.getElementById("equipo");
        const mail = document.getElementById("mail");
        const contrasenia = document.getElementById("contrasenia");

        const response = await fetch("http://localhost:3000/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                usuario: usuario.value,
                nombre: nombre.value,
                apellido: apellido.value,
                mail: mail.value,
                pais: pais.value,
                equipo: equipo.value,
                contrasenia: contrasenia.value,
            })
        });

        const post = await response.json();
        console.log(post);

        if (!post.ok) return;

        const divDatos = document.getElementById("datosUsuario");
        divDatos.innerHTML = "";

        const contenedor = document.createElement("div");
        contenedor.className = "datos";

        const hUsuario = document.createElement("h5");
        hUsuario.className = "usuario";
        hUsuario.textContent = usuario.value;

        const infoExtra = document.createElement("div");
        infoExtra.className = "info-extra";

        const hEquipo = document.createElement("h5");
        hEquipo.textContent = equipo.value;

        const hPais = document.createElement("h5");
        hPais.textContent = pais.value;

        
        const btnEditar = document.createElement("button");
        btnEditar.className = "boton";
        btnEditar.textContent = "Editar Perfil";

        btnEditar.onclick = () => modalEditar.style.display = "flex";

        infoExtra.appendChild(hEquipo);
        infoExtra.appendChild(hPais);
        infoExtra.appendChild(btnEditar);

        contenedor.appendChild(hUsuario);
        contenedor.appendChild(infoExtra);
        divDatos.appendChild(contenedor);

        modalRegistro.style.display = "none";
        openModalLogin.style.display = "none";
        openModalRegistro.style.display = "none";

    }catch(err){
        console.log("Error:", err);
    }
}

function login(){
    console.log("entre");

    const usuario = document.getElementById("usuarioLogin").value;
    const contrasenia = document.getElementById("contraLogin").value;

    const url = `http://localhost:3000/usuarios/${usuario}/${contrasenia}`;



}
