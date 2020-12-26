import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactMapGl, { Layer, ScaleControl } from 'react-map-gl';
import { MapStyleName, MyViewportProps } from '../types/mapbox';
import MapboxGeocoder from './components/mapbox-geocoder';
import MapControlsToolbar from './components/map-controls-toolbar';
import vars from '../scss/vars';
import MapStyleToolbar from './components/map-style-toolbar';
import { AllActions } from '../data';

const Map: React.FC<{
  viewport: MyViewportProps;
  dispatch: React.Dispatch<AllActions>;
}> = props => {
  const { viewport, dispatch } = props;

  const mapRef = useRef<ReactMapGl | null>(null);

  const [mapStyle, setMapStyle] = useState<MapStyleName>('streets');
  const setViewport = (vp: MyViewportProps) =>
    dispatch({ type: 'MAPBOX', subType: 'SET_VIEWPORT', payload: vp });

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
    <div className="map-container">
      <ReactMapGl
        {...viewport}
        onViewportChange={v => setViewport(v)}
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
        ref={mapRef}
        mapStyle={`mapbox://styles/mapbox/${mapStyle}-v11`} // this hack will only work if there is a map style url that map style name fits into like this
        doubleClickZoom={false}
        clickRadius={5}
        getCursor={({ isHovering, isDragging }) =>
          isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default'
        }
      >
        {/* <Layer
      {...{
        id: 'landuse_park',
        type: 'fill',
        source: 'mapbox',
        'source-layer': 'landuse',
        filter: ['==', 'class', 'park'],
      }}
      paint={{ 'fill-color': '#ff0000' }}
    /> */}
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
      <div className="map-controls-container bottom left">
        <MapStyleToolbar value={mapStyle} onChange={setMapStyle} />
      </div>
    </div>
  );
};

export default Map;
