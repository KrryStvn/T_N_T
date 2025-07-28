using System.Collections.Generic;
using System.Linq;

public class RutaListResponse
{
    public static object GetResponse(List<Ruta> rutas)
    {
        return new
        {
            status = 0,
            message = "Lista de rutas obtenida correctamente",
            data = rutas.Select(r => new
            {
                id = r.IdRuta,
                nombre = r.NombreRuta,
                fechaCreacion = r.FechaCreacion,
                descripcion = r.Descripcion,
                estado = r.Estado,
                id_usuaroi_asignado = r.Id_usuario_asignado,
                progreso_ruta = r.Progreso_ruta,
                fecha_inicio_real = r.Fecha_inicio_real,
                start_offset_minutes = r.Start_offset_minutes
    }).ToList()
        };
    }
}