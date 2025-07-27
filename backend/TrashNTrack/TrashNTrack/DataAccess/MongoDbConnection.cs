using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class MongoDbConnection
{
    private readonly IMongoDatabase _database;

    public MongoDbConnection()
    {
        // Asegúrate de que Config.Configuration ya ha sido cargado
        if (Config.Configuration == null || Config.Configuration.MongoDb == null)
        {
            throw new InvalidOperationException("Configuración de MongoDB no cargada. Asegúrate de inicializar Config.Configuration al inicio de tu aplicación.");
        }

        try
        {
            var client = new MongoClient(Config.Configuration.MongoDb.ConnectionString);
            _database = client.GetDatabase(Config.Configuration.MongoDb.DatabaseName);
            Console.WriteLine($"Conexión a MongoDB exitosa a la base de datos: {Config.Configuration.MongoDb.DatabaseName}");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al conectar a MongoDB: {ex.Message}");
            throw;
        }
    }

    public IMongoCollection<TDocument> GetCollection<TDocument>()
    {
        // Obtiene el nombre de la colección por defecto desde la configuración
        return _database.GetCollection<TDocument>(Config.Configuration.MongoDb.CollectionName);
    }

    public async Task UpsertDocument<TDocument>(TDocument document) where TDocument : class
    {
        // Asume que TDocument tiene una propiedad "Id" mapeada a "_id"
        // Necesitas asegurarte de que tu clase TDocument (ContainerData) tenga una propiedad 'Id'
        // y que esté marcada con [BsonId] para que funcione el filtro por Id.
        var collection = GetCollection<TDocument>();

        // Crear un filtro para encontrar el documento por su _id
        // Esto asume que el documento tiene una propiedad 'Id' que se usa como _id de MongoDB
        // y que es un string. Si es ObjectId, necesitarías un filtro diferente.
        var objectId = ((dynamic)document).Id; // Acceso dinámico para obtener el Id
        var filter = Builders<TDocument>.Filter.Eq("_id", objectId);

        var options = new ReplaceOptions { IsUpsert = true }; // Si no existe, lo inserta

        try
        {
            var result = await collection.ReplaceOneAsync(filter, document, options);

            if (result.IsAcknowledged)
            {
                if (result.ModifiedCount > 0)
                {
                    Console.WriteLine($"Documento con ID {objectId} actualizado.");
                }
                else if (result.UpsertedId != null)
                {
                    Console.WriteLine($"Documento con ID {objectId} insertado.");
                }
                else
                {
                    Console.WriteLine($"Documento con ID {objectId} no modificado (posiblemente idéntico).");
                }
            }
            else
            {
                Console.WriteLine($"Operación de upsert para ID {objectId} no reconocida.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al hacer upsert del documento con ID {objectId}: {ex.Message}");
            throw;
        }
    }
}
