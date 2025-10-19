"use client";
import { useEffect, useRef, useState } from "react";

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

const INITIAL_TIME = 30; // 30 seconds per round

// --- DEDICATED LOCATION DEFINITION SECTION ---
const zach = { name: "Zachry Engineering Building", lat: 30.620715, lng: -96.340905, };
const msc = { name: "Memorial Student Center", lat: 30.612063, lng: -96.342733, };

const loc_list = [
  zach, msc
];

type LocationType = typeof zach;
let currentLocation: LocationType;

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

/** Starts the 30-second timer and handles time-out logic. */
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

/** Logic executed when the 30 seconds run out. */
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
    // The next round logic will be triggered by handleNextRound click.
}


function pickRandomLocation() {
  currentLocation = loc_list[Math.floor(Math.random() * loc_list.length)];
  console.log(`🎯 Target for round ${round}: ${currentLocation.name}`);
  updateGameMessage(`Round ${round}/${maxRounds}: Guess the location!`);
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

export default function RoundsPage() {
  const scriptLoaded = useRef(false);
  const [gameMessage, setGameMessage] = useState("Loading game...");
  const [roundInfo, setRoundInfo] = useState("");
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME); // New state for timer

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
        <h2 style={{ margin: "0 0 5px 0", fontSize: 18, color: "#500000" }}>TAMU Guessr</h2>
        
        {/* Timer Display */}
        <div style={{ color: timeLeft <= 10 && roundTimer !== null ? 'red' : 'yellow', fontWeight: 'bold', marginBottom: '5px' }}>
            {roundTimer !== null && `⏳ Time Left: ${timeLeft} seconds`}
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
          id="map"
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            height: 250,
            width: 350,
            border: "2px solid white",
            borderRadius: 8,
            boxShadow: "0 0 10px rgba(0,0,0,0.7)",
            zIndex: 15,
            backgroundColor: "#eee",
          }}
        ></div>
      </div>

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