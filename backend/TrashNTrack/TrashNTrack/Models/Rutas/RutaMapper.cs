using System;
using System.Collections.Generic;
using System.Data;
using System.Numerics;
using System.Reflection;

public class RutaMapper
{
    public static Ruta ToObject(DataRow row)
    {
        int idRuta = (int)row["id_ruta"];
        string nombreRuta = row["nombre_ruta"].ToString();
        string fechaCreacion = row["fecha_creacion"].ToString();
        string descripcion = row["descripcion"].ToString();
        string estado = row["estado"].ToString();
        int idUsuarioAsignado = row["id_usuario_asignado"] != DBNull.Value ? Convert.ToInt32(row["id_usuario_asignado"]):0;
        int progresoRuta = (int)row["progreso_ruta"];
        string fechaInicioReal = row["fecha_inicio_real"] != DBNull.Value ? Convert.ToString(row["fecha_inicio_real"]):"";
        int startOffsetMinutes = (int)row["start_offset_minutes"];



        return new Ruta(idRuta,nombreRuta,fechaCreacion,descripcion,estado,idUsuarioAsignado,progresoRuta,fechaInicioReal,startOffsetMinutes);

    }

    public static List<Ruta> ToList(DataTable table)
    {
        List<Ruta> list = new List<Ruta>();

        foreach (DataRow row in table.Rows)
        {
            list.Add(ToObject(row));
        }

        return list;
    }
}