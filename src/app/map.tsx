import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactMapGl, { Layer, MapRef, ScaleControl } from 'react-map-gl';
import MapboxGeocoder from './components/mapbox-geocoder';
import MapControlsToolbar from './components/map-controls-toolbar';
import vars from '../scss/vars';
import MapStyleToolbar from './components/map-style-toolbar';
import { AllActions } from '../data';
import { MapStyleName, MyViewportProps } from '../data/mapbox/types';
import { throwIfNotNever } from '../util/typescript';
import DateRangeSlider from './components/date-range-slider';
import { DateTime } from 'luxon';

const Map: React.FC<{
  mapStyle: MapStyleName;
  viewport: MyViewportProps;

  dateSliderMinValue: DateTime;
  dateSliderMaxValue: DateTime;

  dispatch: React.Dispatch<AllActions>;
}> = props => {
  const {
    mapStyle,
    viewport,

    dateSliderMinValue,
    dateSliderMaxValue,

    dispatch,
  } = props;

  const mapRef = useRef<MapRef | null>(null);
  const bottomCenterControlsContainerRef = useRef<HTMLDivElement | null>(null);

  let mapStyleUrl: string | undefined;
  switch (mapStyle) {
    case 'streets':
      mapStyleUrl = `mapbox://styles/mapbox/streets-v11`;
      break;
    case 'satellite-streets':
      mapStyleUrl = `mapbox://styles/mapbox/satellite-streets-v11`;
      break;

    default:
      throwIfNotNever(mapStyle);
      break;
  }

  const setViewport = (vp: MyViewportProps) =>
    dispatch({ type: 'MAPBOX', subType: 'SET_VIEWPORT', payload: vp });

  useEffect(() => {
    const initialViewport: MyViewportProps = {
      ...viewport,
      width: window.innerWidth,
      height: window.innerHeight - parseInt(vars['top-panel-height']),
    };
    setViewport(initialViewport);

    window.addEventListener('resize', () => {
      setViewport({
        ...viewport,
        width: window.innerWidth,
        height: window.innerHeight - parseInt(vars['top-panel-height']),
      });
    });
  }, []);

  return (
    <div className="map-container">
      <ReactMapGl
        {...viewport}
        onViewportChange={(v: MyViewportProps) => setViewport(v)}
        mapboxApiAccessToken={process.env.MAPBOX_TOKEN}
        ref={mapRef}
        mapStyle={mapStyleUrl}
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
        <MapStyleToolbar
          value={mapStyle}
          onChange={style =>
            dispatch({
              type: 'MAPBOX',
              subType: 'SET_MAP_STYLE',
              payload: style,
            })
          }
        />
      </div>
      <div
        ref={bottomCenterControlsContainerRef}
        className="map-controls-container bottom center"
        style={{
          left:
            !!bottomCenterControlsContainerRef &&
            !!bottomCenterControlsContainerRef.current
              ? Math.ceil(
                  window.innerWidth / 2 -
                    bottomCenterControlsContainerRef.current.clientWidth / 2
                )
              : undefined,
        }}
      >
        <DateRangeSlider
          min={DateTime.fromJSDate(new Date(2021, 0, 1))}
          max={DateTime.fromJSDate(new Date(2021, 11, 31))}
          minValue={dateSliderMinValue}
          maxValue={dateSliderMaxValue}
          onMinValueChange={v =>
            dispatch({
              type: 'DATE_SLIDER',
              subType: 'CHANGE_MIN_VALUE',
              payload: v.toISO(),
            })
          }
          onMaxValueChange={v =>
            dispatch({
              type: 'DATE_SLIDER',
              subType: 'CHANGE_MAX_VALUE',
              payload: v.toISO(),
            })
          }
        />
      </div>
    </div>
  );
};

export default Map;
