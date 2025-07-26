import { config } from './Config.js';

// Función auxiliar para todas las llamadas GET
async function fetchData(endpoint){
    var url = config.api.url + endpoint;
    console.log(url);

    return await fetch (url)
    .then ((result)=>{return result.json(); })
    .catch ((error)=> {console.log(error)});
}

// =======================================
// GETS PARA Usuarios
// =======================================
export async function getUsuarios() {
    return fetchData("Usuarios");
}

export async function getUserById(id) {
    return fetchData(`Usuarios/${id}`);
}

// =======================================
// GETS PARA SENSORES
// =======================================
export async function getSensores() {
    return fetchData("Sensores");
}

export async function getSensoresById(id) {
    return fetchData(`Sensores/`+id);
}

export async function getSensoresByContenedor(contenedorId){
    return fetchData(`Sensores/por-contenedor`+contenedorId);
}

// =======================================
// GETS PARA RUTAS
// =======================================
export async function getRutas() {
    return fetchData("Rutas");
}

export async function getRutasById(id) {
    return fetchData(`Rutas/`+id);
}

export async function getRutasByEmpresa(empresaId){
    return fetchData(`Sensores/por-contenedor`+empresaId);
}

export async function getRutasByPlanta(plantaId){
    return fetchData(`Sensores/por-contenedor`+plantaId);
}

// =======================================
// GETS PARA REPORTES
// =======================================
export async function getReportes() {
    return fetchData("Reportes");
}

export async function getReportesById(id) {
    return fetchData(`Reportes/`+id);
}

export async function getReportesByUsuario(usuarioId){
    return fetchData(`Reportes/por-contenedor`+usuarioId);
}

export async function getReportesByFecha() {
    return fetchData(`Reportes/por-fecha`);
}

export async function getReportesByUid(firebaseUid){
    return fetchData(`Reportes/uid`+firebaseUid);
}

// =======================================
// GETS PARA PLANTAS
// =======================================
export async function getPlantas() {
    return fetchData("Plantas");
}

export async function getPlantasById(id) {
    return fetchData(`Plantas/`+id);
}

export async function getPlantasByUbicacion(ubicacionId){
    return fetchData(`Plantas/por-contenedor`+ubicacionId);
}

// =======================================
// GETS PARA ITINERARIOS
// =======================================
export async function getItinerarios() {
    return fetchData("Itinerarios");
}

export async function getItinerariosById(id) {
    return fetchData(`Itinerarios/`+id);
}

export async function getItinerariosByUsuario(usuarioId){
    return fetchData(`Itinerarios/por-contenedor`+usuarioId);
}

export async function getItinerariosByRuta(rutaId){
    return fetchData(`Itinerarios/por-ruta`+rutaId);
}

export async function getItinerariosByEstado(estado){
    return fetchData(`Itinerarios/por-ruta`+estado);
}

// =======================================
// GETS PARA INCIDENTES
// =======================================
export async function getIncidentes() {
    return fetchData("Incidentes");
}

export async function getIncidentesById(id) {
    return fetchData(`Incidentes/`+id);
}

export async function getIncidentesByUsuario(usuarioId){
    return fetchData(`Incidentes/por-usuario`+usuarioId);
}

export async function getIncidentesByFecha() {
    return fetchData(`Incidentes/por-fecha`);
}

// =======================================
// GETS PARA EMPRESAS
// =======================================
export async function getEmpresas() {
    return fetchData("Empresas");
}

export async function getEmpresasById(id) {
    return fetchData(`Empresas/`+id);
}

export async function getEmpresasByUbicacion(ubicacionId){
    return fetchData(`Empresas/por-usuario`+ubicacionId);
}
/*
export async function getEmpresasByNombre() {
    return fetchData("Empresas/buscar");
}
*/

// =======================================
// GETS PARA CONTENEDORES
// =======================================
export async function getContenedores() {
    return fetchData("Containers");
}

export async function getContenedoresById(id) {
    return fetchData(`Containers/${id}`);
}

export async function getContenedoresByEmpresa(idEmpresa){
    return fetchData(`Containers/`+idEmpresa);
}
export async function getContenedoresByTipoResiduo(tipoResiduoId){
    return fetchData(`Containers/por-tipo-residuo/`+tipoResiduoId);
}
export async function getContenedoresByEstado(estado){
    return fetchData(`Containers/por-estado/`+estado);
}

// =======================================
// GETS PARA CAMIONES
// =======================================
export async function getCamiones() {
    return fetchData("Camiones");
}

export async function getCamionesById(id) {
    return fetchData(`Camiones/${id}`);
}

// =======================================
// GETS PARA ALERTAS
// =======================================
export async function getAletas() {
    return fetchData("Alertas");
}

export async function getAlertasById(id) {
    return fetchData(`Alertas/`+id);
}

export async function getAlertasBySensor(sensorId){
    return fetchData(`Alertas/por-sensor/`+sensorId);
}

export async function getAlertasByTipo(tipoAlerta){
    return fetchData(`Alertas/por-tipo/`+tipoAlerta);
}
export async function getAletasByFecha() {
    return fetchData("Alertas/por-fecha");
}