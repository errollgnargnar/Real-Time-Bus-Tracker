

///add map to page
mapboxgl.accessToken = 'pk.eyJ1IjoiZXJyb2xsZ25hcmduYXIiLCJhIjoiY2t3cHR4Y3FlMGc3MjJvczZid2o5eG45NCJ9.9Fx38vz7p-lHHEzL_byD7Q';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/light-v10',
	center: [-71.104081, 42.365554], // starting position
	zoom: 12
});


//map style interactivity
const mapStyleSel = document.querySelector('.map-style-select');
mapStyleSel.onchange = () => {
    let mStyleSelVal = mapStyleSel.value;
    switch(mStyleSelVal){
        case 'Light':
            map.setStyle('mapbox://styles/mapbox/light-v10');
            break;
        case 'Dark':
            map.setStyle('mapbox://styles/mapbox/dark-v10');
            break;
        case 'Satellite':
            map.setStyle('mapbox://styles/mapbox/satellite-v9');
            break;
        case 'Navigation Day':
            map.setStyle('mapbox://styles/mapbox/navigation-day-v1');
            break;
        case 'Navigation Night':
            map.setStyle('mapbox://styles/mapbox/navigation-night-v1');
            break;
        default:
            map.setStyle('mapbox://styles/mapbox/streets-v11')
    }
}

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

async function run(){
    // get bus data    
	const locations = await getBusLocations();
	

	console.log(new Date());
	console.log(locations);
    console.log(locations.length);


	// timer
	setTimeout(run, 4000);
}
let busStops;
// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles?filter[route]=1&include=trip';
	const response = await fetch(url);
	const json     = await response.json();
	busStops = json;
	setBSMarkers();
	return json.data;
}

run();

let totalMarkers = [];

const busInfo = document.querySelector('.bus-info');

///make a marker for each bus stop active
function setBSMarkers(){
	let counter = 0;
		while(counter < busStops.data.length) {
            ///draw marker from busStops data
			const marker = new mapboxgl.Marker()
				.setLngLat([busStops.data[counter].attributes.longitude, busStops.data[counter].attributes.latitude])
			//	.addTo(map);
            
            //check seats available
            if(busStops.data[counter].attributes.occupancy_status === null){
                const popup = new mapboxgl.Popup({ closeOnClick: false})
                .setLngLat([busStops.data[counter].attributes.longitude, busStops.data[counter].attributes.latitude])
                .setHTML(`<h4>${busStops.data[counter].attributes.label}</h4><p>no seats available</p>`)
                .addTo(map);
                setTimeout(() => {popup.remove()},3999);


            } else {
                const popup = new mapboxgl.Popup({ closeOnClick: false })
                .setLngLat([busStops.data[counter].attributes.longitude, busStops.data[counter].attributes.latitude])
                .setHTML(`<h4>${busStops.data[counter].attributes.label}</h4><p>${busStops.data[counter].attributes.occupancy_status.toLowerCase().replaceAll('_',' ')}</p>`)
                .addTo(map);
                setTimeout(() => {popup.remove()},3999);

            }

            busInfo.textContent=`There are ${busStops.data.length} buses in transit.`;
            counter++;
		}
}