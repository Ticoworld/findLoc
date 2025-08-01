import React, { memo, useMemo } from "react";
import FreeMap from "./freeMap";
import PhoneUi from "./phoneUi";

const MapComp = (props) => {
  // Variables - Use useMemo to prevent re-renders
  const mapLocData = useMemo(() => ({
    lat: Number(props.lat),
    lng: Number(props.lng),
    name: props.name,
  }), [props.lat, props.lng, props.name]);

  // Check if we need to show directions
  const showDirections = props.dir === 'true' && props.direction;
  
  // Prepare start and end locations for routing
  const startLocation = showDirections && props.direction.origin ? props.direction.origin : null;
  const endLocation = showDirections && props.direction.destination ? {
    lat: props.direction.destination.lat,
    lng: props.direction.destination.lng
  } : null;

  // Styles
  const style = {
    width: '100%',
    height: '100%',
  };

  console.log('Map data:', mapLocData);
  console.log('Directions:', { showDirections, startLocation, endLocation });

  // UI
  return (
    <main id="map_cont" style={style}>
      <FreeMap
        lat={mapLocData.lat}
        lng={mapLocData.lng}
        name={mapLocData.name}
        showDirections={showDirections}
        startLocation={startLocation}
        endLocation={endLocation}
      />

      <div id="phoneUICont">
        <PhoneUi />
      </div>

      {/* Free Maps Badge */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        right: '20px',
        background: 'rgba(102, 126, 234, 0.9)',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        zIndex: 1000,
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
      }}>
        🆓 Free Maps • No Card Required
      </div>
    </main>
  );
};

export default memo(MapComp);