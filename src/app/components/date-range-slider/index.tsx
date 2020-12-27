import * as React from 'react';
import { DateTime } from 'luxon';

type DateRangeSliderProps = {
  min: Date;
  max: Date;
  minValue: Date;
  maxValue: Date;
  onMinValueChange: (v: Date) => void;
  onMaxValueChange: (v: Date) => void;
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
    minValue.getTime(),
    min.getTime(),
    max.getTime()
  );
  const sliderMaxFromLeftPerc = calculateValuePercInRange(
    maxValue.getTime(),
    min.getTime(),
    max.getTime()
  );
  const sliderWidth = sliderMaxFromLeftPerc - sliderMinFromLeftPerc;

  const minDateTime = DateTime.fromJSDate(min);
  const maxDateTime = DateTime.fromJSDate(max);

  return (
    <div className="date-range-slider-container">
      <div className="date-range-slider">
        <label className="min-label">{minDateTime.toFormat('d LLL')}</label>
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
        <label className="max-label">{maxDateTime.toFormat('d LLL')}</label>
      </div>
    </div>
  );
};

export default DateRangeSlider;
