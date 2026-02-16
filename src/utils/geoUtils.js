/**
 * Check if a point [lat, lng] is within a bounding box
 * @param {Array<number>} point - [latitude, longitude]
 * @param {Object} bounds - Leaflet LatLngBounds object or similar structure { _southWest: { lat, lng }, _northEast: { lat, lng } }
 * @returns {boolean}
 */
export const isPointInBounds = (point, bounds) => {
  if (!point || !bounds) return false;
  
  const [lat, lng] = point;
  const sw = bounds._southWest || bounds.getSouthWest();
  const ne = bounds._northEast || bounds.getNorthEast();

  return lat >= sw.lat && lat <= ne.lat && lng >= sw.lng && lng <= ne.lng;
};

/**
 * Check if a point is inside a polygon using ray-casting algorithm
 * @param {Array<number>} point - [latitude, longitude]
 * @param {Array<Array<number>>} polygon - Array of points [[lat, lng], ...]
 * @returns {boolean}
 */
export const isPointInPolygon = (point, polygon) => {
  if (!point || !polygon || polygon.length < 3) return false;

  const x = point[0], y = point[1];
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];

    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    
    if (intersect) inside = !inside;
  }

  return inside;
};
