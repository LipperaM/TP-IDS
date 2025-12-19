let todosLosEquipos = [];

async function getEquipos(){
    const url = `${API_URL}/equipos`;
    const response = await fetch(url, { method: "GET" });
    todosLosEquipos = await response.json();  
    renderizarTablas(todosLosEquipos);
}

function renderizarTablas(equipos) {
    const tbodyA = document.getElementById("tablaGrupoA");
    const tbodyB = document.getElementById("tablaGrupoB");

    tbodyA.innerHTML = "";
    tbodyB.innerHTML = "";

    let contadorA = 1;
    let contadorB = 1;

    equipos.forEach(equipo => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${equipo.zona === "A" ? contadorA : contadorB}</td>
            <td>
                <img src="${equipo.escudo_url}" width="30" style="margin-right:5px;">
                ${equipo.nombre}
            </td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
        `;

        if (equipo.zona === "A") {
            tbodyA.appendChild(tr);
            contadorA++;
        } else {
            tbodyB.appendChild(tr);
            contadorB++;
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getEquipos();

    const busquedaForm = document.querySelector('form[role="search"]');
    const busquedaInput = busquedaForm.querySelector('input[type="search"]');

    busquedaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const textoBusqueda = busquedaInput.value.trim().toLowerCase();

        if (textoBusqueda === '') {
            renderizarTablas(todosLosEquipos);
        } else {
            const equiposFiltrados = todosLosEquipos.filter(equipo => 
                equipo.nombre.toLowerCase().includes(textoBusqueda)
            );
            renderizarTablas(equiposFiltrados);
        }
    });

    // Limpiar búsqueda al cambiar de tab
    const tabs = document.querySelectorAll('[data-bs-toggle="tab"]');
    tabs.forEach(tab => {
        tab.addEventListener('shown.bs.tab', () => {
            busquedaInput.value = '';
            renderizarTablas(todosLosEquipos);
        });
    });
});