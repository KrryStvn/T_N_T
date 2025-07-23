// API Configuration

// Sample data structure matching your C# Incidente model
let incidentes = []
let filteredIncidentes = []
let usuarios = []

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

async function initializeApp() {
  setupEventListeners()
  await loadInitialData()
  showSection("incidentes-dashboard")
  updateIncidentesStats()
}

// Load initial data from your C# API
async function loadInitialData() {
  try {
    showLoading()

    // Load incidentes from your API - GetAll method
    const incidentesResponse = await fetch(`${API_BASE_URL}/incidentes`)
    if (incidentesResponse.ok) {
      const data = await incidentesResponse.json()
      incidentes = data.data || data // Handle both response formats
      filteredIncidentes = [...incidentes]
    }

    // Load usuarios for dropdowns
    const usuariosResponse = await fetch(`${API_BASE_URL}/usuarios`)
    if (usuariosResponse.ok) {
      usuarios = await usuariosResponse.json()
      populateUsuariosDropdowns()
    }

    hideLoading()
  } catch (error) {
    console.error("Error loading initial data:", error)
    hideLoading()
    showToast("Error al cargar los datos iniciales", "error")

    // Fallback to sample data if API is not available
    loadSampleIncidentesData()
  }
}

// Fallback sample data matching your C# Incidente model
function loadSampleIncidentesData() {
  incidentes = [
    {
      idIncidente: 1,
      nombre: "Accidente en Ruta Norte",
      fechaIncidente: "2024-01-15T14:30:00",
      photoUrl: "https://example.com/photo1.jpg",
      descripcion: "Colisión menor en la intersección principal",
      idUsuario: 1,
    },
    {
      idIncidente: 2,
      nombre: "Falla Mecánica Camión 001",
      fechaIncidente: "2024-01-16T09:15:00",
      photoUrl: "",
      descripcion: "Problema en el sistema de frenos durante la ruta",
      idUsuario: 2,
    },
    {
      idIncidente: 3,
      nombre: "Derrame de Combustible",
      fechaIncidente: "2024-01-17T16:45:00",
      photoUrl: "https://example.com/photo3.jpg",
      descripcion: "Pequeño derrame durante la carga de combustible",
      idUsuario: 1,
    },
    {
      idIncidente: 4,
      nombre: "Retraso por Tráfico",
      fechaIncidente: "2024-01-18T11:20:00",
      photoUrl: "",
      descripcion: "Retraso significativo debido a congestión vehicular",
      idUsuario: 3,
    },
    {
      idIncidente: 5,
      nombre: "Daño en Carga",
      fechaIncidente: "2024-01-19T13:10:00",
      photoUrl: "https://example.com/photo5.jpg",
      descripcion: "Daño menor en la mercancía durante el transporte",
      idUsuario: 2,
    },
  ]

  usuarios = [
    { id: 1, nombre: "Juan Pérez" },
    { id: 2, nombre: "María García" },
    { id: 3, nombre: "Carlos López" },
  ]

  filteredIncidentes = [...incidentes]
  populateUsuariosDropdowns()
}

function populateUsuariosDropdowns() {
  const dropdowns = ["usuarioIncidentesFilter", "selectUsuarioIncidentes"]

  dropdowns.forEach((dropdownId) => {
    const dropdown = document.getElementById(dropdownId)
    if (dropdown) {
      // Clear existing options except the first one
      const firstOption = dropdown.querySelector('option[value=""]')
      dropdown.innerHTML = ""
      if (firstOption) {
        dropdown.appendChild(firstOption)
      }

      usuarios.forEach((usuario) => {
        const option = document.createElement("option")
        option.value = usuario.id
        option.textContent = usuario.nombre || `Usuario ${usuario.id}`
        dropdown.appendChild(option)
      })
    }
  })
}

function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault()
      const section = button.dataset.section
      showSection(section)

      // Update active state in tabs
      document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"))
      button.classList.add("active")
    })
  })

  // Sidebar toggle for mobile
  const sidebarToggle = document.getElementById("sidebarToggle")
  const sidebar = document.querySelector(".sidebar")

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open")
  })

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
      sidebar.classList.remove("open")
    }
  })
}

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active")
  })

  // Show selected section
  const targetSection = document.getElementById(sectionId)
  if (targetSection) {
    targetSection.classList.add("active")
  }

  // Load section-specific data
  switch (sectionId) {
    case "incidentes-dashboard":
      loadIncidentesDashboard()
      break
    case "incidentes-lista":
      loadIncidentesList()
      break
  }
}

