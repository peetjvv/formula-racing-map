import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';
import ReactMapGl, { ViewportProps } from 'react-map-gl';
import './main.scss';

type MyViewportProps = Pick<
  ViewportProps,
  'width' | 'height' | 'latitude' | 'longitude' | 'zoom' | 'pitch' | 'bearing'
>;

const App: React.FC<{}> = () => {
  const [viewport, setViewport] = useState<MyViewportProps>({
    width: 400,
    height: 400,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
    bearing: 0,
    pitch: 0,
  });

  useEffect(() => {
    const initialViewport: MyViewportProps = {
      ...viewport,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    setViewport(initialViewport);

    window.addEventListener('resize', () => {
      setViewport({
        ...viewport,
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });
  }, []);

  return (
    <div className="app">
      <div className="map-container">
        <ReactMapGl
          {...viewport}
          onViewportChange={v => setViewport(v)}
          mapboxApiAccessToken={
            'pk.eyJ1IjoicGVldGp2diIsImEiOiJjajluMW5jejM0c3BwMzNxdHVja2V1ZW90In0.lEV3-a6gpePWGBssPv02ng'
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
