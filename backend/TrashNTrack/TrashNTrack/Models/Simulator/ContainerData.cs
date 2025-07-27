using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

public class ContainerData
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    [BsonElement("deviceID")]
    public string DeviceID { get; set; }

    [BsonElement("clientID")]
    public string ClientID { get; set; }

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

    [BsonElement("last_updated")]
    [BsonDateTimeOptions(Kind = DateTimeKind.Utc)]
    public DateTime LastUpdated { get; set; }

    public void PrepareForInsert()
    {
        if (!ObjectId.TryParse(this.Id, out _))
        {
            this.Id = null; // Permitirá que MongoDB genere un nuevo ID
        }
    }
}

public class ContainerSensorValues
{
    [BsonElement("device_id")]
    public int Device_id { get; set; }

    [BsonElement("temperature_C")]
    public double Temperature_C { get; set; }

    [BsonElement("humidity_RH")]
    public double Humidity_RH { get; set; }

    [BsonElement("air_quality_ppm")]
    public double Air_quality_ppm { get; set; }

    // Cambiado a double para aceptar decimales
    [BsonElement("gas_ppm")]
    public double Gas_ppm { get; set; }  // De int a double

    [BsonElement("distance_cm")]
    public double Distance_cm { get; set; }

    [BsonElement("weight_kg")]
    public double Weight_kg { get; set; }

    [BsonElement("is_open")]
    public bool Is_open { get; set; }

    [BsonElement("open_count")]
    public int Open_count { get; set; }
}