function updateIncidentesStats() {
  const totalIncidentes = incidentes.length
  
  // Calculate incidents today
  const today = new Date().toDateString()
  const incidentesHoy = incidentes.filter((inc) => {
    const incidenteDate = new Date(inc.fechaIncidente).toDateString()
    return incidenteDate === today
  }).length

  // Calculate unique users with incidents
  const usuariosConIncidentes = new Set(incidentes.map((inc) => inc.idUsuario)).size

  // Calculate incidents with photos
  const incidentesConFoto = incidentes.filter((inc) => inc.photoUrl && inc.photoUrl.trim() !== "").length

  document.getElementById("totalIncidentes").textContent = totalIncidentes
  document.getElementById("incidentesHoy").textContent = incidentesHoy
  document.getElementById("usuariosConIncidentes").textContent = usuariosConIncidentes
  document.getElementById("incidentesConFoto").textContent = incidentesConFoto
}

function loadIncidentesDashboard() {
  // Load recent incidents
  const incidentesRecientes = document.getElementById("incidentesRecientes")
  incidentesRecientes.innerHTML = ""

  const recientes = incidentes.slice(-5).reverse()
  recientes.forEach((incidente) => {
    const usuario = usuarios.find((u) => u.id === incidente.idUsuario)

    const item = document.createElement("div")
    item.className = "recent-item"
    item.innerHTML = `
      <div class="recent-info">
        <h4>${incidente.nombre}</h4>
        <p>Usuario: ${usuario?.nombre || `ID ${incidente.idUsuario}`} • ${formatDate(incidente.fechaIncidente)}</p>
        <small>${incidente.descripcion}</small>
      </div>
      ${incidente.photoUrl ? '<i class="fas fa-camera" style="color: #10b981;"></i>' : ''}
    `
    incidentesRecientes.appendChild(item)
  })

  // Load incidents by user
  const incidentesPorUsuario = document.getElementById("incidentesPorUsuario")
  incidentesPorUsuario.innerHTML = ""

  const usuariosMap = {}
  incidentes.forEach((incidente) => {
    if (!usuariosMap[incidente.idUsuario]) {
      usuariosMap[incidente.idUsuario] = []
    }
    usuariosMap[incidente.idUsuario].push(incidente)
  })

  Object.entries(usuariosMap).forEach(([usuarioId, incidentesList]) => {
    const usuario = usuarios.find((u) => u.id == usuarioId)
    const usuarioNombre = usuario ? usuario.nombre : `Usuario ${usuarioId}`

    const card = document.createElement("div")
    card.className = "user-incidents-card"
    card.innerHTML = `
      <div class="user-incidents-header">
        <i class="fas fa-user"></i>
        <h3>${usuarioNombre}</h3>
      </div>
      <div class="user-incidents-count">${incidentesList.length} incidente(s)</div>
      <div class="user-incidents-recent">
        Último: ${formatDate(incidentesList[incidentesList.length - 1].fechaIncidente)}
      </div>
    `
    incidentesPorUsuario.appendChild(card)
  })
}

async function loadIncidentesList() {
  try {
    // Refresh data from API
    const response = await fetch(`${API_BASE_URL}/incidentes`)
    if (response.ok) {
      const data = await response.json()
      incidentes = data.data || data
      filteredIncidentes = [...incidentes]
    }
  } catch (error) {
    console.error("Error loading incidentes:", error)
  }

  const grid = document.getElementById("incidentesGrid")
  grid.innerHTML = ""

  filteredIncidentes.forEach((incidente) => {
    const card = createIncidenteCard(incidente)
    grid.appendChild(card)
  })
}

function createIncidenteCard(incidente) {
  const usuario = usuarios.find((u) => u.id === incidente.idUsuario)

  const card = document.createElement("div")
  card.className = "incident-card"
  card.innerHTML = `
    <div class="incident-header">
      <div>
        <div class="incident-title">${incidente.nombre}</div>
        <div class="incident-date">${formatDate(incidente.fechaIncidente)}</div>
      </div>
      ${incidente.photoUrl ? '<i class="fas fa-camera" style="color: #10b981;"></i>' : ''}
    </div>
    <div class="incident-details">
      <div class="incident-detail">
        <i class="fas fa-user"></i>
        <span>Usuario: ${usuario?.nombre || `ID ${incidente.idUsuario}`}</span>
      </div>
      <div class="incident-detail">
        <i class="fas fa-info-circle"></i>
        <span>${incidente.descripcion}</span>
      </div>
      ${incidente.photoUrl ? `
        <div class="incident-detail">
          <i class="fas fa-link"></i>
          <a href="${incidente.photoUrl}" target="_blank" style="color: #3b82f6;">Ver foto</a>
        </div>
      ` : ''}
    </div>
    <div class="incident-actions">
      <button class="btn btn-outline" onclick="viewIncidente(${incidente.idIncidente})">
        <i class="fas fa-eye"></i>
        Ver Detalles
      </button>
    </div>
  `
  return card
}

