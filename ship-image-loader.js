// Ship image preloading system
const shipImages = {};
const shipImageFiles = {
  'prospector': 'images/ships/prospector.png',
  'hauler': 'images/ships/hauler.png',
  'corsair': 'images/ships/corsair.png',
  'sentinel': 'images/ships/sentinel.png',
  'phantom': 'images/ships/phantom.png',
  'carrier': 'images/ships/drone_carrier.png',
  'drone_fighter': 'images/ships/strike_drone.png',
  'drone_guardian': 'images/ships/guardian_drone.png',
  'drone_harvester': 'images/ships/mining_drone.png'
};

let shipImagesLoaded = 0;
const totalShipImages = Object.keys(shipImageFiles).length;

function loadShipImages(callback) {
  Object.entries(shipImageFiles).forEach(([shipType, imagePath]) => {
    const img = new Image();
    img.onload = () => {
      shipImages[shipType] = img;
      shipImagesLoaded++;
      if (shipImagesLoaded === totalShipImages && callback) {
        callback();
      }
    };
    img.onerror = () => {
      console.warn(`Failed to load ship image: ${imagePath}`);
      shipImagesLoaded++;
      if (shipImagesLoaded === totalShipImages && callback) {
        callback();
      }
    };
    img.src = imagePath;
  });
}