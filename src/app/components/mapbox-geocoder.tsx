import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FaSolidIcons from '@fortawesome/free-solid-svg-icons';
import { Geometry, Position } from 'geojson';
import axios from 'axios';
import { MyViewportProps } from '../../types/mapbox';
import { isCoord } from '../../regex';

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
  let requestUrl: string;
  if (isCoord(searchString)) {
    const searchStringCoord: Position = searchString
      .replace(/\s/, '')
      .split(',')
      .map(v => Number(v))
      .reverse();

    requestUrl = `https://api.mapbox.com/v4/geocode/mapbox.places/${searchStringCoord[0]},${searchStringCoord[1]}.json?access_token=${process.env.MAPBOX_TOKEN}`;
  } else {
    requestUrl = `https://api.mapbox.com/v4/geocode/mapbox.places/${encodeURI(
      searchString
    )}.json?access_token=${process.env.MAPBOX_TOKEN}&proximity=${
      proximity[0]
    },${proximity[1]}`;
  }

  return await axios.get<MapboxGeocodeReponse>(requestUrl, {});
};

const MapboxGeocoder: React.FC<{
  viewport: MyViewportProps;
  setViewport: (vp: MyViewportProps) => void;
}> = props => {
  const { viewport, setViewport } = props;

  const inputContainerRef = useRef<HTMLDivElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const [searchString, setSearchString] = useState<string>('');

  const [searchResults, setSearchResults] = useState<MapboxGeocodeFeature[]>(
    []
  );

  const searchDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (!!searchDebounceTimerRef && !!searchDebounceTimerRef.current) {
      clearTimeout(searchDebounceTimerRef.current);
    }
    searchDebounceTimerRef.current = setTimeout(() => {
      if (!searchString) {
        setSearchResults([]);
      } else {
        getMapboxGeocodeResults(searchString, [
          viewport.longitude,
          viewport.latitude,
        ]).then(response => setSearchResults(response.data.features));
      }
    }, 500);
  }, [searchString]);

  const isOpen = !!searchResults && !!searchResults.length;

  return (
    <div className={`mapbox-geocoder ${isOpen ? 'is-open' : ''}`}>
      <div
        ref={inputContainerRef}
        className="mapbox-geocoder-input-container"
        onClick={() => {
          if (!!inputRef && !!inputRef.current) {
            inputRef.current.focus();
          }
        }}
      >
        <FontAwesomeIcon icon={FaSolidIcons.faSearch} />
        <input
          ref={inputRef}
          style={{
            width:
              !!inputContainerRef && !!inputContainerRef.current
                ? inputContainerRef.current.clientWidth - 30
                : undefined,
          }}
          type="search"
          value={searchString}
          onChange={e => setSearchString(e.target.value)}
          placeholder="Search..."
        />
      </div>
      {isOpen ? (
        <div ref={resultsContainerRef} className="mapbox-geocoder-results">
          {searchResults.map((feature, idx) => (
            <div key={idx}>{feature.place_name}</div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default MapboxGeocoder;
