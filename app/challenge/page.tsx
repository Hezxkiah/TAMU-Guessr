"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Note: Ensure your CSS file is named Challenge.module.css or update the import if necessary
import styles from "./Challenge.module.css";

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
let roundTimer: NodeJS.Timeout | null = null; // Variable to hold the interval ID

// 🎯 Challenge time is 25 seconds
const INITIAL_TIME = 25; // 25 seconds per round

// --- DEDICATED LOCATION DEFINITION SECTION ---
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
let previousLocation: LocationType | null = null; // <-- NEW: Stores the last location to prevent immediate repetition

// Functions linked to React state setters
let updateGameMessage: (message: string) => void;
let updateRoundInfo: (info: string) => void;
let updateTimeLeft: (time: number) => void; // New setter for the timer

/** Clears the current round timer if it exists. */
function stopTimer() {
    if (roundTimer !== null) {
        clearInterval(roundTimer);
        roundTimer = null;
    }
}

/** Starts the 25-second timer and handles time-out logic. */
function startTimer() {
    stopTimer(); // Clear any existing timer
    let time = INITIAL_TIME;
    updateTimeLeft(time);

    roundTimer = setInterval(() => {
        time -= 1;
        updateTimeLeft(time);

        if (time <= 0) {
            stopTimer();
            handleTimeExpired(); // Trigger the time-out logic
        }
    }, 1000);
}

/** Logic executed when the time runs out. */
function handleTimeExpired() {
    const confirmBtn = document.getElementById("confirmBtn") as HTMLButtonElement;
    
    // Announce time expired
    updateGameMessage(`🚨 Time's Up for Round ${round}!`);
    updateRoundInfo('No guess was placed in time. Score: 0.');

    // Disable the map click and guess button
    confirmBtn.disabled = false; // Enable to allow 'Next Round' click
    confirmBtn.textContent = "➡️ Next Round";
    
    // Remove the current event listener and prepare for the next round
    confirmBtn.removeEventListener("click", handleConfirmGuess);
    confirmBtn.addEventListener("click", handleNextRound);

    // If a marker was placed, clear it so it doesn't carry over
    if (marker) { marker.setMap(null); marker = null; }
    clickedLocation = null;

    // We do NOT calculate distance or add score (implicitly 0)
}


function pickRandomLocation() {
    let newLocation: LocationType;
    
    // FIX: Logic to prevent the same location from being picked twice in a row
    do {
        newLocation = loc_list[Math.floor(Math.random() * loc_list.length)];
    } while (newLocation === previousLocation && loc_list.length > 1);

    currentLocation = newLocation;
    previousLocation = newLocation; // Store the current location for the next check

    console.log(`🎯 Target for round ${round}: ${currentLocation.name}`);
    // Update message for challenge mode
    updateGameMessage(`Round ${round}/${maxRounds} (CHALLENGE): Guess the location!`);
    updateRoundInfo('');
    
    startTimer(); // <<< START TIMER HERE
}

function handleConfirmGuess() {
  if (!clickedLocation) {
    updateGameMessage("Click on the map to place your guess first!");
    return;
  }
  
  stopTimer(); // <<< STOP TIMER ON GUESS

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
    stopTimer(); // Ensure timer is stopped

    // Reset all game state variables
    round = 1;
    totalScore = 0;
    clickedLocation = null;
    previousLocation = null; // <-- IMPORTANT: Reset previous location for new game
    
    // Reset timer display
    updateTimeLeft(INITIAL_TIME);

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

  panorama.setPosition({
    lat: currentLocation.lat,
    lng: currentLocation.lng,
  });
  
  // Re-apply no-move settings (just in case)
  panorama.setOptions({
    addressControl: false,
    motionTrackingControl: false,
    linksControl: false,
    clickToGo: false, // Ensure this is reapplied
    panControl: true, // Allow looking around
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

  // This calls pickRandomLocation, which starts the timer for the first round
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
      // Disable movement controls (links, motion, zoom, fullscreen, and click-to-go)
      addressControl: false,
      motionTrackingControl: false,
      linksControl: false, // Disables the arrows for moving
      clickToGo: false,    // Disables clicking to move forward in Street View
      panControl: true,    // Allow looking around (panning)
      zoomControl: false,
      fullscreenControl: false,
    }
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

/**
 * Renders the Challenge Game Component.
 * NOTE: For Next.js App Router, ensure this file is named `ChallengeGame.tsx`
 * and is imported by `app/challenge/page.tsx`.
 */
export default function ChallengeGame() {
  const scriptLoaded = useRef(false);
  // Update initial message for challenge mode
  const [gameMessage, setGameMessage] = useState("Loading Challenge game...");
  const [roundInfo, setRoundInfo] = useState("");
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME); // New state for timer
    
  // Initialize Next.js router
  const router = useRouter();

  // Assign the state setters to the global functions for use in game logic
  useEffect(() => {
    updateGameMessage = setGameMessage;
    updateRoundInfo = setRoundInfo;
    updateTimeLeft = setTimeLeft; // New assignment
    
    // Cleanup function: important to stop the timer if the component unmounts!
    return () => {
        stopTimer();
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).initMapGame = initMapGame;
    }

    // IMPORTANT: Ensure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set in your .env.local file
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
    stopTimer(); // Crucial: Stop the game timer before navigating away
    router.push('/'); // Navigate to the root path (which typically renders home/page.tsx)
  };

  // 🚨 Dynamic panic style: Fades from yellow to red, and gets bolder/larger under 10 seconds.
  const timerStyle = {
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: timeLeft <= 10 && roundTimer !== null ? '20px' : '16px', // Gets bigger
    color: roundTimer === null
      ? 'yellow' // Paused/Done color
      : timeLeft <= 10
      ? '#ff4444' // Intense Red (Panic Time)
      : timeLeft <= 17 // Yellow between 25 and 17 seconds
      ? '#ffcc00' 
      : 'yellow', 
    transition: 'all 0.5s ease-in-out', // Smooth transition for the color/size change
  };


  return (
    <main style={{ height: "100vh", margin: 0, padding: 0, overflow: "hidden", position: "relative" }}>
      {/* Game Message Display Box */}
      <div
        style={{
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
        }}
      >
        {/* Update title for Challenge Mode */}
        <h2 style={{ margin: "0 0 5px 0", fontSize: 18, color: "#500000" }}>TAMU Guessr - Challenge Mode 🚀</h2>
        
        {/* Timer Display */}
        {/* 🚨 APPLY THE NEW, DYNAMIC PANIC STYLE */}
        <div style={timerStyle}>
            {roundTimer !== null && `⏳ TIME LEFT: ${timeLeft}s`}
            {roundTimer === null && 'Game Paused/Complete'}
        </div>

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
            //height: 250, // Removed for adaptive sizing
            //width: 350,  // Removed for adaptive sizing
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