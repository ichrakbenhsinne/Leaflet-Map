import { Component, OnInit } from '@angular/core';
import 'leaflet';
import 'leaflet-draw';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  ngOnInit(): void {
    // Initialize the map
    const map = L.map('map');

    // Add the OpenStreetMap tiles
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    osm.addTo(map);
// Set the correct paths for marker icons
L.Icon.Default.imagePath = 'assets/leaflet/dist/images/';

    // Get the user's current location
    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      // Set the map view based on the user's location
      map.setView([userLat, userLng], 13);

      // Define a custom marker icon
      const customIcon = L.icon({
        iconUrl: 'src/assets/lib/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      // Add a marker at the user's location with the custom icon
      const userMarker = L.marker([userLat, userLng], {
        icon: L.icon({
          iconUrl: 'assets/lib/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41]
        })
      }).addTo(map);
      userMarker.bindPopup('Your current location').openPopup();

      // Leaflet draw
      const drawnFeatures = new L.FeatureGroup();
      map.addLayer(drawnFeatures);

      const drawControl = new L.Control.Draw({
        edit: {
          featureGroup: drawnFeatures,
          remove: false
        },
        draw: {
          polygon: {
            shapeOptions: {
              color: 'purple'
            },
          },
          polyline: {
            shapeOptions: {
              color: 'red'
            },
          },
          rectangle: {
            shapeOptions: {
              color: 'green'
            },
          },
          circle: {
            shapeOptions: {
              color: 'steelblue'
            },
          },
        },
      });

      map.addControl(drawControl);

      map.on("draw:created", (e: any) => {
        const type = e.layerType;
        const layer = e.layer;
        console.log(layer.toGeoJSON());

        layer.bindPopup(`<p>${JSON.stringify(layer.toGeoJSON())}</p>`);
        drawnFeatures.addLayer(layer);
      });
    }, (error) => {
      console.error('Error getting user location:', error);
      // Handle error, maybe set a default map view
    });
  }
}
