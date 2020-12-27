import { Reducer } from 'react';
import { PayloadAction } from '../types/reducer';
import { throwIfNotNever } from '../util/typescript';
import { State } from './';

export type DateSliderState = { minValue: string; maxValue: string };

type ChangeMinValueAction = PayloadAction<
  'DATE_SLIDER',
  'CHANGE_MIN_VALUE',
  string
>;
type ChangeMaxValueAction = PayloadAction<
  'DATE_SLIDER',
  'CHANGE_MAX_VALUE',
  string
>;
export type DateSliderAction = ChangeMinValueAction | ChangeMaxValueAction;

export const initialState: DateSliderState = {
  minValue: new Date(2021, 3, 5).toISOString(),
  maxValue: new Date(2021, 7, 19).toISOString(),
};

export const reducer: Reducer<State, DateSliderAction> = (state, action) => {
  switch (action.subType) {
    case 'CHANGE_MIN_VALUE':
      return {
        ...state,
        dateSlider: { ...state.dateSlider, minValue: action.payload },
      };
    case 'CHANGE_MAX_VALUE':
      return {
        ...state,
        dateSlider: { ...state.dateSlider, maxValue: action.payload },
      };

    default:
      throwIfNotNever(action);
      return state;
  }
};
