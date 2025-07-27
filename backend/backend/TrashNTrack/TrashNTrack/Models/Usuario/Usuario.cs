using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using Microsoft.Data.SqlClient;

public class Usuario
{
    #region statements
    private static String UsuarioGetAll = @"select * from USUARIOS";

    private static String UsuarioGetOne = @"
    select id_usuario, nombre, primer_apellido, segundo_apellido, correo, 
    numero_telefono,firebase_uid, tipo_usuario 
    from USUARIOS
    where id_usuario = @ID";
    #endregion

    #region attributes

    private int _id_usuario;
    private string _nombre;
    private String _primer_apellido;
    private String _segundo_apellido;
    private string _correo;
    private string _numero_telefono;
    private string _firebase_uid;
    private string _tipo_usuario;

    #endregion

    #region properties

    public int id_Usuario { get => _id_usuario; }
    public string nombre { get => _nombre; set => _nombre = value; }
    public string primerApell { get => _primer_apellido; set => _primer_apellido = value; }
    public string secundoApell { get => _segundo_apellido; set => _segundo_apellido = value; }
    public string correo { get => _correo; set => _correo = value; }
    public string numero_telefono { get => _numero_telefono; set => _numero_telefono = value; }
    public string firebase_uid { get => _firebase_uid; set => _firebase_uid = value; }
    public string tipo_usuario{ get => _tipo_usuario; set => _tipo_usuario = value; }



    #endregion

    #region Constructors

    public Usuario()
    {
        _id_usuario = 0;
        _nombre = "";
        _primer_apellido = "";
        _segundo_apellido = "";
        _correo = "";
        _numero_telefono = "";
        _firebase_uid = "";
        _tipo_usuario = "";
    }
    public Usuario(int id_usuario,string nombre, String primer_apellido, String segundo_apellido,string correo, string numero_telefono, string firebase_uid, string tipo_usuario)
    {
        _id_usuario = id_usuario;
        _nombre = nombre;
        _primer_apellido = primer_apellido;
        _segundo_apellido = segundo_apellido;
        _correo = correo;
        _numero_telefono = numero_telefono;
        _firebase_uid = firebase_uid;
        _tipo_usuario = tipo_usuario;
    }

    #endregion

    #region classMethods

    public static List<Usuario> Get()
    {
        SqlCommand command = new SqlCommand(UsuarioGetAll);
        return UsuarioMapper.ToList(SqlServerConnection.ExecuteQuery(command));
    }



    public static Usuario Get(int id)
    {
        //sql command
        SqlCommand command = new SqlCommand(UsuarioGetOne);
        //paramaters
        command.Parameters.AddWithValue("@ID", id);
        //execute query 
        DataTable table = SqlServerConnection.ExecuteQuery(command);
        //check if rows were found
        if (table.Rows.Count > 0)
            return UsuarioMapper.ToObject(table.Rows[0]);
        else
            throw new UsuarioNotFoundException(id);
    }

    #endregion
}