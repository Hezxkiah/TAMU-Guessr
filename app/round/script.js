let map;
let marker;
let panorama;

const zach = {
    name: "Zachry Engineering Building",
    lat: 30.620715,
    lng: -96.340905,
};

const msc = {
name: "Memorial Student Center",
    lat: 30.612063,
    lng: -96.342733,
};

const loc_list = [zach, msc];
const currentLocation = loc_list[Math.floor(Math.random() * loc_list.length)];

function initMap() {
    const collegeStation = { lat: 30.627977, lng: -96.334407 };

  // Initialize the map
    map = new google.maps.Map(document.getElementById("map"), {
    center: collegeStation,
    zoom: 14,
    });

  // Initialize a disconnected Street View
    panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view"),
    {
        position: { lat: currentLocation.lat, lng: currentLocation.lng },
        pov: { heading: 165, pitch: 0 },
        zoom: 1,
    }
    );

  // Handle map clicks
    map.addListener("click", (event) => {
    const clickedLocation = event.latLng;

    // Drop or move a marker
    if (marker) {
    marker.setPosition(clickedLocation);
    } else {
    marker = new google.maps.Marker({
        position: clickedLocation,
        map: map,
    });
    }

    // Compute distance
    const randomPoint = new google.maps.LatLng(
    currentLocation.lat,
    currentLocation.lng
    );

    const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(
    clickedLocation,
    randomPoint
    );

    const distanceKm = (distanceMeters / 1000).toFixed(2);

    console.log(`Distance: ${distanceKm} km from ${currentLocation.name}`);
    alert(`Distance from ${currentLocation.name}: ${distanceKm} km`);
    });
}
