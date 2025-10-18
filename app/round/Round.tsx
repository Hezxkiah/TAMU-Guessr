"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Dynamically load the Google Maps script
    const script = document.createElement("script");
    script.src =
      "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=geometry";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    // Cleanup old script if component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <main style={{ padding: "20px" }}>
      <h2>Map and Street View with Distance</h2>
      <p>
        A random location in College Station is chosen at startup (used
        internally).<br />
        Click the map to drop a pin and see the distance from that hidden
        location.
      </p>

      <div
        id="container"
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <div
          id="map"
          style={{
            height: "500px",
            width: "50%",
          }}
        ></div>
        <div
          id="street-view"
          style={{
            height: "500px",
            width: "50%",
          }}
        ></div>
      </div>

      {/* Load your external script */}
      <script src="/script.js"></script>
    </main>
  );
}

