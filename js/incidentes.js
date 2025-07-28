
async function cargarIncidentes() {
    const respuesta = await getIncidentes(); // Llama al GET
    const incidentes = respuesta.data || [];

    const lista = document.getElementById("lista-incidentes");
    lista.innerHTML = "";

    if (incidentes.length === 0) {
        lista.innerHTML = "<p>No hay incidentes registrados.</p>";
        return;
    }

    incidentes.forEach((incidente) => {
        const item = document.createElement("li");
        item.innerHTML = `
            <strong>${incidente.nombre}</strong><br>
            Fecha: ${new Date(incidente.fechaIncidente).toLocaleString()}<br>
            Descripción: ${incidente.descripcion}<br>
            <img src="${incidente.photoUrl || 'https://via.placeholder.com/100'}" width="100">
            <hr>
        `;
        lista.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", cargarIncidentes);
