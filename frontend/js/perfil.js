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


if (openModalRegistro && modalRegistro) {
    openModalRegistro.onclick = () => { modalRegistro.style.display = "flex"; };
}
if (openModalLogin && modalLogin) {
    openModalLogin.onclick = () => { modalLogin.style.display = "flex"; };
}
if (openModalEliminar && modalEliminar) {
    openModalEliminar.onclick = () => { modalEliminar.style.display = "flex"; }
}

if (openModalEditar && modalEditar) {
    openModalEditar.onclick = () => { modalEditar.style.display = "flex"; };
}

window.onclick = (e) => {
    if (modalRegistro && e.target === modalRegistro) modalRegistro.style.display = "none";
    if (modalLogin && e.target === modalLogin) modalLogin.style.display = "none";
    if (modalEliminar && e.target === modalEliminar) modalEliminar.style.display = "none";
    if (modalEditar && e.target === modalEditar) modalEditar.style.display = "none";
};

async function registrarse(){
    console.log("entre");
    
    try{
        const usuario = document.getElementById("usuario");
        const nombre = document.getElementById("nombre");
        const apellido = document.getElementById("apellido");
        const pais = document.getElementById("pais");
        const equipo = document.getElementById("equipo");
        console.log(equipo.value);
        const mail = document.getElementById("mail");
        const contrasenia = document.getElementById("contrasenia");

        const url = "http://localhost:3000/usuarios";
        const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
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
        console.log(response);
        const post = await response.json();
        console.log(post);
    }catch (err){
        console.log(err);
    }
    
};