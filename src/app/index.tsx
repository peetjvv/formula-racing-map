import * as React from 'react';
import { useState } from 'react';
import { MyViewportProps } from '../types/mapbox';
import Map from './map';

const App: React.FC<{}> = () => {
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

  return (
    <div className="content">
      <div className="top-panel">Hallo there</div>
      <Map viewport={viewport} setViewport={setViewport} />
    </div>
  );
};

export default App;
