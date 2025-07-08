// js/contenedores.js

// Array para almacenar los datos de los contenedores
let containers = [];

// Datos estáticos para tipos de residuo y tipos de contenedor (para simulación)
export const TIPO_RESIDUOS_DATA = [
    { id: 1, nombre: 'Químicos', descripcion: 'Residuos químicos peligrosos.' },
    { id: 2, nombre: 'Biológicos', descripcion: 'Residuos biológicos y médicos.' },
    { id: 3, nombre: 'Radiactivos', descripcion: 'Residuos con material radiactivo.' },
    { id: 4, nombre: 'Industriales', descripcion: 'Residuos generales de procesos industriales.' },
    { id: 5, nombre: 'Corrosivos', descripcion: 'Residuos que pueden corroer materiales.' }
];

export const TIPO_CONTENEDORES_DATA = [
    { id: 101, nombre: 'Barril 200L', descripcion: 'Barril estándar de 200 litros.', capacidad_maxima: 200 },
    { id: 102, nombre: 'Contenedor IBC 1000L', descripcion: 'Contenedor intermedio para granel de 1000 litros.', capacidad_maxima: 1000 },
    { id: 103, nombre: 'Cubo 20L', descripcion: 'Cubo pequeño de 20 litros.', capacidad_maxima: 20 },
    { id: 104, nombre: 'Cisterna 5000L', descripcion: 'Cisterna para líquidos a granel de 5000 litros.', capacidad_maxima: 5000 }
];

// Función para cargar contenedores desde localStorage
export function loadContainersFromLocalStorage() {
    const storedContainers = localStorage.getItem('contenedores');
    return storedContainers ? JSON.parse(storedContainers) : [];
}

// Función para guardar contenedores en localStorage
export function saveContainersToLocalStorage(updatedContainers) {
    localStorage.setItem('contenedores', JSON.stringify(updatedContainers));
}

// Función para mostrar/ocultar mensajes de error de campo
export function displayFieldError(fieldId, message, isEditModal = false) {
    const prefix = isEditModal ? 'edit' : '';
    const errorElement = document.getElementById(prefix + fieldId + 'Error');
    const inputElement = document.getElementById(prefix + fieldId);
    if (message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('invalid');
    } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputElement.classList.remove('invalid');
    }
}

// Función de validación para la descripción
export function validateDescripcion(descripcion) {
    if (!descripcion || descripcion.trim() === '') {
        return "La descripción es obligatoria.";
    }
    if (descripcion.length < 10) {
        return "La descripción debe tener al menos 10 caracteres.";
    }
    return "";
}

// Función para cerrar cualquier modal
export function closeModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
        modalElement.classList.add('hidden');
    }
}

// Función para manejar la búsqueda en tiempo real
export function handleContainerSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const allContainers = loadContainersFromLocalStorage();
    
    if (searchTerm === "") {
        renderContainers(allContainers); // Si el campo de búsqueda está vacío, mostrar todos los contenedores
        return;
    }

    const filteredContainers = allContainers.filter(container => {
        return (
            (container.id && container.id.toLowerCase().includes(searchTerm)) ||
            (container.descripcion && container.descripcion.toLowerCase().includes(searchTerm)) ||
            (container.tipo_residuo_nombre && container.tipo_residuo_nombre.toLowerCase().includes(searchTerm)) ||
            (container.tipo_contenedor_nombre && container.tipo_contenedor_nombre.toLowerCase().includes(searchTerm))
        );
    });
    renderContainers(filteredContainers); // Renderizar solo los contenedores filtrados
}

// Función para renderizar contenedores en la cuadrícula (específica de contenedores.html)
export function renderContainers(filteredContainers = null) {
    const containersGrid = document.getElementById('containersGrid');
    if (!containersGrid) return; // Asegurarse de que el elemento existe

    containersGrid.innerHTML = ''; // Limpiar las tarjetas existentes

    const containersToRender = filteredContainers || loadContainersFromLocalStorage(); 
    containers = loadContainersFromLocalStorage(); // Asegurarse de que 'containers' global siempre tenga todos los datos

    if (containersToRender.length === 0) {
        containersGrid.innerHTML = '<p class="text-gray-500 text-center col-span-full">No hay contenedores registrados que coincidan con la búsqueda.</p>';
        return;
    }

    containersToRender.forEach(container => {
        const fillLevel = Math.floor(Math.random() * 100); // Simular nivel de llenado
        let statusClass = 'status-empty';
        let fillProgressClass = 'empty';
        if (fillLevel > 75) {
            statusClass = 'status-full';
            fillProgressClass = 'full';
        } else if (fillLevel > 25) {
            statusClass = 'status-medium';
            fillProgressClass = 'medium';
        }

        const containerCard = document.createElement('div');
        containerCard.className = 'container-card';
        containerCard.innerHTML = `
            <div class="container-header">
                <span class="container-id">${container.id}</span>
                <span class="container-status ${statusClass}">${statusClass.replace('status-', '')}</span>
            </div>
            <div class="container-info">
                <strong>Tipo:</strong> ${container.tipo_residuo_nombre || 'N/A'}<br>
                <strong>Contenedor:</strong> ${container.tipo_contenedor_nombre || 'N/A'}<br>
                <strong>Descripción:</strong> ${container.descripcion || 'N/A'}<br>
                <strong>Fecha Registro:</strong> ${container.fecha_registro || 'N/A'}
            </div>
            <div class="fill-level">
                <div class="fill-bar">
                    <div class="fill-progress ${fillProgressClass}" style="width: ${fillLevel}%"></div>
                </div>
                <div class="fill-text">${fillLevel}% lleno</div>
            </div>
            <div class="container-metrics">
                <div class="metric-small">
                    <div class="metric-small-value">${Math.floor(Math.random() * 15) + 15}°C</div>
                    <div class="metric-small-label">Temperatura</div>
                </div>
                <div class="metric-small">
                    <div class="metric-small-value">Normal</div>
                    <div class="metric-small-label">Estado sensor</div>
                </div>
            </div>
            <div class="container-actions">
                <button class="btn-small btn-view" data-id="${container.id}">Ver Detalles</button>
                <button class="btn-small btn-edit" data-id="${container.id}">Editar</button>
            </div>
        `;
        containersGrid.appendChild(containerCard);
    });

    attachButtonListeners();
}

