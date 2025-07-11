// js/containers-management.js

// Array para almacenar los datos de los contenedores (se inicializa al cargar desde localStorage)
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
        const fillLevel = Math.floor(Math.random() * 100); // Simular nivel de llenado para la tarjeta
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

    // --- Simulación de datos para el modal de detalles (basado en la imagen) ---
    // Usar la capacidad máxima del tipo de contenedor si está disponible, sino un valor por defecto
    const maxCapacity = container.capacidad_maxima_contenedor || 500; 
    const simulatedFillLevel = Math.floor(Math.random() * (100 - 70 + 1)) + 70; // Simular entre 70-100% para mostrar "Crítico"
    const currentWeight = ((simulatedFillLevel / 100) * maxCapacity).toFixed(0);
    const remainingSpace = (maxCapacity - currentWeight).toFixed(0);
    const isCritical = simulatedFillLevel > 90; // Si es más del 90% lleno, es crítico
    
    // Simulación de datos del sensor
    const sensorId = 'WS-' + Math.floor(Math.random() * 999).toString().padStart(3, '0') + '-' + (Math.random() > 0.5 ? 'N' : 'S');
    const lastCalibrationDays = Math.floor(Math.random() * 30) + 1;
    const sensorStatus = Math.random() > 0.1 ? 'Funcionando' : 'Offline'; // 10% de probabilidad de offline
    
    // Simulación de cambio de peso
    const weightChange = Math.floor(Math.random() * 20) - 10; // +/- 10kg
    const weightChangeText = weightChange > 0 ? `+${weightChange}kg` : `${weightChange}kg`;
    const weightChangeColor = weightChange > 0 ? '#ef4444' : (weightChange < 0 ? '#10b981' : '#64748b'); // Tailwind red-500, green-500, gray-500
    const weightChangeArrow = weightChange > 0 ? '↑' : (weightChange < 0 ? '↓' : '');
    
    // Simulación de ubicación basada en el ID del contenedor
    const location = container.id.includes('001') ? 'Laboratorio A' : 
                     (container.id.includes('002') ? 'Sala de Cirugía' :
                     (container.id.includes('003') ? 'Unidad de Radiología' :
                     (container.id.includes('004') ? 'Planta de Ensamblaje' :
                     (container.id.includes('005') ? 'Área de Producción' : 'Zona Desconocida'))));


    detailsDiv.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3 style="font-size: 1.25rem; font-weight: 600; color: #1e293b;">${container.id}</h3>
            ${isCritical ? '<span style="padding: 0.25rem 0.75rem; background-color: #fee2e2; color: #dc2626; border-radius: 9999px; font-size: 0.75rem; font-weight: 500;">Crítico</span>' : ''}
        </div>

        <div style="text-align: center; margin-bottom: 1.5rem;">
            <p style="font-size: 3rem; font-weight: 700; color: #1e293b; line-height: 1;">${currentWeight}</p>
            <p style="font-size: 0.875rem; color: #64748b;">${maxCapacity}kg máx.</p>
        </div>

        <div style="width: 100%; background-color: #e2e8f0; border-radius: 9999px; height: 0.625rem; margin-bottom: 1rem;">
            <div style="background-color: #ef4444; height: 100%; border-radius: 9999px; width: ${simulatedFillLevel}%"></div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; text-align: center; margin-bottom: 1.5rem;">
            <div>
                <p style="font-size: 1.125rem; font-weight: 600; color: #1e293b;">${simulatedFillLevel}%</p>
                <p style="font-size: 0.875rem; color: #64748b;">Capacidad</p>
            </div>
            <div>
                <p style="font-size: 1.125rem; font-weight: 600; color: #1e293b;">${remainingSpace}kg</p>
                <p style="font-size: 0.875rem; color: #64748b;">Espacio restante</p>
            </div>
            <div>
                <p style="font-size: 1.125rem; font-weight: 600; color: #1e293b;">${container.tipo_residuo_nombre || 'N/A'}</p>
                <p style="font-size: 0.875rem; color: #64748b;">Tipo residuo</p>
            </div>
            <div>
                <p style="font-size: 1.125rem; font-weight: 600; color: #1e293b;">${location}</p>
                <p style="font-size: 0.875rem; color: #64748b;">Ubicación</p>
            </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 1rem; font-size: 0.875rem; color: #374151;">
            <p style="margin-bottom: 0.5rem;"><strong>Sensor ID:</strong> ${sensorId}</p>
            <p style="margin-bottom: 0.5rem;"><strong>Última calibración:</strong> Hace ${lastCalibrationDays} días</p>
            <p style="margin-bottom: 0.5rem;"><strong>Estado del sensor:</strong> ${sensorStatus}</p>
            <p style="color: ${weightChangeColor}; margin-top: 0.5rem;">
                ${weightChangeArrow} ${weightChangeText} en las últimas 2 horas
            </p>
        </div>
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
    document.getElementById('editTipoResiduo').value = container.id_tipo_residuo || ''; // Usar el ID
    document.getElementById('editTipoContenedor').value = container.id_tipo_contenedor || ''; // Usar el ID

    // Limpiar errores previos al abrir el modal de edición
    displayFieldError('Descripcion', '', true);
    displayFieldError('FechaRegistro', '', true);
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

