async function getEquipos(){
    const url = `http://localhost:3000/equipos`;

    const response = await fetch(url, { method: "GET" });
    const equipos = await response.json();  

    const tbodyA = document.getElementById("tablaGrupoA");
    const tbodyB = document.getElementById("tablaGrupoB");

    let contadorA = 1;
    let contadorB = 1;

    equipos.forEach(equipo => {
        const tr = document.createElement("tr");

        if (equipo.zona === "A") {
            tbodyA.appendChild(tr);
            tr.innerHTML = `
            <td>${contadorA}</td>
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
            contadorA++;
        } else {
            tbodyB.appendChild(tr);
            tr.innerHTML = `
            <td>${contadorB}</td>
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
            contadorB++;
        }
    });
}