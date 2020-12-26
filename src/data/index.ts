import { Reducer } from 'react';
import { throwIfNotNever } from '../util/typescript';
import * as MapboxData from './mapbox';
import { MapboxAction, MapboxState } from './mapbox/types';

export type State = { mapbox: MapboxState };
export type AllActions = MapboxAction;

export const initialState: State = { mapbox: MapboxData.initialState };

export const combinedReducer: Reducer<State, AllActions> = (state, action) => {
  switch (action.type) {
    case 'MAPBOX':
      return MapboxData.reducer(state, action);

    default:
      throwIfNotNever(action.type);
      return state;
  }
};
