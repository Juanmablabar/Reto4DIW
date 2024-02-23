var map = L.map('map').fitWorld();
var youAreHere;
var addLocation = document.getElementById('addLocation');
var hist = document.getElementById('history');
var dialAddLocation = document.getElementById('dialAddLocation');
var saveLocation = document.getElementById('saveLocation');
var panel = document.getElementById('bottomPanelInfo');
var dialHist = document.getElementById('dialHistory');
var closeHist = document.getElementById('closeHistory');


// Inicializa el mapa
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        map.locate({setView: true, watch: true, maxZoom: 18});
        youAreHere = L.marker([lat, lon]).addTo(map);
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
} else {
    alert('Geolocalización no es compatible con este navegador.');
}
// Sigue al usuario según la posición (EN TEORÍA)
map.on('locationfound', function(e){
    var latlng = e.latlng;
    youAreHere.setLatLng(latlng);
    updatePanel();
})

// Abre el modal para guardar ubicaciones.
addLocation.addEventListener('click', function(){
    dialAddLocation.showModal()
});

var marker;
// Cierra el modal para guardar ubicaciones.
saveLocation.addEventListener('click', function(){
    // Comprueba si hay marcador y borra si lo hay antes de añadir otro.
    if(marker){
        saveDeletedMarkers(marker);
        map.removeLayer(marker);
        marker=null;
        panel.innerHTML = '';
    }
    // Establece los datos del marcador
    var locationName = document.getElementById('locationName').value;
    var latlng = youAreHere.getLatLng();
    marker = L.marker(latlng).addTo(map);
    marker.bindPopup(locationName).openPopup();
    marker.timestamp = new Date().getTime();

    dialAddLocation.close();
    updatePanel();
})



var template = document.querySelector('template');
var tableBody = document.getElementById('tableBody');

// Mostrar el historial de ubicaciones
hist.addEventListener('click', function(){
    var locations = localStorage.getItem('locations') || [];
    if (locations){
        var locationTable = JSON.parse(locations);
        tableBody.innerHTML = "";
        locationTable.forEach(location =>{
            let row= template.content.cloneNode(true);
            row.querySelector('.C-name').textContent = location.name;
            row.querySelector('.C-coords').textContent = location.latlng;
            row.querySelector('.C-time').textContent = location.time+' min';
            tableBody.appendChild(row);
        })
    }else{
        let row= template.content.cloneNode(true);
            row.querySelector('.C-name').textContent = "-";
            row.querySelector('.C-coords').textContent = "-";
            row.querySelector('.C-time').textContent = '-';
            tableBody.appendChild(row);
    }
    dialHist.showModal();
})

// Cerrar el historial
closeHist.addEventListener('click', function(){
    dialHist.close();
})

// Eliminar marcador y guardar marcador
map.on('contextmenu', function(){
    if(marker && confirm('¿Borrar este marcador?')){
        saveDeletedMarkers(marker);
        map.removeLayer(marker);
        marker = null;
        panel.innerHTML='';
    }
})


// Guardar marcadores
function saveDeletedMarkers(marker){
    var locations = JSON.parse(localStorage.getItem('locations')) || [];
    locations.push({
        name: marker.getPopup().getContent(),
        latlng: '('+marker.getLatLng().lat+','+marker.getLatLng().lng+')',
        time: calculateTime(marker.timestamp)
    });
    localStorage.setItem('locations', JSON.stringify(locations));
}

// Distancia, temporizador y nombre
function updatePanel(){
    if(youAreHere){
        if(marker){
            var currentCoords = youAreHere.getLatLng();
            var distance = calculateDistance(currentCoords, marker.getLatLng());
            var time = calculateTime(marker.timestamp);
        
            panel.innerHTML = `
            <p>Nombre: ${marker.getPopup().getContent()}</p>
            <p>Distancia: ${distance.toFixed(2)} metros</p>
            <p>Tiempo: ${time} minutos</p>`;
        }
        
    }else{
        panel.innerHTML = "Ubicación desconocida";
    }
    
}

// Calcular distancia
function calculateDistance (latlng1, latlng2){
    return latlng1.distanceTo(latlng2);
}

// Calcular tiempo
function calculateTime(markerTimeStamp){
    var now = new Date().getTime();
    var elapsedTime = now - markerTimeStamp;
    return Math.floor(elapsedTime / (1000 *60)); //minutos
}