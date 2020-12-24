import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactMapGl, { ScaleControl } from 'react-map-gl';
import { MyViewportProps } from '../types/mapbox';
import MapboxGeocoder from './components/mapbox-geocoder';
import MapControlsToolbar from './components/map-controls-toolbar';
import vars from '../scss/vars';

const App: React.FC<{}> = () => {
  const mapRef = useRef<ReactMapGl | null>(null);

  const [viewport, setViewport] = useState<MyViewportProps>({
    width: 400,
    height: 400,
    latitude: 48.3419023,
    longitude: 8.8835719,
    zoom: 3,
    minZoom: 1,
    maxZoom: 21,
    bearing: 0,
    pitch: 0,
  });

  useEffect(() => {
    const initialViewport: MyViewportProps = {
      ...viewport,
      width: window.innerWidth,
      height: window.innerHeight - vars['top-panel-height'],
    };
    setViewport(initialViewport);

    window.addEventListener('resize', () => {
      setViewport({
        ...viewport,
        width: window.innerWidth,
        height: window.innerHeight - 200,
      });
    });
  }, []);

  return (
    <div className="content">
      <div className="top-panel">Hallo there</div>
      <div className="map-container">
        <ReactMapGl
          {...viewport}
          onViewportChange={v => setViewport(v)}
          mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
          ref={mapRef}
          mapStyle={'mapbox://styles/mapbox/streets-v11'}
          doubleClickZoom={false}
          clickRadius={5}
          getCursor={({ isHovering, isDragging }) =>
            isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default'
          }
        >
          <div className="scale-controls-container">
            <ScaleControl maxWidth={100} unit={'metric'} />
            <ScaleControl maxWidth={100} unit={'imperial'} />
          </div>
        </ReactMapGl>
        <div className="map-controls-container top left">
          <MapboxGeocoder viewport={viewport} setViewport={setViewport} />
        </div>
        <div className="map-controls-container top right">
          <MapControlsToolbar viewport={viewport} setViewport={setViewport} />
        </div>
      </div>
    </div>
  );
};

export default App;
