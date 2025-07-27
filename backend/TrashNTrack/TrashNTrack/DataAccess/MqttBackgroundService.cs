using MQTTnet;
using MQTTnet.Extensions.ManagedClient;
using Microsoft.Extensions.Hosting;
using System;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using MQTTnet.Client;

public class MqttBackgroundService : BackgroundService
{
    private IManagedMqttClient _mqttClient;
    private MongoDbConnection _mongoDb;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _mongoDb = new MongoDbConnection();

        var mqttFactory = new MqttFactory();
        _mqttClient = mqttFactory.CreateManagedMqttClient();

        var clientOptions = new MqttClientOptionsBuilder()
            .WithTcpServer("broker.hivemq.com")
            .WithClientId("backend-tracker")
            .Build();

        var managedOptions = new ManagedMqttClientOptionsBuilder()
            .WithClientOptions(clientOptions)
            .Build();

        _mqttClient.ApplicationMessageReceivedAsync += async e =>
        {
            var payload = Encoding.UTF8.GetString(e.ApplicationMessage.Payload);
            Console.WriteLine($"Mensaje recibido: {payload}");

            try
            {
                var container = JsonSerializer.Deserialize<ContainerData>(payload);
                if (container != null)
                {
                    container.PrepareForInsert();
                    await _mongoDb.UpsertDocument(container);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al procesar el mensaje: {ex.Message}");
            }
        };

        _mqttClient.ConnectedAsync += async e =>
        {
            await _mqttClient.SubscribeAsync("UTT/TRASHANDTRACK");
            Console.WriteLine("Suscrito al tópico: UTT/TRASHANDTRACK");
        };

        try
        {
            await _mqttClient.StartAsync(managedOptions);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error de conexión: {ex.Message}");
        }

        try
        {
            await Task.Delay(Timeout.Infinite, stoppingToken);
        }
        catch (TaskCanceledException)
        {
            // Cancellation requested, exit gracefully
        }
    }

    public override async Task StopAsync(CancellationToken cancellationToken)
    {
        if (_mqttClient != null)
        {
            await _mqttClient.StopAsync();
            Console.WriteLine("Desconectado del broker");
        }

        await base.StopAsync(cancellationToken);
    }
}
