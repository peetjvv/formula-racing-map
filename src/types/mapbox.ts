import { ViewportProps } from 'react-map-gl';

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
