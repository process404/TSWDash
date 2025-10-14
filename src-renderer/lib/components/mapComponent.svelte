<script lang="ts">
	import { onMount } from 'svelte';
	import L from 'leaflet';
	import { derived } from 'svelte/store';
	import { latestPingResponse, pingPoint } from '$lib/stores/sessionTracker';

	const trainStations = [
        // needs stations
	];

	let map: L.Map;
	let marker: L.Marker;
	let pathLine: L.Polyline;
    let driverMarker: L.CircleMarker;

	const coords = derived(latestPingResponse, ($resp) => {
		if ($resp?.Result === 'Success' && $resp.Values) {
			return { lat: $resp.Values.Lat, lon: $resp.Values.Lon };
		}
		return null;
	});

	onMount(() => {
		map = L.map('map', {
			center: [55.8568, -4.2586],
			zoom: 13
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '© OpenStreetMap contributors',
		}).addTo(map);


        trainStations.forEach(station => {
            L.circleMarker([station.lat, station.lon], {
                radius: 5,
                color: '#444',
                fillColor: '#888',
                fillOpacity: 0.9,
                weight: 1,
            })
                .addTo(map)
                .bindPopup(station.name);
        });

        driverMarker = L.circleMarker([55.8568, -4.2586], {
            radius: 8,
            color: '0084E1',      
            weight: 2,          
            fillColor: '0084E1',  
            fillOpacity: 1,     
            opacity: 1,        
            interactive: true,  
        }).addTo(map);


		pathLine = L.polyline([], { color: '#0074D9', weight: 3 }).addTo(map);

		const unsubscribeCoords = coords.subscribe(pos => {
			if (pos) {
                driverMarker.setLatLng([pos.lat, pos.lon]).setStyle({ opacity: 1, fillOpacity: 0.9 });
				map.panTo([pos.lat, pos.lon], { animate: true });
			} else {
				driverMarker.setStyle({ opacity: 0, fillOpacity: 0 });
			}
		});

		const unsubscribePath = pingPoint.subscribe(points => {
			const latlngs = points.map(p => [p.lat, p.lon] as [number, number]);
			pathLine.setLatLngs(latlngs);
		});

		return () => {
			unsubscribeCoords();
			unsubscribePath();
			map.remove();
		};
	});
</script>

<style>
	#map {
		height: 400px;
		width: 100%;
	}
</style>

<div id="map"></div>
