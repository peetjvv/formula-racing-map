import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaSolidIcons from '@fortawesome/free-solid-svg-icons';
import { Geometry, Position } from 'geojson';
import axios from 'axios';
import AutosizeInput from 'react-input-autosize';
import { MAPBOX_TRANSITION_DURATION_SHORT } from '../../consts';
import { isCoord } from '../../util/regex';
import { MyViewportProps } from '../../data/mapbox/types';

type MapboxGeocodeFeature = {
  bbox: number[];
  center: Position;
  geometry: Geometry;
  id: string;
  matching_place_name?: string;
  matching_text?: string;
  place_name: string;
  place_type: any[];
  properties: Object;
  relevance: number;
  text: string;
  type: 'Feature';
};
type MapboxGeocodeReponse = {
  type: 'FeatureCollection';
  attribution: string;
  features: MapboxGeocodeFeature[];
  query: any[];
};

const getMapboxGeocodeResults = async (
  searchString: string,
  proximity: Position
) => {
  let requestUrl: string = 'https://api.mapbox.com/v4/geocode/mapbox.places/';
  if (isCoord(searchString)) {
    const searchStringCoord: Position = searchString
      .replace(/\s/, '')
      .split(',')
      .map(v => Number(v))
      .reverse();

    requestUrl =
      requestUrl +
      `${searchStringCoord[0]},${searchStringCoord[1]}.json?access_token=${process.env.MAPBOX_TOKEN}`;
  } else {
    requestUrl =
      requestUrl +
      `${encodeURI(searchString)}.json?access_token=${
        process.env.MAPBOX_TOKEN
      }&proximity=${proximity[0]},${proximity[1]}`;
  }

  return await axios.get<MapboxGeocodeReponse>(requestUrl, {});
};

const MapboxGeocoder: React.FC<{
  viewport: MyViewportProps;
  setViewport: (vp: MyViewportProps) => void;
}> = props => {
  const { viewport, setViewport } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [searchString, setSearchString] = useState<string>('');

  const [searchResults, setSearchResults] = useState<MapboxGeocodeFeature[]>(
    []
  );
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const searchDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!!searchDebounceTimerRef && !!searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }
    searchDebounceTimerRef.current = setTimeout(() => {
      if (!searchString) {
        setSearchResults([]);
        if (isResultsOpen) {
          setIsResultsOpen(false);
        }
      } else {
        getMapboxGeocodeResults(searchString, [
          viewport.longitude!,
          viewport.latitude!,
        ]).then(response => {
          const results = response.data.features;
          setSearchResults(results);
          if (!isResultsOpen) {
            setIsResultsOpen(true);
          }
        });
      }
    }, 500);
  }, [searchString]);

  // close on offclick
  useEffect(() => {
    const documentBodyClickHandler = (e: MouseEvent) => {
      if (
        !!containerRef &&
        !!containerRef.current &&
        !containerRef.current.contains(e.target as Node | null)
      ) {
        setIsResultsOpen(false);
      }
    };

    window.document.body.addEventListener('click', documentBodyClickHandler);

    return () =>
      window.document.body.removeEventListener(
        'click',
        documentBodyClickHandler
      );
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mapbox-geocoder ${isResultsOpen ? 'is-open' : ''}`}
    >
      <div
        className="mapbox-geocoder-input-container"
        onClick={() => {
          if (!!inputRef && !!inputRef.current) {
            inputRef.current.focus();
          }

          if (!isResultsOpen && !!searchResults.length) {
            setIsResultsOpen(true);
          }
        }}
      >
        <FontAwesomeIcon icon={FaSolidIcons.faSearch} />
        <AutosizeInput
          inputRef={ref => (inputRef.current = ref)}
          type="search"
          value={searchString}
          onChange={e => setSearchString(e.target.value)}
          placeholder="Search..."
          minWidth={200}
        />
      </div>
      {isResultsOpen ? (
        <div
          className={`mapbox-geocoder-results ${
            !searchResults.length ? 'no-results' : ''
          }`}
        >
          {!!searchResults.length ? (
            searchResults.map((feature, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setViewport({
                    ...viewport,
                    latitude: feature.center[1],
                    longitude: feature.center[0],
                    zoom: viewport.zoom! >= 14 ? viewport.zoom : 14,
                    transitionDuration: MAPBOX_TRANSITION_DURATION_SHORT,
                  });
                  setIsResultsOpen(false);
                }}
              >
                {feature.place_name}
              </div>
            ))
          ) : (
            <div>No results</div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default MapboxGeocoder;
