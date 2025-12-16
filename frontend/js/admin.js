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

/*ALTA EQUIPO*/
async function altaEquipo(){
    try{
        const nombre = document.getElementById("nombre");
        const escudo = document.getElementById("escudo");
        const zona = document.getElementById("zona");

        console.log(nombre.value);
        console.log(escudo.value);
        console.log(zona.value);
        

        const response = await fetch("http://localhost:3000/equipos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: nombre.value,
                escudo: escudo.value,
                zona: zona.value
            })
        });

        const post = await response.json();
        console.log(post);

        if (post === "Todos los campos son obligatorios") {
            alert("Todos los campos son obligatorios");
            return;
        }
        if (post === "No se pueden sumar mas equipos") {
            alert("No se pueden sumar mas equipos");
            return;
        }
        if (post === "La zona debe ser A o B") {
            alert("La zona debe ser A o B");
            return;
        }
        if (post === "No se pueden sumar mas equipos a la zona ") {
            alert("No se pueden sumar mas equipos a esta zona");
            return;
        }

        window.location.reload();


    }catch(err){
        console.log("Error:", err);
    }
}

/*ELIMINAR EQUIPO*/
async function eliminarEquipo(idEquipo){
    try{
        if (!idEquipo) {
            alert("Seleccioná un equipo");
            return;
        }
        
        const response = await fetch("http://localhost:3000/equipos", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: idEquipo,
            })
        });

        const borrar = await response.json();
        console.log(borrar);

        window.location.reload();

    }catch(err){
        console.log("Error:", err);
    }
    
}