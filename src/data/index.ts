import { Reducer } from 'react';
import { throwIfNotNever } from '../util/typescript';
import {
  DateSliderState,
  DateSliderAction,
  initialState as DateSliderInitialState,
  reducer as DateSliderReducer,
} from './date-slider';
import * as MapboxData from './mapbox';
import { MapboxAction, MapboxState } from './mapbox/types';

export type State = { dateSlider: DateSliderState; mapbox: MapboxState };
export type AllActions = DateSliderAction | MapboxAction;

export const initialState: State = {
  dateSlider: DateSliderInitialState,
  mapbox: MapboxData.initialState,
};

export const combinedReducer: Reducer<State, AllActions> = (state, action) => {
  switch (action.type) {
    case 'MAPBOX':
      return MapboxData.reducer(state, action);

    case 'DATE_SLIDER':
      return DateSliderReducer(state, action);

    default:
      throwIfNotNever(action);
      return state;
  }
};
