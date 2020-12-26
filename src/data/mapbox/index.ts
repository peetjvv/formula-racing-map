import { Reducer } from 'react';
import { throwIfNotNever } from '../../util/typescript';
import { MapboxAction, MapboxState } from './types';
import { State } from '../';

export const initialState: MapboxState = {
  mapStyle: 'streets',
  viewport: {
    width: 400,
    height: 400,
    latitude: 48.3419023,
    longitude: 8.8835719,
    zoom: 3,
    minZoom: 1,
    maxZoom: 21,
    bearing: 0,
    pitch: 0,
  },
};

export const reducer: Reducer<State, MapboxAction> = (state, action) => {
  switch (action.subType) {
    case 'SET_MAP_STYLE':
      return {
        ...state,
        mapbox: { ...state.mapbox, mapStyle: action.payload },
      };
    case 'SET_VIEWPORT':
      return {
        ...state,
        mapbox: { ...state.mapbox, viewport: action.payload },
      };

    default:
      throwIfNotNever(action);
      return state;
  }
};
