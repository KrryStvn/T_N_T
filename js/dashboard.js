
    // Performance Chart (Line Chart)
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Zona Norte', 'Zona Centro', 'Zona Sur', 'Zona Este', 'Zona Oeste', 'Industrial'],
            datasets: [{
                label: 'Nivel promedio (%)',
                data: [50, 75, 60, 90, 70, 95],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: 'Capacidad máxima (%)',
                data: [100, 100, 100, 100, 100, 100],
                borderColor: '#64748b',
                backgroundColor: 'rgba(100, 116, 139, 0.1)',
                tension: 0.4,
                fill: false,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        font: {
                            size: 10
                        },
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });

    // Distribution Chart (Doughnut Chart)
    const distributionCtx = document.getElementById('distributionChart').getContext('2d');
    new Chart(distributionCtx, {
        type: 'doughnut',
        data: {
            labels: ['Vacío (0-25%)', 'Medio (26-75%)', 'Lleno (76-100%)'],
            datasets: [{
                data: [120, 180, 42],
                backgroundColor: [
                    '#10b981',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: {
                            size: 11
                        },
                        padding: 10
                    }
                }
            }
        }
    });

    // Analytics Chart (Bar Chart)
    const analyticsCtx = document.getElementById('analyticsChart').getContext('2d');
    new Chart(analyticsCtx, {
        type: 'bar',
        data: {
            labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
            datasets: [{
                label: 'Toneladas recolectadas',
                data: [12.5, 15.2, 18.1, 22.3, 19.8, 14.6, 8.2],
                backgroundColor: '#22d3ee',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 10
                        },
                        callback: function(value) {
                            return value + 't';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                }
            }
        }
    });

    // Simulated real-time data updates
    function updateDashboardData() {
        console.log('Actualizando datos del dashboard de residuos...');
    }

    // Actualizar datos cada 30 segundos
    setInterval(updateDashboardData, 30000);

    // Event listeners para navegación
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            console.log('Navegando a:', this.textContent.trim());
        });
    });
