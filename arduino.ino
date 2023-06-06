#include <ESP8266WiFi.h>
#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11

const char* ssid = "No wifi-2.4G";
const char* password = "8019586157";

//const char* unique_Id = WiFi.localIP().toString().c_str();

//String unique_Id;

DHT dht(DHTPIN, DHTTYPE);
WiFiServer server(80);

void setup() {
  Serial.begin(9600);
  delay(10);
  dht.begin();
  WiFi.begin(ssid, password);
  Serial.println();

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }

  Serial.println("WiFi connected");
  server.begin();
  Serial.println("Server started");
  Serial.println("Server started");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  IPAddress ipAddress = WiFi.localIP();
  /*
  unique_Id = "";
  unique_Id += ipAddress[2];
  unique_Id += ".";
  unique_Id += ipAddress[3];
  unique_Id += ":";
  unique_Id += "80";
  */

  
}

void loop() {
  WiFiClient client = server.available();

  if (client) {
    Serial.println("New client connected");
    String response = getTemperatureHumidityJSON();
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: application/json");
    client.println("Connection: close");
    client.println();
    client.println(response);
    delay(10);
    client.stop();
    Serial.println("Client disconnected");
  }
}

String getTemperatureHumidityJSON() {
  int temperature = dht.readTemperature();
  int humidity = dht.readHumidity();
  int unique_Id = 101;
  String JSON = "{\"unique_Id\": \"" + String(unique_Id) + "\", \"temperature\": " + String(temperature) + ", \"humidity\": " + String(humidity) + "}";
  return JSON;
}