import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDirection from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";

import * as Styles from "./styled";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiemVuaXRzdSIsImEiOiJja3FjNzR3ZjAwdGdyMm5vdjFqa3hwN25mIn0.cLd4F1gnAF8_kORW7FSnDg";

const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/zenitsu/ckqeu0i200cyk18mkb1cpvno9",
      center: [121.0503, 14.5547],
      zoom: 17,
    });
    const style = [
      {
        id: "directions-route-line-alt",
        type: "line",
        source: "directions",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#bbb",
          "line-width": 4,
        },
        filter: [
          "all",
          ["in", "$type", "LineString"],
          ["in", "route", "alternate"],
        ],
      },
      {
        id: "directions-route-line-casing",
        type: "line",
        source: "directions",
        layout: {
          "line-cap": "round",
          "line-join": "round",
        },
        paint: {
          "line-color": "#2d5f99",
          "line-width": 12,
        },
        filter: [
          "all",
          ["in", "$type", "LineString"],
          ["in", "route", "selected"],
        ],
      },
      {
        id: "directions-route-line",
        type: "line",
        source: "directions",
        layout: {
          "line-cap": "butt",
          "line-join": "round",
        },
        paint: {
          "line-color": {
            property: "congestion",
            type: "categorical",
            default: "#4882c5",
            stops: [
              ["unknown", "#4882c5"],
              ["low", "#4882c5"],
              ["moderate", "#f09a46"],
              ["heavy", "#e34341"],
              ["severe", "#8b2342"],
            ],
          },
          "line-width": 7,
        },
        filter: [
          "all",
          ["in", "$type", "LineString"],
          ["in", "route", "selected"],
        ],
      },
      {
        id: "directions-hover-point-casing",
        type: "circle",
        source: "directions",
        paint: {
          "circle-radius": 8,
          "circle-color": "#fff",
        },
        filter: ["all", ["in", "$type", "Point"], ["in", "id", "hover"]],
      },
      {
        id: "directions-hover-point",
        type: "circle",
        source: "directions",
        paint: {
          "circle-radius": 6,
          "circle-color": "#3bb2d0",
        },
        filter: ["all", ["in", "$type", "Point"], ["in", "id", "hover"]],
      },
      {
        id: "directions-waypoint-point-casing",
        type: "circle",
        source: "directions",
        paint: {
          "circle-radius": 8,
          "circle-color": "#fff",
        },
        filter: ["all", ["in", "$type", "Point"], ["in", "id", "waypoint"]],
      },
      {
        id: "directions-waypoint-point",
        type: "circle",
        source: "directions",
        paint: {
          "circle-radius": 6,
          "circle-color": "#8a8bc9",
        },
        filter: ["all", ["in", "$type", "Point"], ["in", "id", "waypoint"]],
      },
      {
        id: "directions-origin-point",
        type: "circle",
        source: "directions",
        paint: {
          "circle-radius": 18,
          "circle-color": "#3bb2d0",
        },
        filter: ["all", ["in", "$type", "Point"], ["in", "marker-symbol", "A"]],
      },
      {
        id: "directions-origin-label",
        type: "symbol",
        source: "directions",
        layout: {
          "text-field": "A",
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#fff",
        },
        filter: ["all", ["in", "$type", "Point"], ["in", "marker-symbol", "A"]],
      },
      {
        id: "directions-destination-point",
        type: "circle",
        source: "directions",
        paint: {
          "circle-radius": 18,
          "circle-color": "#8a8bc9",
        },
        filter: ["all", ["in", "$type", "Point"], ["in", "marker-symbol", "B"]],
      },
      {
        id: "directions-destination-label",
        type: "symbol",
        source: "directions",
        layout: {
          "text-field": "B",
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "#fff",
        },
        filter: ["all", ["in", "$type", "Point"], ["in", "marker-symbol", "B"]],
      },
    ];

    const directions = new MapboxDirection({
      styles: style,
      accessToken: mapboxgl.accessToken,
      unit: "metric",
      profile: "mapbox/walking",
      alternatives: true,
      geometries: false,
      controls: { instructions: true },
      flyTo: false,
    });

    const geoLocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    });

    map.addControl(directions, "top-left");
    map.addControl(geoLocate);

    geoLocate.on("geolocate", (e) => {
      map.flyTo({
        center: [e.coords.longitude, e.coords.latitude],
        zoom: 17,
      });
    });

    map.scrollZoom.enable();
  }, []);

  return (
    <div>
      <Styles.Mapcontainer
        ref={mapContainer}
        className="map-container"
      ></Styles.Mapcontainer>
    </div>
  );
};

export default Map;
