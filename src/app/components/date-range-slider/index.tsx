import * as React from 'react';
import { DateTime } from 'luxon';

type DateRangeSliderProps = {
  min: DateTime;
  max: DateTime;
  minValue: DateTime;
  maxValue: DateTime;
  onMinValueChange: (v: DateTime) => void;
  onMaxValueChange: (v: DateTime) => void;
};

const calculateValuePercInRange = (
  value: number,
  min: number,
  max: number
): number => {
  if (value < min || value > max) {
    throw new Error(`value (${value}) out of bounds`);
  }

  const valueNormalised = value - min;
  const maxNormalised = max - min;
  const result = valueNormalised / maxNormalised;
  return result;
};

const DateRangeSlider: React.FC<DateRangeSliderProps> = props => {
  const {
    min,
    max,
    minValue,
    maxValue,
    onMinValueChange,
    onMaxValueChange,
  } = props;

  if (minValue < min || minValue > max) {
    throw new Error(`minValue (${minValue}) out of bounds`);
  } else if (maxValue < min || maxValue > max) {
    throw new Error(`maxValue (${maxValue}) out of bounds`);
  }

  const sliderMinFromLeftPerc = calculateValuePercInRange(
    minValue.toMillis(),
    min.toMillis(),
    max.toMillis()
  );
  const sliderMaxFromLeftPerc = calculateValuePercInRange(
    maxValue.toMillis(),
    min.toMillis(),
    max.toMillis()
  );
  const sliderWidth = sliderMaxFromLeftPerc - sliderMinFromLeftPerc;

  return (
    <div className="date-range-slider-container">
      <div className="date-range-slider">
        <label className="min-label">{min.toFormat('d LLL')}</label>
        <div className="track">
          <div className="track-background" />
          <div
            className="track-slider"
            style={{
              left: `${sliderMinFromLeftPerc * 100}%`,
              width: `${sliderWidth * 100}%`,
            }}
          >
            <div className="track-slider-knob left" />
            <div className="track-slider-knob right" />
          </div>
        </div>
        <label className="max-label">{max.toFormat('d LLL')}</label>
      </div>
    </div>
  );
};

export default DateRangeSlider;
