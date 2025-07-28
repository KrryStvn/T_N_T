using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.Extensions.Logging;

[ApiController]
[Route("api/[controller]")] // Ruta base: /api/containers
public class ContainersController : ControllerBase
{
    private readonly MongoDbConnection _mongoDbConnection;
    private readonly ILogger<ContainersController> _logger;

    // Inyección de dependencias para MongoDbConnection y ILogger
    public ContainersController(MongoDbConnection mongoDbConnection, ILogger<ContainersController> logger)
    {
        _mongoDbConnection = mongoDbConnection;
        _logger = logger;
    }


    [HttpGet]
    public async Task<ActionResult<List<ContainerData>>> GetAllContainers()
    {
        try
        {
            var collection = _mongoDbConnection.GetCollection<ContainerData>();
            var containers = await collection.Find(_ => true).ToListAsync();

            if (containers == null || containers.Count == 0)
            {
                _logger.LogInformation("No se encontraron contenedores. Devolviendo lista vacía.");
                return Ok(new List<ContainerData>()); // Devolver Ok con lista vacía en lugar de NotFound
            }

            _logger.LogInformation($"Se recuperaron {containers.Count} contenedores de la base de datos.");
            return Ok(containers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al obtener todos los contenedores.");
            return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        }
    }

    

    [HttpGet("{id}")]
    public async Task<ActionResult<ContainerData>> GetContainerById(string id)
    {
        try
        {
            var collection = _mongoDbConnection.GetCollection<ContainerData>();

            if (!ObjectId.TryParse(id, out _))
            {
                return BadRequest("ID de contenedor no válido.");
            }

            var container = await collection.Find(c => c.Id == id).FirstOrDefaultAsync();

            if (container == null)
            {
                _logger.LogWarning($"Contenedor con ID '{id}' no encontrado.");
                return NotFound($"Contenedor con ID '{id}' no encontrado.");
            }

            _logger.LogInformation($"Contenedor con ID '{id}' recuperado exitosamente.");
            return Ok(container);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error al obtener contenedor por ID: {id}");
            return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        }
    }


    [HttpGet("bydeviceid/{deviceId}")]
    public async Task<ActionResult<ContainerData>> GetContainerByDeviceId(int deviceId)
    {
        try
        {
            var collection = _mongoDbConnection.GetCollection<ContainerData>();
            // La consulta se mantiene igual, ya que DeviceID en el modelo ya es int
            var container = await collection.Find(c => c.DeviceID == deviceId).FirstOrDefaultAsync();

            if (container == null)
            {
                _logger.LogWarning($"Contenedor con DeviceID '{deviceId}' no encontrado.");
                return NotFound($"Contenedor con DeviceID '{deviceId}' no encontrado.");
            }

            _logger.LogInformation($"Contenedor con DeviceID '{deviceId}' recuperado exitosamente.");
            return Ok(container);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error al obtener contenedor por DeviceID: {deviceId}");
            return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        }
    }


    [HttpPost]
    public async Task<ActionResult<ContainerData>> CreateContainer([FromBody] ContainerData newContainer)
    {
        if (newContainer == null)
        {
            return BadRequest("Datos del contenedor no proporcionados.");
        }

        try
        {
            var collection = _mongoDbConnection.GetCollection<ContainerData>();
            newContainer.PrepareForInsert(); // Prepara CreatedAt, UpdatedAt y el ID si es necesario

            // *** CAMBIO CLAVE AQUÍ: Se eliminó la validación de unicidad de DeviceID ***
            // Si DeviceID y ClientID pueden ser duplicados, no debemos verificar su existencia aquí
            // Esto permite crear múltiples contenedores con el mismo DeviceID/ClientID.

            await collection.InsertOneAsync(newContainer);
            _logger.LogInformation($"Nuevo contenedor creado con ID: {newContainer.Id}");
            return CreatedAtAction(nameof(GetContainerById), new { id = newContainer.Id }, newContainer);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al crear un nuevo contenedor.");
            return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        }
    }


    [HttpPost("batch-update")]
    public async Task<IActionResult> BatchUpdateContainers([FromBody] List<ContainerData> containers)
    {
        if (containers == null || containers.Count == 0)
        {
            return BadRequest(new { error = "No se recibieron datos de contenedores." });
        }

        try
        {
            var collection = _mongoDbConnection.GetCollection<ContainerData>();
            var results = new List<object>();

            foreach (var container in containers)
            {
                // La lógica actual de batch-update usa DeviceID para encontrar un "existing"
                // y luego actualiza. Si no lo encuentra, lo inserta.
                // Esto aún asume que un DeviceID en el INPUT del batch
                // se usa para identificar un registro ÚNICO a actualizar.
                // Si quieres insertar nuevos si no existe, o actualizar si existe (upsert-like behavior),
                // esta lógica es válida. Si un DeviceID debe existir múltiples veces
                // y no sabes cuál actualizar, esta lógica necesitaría otro campo identificador único
                // o actualizaría el primer DeviceID que encuentre.
                var existing = await collection.Find(c => c.DeviceID == container.DeviceID).FirstOrDefaultAsync();

                if (existing == null)
                {
                    container.CreatedAt = DateTime.UtcNow;
                    container.UpdatedAt = DateTime.UtcNow;
                    container.Id = ObjectId.GenerateNewId().ToString();

                    await collection.InsertOneAsync(container);
                    results.Add(new { action = "inserted", id = container.Id, deviceId = container.DeviceID });
                    _logger.LogInformation($"Nuevo contenedor insertado: DeviceID {container.DeviceID}, ID {container.Id}");
                }
                else
                {
                    // Contenedor existente: actualizar campos
                    var filter = Builders<ContainerData>.Filter.Eq(c => c.DeviceID, container.DeviceID);
                    var update = Builders<ContainerData>.Update
                        .Set(c => c.ClientID, container.ClientID)
                        .Set(c => c.Name, container.Name)
                        .Set(c => c.Status, container.Status)
                        .Set(c => c.Type, container.Type)
                        .Set(c => c.MaxWeight_kg, container.MaxWeight_kg)
                        .Set(c => c.Values, container.Values) // Actualiza el objeto de valores completo
                        .Set(c => c.UpdatedAt, DateTime.UtcNow);

                    var result = await collection.UpdateOneAsync(filter, update);

                    results.Add(new
                    {
                        action = result.ModifiedCount > 0 ? "updated" : "unchanged",
                        id = existing.Id,
                        deviceId = container.DeviceID
                    });
                    _logger.LogInformation($"Contenedor actualizado: DeviceID {container.DeviceID} (ID: {existing.Id}), Modificado: {result.ModifiedCount > 0}");
                }
            }

            return Ok(new
            {
                message = $"Procesados {containers.Count} contenedores",
                details = results
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al procesar batch-update.");
            return StatusCode(500, new { error = ex.Message });
        }
    }


    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateContainer(string id, [FromBody] ContainerData updatedContainer)
    {
        if (updatedContainer == null || updatedContainer.Id != id)
        {
            return BadRequest("ID del contenedor no coincide o datos inválidos.");
        }

        if (!ObjectId.TryParse(id, out _))
        {
            return BadRequest("ID de contenedor no válido.");
        }

        try
        {
            var collection = _mongoDbConnection.GetCollection<ContainerData>();

            var filter = Builders<ContainerData>.Filter.Eq(c => c.Id, id);

            updatedContainer.UpdatedAt = DateTime.UtcNow;

            var update = Builders<ContainerData>.Update
                .Set(c => c.DeviceID, updatedContainer.DeviceID)
                .Set(c => c.ClientID, updatedContainer.ClientID)
                .Set(c => c.Name, updatedContainer.Name)
                .Set(c => c.Status, updatedContainer.Status)
                .Set(c => c.Type, updatedContainer.Type)
                .Set(c => c.MaxWeight_kg, updatedContainer.MaxWeight_kg)
                .Set(c => c.Values, updatedContainer.Values)
                .Set(c => c.UpdatedAt, DateTime.UtcNow);

            var result = await collection.UpdateOneAsync(filter, update);

            if (result.ModifiedCount == 0)
            {
                _logger.LogWarning($"Contenedor con ID '{id}' no encontrado o no se realizaron cambios.");
                return NotFound($"Contenedor con ID '{id}' no encontrado o no se realizaron cambios.");
            }

            _logger.LogInformation($"Contenedor con ID '{id}' actualizado exitosamente.");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error al actualizar contenedor con ID: {id}");
            return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        }
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteContainer(string id)
    {
        if (!ObjectId.TryParse(id, out _))
        {
            return BadRequest("ID de contenedor no válido.");
        }

        try
        {
            var collection = _mongoDbConnection.GetCollection<ContainerData>();
            var result = await collection.DeleteOneAsync(c => c.Id == id);

            if (result.DeletedCount == 0)
            {
                _logger.LogWarning($"Contenedor con ID '{id}' no encontrado para eliminar.");
                return NotFound($"Contenedor con ID '{id}' no encontrado.");
            }

            _logger.LogInformation($"Contenedor con ID '{id}' eliminado exitosamente.");
            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error al eliminar contenedor con ID: {id}");
            return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        }
    }
}