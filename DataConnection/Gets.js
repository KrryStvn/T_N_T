
// Función auxiliar para todas las llamadas GET
async function fetchData(endpoint){
    var url = config.api.url + endpoint;
    console.log(`Intentando GET desde: ${url}`);

    try {
        const response = await fetch(url);

        // Verificar si la respuesta fue exitosa (código de estado 2xx)
        if (!response.ok) {
            const errorText = await response.text(); // Intentar leer el cuerpo del error
            const errorMessage = `Error HTTP ${response.status}: ${errorText || response.statusText}`;
            console.error(`Error al obtener datos desde ${url}:`, errorMessage);
            throw new Error(errorMessage); // Lanzar el error para que sea capturado por el llamador
        }

        const result = await response.json();
        console.log(`Datos obtenidos de ${url}:`, result);
        return result;
    } catch (error) {
        console.error("Error al realizar la solicitud GET:", error);
        throw error; // Re-lanzar el error para que el llamador pueda manejarlo
    }
}

// =======================================
// GETS PARA Usuarios
// =======================================
 async function getUsuarios() {
    return fetchData("Usuarios");
}

 async function getUserById(id) {
    return fetchData(`Usuarios/${id}`);
}

// =======================================
// GETS PARA SENSORES
// =======================================
 async function getSensores() {
    return fetchData("Sensores");
}

 async function getSensoresById(id) {
    return fetchData(`Sensores/`+id);
}

 async function getSensoresByContenedor(contenedorId){
    return fetchData(`Sensores/por-contenedor`+contenedorId);
}

// =======================================
// GETS PARA RUTAS
// =======================================
 async function getRutas() {
    return fetchData("Rutas");
}

 async function getRutasById(id) {
    return fetchData(`Rutas/`+id);
}

 async function getRutasByEmpresa(empresaId){
    return fetchData(`Sensores/por-contenedor`+empresaId);
}

 async function getRutasByPlanta(plantaId){
    return fetchData(`Sensores/por-contenedor`+plantaId);
}

// =======================================
// GETS PARA REPORTES
// =======================================
 async function getReportes() {
    return fetchData("Reportes");
}

 async function getReportesById(id) {
    return fetchData(`Reportes/`+id);
}

 async function getReportesByUsuario(usuarioId){
    return fetchData(`Reportes/por-contenedor`+usuarioId);
}

 async function getReportesByFecha() {
    return fetchData(`Reportes/por-fecha`);
}

 async function getReportesByUid(firebaseUid){
    return fetchData(`Reportes/uid`+firebaseUid);
}

// =======================================
// GETS PARA PLANTAS
// =======================================
 async function getPlantas() {
    return fetchData("Plantas");
}

 async function getPlantasById(id) {
    return fetchData(`Plantas/`+id);
}

 async function getPlantasByUbicacion(ubicacionId){
    return fetchData(`Plantas/por-contenedor`+ubicacionId);
}

// =======================================
// GETS PARA ITINERARIOS
// =======================================
 async function getItinerarios() {
    return fetchData("Itinerarios");
}

 async function getItinerariosById(id) {
    return fetchData(`Itinerarios/`+id);
}

 async function getItinerariosByUsuario(usuarioId){
    return fetchData(`Itinerarios/por-contenedor`+usuarioId);
}

 async function getItinerariosByRuta(rutaId){
    return fetchData(`Itinerarios/por-ruta`+rutaId);
}

 async function getItinerariosByEstado(estado){
    return fetchData(`Itinerarios/por-ruta`+estado);
}

// =======================================
// GETS PARA INCIDENTES
// =======================================
 async function getIncidentes() {
    return fetchData("Incidentes");
}

 async function getIncidentesById(id) {
    return fetchData(`Incidentes/`+id);
}

 async function getIncidentesByUsuario(usuarioId){
    return fetchData(`Incidentes/por-usuario`+usuarioId);
}

 async function getIncidentesByFecha() {
    return fetchData(`Incidentes/por-fecha`);
}

// =======================================
// GETS PARA EMPRESAS
// =======================================
 async function getEmpresas() {
    return fetchData("Empresas");
}

 async function getEmpresasById(id) {
    return fetchData(`Empresas/`+id);
}

 async function getEmpresasByUbicacion(ubicacionId){
    return fetchData(`Empresas/por-usuario`+ubicacionId);
}
/*
 async function getEmpresasByNombre() {
    return fetchData("Empresas/buscar");
}
*/

// =======================================
// GETS PARA CONTENEDORES
// =======================================
 async function getContenedores() {
    return fetchData("Containers");
}

 async function getContenedoresById(id) {
    return fetchData(`Containers/${id}`);
}

 async function getContenedoresByEmpresa(idEmpresa){
    return fetchData(`Containers/`+idEmpresa);
}
 async function getContenedoresByTipoResiduo(tipoResiduoId){
    return fetchData(`Containers/por-tipo-residuo/`+tipoResiduoId);
}
 async function getContenedoresByEstado(estado){
    return fetchData(`Containers/por-estado/`+estado);
}

// =======================================
// GETS PARA CAMIONES
// =======================================
 async function getCamiones() {
    return fetchData("Camiones");
}

 async function getCamionesById(id) {
    return fetchData(`Camiones/${id}`);
}

// =======================================
// GETS PARA ALERTAS
// =======================================
 async function getAletas() {
    return fetchData("Alertas");
}

 async function getAlertasById(id) {
    return fetchData(`Alertas/`+id);
}

 async function getAlertasBySensor(sensorId){
    return fetchData(`Alertas/por-sensor/`+sensorId);
}

 async function getAlertasByTipo(tipoAlerta){
    return fetchData(`Alertas/por-tipo/`+tipoAlerta);
}
 async function getAletasByFecha() {
    return fetchData("Alertas/por-fecha");
}