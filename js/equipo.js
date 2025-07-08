
        // Search functionality
        document.querySelector('.search-box input').addEventListener('input', function(e) {
            console.log('Buscando empleado:', e.target.value);
        });

        // Team card clicks
        document.querySelectorAll('.team-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.classList.contains('action-btn')) {
                    const employeeName = this.querySelector('h3').textContent;
                    console.log('Ver detalles de empleado:', employeeName);
                }
            });
        });

        // Action buttons
        document.querySelectorAll('.btn-contact').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const employeeName = this.closest('.team-card').querySelector('h3').textContent;
                console.log('Contactar a:', employeeName);
            });
        });

        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const employeeName = this.closest('.team-card').querySelector('h3').textContent;
                console.log('Editar información de:', employeeName);
            });
        });

        // New employee button
        document.querySelector('.btn-primary').addEventListener('click', function() {
            console.log('Registrar nuevo empleado');
        });

        // Schedule button
        document.querySelector('.btn-secondary').addEventListener('click', function() {
            console.log('Ver horarios completos');
        });

        // Simulate status updates
        function updateEmployeeStatus() {
            const statusElements = document.querySelectorAll('.member-status');
            statusElements.forEach(element => {
                // Simulate occasional status changes
                if (Math.random() < 0.1) {
                    console.log('Estado actualizado para empleado');
                }
            });
        }

        // Update every 60 seconds
        setInterval(updateEmployeeStatus, 60000);
