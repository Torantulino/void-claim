// Fixed drawShipHull function with proper sprite handling
function drawShipHull(ctx,shipType,sz,col){
  const shipImage = shipImages[shipType];
  
  // Use sprite rendering if image is loaded and complete
  if (shipImage && shipImage.complete) {
    const imageSize = sz * 8; // Increased scale factor to fix tiny size
    
    ctx.save();
    
    // Apply 90-degree clockwise rotation to fix orientation
    ctx.rotate(Math.PI / 2);
    
    // Draw the ship image
    ctx.drawImage(
      shipImage,
      -imageSize / 2,
      -imageSize / 2,
      imageSize,
      imageSize
    );
    
    // Apply color tint if not default color
    if (col && col !== '#5588ff') {
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = col;
      ctx.fillRect(-imageSize / 2, -imageSize / 2, imageSize, imageSize);
      
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(
        shipImage,
        -imageSize / 2,
        -imageSize / 2,
        imageSize,
        imageSize
      );
    }
    
    ctx.restore();
    return;
  }
  
  // Fallback to vector graphics if image not loaded or failed
  // Each ship: main hull fill + accent details + outline
  const s=sz; // alias
  ctx.beginPath();
  // ... rest of original vector drawing code remains unchanged ...