function filterIncidentes() {
  const searchTerm = document.getElementById("searchIncidentesInput").value.toLowerCase()
  const usuarioFilter = document.getElementById("usuarioIncidentesFilter").value
  const fechaFilter = document.getElementById("fechaIncidentesFilter").value

  filteredIncidentes = incidentes.filter((incidente) => {
    const matchesSearch =
      incidente.nombre.toLowerCase().includes(searchTerm) ||
      incidente.descripcion.toLowerCase().includes(searchTerm)

    const matchesUsuario = !usuarioFilter || incidente.idUsuario.toString() === usuarioFilter

    let matchesFecha = true
    if (fechaFilter) {
      const incidenteDate = new Date(incidente.fechaIncidente)
      const today = new Date()
      
      switch (fechaFilter) {
        case "hoy":
          matchesFecha = incidenteDate.toDateString() === today.toDateString()
          break
        case "semana":
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesFecha = incidenteDate >= weekAgo
          break
        case "mes":
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesFecha = incidenteDate >= monthAgo
          break
      }
    }

    return matchesSearch && matchesUsuario && matchesFecha
  })

  loadIncidentesList()
}

// POST /api/incidentes - Create new incident using the Create method
async function saveIncidente(event) {
  event.preventDefault()
  showLoading()

  const formData = {
    nombre: document.getElementById("incidenteNombre").value,
    fechaIncidente: new Date(document.getElementById("incidenteFechaIncidente").value).toISOString(),
    photoUrl: document.getElementById("incidentePhotoUrl").value || "",
    descripcion: document.getElementById("incidenteDescripcion").value,
    idUsuario: parseInt(document.getElementById("incidenteIdUsuario").value),
  }

  try {
    const response = await fetch(`${API_BASE_URL}/incidentes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      const result = await response.json()
      
      // Add the new incident to local data
      const newIncidente = { ...formData, idIncidente: result.data.id }
      incidentes.push(newIncidente)
      filteredIncidentes = [...incidentes]

      updateIncidentesStats()
      loadIncidentesDashboard()
      document.getElementById("incidenteForm").reset()
      showSection("incidentes-lista")
      showToast("Incidente creado correctamente", "success")
    } else {
      const errorData = await response.json()
      showToast(`Error: ${errorData.message || "No se pudo crear el incidente"}`, "error")
    }
  } catch (error) {
    console.error("Error creating incidente:", error)
    showToast("Error de conexión al crear el incidente", "error")
  } finally {
    hideLoading()
  }
}

// GET /api/incidentes/{id} - Get incident by ID using GetById method
async function viewIncidente(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/incidentes/${id}`)
    if (response.ok) {
      const result = await response.json()
      const incidente = result.data
      
      alert(`
Incidente: ${incidente.nombre}
Fecha: ${formatDate(incidente.fechaIncidente)}
Usuario ID: ${incidente.idUsuario}
Descripción: ${incidente.descripcion}
${incidente.photoUrl ? `Foto: ${incidente.photoUrl}` : 'Sin foto'}
      `)
    }
  } catch (error) {
    console.error("Error loading incidente:", error)
    showToast("Error al cargar los detalles del incidente", "error")
  }
}

// GET /api/incidentes/usuario/{usuarioId} - Get incidents by user using GetByUsuario method
async function loadIncidentesByUsuario() {
  const usuarioId = document.getElementById("selectUsuarioIncidentes").value
  if (!usuarioId) {
    document.getElementById("incidentesUsuarioGrid").innerHTML = 
      '<p class="text-muted">Selecciona un usuario para ver sus incidentes</p>'
    return
  }

  try {
    showLoading()
    const response = await fetch(`${API_BASE_URL}/incidentes/usuario/${usuarioId}`)
    if (response.ok) {
      const result = await response.json()
      const incidentesUsuario = result.data || []
      
      const grid = document.getElementById("incidentesUsuarioGrid")
      grid.innerHTML = ""

      if (incidentesUsuario.length === 0) {
        grid.innerHTML = '<p class="text-muted">Este usuario no tiene incidentes registrados</p>'
      } else {
        incidentesUsuario.forEach((incidente) => {
          const card = createIncidenteCard(incidente)
          grid.appendChild(card)
        })
      }
    }
    hideLoading()
  } catch (error) {
    console.error("Error loading incidentes by usuario:", error)
    hideLoading()
    showToast("Error al cargar incidentes del usuario", "error")
  }
}

