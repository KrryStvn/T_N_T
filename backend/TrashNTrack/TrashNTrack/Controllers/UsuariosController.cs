using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TrashNTrack.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        [HttpGet]
        [Route("")]
        public ActionResult Get()
        {
            try
            {
                var usuarios = Usuario.Get();

                // Pasa la lista de usuarios al método GetResponse
                var response = UsuarioListResponse.GetResponse();
                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"ERROR EN CONTROLADOR: {ex.ToString()}");
                return StatusCode(500, new
                {
                    error = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }

        // GET api/<UsuariosController>/5
        [HttpGet]
        [Route("{id}")]
        public ActionResult Get(int id)
        {
            try
            {
                Usuario a = Usuario.Get(id);
                return Ok(UsuarioResponse.GetResponse(a));
            }
            catch (UsuarioNotFoundException e)
            {
                return Ok(MessageResponse.GetResponse(1, e.Message, MessageType.Error));
            }
            catch (Exception e)
            {
                return Ok(MessageResponse.GetResponse(999, e.Message, MessageType.Error));
            }
        }

        [HttpPost]
        [RequestSizeLimit(5_000_000)]
        public IActionResult RegistrarUsuario(
            [FromForm] string nombre,
            [FromForm] string primer_apellido,
            [FromForm] string segundo_apellido,
            [FromForm] string correo,
            [FromForm] string numero_telefono,
            [FromForm] string firebase_uid,
            [FromForm] string tipo_usuario
        )
        {
            try
            {
                // Validar campos mínimos
                if (string.IsNullOrEmpty(nombre))
                {
                    return BadRequest(new { status = -1, message = "Falta agregar nombre" });
                }
                if (string.IsNullOrEmpty(primer_apellido))
                {
                    return BadRequest(new { status = -1, message = "necesita tener al menos el primer apellico" });

                }
                if (string.IsNullOrEmpty(tipo_usuario))
                {
                    return BadRequest(new { status = -1, message = "Falta agregar el tipo de usuario" });

                }

                // Insertar en REPORTES con todos los campos necesarios
                SqlCommand cmd = new SqlCommand(@"
                insert into USUARIOS (nombre, primer_apellido, segundo_apellido, correo, numero_telefono, firebase_uid, tipo_usuario) 
                values (@nombre,@primer_apellido,@segundo_apellido,@correo,@numero_telefono,@firebase_uid,@tipo_usuario);
        ");
                cmd.Parameters.AddWithValue("@nombre", nombre);
                cmd.Parameters.AddWithValue("@primer_apellido",primer_apellido);
                cmd.Parameters.AddWithValue("@segundo_apellido", segundo_apellido);
                cmd.Parameters.AddWithValue("@correo", correo);
                cmd.Parameters.AddWithValue("@numero_telefono", numero_telefono);
                cmd.Parameters.AddWithValue("@firebase_uid", firebase_uid);
                cmd.Parameters.AddWithValue("@tipo_usuario", tipo_usuario);


                var result = SqlServerConnection.ExecuteScalar(cmd);
                int idReporte = Convert.ToInt32(result);

                return Ok(new
                {
                    status = 0,
                    message = "Usuario registrado correctamente",
                    idReporte
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = -1,
                    message = "Error interno del servidor",
                    errorDetails = ex.Message
                });
            }
        }
    }
}
