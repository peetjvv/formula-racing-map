import { ViewportProps } from 'react-map-gl';

export type MyViewportProps = Pick<
  ViewportProps,
  | 'width'
  | 'height'
  | 'latitude'
  | 'longitude'
  | 'zoom'
  | 'pitch'
  | 'bearing'
  | 'transitionDuration'
>;
