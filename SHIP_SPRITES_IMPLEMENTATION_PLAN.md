# Ship Sprite Implementation Plan

## Overview
Replace vector-drawn ships in `index.html` with PNG sprite images for better visual quality and performance.

## Current State Analysis

### Ship Types and Names
We have 9 ship PNG files that match the game's ship types:
- `corsair.png` → `corsair` (fast attack ship)
- `drone_carrier.png` → `carrier` (capital ship)
- `guardian_drone.png` → `drone_guardian` (shield drone)
- `hauler.png` → `hauler` (cargo ship)  
- `mining_drone.png` → `drone_harvester` (mining drone)
- `phantom.png` → `phantom` (stealth ship)
- `prospector.png` → `prospector` (starter ship)
- `sentinel.png` → `sentinel` (tank ship)
- `strike_drone.png` → `drone_fighter` (attack drone)

### Current Rendering System
- Ships are drawn using canvas vector graphics in the `drawShip()` function (around line 3500-4000 in index.html)
- Each ship type has custom vector drawing code with different shapes, colors, and details
- Ships are rendered with rotation, scaling, and color tinting applied dynamically

## Implementation Plan

### Phase 1: Add Ship Images to Project
1. Create `images/ships/` directory
2. Copy all 9 PNG files to this directory
3. Ensure proper naming convention matches game ship types

### Phase 2: Preload Ship Images
1. Add image preloading system in the game initialization
2. Create a `shipImages` object to store loaded Image elements
3. Add loading screen progress indication for ship assets

### Phase 3: Modify Ship Rendering Function
1. Replace the existing `drawShip()` vector drawing code
2. Implement sprite-based rendering with:
   - Image rotation using canvas transforms
   - Color tinting using canvas composite operations or CSS filters
   - Proper scaling based on `visualScale` property
   - Maintain existing ship positioning and animation systems

### Phase 4: Handle Edge Cases
1. Ensure proper fallback if images fail to load
2. Maintain performance with efficient image caching
3. Handle different ship states (cloaked, damaged, etc.)
4. Preserve existing visual effects (engine trails, shields, etc.)

### Phase 5: Testing
1. Test all ship types render correctly
2. Verify color tinting works for player differentiation
3. Confirm rotation and scaling functions properly
4. Test performance impact vs vector rendering

## Technical Implementation Details

### Image Loading System
```javascript
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
```

### Updated drawShip Function
Replace vector drawing with image rendering:
- Use `ctx.drawImage()` with proper transforms
- Apply color filters for player colors
- Maintain existing size calculations and positioning

### Benefits
1. **Visual Quality**: Higher detail and professional appearance
2. **Performance**: Potentially better performance than complex vector drawing
3. **Maintainability**: Easier to update ship designs
4. **Consistency**: All ships will have consistent artistic style

## Risk Mitigation
- Keep original vector code as fallback
- Gradual rollout with feature flag capability  
- Performance monitoring to ensure no regression
- Asset optimization (file sizes are already reasonable at ~25-70KB each)