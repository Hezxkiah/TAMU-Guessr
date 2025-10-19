"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./Weekly.module.css";

// **********************************************
// * START OF EMBEDDED GAME LOGIC
// **********************************************
let map: google.maps.Map;
let marker: google.maps.Marker | null;
let actualMarker: google.maps.Marker | null;
let panorama: google.maps.StreetViewPanorama;

let round = 1;
let totalScore = 0;
const maxRounds = 5;
let clickedLocation: google.maps.LatLng | null = null;

// --- DEDICATED LOCATION DEFINITION SECTION (No pano IDs) ---
const zach = { name: "Zachry Engineering Education Complex", lat: 30.620794, lng:-96.340940 };
const msc = { name: "Memorial Student Center", lat: 30.61206, lng: -96.34273 };
const clocktower = { name: "Albritton Bell Tower", lat: 30.61348, lng: -96.34488 };
const simpson = {name:"Simpson Drill Field", lat:30.614020, lng:-96.343297};
const kyle = {name:"Kyle field", lat:30.610752, lng:-96.339233};
const kylehotel = {name: "Kyle Hotel", lat:30.610021, lng:-96.343299};
const northgate = {name:"Northgate" ,lat:30.619065, lng:-96.344787};
const physics = {name:"Physics building", lat:30.619815, lng:-96.343143}; 
const drive = {name:"Main drive",lat:30.619751, lng:-96.334874};
const haney = {name:"Haney drill field", lat:30.612677, lng:-96.333580};
const park = {name: "Aggie park", lat:30.609775, lng:-96.338299};
const duncan = {name:"Duncan",lat:30.611309, lng:-96.335232};
const ring = {name:"Aggie ring", lat:30.608837, lng:-96.336240};
const rec = {name:"Rec center", lat:30.607494, lng:-96.344265};
const whitecreek = {name:"Whitecreek", lat:30.607281, lng:-96.355118};
const olsen = {name:"Olsen field", lat:30.605437, lng:-96.342304};
const wlc = {name:"West campus library", lat:30.612745, lng:-96.350190}
const sbisa = {name:"SBISA", lat:30.61643, lng:-96.34317};
const polo = {name:"Polo", lat:30.6164292, lng:-96.3431690};
const sign = {name:"Sign", lat:30.622730, lng:-96.328971}
const anth = {name:"Anthropology building", lat:30.617818, lng:-96.339336}

const loc_list = [
  zach,
  msc,
  clocktower,
  simpson,
  kyle,
  kylehotel,
  northgate,
  physics,
  drive,
  haney,
  park,
  duncan,
  ring,
  rec,
  whitecreek,
  olsen,
  wlc,
  sbisa,
  polo,
  sign,
  anth,
];


type LocationType = typeof zach;
let currentLocation: LocationType;

// Functions linked to React state setters
let updateGameMessage: (message: string) => void;
let updateRoundInfo: (info: string) => void;
// updateTimeLeft is no longer needed

function pickRandomLocation() {
  currentLocation = loc_list[Math.floor(Math.random() * loc_list.length)];
  console.log(`🎯 Target for round ${round}: ${currentLocation.name}`);
  updateGameMessage(`Round ${round}/${maxRounds}: Guess the location!`);
  updateRoundInfo('');
}

function handleConfirmGuess() {
  if (!clickedLocation) {
    updateGameMessage("Click on the map to place your guess first!");
    return;
  }
  
  // Timer stop logic removed

  const confirmBtn = document.getElementById("confirmBtn") as HTMLButtonElement;
  confirmBtn.disabled = true;

  if (actualMarker) {
    actualMarker.setMap(null);
  }
  actualMarker = new google.maps.Marker({
    position: { lat: currentLocation.lat, lng: currentLocation.lng },
    map: map,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: "red",
      fillOpacity: 0.8,
      strokeColor: "white",
      strokeWeight: 2,
    },
    title: "Actual Location",
  });

  const bounds = new google.maps.LatLngBounds();
  bounds.extend(clickedLocation);
  bounds.extend(actualMarker.getPosition()!);
  map.fitBounds(bounds);

  const targetPoint = new google.maps.LatLng(
    currentLocation.lat,
    currentLocation.lng
  );
  const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(
    clickedLocation,
    targetPoint
  );
  const distanceKm = distanceMeters / 1000;
  const roundScore = Math.round(1200 * Math.exp(-1.8 * distanceKm));
  totalScore += roundScore;

  updateGameMessage(`🏁 Round ${round} Complete!`);
  updateRoundInfo(
    `Target: ${currentLocation.name}\n` +
      `Distance: ${distanceKm.toFixed(2)} km\n` +
      `Round Score: ${roundScore}\n` +
      `Total Score: ${totalScore}`
  );

  confirmBtn.textContent = "➡️ Next Round";
  confirmBtn.disabled = false;

  confirmBtn.removeEventListener("click", handleConfirmGuess);
  confirmBtn.addEventListener("click", handleNextRound);
}

