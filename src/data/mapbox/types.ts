import { MyViewportProps } from '../../types/mapbox';
import { PayloadAction } from '../../types/reducer';

export type MapboxState = { viewport: MyViewportProps };

type MapboxActionType = 'MAPBOX';

type SetViewportAction = PayloadAction<
  MapboxActionType,
  'SET_VIEWPORT',
  MyViewportProps
>;

export type MapboxAction = SetViewportAction;
