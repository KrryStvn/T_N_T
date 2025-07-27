﻿using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;

public class Incidente
{
    #region SQL Statements
    private static string IncidenteGetAll = @"
        SELECT id_incidente, nombre, fecha_incidente, url_foto, descripcion, id_usuario 
        FROM Incidentes";

    private static string IncidenteGetById = @"
        SELECT id_incidente, nombre, fecha_incidente, url_foto, descripcion, id_usuario 
        FROM Incidentes 
        WHERE id_incidente = @Id";

    private static string IncidenteGetByUsuario = @"
        SELECT id_incidente, nombre, fecha_incidente, url_foto, descripcion, id_usuario 
        FROM Incidentes 
        WHERE id_usuario = @UsuarioId";

    private static string IncidenteGetByDateRange = @"
        SELECT id_incidente, nombre, fecha_incidente, url_foto, descripcion, id_usuario 
        FROM Incidentes 
        WHERE fecha_incidente BETWEEN @FechaInicio AND @FechaFin";


    #endregion

    #region Properties
    public int IdIncidente { get; set; }
    public string Nombre { get; set; }
    public DateTime FechaIncidente { get; set; }
    public string PhotoUrl { get; set; }
    public string Descripcion { get; set; }
    public int IdUsuario { get; set; }
    #endregion

    #region Constructors
    public Incidente()
    {
        IdIncidente = 0;
        Nombre = string.Empty;
        FechaIncidente = DateTime.Now;
        PhotoUrl = string.Empty;
        Descripcion = string.Empty;
        IdUsuario = 0;
    }

    public Incidente(int id, string nombre, DateTime fechaIncidente, string photoUrl, string descripcion, int idUsuario)
    {
        IdIncidente = id;
        Nombre = nombre;
        FechaIncidente = fechaIncidente;
        PhotoUrl = photoUrl;
        Descripcion = descripcion;
        IdUsuario = idUsuario;
    }
    #endregion

    #region Methods
    public static List<Incidente> GetAll()
    {
        SqlCommand command = new SqlCommand(IncidenteGetAll);
        return IncidenteMapper.ToList(SqlServerConnection.ExecuteQuery(command));
    }

    public static Incidente GetById(int id)
    {
        SqlCommand command = new SqlCommand(IncidenteGetById);
        command.Parameters.AddWithValue("@Id", id);
        DataTable table = SqlServerConnection.ExecuteQuery(command);
        return table.Rows.Count > 0 ? IncidenteMapper.ToObject(table.Rows[0]) : null;
    }

    public static List<Incidente> GetByUsuario(int usuarioId)
    {
        SqlCommand command = new SqlCommand(IncidenteGetByUsuario);
        command.Parameters.AddWithValue("@UsuarioId", usuarioId);
        return IncidenteMapper.ToList(SqlServerConnection.ExecuteQuery(command));
    }

    public static List<Incidente> GetByDateRange(DateTime fechaInicio, DateTime fechaFin)
    {
        SqlCommand command = new SqlCommand(IncidenteGetByDateRange);
        command.Parameters.AddWithValue("@FechaInicio", fechaInicio);
        command.Parameters.AddWithValue("@FechaFin", fechaFin);
        return IncidenteMapper.ToList(SqlServerConnection.ExecuteQuery(command));
    }


    #endregion
}