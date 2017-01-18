import maxBy from 'lodash/maxBy'; 

// model types
export class Viewer {}
export class Location {}

// mock data
const viewer = new Viewer();
viewer.id = 1;

let locations = [];

(() => {
  for (let i = 1; i <= 3; i++) {
    const location = new Location();
    
    location.id = i;
    location.title = `Location ${i}`;
    location.description= '';
    location.createdDate = (new Date()).toISOString();
    
    locations.push(location);
  }
})();

export function addLocation(title) {
  const newLocationId = (maxBy(locations, location => location.id)).id + 1;
  
  const location = {
    id: newLocationId,
    createdDate: (new Date()).toISOString(),
    title
  };
  
  locations.push(location);

  return newLocationId;
}

export function getLocations() {
  return locations;
}

export function getLocation(id) {
  return locations.find(location => location.id === id);
}

export function getViewer() {
  return viewer;
}