// Función para cargar opciones en los select de edición (específica de contenedores.html)
export function populateEditSelects() {
    const editTipoResiduoSelect = document.getElementById('editTipoResiduo');
    if (editTipoResiduoSelect) {
        editTipoResiduoSelect.innerHTML = '<option value="">Seleccione un tipo de residuo</option>';
        TIPO_RESIDUOS_DATA.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nombre;
            editTipoResiduoSelect.appendChild(option);
        });
    }

    const editTipoContenedorSelect = document.getElementById('editTipoContenedor');
    if (editTipoContenedorSelect) {
        editTipoContenedorSelect.innerHTML = '<option value="">Seleccione un tipo de contenedor</option>';
        TIPO_CONTENEDORES_DATA.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.id;
            option.textContent = tipo.nombre;
            editTipoContenedorSelect.appendChild(option);
        });
    }
}

// Función para inicializar la página de contenedores
export function initializeContainersPage() {
    let currentContainers = loadContainersFromLocalStorage();
    if (currentContainers.length === 0) {
        // Si no hay contenedores en localStorage, precargar algunos datos de ejemplo
        const initialContainers = [
            { id: 'BOTE-001', descripcion: 'Contenedor para residuos químicos del laboratorio principal.', fecha_registro: '2024-01-15', id_empresa: 'simulated-company-id', id_tipo_residuo: 1, tipo_residuo_nombre: 'Químicos', id_tipo_contenedor: 102, tipo_contenedor_nombre: 'Contenedor IBC 1000L', capacidad_maxima_contenedor: 1000 },
            { id: 'BOTE-002', descripcion: 'Bote para desechos biológicos de la sala de cirugía.', fecha_registro: '2024-02-20', id_empresa: 'simulated-company-id', id_tipo_residuo: 2, tipo_residuo_nombre: 'Biológicos', id_tipo_contenedor: 101, tipo_contenedor_nombre: 'Barril 200L', capacidad_maxima_contenedor: 200 },
            { id: 'BOTE-003', descripcion: 'Contenedor para residuos radiactivos de la unidad de radiología.', fecha_registro: '2024-03-10', id_empresa: 'simulated-company-id', id_tipo_residuo: 3, tipo_residuo_nombre: 'Radiactivos', id_tipo_contenedor: 103, tipo_contenedor_nombre: 'Cubo 20L', capacidad_maxima_contenedor: 20 },
            { id: 'BOTE-004', descripcion: 'Contenedor de residuos industriales generales de la planta de ensamblaje.', fecha_registro: '2024-04-05', id_empresa: 'simulated-company-id', id_tipo_residuo: 4, tipo_residuo_nombre: 'Industriales', id_tipo_contenedor: 102, tipo_contenedor_nombre: 'Contenedor IBC 1000L', capacidad_maxima_contenedor: 1000 },
            { id: 'BOTE-005', descripcion: 'Contenedor para ácidos corrosivos en el área de producción.', fecha_registro: '2024-05-01', id_empresa: 'simulated-company-id', id_tipo_residuo: 5, tipo_residuo_nombre: 'Corrosivos', id_tipo_contenedor: 101, tipo_contenedor_nombre: 'Barril 200L', capacidad_maxima_contenedor: 200 }
        ];
        saveContainersToLocalStorage(initialContainers);
        console.log("Se cargaron datos iniciales de contenedores en localStorage.");
    }
    populateEditSelects(); // Poblar selects en el modal de edición
    renderContainers(); // Renderiza los contenedores (ya sea los cargados o los iniciales)

    // Adjuntar el event listener del botón "Nuevo Bote"
    const newContainerButton = document.getElementById('newContainerBtn');
    if (newContainerButton) {
        console.log("Elemento 'newContainerBtn' encontrado y listener adjuntado.");
        newContainerButton.addEventListener('click', () => {
            console.log("Botón 'Nuevo Bote' clicado. Redirigiendo a new-container.html");
            window.location.href = 'new-container.html';
        });
    } else {
        console.error("Elemento 'newContainerBtn' NO encontrado.");
    }

    // Manejar el envío del formulario de Edición de Contenedor
    const editContainerForm = document.getElementById('editContainerForm');
    if (editContainerForm) {
        editContainerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const containerId = document.getElementById('editContainerId').value;
            
            // Limpiar mensajes de error previos del modal de edición
            displayFieldError('Descripcion', '', true);
            displayFieldError('FechaRegistro', '', true);
            displayFieldError('TipoResiduo', '', true);
            displayFieldError('TipoContenedor', '', true);

            const editDescripcion = document.getElementById('editDescripcion').value;
            const editFechaRegistro = document.getElementById('editFechaRegistro').value;
            const editTipoResiduoId = parseInt(document.getElementById('editTipoResiduo').value);
            const editTipoContenedorId = parseInt(document.getElementById('editTipoContenedor').value);

            let isValid = true;

            // Validaciones para el modal de edición
            const descripcionError = validateDescripcion(editDescripcion);
            if (descripcionError) {
                displayFieldError('Descripcion', descripcionError, true);
                isValid = false;
            }
            if (!editFechaRegistro) {
                displayFieldError('FechaRegistro', 'La fecha de registro es obligatoria.', true);
                isValid = false;
            }
            if (isNaN(editTipoResiduoId)) {
                displayFieldError('TipoResiduo', 'Debe seleccionar un tipo de residuo.', true);
                isValid = false;
            }
            if (isNaN(editTipoContenedorId)) {
                displayFieldError('TipoContenedor', 'Debe seleccionar un tipo de contenedor.', true);
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            // Obtener nombres y capacidad máxima para guardar en el objeto del contenedor
            const tipoResiduo = TIPO_RESIDUOS_DATA.find(t => t.id === editTipoResiduoId);
            const tipoContenedor = TIPO_CONTENEDORES_DATA.find(t => t.id === editTipoContenedorId);

            const updatedData = {
                descripcion: editDescripcion,
                fecha_registro: editFechaRegistro,
                id_tipo_residuo: editTipoResiduoId,
                tipo_residuo_nombre: tipoResiduo ? tipoResiduo.nombre : 'Desconocido',
                id_tipo_contenedor: editTipoContenedorId,
                tipo_contenedor_nombre: tipoContenedor ? tipoContenedor.nombre : 'Desconocido',
                capacidad_maxima_contenedor: tipoContenedor ? tipoContenedor.capacidad_maxima : null,
            };

            // Encontrar el índice del contenedor y actualizarlo
            let containers = loadContainersFromLocalStorage(); // Cargar la lista actual
            const containerIndex = containers.findIndex(c => c.id === containerId);
            if (containerIndex !== -1) {
                containers[containerIndex] = { ...containers[containerIndex], ...updatedData };
                saveContainersToLocalStorage(containers); // Guardar los cambios en localStorage
                renderContainers(); // Volver a renderizar para reflejar los cambios
                console.log("Contenedor actualizado exitosamente en localStorage!");
                window.closeModal('editContainerModal'); // Usar window.closeModal
            } else {
                console.error("Error: Contenedor no encontrado para actualizar en localStorage.");
            }
        });
    } else {
        console.error("Elemento 'editContainerForm' NO encontrado.");
    }
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
window.populateEditSelects = populateEditSelects; // Exportar para uso en contenedores.html
window.initializeContainersPage = initializeContainersPage; // Exportar la función de inicialización
