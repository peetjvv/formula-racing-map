import * as React from 'react';

const DateRangeSlider: React.FC<{}> = props => {
  const {} = props;

  const sliderMinFromLeft = 0.25;
  const sliderMaxFromLeft = 0.6;
  const sliderWidth = sliderMaxFromLeft - sliderMinFromLeft;

  return (
    <div className="date-range-slider-container">
      <div className="date-range-slider">
        {/* <label>min</label> */}
        <div className="track">
          <div className="track-background" />
          <div
            className="track-slider"
            style={{
              left: `${sliderMinFromLeft * 100}%`,
              width: `${sliderWidth * 100}%`,
            }}
          >
            <div className="track-slider-knob left" />
            <div className="track-slider-knob right" />
          </div>
        </div>
        {/* <label>max</label> */}
      </div>
    </div>
  );
};

export default DateRangeSlider;
