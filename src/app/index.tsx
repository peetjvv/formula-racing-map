import { DateTime } from 'luxon';
import * as React from 'react';
import { AllActions, combinedReducer, initialState, State } from '../data';
import createPersistedReducer from '../util/persisted-reducer/use-persisted-reducer';
import Map from './map';

const usePersistedReducer = createPersistedReducer<State, AllActions>(
  'persisted-state'
);

const App: React.FC<{}> = () => {
  const [state, dispatch] = usePersistedReducer(combinedReducer, initialState);
  // const [state, dispatch] = React.useReducer(combinedReducer, initialState);

  return (
    <div className="content">
      <div className="top-panel">Hallo there</div>
      <Map
        mapStyle={state.mapbox.mapStyle}
        viewport={state.mapbox.viewport}
        dateSliderMinValue={DateTime.fromISO(state.dateSlider.minValue)}
        dateSliderMaxValue={DateTime.fromISO(state.dateSlider.maxValue)}
        dispatch={dispatch}
      />
    </div>
  );
};

export default App;
