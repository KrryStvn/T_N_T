
        let trucks = []; // Array para almacenar los datos de los camiones

        // Función para cargar camiones desde localStorage
        function loadTrucksFromLocalStorage() {
            const storedTrucks = localStorage.getItem('camiones');
            return storedTrucks ? JSON.parse(storedTrucks) : [];
        }

        // Función para guardar camiones en localStorage
        function saveTrucksToLocalStorage(updatedTrucks) {
            localStorage.setItem('camiones', JSON.stringify(updatedTrucks));
        }

        // Función para mostrar/ocultar mensajes de error de campo
        function displayFieldError(fieldId, message, isEditModal = false) {
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

        // Función de validación para el año
        function validateAnio(anio) {
            const currentYear = new Date().getFullYear();
            if (anio === null || isNaN(anio) || anio < 1900 || anio > (currentYear)) {
                return "El año debe ser un número válido entre 1900 y " + (currentYear) + ".";
            }
            return ""; // Sin error
        }

        // Función de validación para la capacidad de carga
        function validateCapacidadCarga(capacidad) {
            if (capacidad === null || isNaN(capacidad) || capacidad <= 0 || capacidad > 200) { // Límite de 200 toneladas
                return "La capacidad de carga debe ser un número positivo, máximo 200 toneladas.";
            }
            return ""; // Sin error
        }

        // Renderizar camiones en la cuadrícula
        function renderTrucks(filteredTrucks = null) {
            const trucksGrid = document.getElementById('trucksGrid');
            trucksGrid.innerHTML = ''; // Limpiar las tarjetas existentes

            const trucksToRender = filteredTrucks || loadTrucksFromLocalStorage(); // Usar filtrados o cargar todos
            trucks = loadTrucksFromLocalStorage(); // Asegurarse de que 'trucks' global siempre tenga todos los datos

            if (trucksToRender.length === 0) {
                trucksGrid.innerHTML = '<p class="text-gray-500 text-center col-span-full">No hay camiones registrados que coincidan con la búsqueda.</p>';
                return;
            }

            trucksToRender.forEach(truck => {
                const truckCard = document.createElement('div');
                truckCard.className = 'truck-card';
                truckCard.innerHTML = `
                    <div class="truck-header">
                        <span class="truck-id">${truck.placa}</span>
                        <!-- Puedes añadir un estado aquí si lo incluyes en tu modelo de datos -->
                        <!-- <span class="truck-status status-active">Activo</span> -->
                    </div>
                    <div class="truck-info">
                        <div class="info-row">
                            <span class="info-label">Marca:</span>
                            <span class="info-value">${truck.marca || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Modelo:</span>
                            <span class="info-value">${truck.modelo || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Año:</span>
                            <span class="info-value">${truck.anio || 'N/A'}</span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Capacidad de Carga:</span>
                            <span class="info-value">${truck.capacidad_carga ? `${truck.capacidad_carga} Ton` : 'N/A'}</span>
                        </div>
                    </div>
                    <div class="truck-actions">
                        <button class="btn-small btn-view" data-id="${truck.id}">Ver Detalles</button>
                        <button class="btn-small btn-edit" data-id="${truck.id}">Editar</button>
                    </div>
                `;
                trucksGrid.appendChild(truckCard);
            });

            // Adjuntar oyentes de eventos a los nuevos botones
            attachButtonListeners();
        }

        // Adjuntar oyentes de eventos a los botones "Ver Detalles" y "Editar"
        function attachButtonListeners() {
            document.querySelectorAll('.btn-view').forEach(button => {
                button.onclick = (event) => {
                    const truckId = event.target.dataset.id;
                    showViewTruckModal(truckId);
                };
            });

            document.querySelectorAll('.btn-edit').forEach(button => {
                button.onclick = (event) => {
                    const truckId = event.target.dataset.id;
                    showEditTruckModal(truckId);
                };
            });
        }

        // Mostrar Modal de Detalles del Camión
        function showViewTruckModal(truckId) {
            const truck = trucks.find(t => t.id === truckId);
            if (!truck) {
                console.error("Camión no encontrado:", truckId);
                return;
            }

            const detailsDiv = document.getElementById('viewTruckDetails');
            detailsDiv.innerHTML = `
                <div class="modal-info-row"><span class="modal-info-label">ID Camión:</span><span class="modal-info-value">${truck.id_camion || truck.id}</span></div>
                <div class="modal-info-row"><span class="modal-info-label">Placa:</span><span class="modal-info-value">${truck.placa}</span></div>
                <div class="modal-info-row"><span class="modal-info-label">Marca:</span><span class="modal-info-value">${truck.marca || 'N/A'}</span></div>
                <div class="modal-info-row"><span class="modal-info-label">Modelo:</span><span class="modal-info-value">${truck.modelo || 'N/A'}</span></div>
                <div class="modal-info-row"><span class="modal-info-label">Año:</span><span class="modal-info-value">${truck.anio || 'N/A'}</span></div>
                <div class="modal-info-row"><span class="modal-info-label">Capacidad de Carga:</span><span class="modal-info-value">${truck.capacidad_carga ? `${truck.capacidad_carga} Ton` : 'N/A'}</span></div>
                <div class="modal-info-row"><span class="modal-info-label">ID Usuario:</span><span class="modal-info-value">${truck.id_usuario || 'N/A'}</span></div>
                <div class="modal-info-row"><span class="modal-info-label">ID Empresa:</span><span class="modal-info-value">${truck.id_empresa || 'N/A'}</span></div>
            `;
            document.getElementById('viewTruckModal').classList.remove('hidden');
        }

        // Mostrar Modal de Edición de Camión
        function showEditTruckModal(truckId) {
            const truck = trucks.find(t => t.id === truckId);
            if (!truck) {
                console.error("Camión no encontrado para editar:", truckId);
                return;
            }

            document.getElementById('editTruckId').value = truck.id;
            document.getElementById('editPlaca').value = truck.placa || '';
            document.getElementById('editMarca').value = truck.marca || '';
            document.getElementById('editModelo').value = truck.modelo || '';
            document.getElementById('editAnio').value = truck.anio || '';
            document.getElementById('editCapacidadCarga').value = truck.capacidad_carga || '';

            // Limpiar errores previos al abrir el modal de edición
            displayFieldError('Placa', '', true);
            displayFieldError('Marca', '', true);
            displayFieldError('Modelo', '', true);
            displayFieldError('Anio', '', true);
            displayFieldError('CapacidadCarga', '', true);

            document.getElementById('editTruckModal').classList.remove('hidden');
        }

        // Función para cerrar cualquier modal
        function closeModal(modalId) {
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                modalElement.classList.add('hidden');
            }
        }
        // Hacer la función closeModal globalmente accesible
        window.closeModal = closeModal;


        // Manejar el envío del formulario de Edición de Camión
        document.getElementById('editTruckForm').addEventListener('submit', (event) => {
            event.preventDefault();
            const truckId = document.getElementById('editTruckId').value;
            
            // Limpiar mensajes de error previos del modal de edición
            displayFieldError('Placa', '', true);
            displayFieldError('Marca', '', true);
            displayFieldError('Modelo', '', true);
            displayFieldError('Anio', '', true);
            displayFieldError('CapacidadCarga', '', true);

            const editPlaca = document.getElementById('editPlaca').value;
            const editMarca = document.getElementById('editMarca').value;
            const editModelo = document.getElementById('editModelo').value;
            const editAnio = parseInt(document.getElementById('editAnio').value);
            const editCapacidadCarga = parseFloat(document.getElementById('editCapacidadCarga').value);

            let isValid = true;

            // Validaciones para el modal de edición
            if (!editPlaca) {
                displayFieldError('Placa', 'La placa es obligatoria.', true);
                isValid = false;
            }

            const anioError = validateAnio(editAnio);
            if (anioError) {
                displayFieldError('Anio', anioError, true);
                isValid = false;
            }

            const capacidadCargaError = validateCapacidadCarga(editCapacidadCarga);
            if (capacidadCargaError) {
                displayFieldError('CapacidadCarga', capacidadCargaError, true);
                isValid = false;
            }

            if (!isValid) {
                // No hay un messageBox general en el modal, los errores se muestran por campo
                return;
            }

            const updatedData = {
                placa: editPlaca,
                marca: editMarca,
                modelo: editModelo,
                anio: editAnio,
                capacidad_carga: editCapacidadCarga,
            };

            // Encontrar el índice del camión y actualizarlo
            const truckIndex = trucks.findIndex(t => t.id === truckId);
            if (truckIndex !== -1) {
                trucks[truckIndex] = { ...trucks[truckIndex], ...updatedData };
                saveTrucksToLocalStorage(trucks); // Guardar los cambios en localStorage
                renderTrucks(); // Volver a renderizar para reflejar los cambios
                console.log("Camión actualizado exitosamente en localStorage!");
                closeModal('editTruckModal');
            } else {
                console.error("Error: Camión no encontrado para actualizar en localStorage.");
            }
        });

        // Función para manejar la búsqueda (ahora llamada en tiempo real)
        function handleSearch() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
            const allTrucks = loadTrucksFromLocalStorage();
            
            if (searchTerm === "") {
                renderTrucks(allTrucks); // Si el campo de búsqueda está vacío, mostrar todos los camiones
                return;
            }

            const filteredTrucks = allTrucks.filter(truck => {
                // Se busca en ID, placa, marca, modelo.
                // 'conductor' se mantiene por si se añade en el futuro
                return (
                    (truck.id && truck.id.toLowerCase().includes(searchTerm)) ||
                    (truck.placa && truck.placa.toLowerCase().includes(searchTerm)) ||
                    (truck.marca && truck.marca.toLowerCase().includes(searchTerm)) ||
                    (truck.modelo && truck.modelo.toLowerCase().includes(searchTerm)) ||
                    (truck.conductor && truck.conductor.toLowerCase().includes(searchTerm)) // Incluido por si se añade este campo
                );
            });
            renderTrucks(filteredTrucks); // Renderizar solo los camiones filtrados
        }
        // Hacer la función handleSearch globalmente accesible para oninput
        window.handleSearch = handleSearch;


        // Redirigir a la página de Nuevo Camión
        document.getElementById('newTruckBtn').addEventListener('click', () => {
            window.location.href = 'registrarCamion.html';
        });

        // Cargar y renderizar camiones cuando la ventana se carga
        window.onload = () => {
            let currentTrucks = loadTrucksFromLocalStorage();
            if (currentTrucks.length === 0) {
                // Si no hay camiones en localStorage, precargar algunos datos de ejemplo
                const initialTrucks = [
                    { id: 'CAM-001', id_camion: 'CAM-001', placa: 'ABC-123-XYZ', marca: 'Volvo', modelo: 'FH16', anio: 2023, capacidad_carga: 25.5, id_usuario: 'simulated-user-id', id_empresa: 'simulated-company-id' },
                    { id: 'CAM-002', id_camion: 'CAM-002', placa: 'DEF-456-UVW', marca: 'Mercedes-Benz', modelo: 'Actros', anio: 2022, capacidad_carga: 30.0, id_usuario: 'simulated-user-id', id_empresa: 'simulated-company-id' },
                    { id: 'CAM-003', id_camion: 'CAM-003', placa: 'GHI-789-RST', marca: 'Scania', modelo: 'R 500', anio: 2021, capacidad_carga: 28.0, id_usuario: 'simulated-user-id', id_empresa: 'simulated-company-id' },
                    { id: 'CAM-004', id_camion: 'CAM-004', placa: 'JKL-012-GHI', marca: 'Ford', modelo: 'Cargo', anio: 2020, capacidad_carga: 15.0, id_usuario: 'simulated-user-id', id_empresa: 'simulated-company-id' }
                ];
                saveTrucksToLocalStorage(initialTrucks);
                console.log("Se cargaron datos iniciales de camiones en localStorage.");
            }
            renderTrucks(); // Renderiza los camiones (ya sea los cargados o los iniciales)
        };

       