// GET /api/incidentes/fecha - Get incidents by date range using GetByDateRange method
async function loadIncidentesByDateRange() {
  const fechaInicio = document.getElementById("fechaInicio").value
  const fechaFin = document.getElementById("fechaFin").value

  if (!fechaInicio || !fechaFin) {
    showToast("Por favor selecciona ambas fechas", "warning")
    return
  }

  try {
    showLoading()
    const response = await fetch(`${API_BASE_URL}/incidentes/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
    if (response.ok) {
      const result = await response.json()
      const incidentesFecha = result.data || []
      
      const resultsDiv = document.getElementById("incidentesFechaResults")
      resultsDiv.innerHTML = ""

      if (incidentesFecha.length === 0) {
        resultsDiv.innerHTML = '<p class="text-muted">No se encontraron incidentes en el rango de fechas seleccionado</p>'
      } else {
        incidentesFecha.forEach((incidente) => {
          const usuario = usuarios.find((u) => u.id === incidente.idUsuario)
          const item = document.createElement("div")
          item.className = "recent-item"
          item.innerHTML = `
            <div class="recent-info">
              <h4>${incidente.nombre}</h4>
              <p>Usuario: ${usuario?.nombre || `ID ${incidente.idUsuario}`} • ${formatDate(incidente.fechaIncidente)}</p>
              <small>${incidente.descripcion}</small>
            </div>
            ${incidente.photoUrl ? '<i class="fas fa-camera" style="color: #10b981;"></i>' : ''}
          `
          resultsDiv.appendChild(item)
        })
      }
    }
    hideLoading()
  } catch (error) {
    console.error("Error loading incidentes by date range:", error)
    hideLoading()
    showToast("Error al cargar incidentes por fecha", "error")
  }
}

function performIncidentesSearch() {
  const searchByNombre = document.getElementById("searchByNombreIncidente").value.toLowerCase()
  const searchByDescripcion = document.getElementById("searchByDescripcionIncidente").value.toLowerCase()
  const searchByIdUsuario = document.getElementById("searchByIdUsuarioIncidente").value
  const searchByPhotoUrl = document.getElementById("searchByPhotoUrl").value

  let results = incidentes

  if (searchByNombre) {
    results = results.filter((incidente) => incidente.nombre.toLowerCase().includes(searchByNombre))
  }

  if (searchByDescripcion) {
    results = results.filter((incidente) => incidente.descripcion.toLowerCase().includes(searchByDescripcion))
  }

  if (searchByIdUsuario) {
    results = results.filter((incidente) => incidente.idUsuario.toString() === searchByIdUsuario)
  }

  if (searchByPhotoUrl) {
    if (searchByPhotoUrl === "con_foto") {
      results = results.filter((incidente) => incidente.photoUrl && incidente.photoUrl.trim() !== "")
    } else if (searchByPhotoUrl === "sin_foto") {
      results = results.filter((incidente) => !incidente.photoUrl || incidente.photoUrl.trim() === "")
    }
  }

  const searchResults = document.getElementById("incidentesSearchResults")
  searchResults.innerHTML = ""

  if (results.length === 0) {
    searchResults.innerHTML = '<p class="text-muted">No se encontraron resultados</p>'
  } else {
    results.forEach((incidente) => {
      const usuario = usuarios.find((u) => u.id === incidente.idUsuario)

      const item = document.createElement("div")
      item.className = "recent-item"
      item.innerHTML = `
        <div class="recent-info">
          <h4>${incidente.nombre}</h4>
          <p>Usuario: ${usuario?.nombre || `ID ${incidente.idUsuario}`} • ${formatDate(incidente.fechaIncidente)}</p>
          <small>${incidente.descripcion}</small>
        </div>
        ${incidente.photoUrl ? '<i class="fas fa-camera" style="color: #10b981;"></i>' : ''}
      `
      searchResults.appendChild(item)
    })
  }
}

function resetIncidenteForm() {
  document.getElementById("incidenteForm").reset()
  // Set current date and time as default
  document.getElementById("incidenteFechaIncidente").value = new Date().toISOString().slice(0, 16)
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function showLoading() {
  document.getElementById("loadingSpinner").style.display = "flex"
}

function hideLoading() {
  document.getElementById("loadingSpinner").style.display = "none"
}

function showToast(message, type = "success") {
  const toast = document.createElement("div")
  toast.className = `toast ${type}`
  toast.innerHTML = `
    <strong>${type === "success" ? "Éxito" : type === "error" ? "Error" : "Advertencia"}</strong>
    <p>${message}</p>
  `

  document.getElementById("toastContainer").appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}
