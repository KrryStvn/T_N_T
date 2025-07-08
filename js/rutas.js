
        // Filter functionality
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                console.log('Filtro aplicado:', this.textContent);
            });
        });

        // Search functionality
        document.querySelector('.search-box input').addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            console.log('Buscando:', searchTerm);
            // Aquí tu amigo puede implementar la lógica de búsqueda
        });

        // Route item click
        document.querySelectorAll('.route-item').forEach(item => {
            item.addEventListener('click', function() {
                const routeNumber = this.querySelector('.route-number').textContent;
                console.log('Ruta seleccionada:', routeNumber);
                // Aquí se puede abrir un modal con detalles completos
            });
        });

        // New route button
        document.querySelector('.btn-primary').addEventListener('click', function() {
            console.log('Crear nueva ruta');
            // Aquí se puede abrir un formulario para nueva ruta
        });

        // Simulate real-time updates
        function updateRouteProgress() {
            const activeRoutes = document.querySelectorAll('.progress-active');
            activeRoutes.forEach(progress => {
                const currentWidth = parseInt(progress.style.width);
                if (currentWidth < 100) {
                    progress.style.width = (currentWidth + Math.random() * 2) + '%';
                }
            });
        }

        // Update progress every 10 seconds
        setInterval(updateRouteProgress, 10000);
  