// Función para adjuntar oyentes de eventos a los botones "Ver Detalles" y "Editar"
export function attachButtonListeners() {
    document.querySelectorAll('.btn-view').forEach(button => {
        button.onclick = (event) => {
            const containerId = event.target.dataset.id;
            showViewContainerModal(containerId);
        };
    });

    document.querySelectorAll('.btn-edit').forEach(button => {
        button.onclick = (event) => {
            const containerId = event.target.dataset.id;
            showEditContainerModal(containerId);
        };
    });
}

// Mostrar Modal de Detalles del Contenedor
export function showViewContainerModal(containerId) {
    const container = containers.find(c => c.id === containerId);
    if (!container) {
        console.error("Contenedor no encontrado:", containerId);
        return;
    }

    const detailsDiv = document.getElementById('viewContainerDetails');
    if (!detailsDiv) return;

    detailsDiv.innerHTML = `
        <div class="modal-info-row"><span class="modal-info-label">ID Contenedor:</span><span class="modal-info-value">${container.id}</span></div>
        <div class="modal-info-row"><span class="modal-info-label">Descripción:</span><span class="modal-info-value">${container.descripcion || 'N/A'}</span></div>
        <div class="modal-info-row"><span class="modal-info-label">Fecha Registro:</span><span class="modal-info-value">${container.fecha_registro || 'N/A'}</span></div>
        <div class="modal-info-row"><span class="modal-info-label">Tipo Residuo:</span><span class="modal-info-value">${container.tipo_residuo_nombre || 'N/A'}</span></div>
        <div class="modal-info-row"><span class="modal-info-label">Tipo Contenedor:</span><span class="modal-info-value">${container.tipo_contenedor_nombre || 'N/A'}</span></div>
        <div class="modal-info-row"><span class="modal-info-label">Capacidad Máxima:</span><span class="modal-info-value">${container.capacidad_maxima_contenedor ? `${container.capacidad_maxima_contenedor} L` : 'N/A'}</span></div>
        <div class="modal-info-row"><span class="modal-info-label">ID Empresa:</span><span class="modal-info-value">${container.id_empresa || 'N/A'}</span></div>
    `;
    document.getElementById('viewContainerModal').classList.remove('hidden');
}

// Mostrar Modal de Edición de Contenedor
export function showEditContainerModal(containerId) {
    const container = containers.find(c => c.id === containerId);
    if (!container) {
        console.error("Contenedor no encontrado para editar:", containerId);
        return;
    }

    document.getElementById('editContainerId').value = container.id;
    document.getElementById('editDescripcion').value = container.descripcion || '';
    document.getElementById('editFechaRegistro').value = container.fecha_registro || '';
    document.getElementById('editTipoResiduo').value = container.tipo_residuo_id || '';
    document.getElementById('editTipoContenedor').value = container.tipo_contenedor_id || '';

    // Limpiar errores previos al abrir el modal de edición
    displayFieldError('Descripcion', '', true);
    displayFieldError('TipoResiduo', '', true);
    displayFieldError('TipoContenedor', '', true);

    document.getElementById('editContainerModal').classList.remove('hidden');
}

// Función para añadir un nuevo contenedor y guardarlo en localStorage
export function addNewContainerAndSave(containerData) {
    let currentContainers = loadContainersFromLocalStorage();
    
    // Generar un ID único para el contenedor
    const newId = 'BOTE-' + (currentContainers.length > 0 ? Math.max(...currentContainers.map(c => parseInt(c.id.replace('BOTE-', '')))) + 1 : 1).toString().padStart(3, '0');
    containerData.id = newId; // Asignar el ID único
    containerData.id_contenedor = newId; // Para coincidir con el esquema de la tabla si es necesario

    currentContainers.push(containerData);
    saveContainersToLocalStorage(currentContainers);
    console.log("Contenedor guardado en localStorage:", containerData);
    return { id: newId }; // Devolver un objeto similar al docRef de Firebase
}

// Función para mostrar cuadro de mensaje (específica de new-container.html)
export function showMessage(message, isError = false) {
    const messageBox = document.getElementById('messageBox');
    if (!messageBox) return; // Asegurarse de que el elemento existe

    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'error');
    if (isError) {
        messageBox.classList.add('error');
    }
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 5000); // Ocultar después de 5 segundos
}

// Exportar funciones para que sean accesibles globalmente si se usan en atributos onclick
window.closeModal = closeModal;
window.handleContainerSearch = handleContainerSearch;
window.renderContainers = renderContainers; 
window.attachButtonListeners = attachButtonListeners; 
window.showViewContainerModal = showViewContainerModal; 
window.showEditContainerModal = showEditContainerModal; 
window.displayFieldError = displayFieldError; 
window.validateDescripcion = validateDescripcion; 
window.addNewContainerAndSave = addNewContainerAndSave; 
window.showMessage = showMessage;
window.TIPO_RESIDUOS_DATA = TIPO_RESIDUOS_DATA;
window.TIPO_CONTENEDORES_DATA = TIPO_CONTENEDORES_DATA;