function handlePlayAgain() {
    // Timer stop logic removed

    // Reset all game state variables
    round = 1;
    totalScore = 0;
    clickedLocation = null;
    
    // Timer display reset logic removed

    // Clear map markers
    if (marker) { marker.setMap(null); marker = null; }
    if (actualMarker) { actualMarker.setMap(null); actualMarker = null; }

    // Reset the map and button appearance/event
    const confirmBtn = document.getElementById("confirmBtn") as HTMLButtonElement;
    confirmBtn.textContent = "✅ Confirm Guess";
    confirmBtn.disabled = true;
    confirmBtn.removeEventListener("click", handlePlayAgain);
    confirmBtn.addEventListener("click", handleConfirmGuess);

    initMapGame(); // Re-initialize the game state
}

function handleNextRound() {
  round++;
  const confirmBtn = document.getElementById("confirmBtn") as HTMLButtonElement;

  if (round > maxRounds) {
    // GAME OVER LOGIC
    updateGameMessage(`🎉 Game Over! Final Score: ${totalScore} / ${maxRounds * 1200}`);
    updateRoundInfo(`Total rounds played: ${maxRounds}`);

    confirmBtn.textContent = "🔄 Play Again?";
    confirmBtn.disabled = false;

    // Change event listener to Play Again handler
    confirmBtn.removeEventListener("click", handleNextRound);
    confirmBtn.addEventListener("click", handlePlayAgain);
    return;
  }

  // Clear map markers and location for new round
  if (marker) { marker.setMap(null); marker = null; }
  if (actualMarker) { actualMarker.setMap(null); actualMarker = null; }
  clickedLocation = null;
  
  // Set up new round
  pickRandomLocation();

  // Load the panorama for the new location (using position)
  panorama.setPosition({
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });

  // Re-apply settings (movement enabled)
  panorama.setOptions({
    addressControl: false,
    motionTrackingControl: false,
    panControl: true, 
    zoomControl: false,
    fullscreenControl: false,
    visible: true,
  });


  map.setCenter({ lat: 30.627977, lng: -96.334407 });
  map.setZoom(14);

  confirmBtn.textContent = "✅ Confirm Guess";
  confirmBtn.disabled = true;

  confirmBtn.removeEventListener("click", handleNextRound);
  confirmBtn.addEventListener("click", handleConfirmGuess);
}

function initMapGame() {
  const collegeStation = { lat: 30.627977, lng: -96.334407 };

  // This calls pickRandomLocation
  pickRandomLocation();

  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: collegeStation,
    zoom: 14,
  });
  
  // Apply movement controls enabled
  const panoramaOptions: google.maps.StreetViewPanoramaOptions = {
    // Load panorama based on position (lat/lng)
    position: { lat: currentLocation.lat, lng: currentLocation.lng }, 
    
    pov: { heading: 165, pitch: 0 },
    zoom: 1,
    // Movement controls are enabled by default (linksControl and clickToGo omitted/true)
    addressControl: false,
    motionTrackingControl: false,
    panControl: true,    // Allow looking around (panning)
    zoomControl: false,
    fullscreenControl: false,
  };


  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view") as HTMLElement,
    panoramaOptions
  );

  map.addListener("click", (event: google.maps.MapMouseEvent) => {
    clickedLocation = event.latLng;

    if (marker) {
      marker.setPosition(clickedLocation);
    } else {
      marker = new google.maps.Marker({
        position: clickedLocation!,
        map: map,
        draggable: true,
      });

      marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
        clickedLocation = e.latLng;
      });
    }

    (document.getElementById("confirmBtn") as HTMLButtonElement).disabled = false;
  });

  const confirmBtn = document.getElementById("confirmBtn");
  if (confirmBtn) {
    confirmBtn.removeEventListener("click", handleConfirmGuess);
    confirmBtn.addEventListener("click", handleConfirmGuess);
  }
}
// * END OF EMBEDDED GAME LOGIC
// **********************************************

