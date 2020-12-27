import * as React from 'react';
import { useReducer } from 'react';
import { combinedReducer, initialState } from '../data';
import Map from './map';

const App: React.FC<{}> = () => {
  const [state, dispatch] = useReducer(combinedReducer, initialState);

  return (
    <div className="content">
      <div className="top-panel">Hallo there</div>
      <Map
        mapStyle={state.mapbox.mapStyle}
        viewport={state.mapbox.viewport}
        dateSliderMinValue={state.dateSlider.minValue}
        dateSliderMaxValue={state.dateSlider.maxValue}
        dispatch={dispatch}
      />
    </div>
  );
};

export default App;
