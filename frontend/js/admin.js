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