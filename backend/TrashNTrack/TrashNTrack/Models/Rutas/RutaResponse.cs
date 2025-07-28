public class RutaResponse
{
    public static object GetResponse(Ruta ruta)
    {
        return new
        {
            status = 0,
            message = "Ruta obtenida correctamente",
            data = new
            {
                id = ruta.IdRuta,
                nombre = ruta.NombreRuta,
                fechaCreacion = ruta.FechaCreacion,
                descripcion = ruta.Descripcion,
                estado = ruta.Estado,
                id_usuario_asignado = ruta.Id_usuario_asignado,
                progreso_ruta = ruta.Progreso_ruta,
                fecha_inicio_real = ruta.Fecha_inicio_real,
                start_offset_minutes = ruta.Start_offset_minutes

    }
};
    }
}