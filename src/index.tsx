import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import ReactMapGl, { ViewportProps } from 'react-map-gl';
import vars from './vars';
import './main.scss';

type MyViewportProps = Pick<
  ViewportProps,
  'width' | 'height' | 'latitude' | 'longitude' | 'zoom' | 'pitch' | 'bearing'
>;

const App: React.FC<{}> = () => {
  const [viewport, setViewport] = useState<MyViewportProps>({
    width: 400,
    height: 400,
    latitude: 48.3419023,
    longitude: 8.8835719,
    zoom: 3,
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
    <div className="app">
      <div className="top-panel">Hallo there</div>
      <div className="map-container">
        <ReactMapGl
          {...viewport}
          onViewportChange={v => setViewport(v)}
          mapboxApiAccessToken={
            'pk.eyJ1IjoicGVldGp2diIsImEiOiJja2lza3E5cmkyMzAyMnFwM2VpeWUwYjV2In0.kze_sfKhhkSqVM5DfQtlMw'
          }
          mapStyle={'mapbox://styles/mapbox/streets-v11'}
          doubleClickZoom={false}
          clickRadius={5}
          getCursor={({ isHovering, isDragging }) =>
            isHovering ? 'pointer' : 'default'
          }
        ></ReactMapGl>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
