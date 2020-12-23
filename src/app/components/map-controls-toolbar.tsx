import * as React from 'react';
import { MyViewportProps } from '../../types/mapbox';

const MapControlsToolbar: React.FC<{
  viewport: MyViewportProps;
  setViewport: (vp: MyViewportProps) => void;
}> = props => {
  const { viewport, setViewport } = props;

  const showPitch = !!viewport['pitch'];
  const showBearing = !!viewport['bearing'];

  return <div className="map-controls-toolbar">Map controls here</div>;
};

export default MapControlsToolbar;
