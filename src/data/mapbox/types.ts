import { ViewportProps } from 'react-map-gl';
import { PayloadAction } from '../../types/reducer';

export type MyViewportProps = Pick<
  ViewportProps,
  | 'width'
  | 'height'
  | 'latitude'
  | 'longitude'
  | 'zoom'
  | 'minZoom'
  | 'maxZoom'
  | 'pitch'
  | 'bearing'
  | 'transitionDuration'
>;

export type MapStyleName = 'streets' | 'satellite-streets';

export type MapboxState = { mapStyle: MapStyleName; viewport: MyViewportProps };

type MapboxActionType = 'MAPBOX';

type SetMapStyleAction = PayloadAction<
  MapboxActionType,
  'SET_MAP_STYLE',
  MapStyleName
>;

type SetViewportAction = PayloadAction<
  MapboxActionType,
  'SET_VIEWPORT',
  MyViewportProps
>;

export type MapboxAction = SetMapStyleAction | SetViewportAction;
