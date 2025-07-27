using System;
using System.Collections.Generic;
using System.Data;

public class IncidenteMapper
{
    public static Incidente ToObject(DataRow row)
    {
        return new Incidente
        {
            IdIncidente = Convert.ToInt32(row["id_incidente"]),
            Nombre = row["nombre"].ToString(),        // alias usado en la vista
            FechaIncidente = Convert.ToDateTime(row["fecha_incidente"]),
            PhotoUrl = row["url_foto"]?.ToString() ?? string.Empty,  // alias usado en la vista
            Descripcion = row["descripcion"].ToString(),
            IdUsuario = Convert.ToInt32(row["id_usuario"]),
            Estado_incidente = row["estado_incidente"].ToString(),
            Fecha_resolucion = row["fecha_resolucion"].ToString(),
            Resuelto_por = row["resuelto_por"].ToString()
        };
    }

    public static List<Incidente> ToList(DataTable table)
    {
        List<Incidente> list = new List<Incidente>();

        foreach (DataRow row in table.Rows)
        {
            list.Add(ToObject(row));
        }

        return list;
    }
}