// --- REACT COMPONENT ---

export default function RoundsPage() {
  const scriptLoaded = useRef(false);
  const [gameMessage, setGameMessage] = useState("Loading game...");
  const [roundInfo, setRoundInfo] = useState("");
  // Time state removed
    
  // Initialize Next.js router
  const router = useRouter();

  // Assign the state setters to the global functions for use in game logic
  useEffect(() => {
    updateGameMessage = setGameMessage;
    updateRoundInfo = setRoundInfo;
    // updateTimeLeft assignment removed
    
    // Cleanup function: now empty as no timer cleanup is needed
    return () => {}
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).initMapGame = initMapGame;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!scriptLoaded.current && apiKey && typeof window !== 'undefined' && !(window as any).google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapGame&libraries=geometry`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      scriptLoaded.current = true;
    } else if ((window as any).google && (window as any).initMapGame) {
      (window as any).initMapGame();
    }


    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).initMapGame;
      }
    };
  }, []);

  // Define the click handler for the Home button
  const handleGoHome = () => {
    router.push('/'); // Navigate to the root path
  };
  
  // Timer style logic removed
  const infoBoxStyle = {
    position: "absolute" as "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "white",
    padding: "10px 15px",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
    minWidth: 250,
    maxWidth: 400,
    fontSize: 16,
    lineHeight: 1.4,
  };


  return (
    <main style={{ height: "100vh", margin: 0, padding: 0, overflow: "hidden", position: "relative" }}>
      {/* Game Message Display Box */}
      <div style={infoBoxStyle}>
        <h2 style={{ margin: "0 0 5px 0", fontSize: 18, color: "#500000" }}>Weekly Challenge</h2>
        
        {/* Timer Display REMOVED */}

        <p style={{ margin: "0", whiteSpace: "pre-wrap" }}>
          {gameMessage}
          {roundInfo && (
            <>
              <br />
              <strong style={{color: '#a5d6a7'}}>-- Round Details --</strong>
              <br />
              {roundInfo}
            </>
          )}
        </p>
      </div>

      {/* Street View Container */}
      <div
        id="street-view"
        style={{ height: "100%", width: "100%", position: "relative" }}
      >
        {/* Map Container (Mini-Map) */}
        <div
          className={styles.Map}
          id="map"
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            //height: 250,
            //width: 350,
            border: "2px solid white",
            borderRadius: 8,
            boxShadow: "0 0 10px rgba(0,0,0,0.7)",
            zIndex: 15,
            backgroundColor: "#eee",
          }}
        ></div>
      </div>
    
      {/* HOME BUTTON */}
      <button
        onClick={handleGoHome} // Use the new handler
        style={{
          position: "absolute",
          bottom: 80, // Positioned above the Confirm Guess button
          left: 20,
          zIndex: 15,
          padding: "12px 24px",
          fontSize: 16,
          borderRadius: 6,
          border: "none",
          backgroundColor: "#500000", // Texas A&M Maroon
          color: "white",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          userSelect: "none",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#6a0000";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#500000";
        }}
      >
        🏠 Back to Home
      </button>


      {/* Confirm Button */}
      <button
        id="confirmBtn"
        disabled
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          zIndex: 15,
          padding: "12px 24px",
          fontSize: 16,
          borderRadius: 6,
          border: "none",
          backgroundColor: "#4caf50",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          userSelect: "none",
          transition: "background-color 0.3s",
        }}
        onMouseOver={(e) => {
          if (!(e.currentTarget as HTMLButtonElement).disabled) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#45a049";
          }
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#4caf50";
        }}
      >
        ✅ Confirm Guess
      </button>
    </main>
  );
}