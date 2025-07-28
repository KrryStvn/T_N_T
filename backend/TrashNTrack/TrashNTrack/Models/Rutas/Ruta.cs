using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;

public class Ruta
{
    #region statements
    private static string RutaGetAll = @"
        SELECT id_ruta, nombre_ruta, fecha_creacion, descripcion,estado,id_usuario_asignado,progreso_ruta,fecha_inicio_real,start_offset_minutes
        FROM Rutas";

    private static string RutaGetById = @"
SELECT id_ruta, nombre_ruta, fecha_creacion, descripcion,estado,id_usuario_asignado,progreso_ruta,fecha_inicio_real,start_offset_minutes        FROM Rutas 
        WHERE id_ruta = @Id";

    private static string RutaGetByEmpresa = @"
SELECT id_ruta, nombre_ruta, fecha_creacion, descripcion,estado,id_usuario_asignado,progreso_ruta,fecha_inicio_real,start_offset_minutes        FROM Rutas 
        WHERE id_empresa = @EmpresaId";

    private static string RutaGetByPlanta = @"
SELECT id_ruta, nombre_ruta, fecha_creacion, descripcion,estado,id_usuario_asignado,progreso_ruta,fecha_inicio_real,start_offset_minutes        FROM Rutas 
        WHERE id_planta = @PlantaId";
    #endregion

    #region properties
    public int IdRuta { get; set; }
    public string NombreRuta { get; set; }
    public string FechaCreacion { get; set; }
    public string Descripcion { get; set; }
    public string Estado { get; set; }
    public int Id_usuario_asignado { get; set; }
    public int Progreso_ruta { get; set; }
    public string Fecha_inicio_real { get; set; }
    public int Start_offset_minutes { get; set; }

    #endregion

    #region constructors
    public Ruta()
    {
        IdRuta = 0;
        NombreRuta = "";
        FechaCreacion = "";
        Descripcion = "";
        Estado = "";
        Id_usuario_asignado = 0;
        Progreso_ruta = 0;
        Fecha_inicio_real = "";
        Start_offset_minutes = 0;
    }

    public Ruta(int id, string nombre, string fecha, string descripcion, string estado, int id_usuario_asignado, int progreso_ruta, string fecha_inicio_real, int start_offset_minutes)
    {
        IdRuta = id;
        NombreRuta = nombre;
        FechaCreacion = fecha;
        Descripcion = descripcion;
        Estado = estado;
        Id_usuario_asignado = id_usuario_asignado;
        Progreso_ruta = progreso_ruta;
        Fecha_inicio_real = fecha_inicio_real;
        Start_offset_minutes = start_offset_minutes;
    }
    #endregion

    #region methods
    public static List<Ruta> GetAll()
    {
        SqlCommand command = new SqlCommand(RutaGetAll);
        return RutaMapper.ToList(SqlServerConnection.ExecuteQuery(command));
    }

    public static Ruta GetById(int id)
    {
        SqlCommand command = new SqlCommand(RutaGetById);
        command.Parameters.AddWithValue("@Id", id);
        DataTable table = SqlServerConnection.ExecuteQuery(command);
        return table.Rows.Count > 0 ? RutaMapper.ToObject(table.Rows[0]) : null;
    }

    public static List<Ruta> GetByEmpresa(int empresaId)
    {
        SqlCommand command = new SqlCommand(RutaGetByEmpresa);
        command.Parameters.AddWithValue("@EmpresaId", empresaId);
        return RutaMapper.ToList(SqlServerConnection.ExecuteQuery(command));
    }

    public static List<Ruta> GetByPlanta(int plantaId)
    {
        SqlCommand command = new SqlCommand(RutaGetByPlanta);
        command.Parameters.AddWithValue("@PlantaId", plantaId);
        return RutaMapper.ToList(SqlServerConnection.ExecuteQuery(command));
    }
    #endregion
}