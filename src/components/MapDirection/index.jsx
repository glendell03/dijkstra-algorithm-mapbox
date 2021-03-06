import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const MapDirection = () => {
  const mapContainer = useRef(null);
  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX
    var map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/zenitsu/ckqeu0i200cyk18mkb1cpvno9",
      center: [121.0503, 14.5547], // starting position
      zoom: 17,
    });

    // initialize the map canvas to interact with later
    var canvas = map.getCanvasContainer();

    // an arbitrary start will always be the same
    // only the end or destination will change
    var start = [121.0503, 14.5547];

    // this is where the code for the next step will go

    // create a function to make a directions request
    function getRoute(end) {
      // make a directions request using cycling profile
      // an arbitrary start will always be the same
      // only the end or destination will change
      var start = [121.0503, 14.5547];
      var url =
        "https://api.mapbox.com/directions/v5/mapbox/walking/" +
        start[0] +
        "," +
        start[1] +
        ";" +
        end[0] +
        "," +
        end[1] +
        "?steps=true&geometries=geojson&access_token=" +
        mapboxgl.accessToken;

      // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.onload = function () {
        var json = JSON.parse(req.response);
        var data = json.routes[0];
        var route = data.geometry.coordinates;
        var geojson = {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route,
          },
        };
        // if the route already exists on the map, reset it using setData
        if (map.getSource("route")) {
          map.getSource("route").setData(geojson);
        } else {
          // otherwise, make a new request
          map.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: geojson,
                },
              },
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#3887be",
              "line-width": 5,
              "line-opacity": 0.75,
            },
          });
        }
        // add turn instructions here at the end
      };
      req.send();
    }

    map.on("load", function () {
      // make an initial directions request that
      // starts and ends at the same location
      getRoute(start);

      // Add starting point to the map
      map.addLayer({
        id: "point",
        type: "circle",
        source: {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Point",
                  coordinates: start,
                },
              },
            ],
          },
        },
        paint: {
          "circle-radius": 10,
          "circle-color": "#3887be",
        },
      });
      // this is where the code from the next step will go

      map.on("click", function (e) {
        var coordsObj = e.lngLat;
        canvas.style.cursor = "";
        var coords = Object.keys(coordsObj).map(function (key) {
          return coordsObj[key];
        });
        var end = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: coords,
              },
            },
          ],
        };
        if (map.getLayer("end")) {
          map.getSource("end").setData(end);
        } else {
          map.addLayer({
            id: "end",
            type: "circle",
            source: {
              type: "geojson",
              data: {
                type: "FeatureCollection",
                features: [
                  {
                    type: "Feature",
                    properties: {},
                    geometry: {
                      type: "Point",
                      coordinates: coords,
                    },
                  },
                ],
              },
            },
            paint: {
              "circle-radius": 10,
              "circle-color": "#f30",
            },
          });
        }
        getRoute(coords);
      });
    });
  }, []);
  return (
    <div>
      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: "100vh" }}
      />
    </div>
  );
};

export default MapDirection;
