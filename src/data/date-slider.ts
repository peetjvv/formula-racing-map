import { Reducer } from 'react';
import { PayloadAction } from '../types/reducer';
import { throwIfNotNever } from '../util/typescript';
import { State } from './';

export type DateSliderState = { minValue: Date; maxValue: Date };

type ChangeMinValueAction = PayloadAction<
  'DATE_SLIDER',
  'CHANGE_MIN_VALUE',
  Date
>;
type ChangeMaxValueAction = PayloadAction<
  'DATE_SLIDER',
  'CHANGE_MAX_VALUE',
  Date
>;
export type DateSliderAction = ChangeMinValueAction | ChangeMaxValueAction;

export const initialState: DateSliderState = {
  minValue: new Date(2021, 3, 5),
  maxValue: new Date(2021, 7, 19),
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
