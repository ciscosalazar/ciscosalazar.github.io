var mymap = L.map('mapid').setView([8.263686, -62.790322], 13);
var longitud, latitud, fecha, velocidad;
const url = new URL("https://api.thingspeak.com/channels/783913/feeds/last.json?timezone=America/Caracas");
var polyline;
var polylinePoints = [];
var polylineOptions = {
  color: 'red',
  weight: 4,
  opacity: 0.8
};

//Incluir mapa de mapbox usando una capa de Leaflet
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox.streets'
}).addTo(mymap);


//Solicitar ubicaciones del servidor
fetch('https://api.thingspeak.com/channels/783913/feeds.json?timezone=America/Caracas&results=80')
  .then((response) => {
    return response.json()
  })
  .then((responseJson) => {
    data = JSON.parse(JSON.stringify(responseJson))
    data.feeds.forEach(function(dato) {
      latitud = dato.field2/1000;
      longitud = dato.field1/1000;
      velocidad = dato.field3
      fecha = dato.created_at;
      var marker = L.marker([latitud, longitud]).addTo(mymap).bindPopup('<b><h2>Fecha y Hora</h2></b> <br>'+ '<h3>' + fecha + '</h3> <br> <b> <h3>Velocidad<h3></b>'+ velocidad + 'Km/h' ).openPopup(); //Agregar marcador al mapa y su
                                                                                                                                                                                                        //popup con la fecha y hora
      polylinePoints.push(new L.LatLng(latitud, longitud));
    })
    
  })
  .catch(function(error) {
    console.log('Sucedio un error durante la solicitud')
    console.log(error.response)
  })
  .finally(function() {
    if(polylinePoints.length > 0){
      polyline = new L.Polyline(polylinePoints, polylineOptions).addTo(mymap)
      mymap.fitBounds(polyline.getBounds())   //Zoom en linea trazada en el mapa
      return
    }
    console.log("No se han registrado ubicaciones con el GPS")
  })