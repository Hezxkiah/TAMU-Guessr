"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./Weekly.module.css";

// FIX 1: REMOVE THE MODULE IMPORT for Google Maps types to fix the compile error.

// 2. DECLARE GLOBAL INTERFACE (Fixes "no-explicit-any" and global type errors)
declare global {
  interface Window {
    initMapGame?: () => void;
    google: typeof google;
  }
}

// **********************************************
// * START OF EMBEDDED GAME LOGIC
// **********************************************
// Use the full global namespace for type annotations:
let map: google.maps.Map;
let marker: google.maps.Marker | null;
let actualMarker: google.maps.Marker | null;
let panorama: google.maps.StreetViewPanorama;

let round = 1;
let totalScore = 0;
const maxRounds = 5;
let clickedLocation: google.maps.LatLng | null = null; 

// --- DEDICATED LOCATION DEFINITION SECTION (ONLY lat/lng) ---

const kyle = {name:"Kyle field", lat:30.610752, lng:-96.339233};
const twelveman = {name:"12th man", lat:30.612058, lng:-96.339987};
const quad = {name:"The quad", lat:30.614781, lng:-96.338047};
const pond = {name:"Aggie Pond", lat:30.608953, lng:-96.337527};
const reed = {name: "Reed Arena", lat:30.605801, lng:-96.345115};
const centree = {name: "Century Tree", lat:30.615927, lng:-96.341484};

const loc_list = [
  kyle,
  twelveman,
  quad,
  pond,
  reed,
  centree
];

type LocationType = typeof kyle; 
let currentLocation: LocationType;
let previousLocation: LocationType | null = null;

let updateGameMessage: (message: string) => void;
let updateRoundInfo: (info: string) => void;

function pickRandomLocation() {
    let newLocation: LocationType;
    
    do {
        newLocation = loc_list[Math.floor(Math.random() * loc_list.length)];
    } while (newLocation === previousLocation && loc_list.length > 1);

    currentLocation = newLocation;
    previousLocation = newLocation;

    console.log(`🎯 Target for round ${round}: ${currentLocation.name}`);
    updateGameMessage(`Round ${round}/${maxRounds}: Guess the location!`);
    updateRoundInfo('');
}

function handleConfirmGuess() {
  if (!clickedLocation) {
    updateGameMessage("Click on the map to place your guess first!");
    return;
  }

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
    round = 1;
    totalScore = 0;
    clickedLocation = null;
    previousLocation = null; 
    
    if (marker) { marker.setMap(null); marker = null; }
    if (actualMarker) { actualMarker.setMap(null); actualMarker = null; }

    const confirmBtn = document.getElementById("confirmBtn") as HTMLButtonElement;
    confirmBtn.textContent = "✅ Confirm Guess";
    confirmBtn.disabled = true;
    confirmBtn.removeEventListener("click", handlePlayAgain);
    confirmBtn.addEventListener("click", handleConfirmGuess);

    initMapGame();
}

function handleNextRound() {
  round++;
  const confirmBtn = document.getElementById("confirmBtn") as HTMLButtonElement;

  if (round > maxRounds) {
    updateGameMessage(`🎉 Game Over! Final Score: ${totalScore} / ${maxRounds * 1200}`);
    updateRoundInfo(`Total rounds played: ${maxRounds}`);

    confirmBtn.textContent = "🔄 Play Again?";
    confirmBtn.disabled = false;

    confirmBtn.removeEventListener("click", handleNextRound);
    confirmBtn.addEventListener("click", handlePlayAgain);
    return;
  }

  pickRandomLocation();

  // FIX 3: Pass a single LatLngLiteral object to setPosition (Fixes InvalidValueError)
  panorama.setPosition({
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });

  panorama.setOptions({
    addressControl: false,
    motionTrackingControl: false,
    panControl: true, 
    zoomControl: false,
    fullscreenControl: false,
    visible: true,
  });

  if (marker) { marker.setMap(null); marker = null; }
  if (actualMarker) { actualMarker.setMap(null); actualMarker = null; }
  clickedLocation = null;

  map.setCenter({ lat: 30.627977, lng: -96.334407 });
  map.setZoom(14);

  confirmBtn.textContent = "✅ Confirm Guess";
  confirmBtn.disabled = true;

  confirmBtn.removeEventListener("click", handleNextRound);
  confirmBtn.addEventListener("click", handleConfirmGuess);
}

function initMapGame() {
  const collegeStation = { lat: 30.627977, lng: -96.334407 };

  pickRandomLocation();

  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: collegeStation,
    zoom: 14,
  });

  panorama = new google.maps.StreetViewPanorama(
    document.getElementById("street-view") as HTMLElement,
    {
      position: { lat: currentLocation.lat, lng: currentLocation.lng },
      pov: { heading: 165, pitch: 0 },
      zoom: 1,
      addressControl: false,
      motionTrackingControl: false,
      panControl: true,
      zoomControl: false,
      fullscreenControl: false,
      visible: true,
    }
  );

  // Use full type name for event:
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
    
  const router = useRouter();

  useEffect(() => {
    updateGameMessage = setGameMessage;
    updateRoundInfo = setRoundInfo;
    
    return () => {}
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.initMapGame = initMapGame;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!scriptLoaded.current && apiKey && typeof window !== 'undefined' && !window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapGame&libraries=geometry`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      scriptLoaded.current = true;
    } else if (window.google && window.initMapGame) {
      window.initMapGame();
    }


    return () => {
      // FIX 4: Delete statement removed
    };
  }, []);

  const handleGoHome = () => {
    router.push('/');
  };
  
  // FIX 5: Use `as const` on the whole object to fix `prefer-as-const`
  const infoBoxStyle = {
    position: "absolute",
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
  } as const;


  return (
    <main style={{ height: "100vh", margin: 0, padding: 0, overflow: "hidden", position: "relative" }}>
      {/* Game Message Display Box */}
      <div style={infoBoxStyle}>
        <h2 style={{ margin: "0 0 5px 0", fontSize: 18, color: "#500000" }}>Weekly Challenge</h2>
        
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
          id="map"
          className={styles.Map}
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
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
        onClick={handleGoHome} 
        style={{
          position: "absolute",
          bottom: 80, 
          left: 20,
          zIndex: 15,
          padding: "12px 24px",
          fontSize: 16,
          borderRadius: 6,
          border: "none",
          backgroundColor: "#500000",
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