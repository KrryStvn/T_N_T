using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using TrashNTrack.Controllers;

[Route("api/[controller]")]
[ApiController]
public class IncidentesController : ControllerBase
{
    [HttpGet]
    public ActionResult GetAll()
    {
        try
        {
            var incidentes = Incidente.GetAll();
            return Ok(IncidenteListResponse.GetResponse(incidentes));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 999,
                message = ex.Message,
                type = "error"
            });
        }
    }

    [HttpGet("{id}")]
    public ActionResult GetById(int id)
    {
        try
        {
            var incidente = Incidente.GetById(id);

            if (incidente == null)
                return NotFound(new
                {
                    status = 1,
                    message = $"Incidente con ID {id} no encontrado",
                    type = "error"
                });

            return Ok(IncidenteResponse.GetResponse(incidente));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 999,
                message = ex.Message,
                type = "error"
            });
        }
    }

    [HttpGet("por-usuario/{usuarioId}")]
    public ActionResult GetByUsuario(int usuarioId)
    {
        try
        {
            var incidentes = Incidente.GetByUsuario(usuarioId);
            return Ok(IncidenteListResponse.GetResponse(incidentes));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 999,
                message = ex.Message,
                type = "error"
            });
        }
    }

    [HttpGet("por-fecha")]
    public ActionResult GetByDateRange([FromQuery] DateTime fechaInicio, [FromQuery] DateTime fechaFin)
    {
        try
        {
            var incidentes = Incidente.GetByDateRange(fechaInicio, fechaFin);
            return Ok(IncidenteListResponse.GetResponse(incidentes));
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                status = 999,
                message = ex.Message,
                type = "error"
            });
        }
    }

    [HttpPost]
    [RequestSizeLimit(5_000_000)]
    public IActionResult RegistrarReporte(
    [FromForm] string   nombre,
    [FromForm] DateTime fecha_incidente,
    [FromForm] string url_foto,
    [FromForm] string descripcion,
    [FromForm] int id_usuario
)
    {
        try
        {
            // Validar campos mínimos
            if (string.IsNullOrEmpty(nombre))
            {
                return BadRequest(new { status = -1, message = "Falta agregar nombre" });
            }
            if (string.IsNullOrEmpty(descripcion))
            {
                return BadRequest(new { status = -1, message = "Falta agregar descripcion" });

            }
            if (id_usuario <=0)
            {
                return BadRequest(new { status = -1, message = "Falta agregar usuario" });

            }

            // Insertar en REPORTES con todos los campos necesarios
            SqlCommand cmd = new SqlCommand(@"
            INSERT INTO INCIDENTES 
            (nombre, fecha_incidente,url_foto,descripcion,id_usuario)
            VALUES 
            (@nombre,GETDATE(),@url_foto,@descripcion,@id_usuario);
        ");
            cmd.Parameters.AddWithValue("@nombre", nombre);
            cmd.Parameters.AddWithValue("@fecha_incidente", fecha_incidente);
            cmd.Parameters.AddWithValue("@url_foto", url_foto);
            cmd.Parameters.AddWithValue("@descripcion", descripcion);
            cmd.Parameters.AddWithValue("@id_usuario", id_usuario);

            var result = SqlServerConnection.ExecuteScalar(cmd);
            int idReporte = Convert.ToInt32(result);

            return Ok(new
            {
                status = 0,
                message = "Reporte registrado correctamente",
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