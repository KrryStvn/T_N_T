﻿public class ItinerarioResponse
{
    public static object GetResponse(Itinerario itinerario)
    {
        return new
        {
            status = 0,
            message = "Itinerario obtenido correctamente",
            data = new
            {
                id = itinerario.IdItinerario,
                estado = itinerario.Estado,
                fechaProgramada = itinerario.FechaProgramada.ToString("yyyy-MM-dd HH:mm"),
                idUsuario = itinerario.IdUsuario,
                idRuta = itinerario.IdRuta
            }
        };
    }

    public static object GetCreateResponse(int id)
    {
        return new
        {
            status = 0,
            message = "Itinerario creado correctamente",
            data = new { id }
        };
    }

    public static object GetUpdateEstadoResponse(bool success)
    {
        return new
        {
            status = success ? 0 : 1,
            message = success ? "Estado actualizado correctamente" : "No se pudo actualizar el estado"
        };
    }
}