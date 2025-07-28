using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

public class ContainerData
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("deviceId")]
    public int DeviceID { get; set; } // ¡CAMBIO AQUÍ! De string a int

    [BsonElement("clientId")]
    public int ClientID { get; set; } // ¡CAMBIO AQUÍ! De string a int

    [BsonElement("name")]
    public string Name { get; set; }

    [BsonElement("status")]
    public string Status { get; set; }

    [BsonElement("type")]
    public string Type { get; set; }

    [BsonElement("maxWeight_kg")]
    public double MaxWeight_kg { get; set; }

    [BsonElement("values")]
    public ContainerSensorValues Values { get; set; }

    [BsonElement("createdAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime CreatedAt { get; set; }

    [BsonElement("updatedAt")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime UpdatedAt { get; set; }

    public void PrepareForInsert()
    {
        if (string.IsNullOrEmpty(this.Id) || !ObjectId.TryParse(this.Id, out _))
        {
            this.Id = null;
        }

        if (this.CreatedAt == default(DateTime))
        {
            this.CreatedAt = DateTime.UtcNow;
        }
        this.UpdatedAt = DateTime.UtcNow;
    }
}

// La clase ContainerSensorValues no necesita cambios para este escenario
public class ContainerSensorValues
{
    [BsonElement("device_id")]
    public int Device_id { get; set; }

    [BsonElement("ToC")]
    public double ToC { get; set; }

    [BsonElement("RH")]
    public double RH { get; set; }

    [BsonElement("CO2_PPM")]
    public double CO2_PPM { get; set; }

    [BsonElement("GLP_PPM")]
    public double GLP_PPM { get; set; }

    [BsonElement("CH4_PPM")]
    public double CH4_PPM { get; set; }

    [BsonElement("H2_PPM")]
    public double H2_PPM { get; set; }
}