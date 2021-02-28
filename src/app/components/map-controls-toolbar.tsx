import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaSolidIcons from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { MAPBOX_TRANSITION_DURATION_SHORT } from '../../consts';
import { MyViewportProps } from '../../data/mapbox/types';

const MapControlButton: React.FC<{
  className?: string;
  disabled?: boolean;
  icon: IconDefinition;
  iconStyle?: React.CSSProperties;
  onClick: () => void;
  value?: number;
}> = props => {
  const {
    className = '',
    disabled = false,
    icon,
    iconStyle = {},
    onClick,
    value,
  } = props;

  return (
    <div
      className={`map-control-button ${
        disabled ? 'disabled' : ''
      } ${className}`}
      onClick={() => {
        if (!disabled) {
          onClick();
        }
      }}
    >
      <FontAwesomeIcon style={iconStyle} icon={icon} />
      {value !== undefined ? <span>{value.toFixed(1)}</span> : null}
    </div>
  );
};

const MapControlsToolbar: React.FC<{
  viewport: MyViewportProps;
  setViewport: (vp: MyViewportProps) => void;
}> = props => {
  const { viewport, setViewport } = props;

  return (
    <div className="map-controls-toolbar">
      <MapControlButton
        disabled={viewport.zoom === viewport.maxZoom}
        icon={FaSolidIcons.faPlus}
        onClick={() =>
          setViewport({
            ...viewport,
            zoom: viewport.zoom! + 1,
            transitionDuration: MAPBOX_TRANSITION_DURATION_SHORT,
          })
        }
        value={viewport.zoom}
      />
      <MapControlButton
        disabled={viewport.zoom === viewport.minZoom}
        icon={FaSolidIcons.faMinus}
        onClick={() =>
          setViewport({
            ...viewport,
            zoom: viewport.zoom! - 1,
            transitionDuration: MAPBOX_TRANSITION_DURATION_SHORT,
          })
        }
      />
      {viewport['bearing'] !== undefined ? (
        <MapControlButton
          disabled={viewport.bearing === 0}
          icon={FaSolidIcons.faLocationArrow}
          iconStyle={{ transform: `rotate(${viewport.bearing - 45}deg)` }}
          onClick={() =>
            setViewport({
              ...viewport,
              bearing: 0,
              transitionDuration: MAPBOX_TRANSITION_DURATION_SHORT,
            })
          }
          value={viewport.bearing}
        />
      ) : null}
      {viewport['pitch'] !== undefined ? (
        <MapControlButton
          disabled={(viewport.pitch || 0) === 0}
          icon={FaSolidIcons.faRoad}
          onClick={() =>
            setViewport({
              ...viewport,
              pitch: 0,
              transitionDuration: MAPBOX_TRANSITION_DURATION_SHORT,
            })
          }
          value={viewport.pitch}
        />
      ) : null}
    </div>
  );
};

export default MapControlsToolbar;
