  // Each ship: main hull fill + accent details + outline
  const s=sz; // alias
  ctx.beginPath();
  if(shipType==='prospector'){
    // ═══ INDUSTRIAL DRILL RIG — forward drill nose, chunky utility pods ═══
    ctx.moveTo(s*1.2, 0);              // drill tip
    ctx.lineTo(s*.85,-s*.06);          // upper drill shaft
    ctx.lineTo(s*.7, -s*.12);          // drill housing top
    ctx.lineTo(s*.5, -s*.18);          // forward hull
    ctx.lineTo(s*.3, -s*.3);           // upper neck
    ctx.lineTo(s*.1, -s*.35);          // pod mount top
    ctx.lineTo(-s*.05,-s*.55);         // upper pod outer
    ctx.lineTo(-s*.35,-s*.6);          // pod rear top
    ctx.lineTo(-s*.45,-s*.5);          // pod inner top
    ctx.lineTo(-s*.35,-s*.3);          // pod inner
    ctx.lineTo(-s*.55,-s*.25);         // engine mount top
    ctx.lineTo(-s*.7, -s*.2);          // engine nozzle top
    ctx.lineTo(-s*.7,  s*.2);          // engine nozzle bottom
    ctx.lineTo(-s*.55, s*.25);         // engine mount bottom
    ctx.lineTo(-s*.35, s*.3);          // pod inner
    ctx.lineTo(-s*.45, s*.5);          // pod inner bottom
    ctx.lineTo(-s*.35, s*.6);          // pod rear bottom
    ctx.lineTo(-s*.05, s*.55);         // lower pod outer
    ctx.lineTo(s*.1,  s*.35);          // pod mount bottom
    ctx.lineTo(s*.3,  s*.3);           // lower neck
    ctx.lineTo(s*.5,  s*.18);          // lower forward hull
    ctx.lineTo(s*.7,  s*.12);          // drill housing bottom
    ctx.lineTo(s*.85, s*.06);          // lower drill shaft
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=1.5;ctx.stroke();
    // Drill rings
    ctx.strokeStyle='rgba(255,200,100,.3)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(s*.9,-s*.05);ctx.lineTo(s*.9,s*.05);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.78,-s*.09);ctx.lineTo(s*.78,s*.09);ctx.stroke();
    // Mining pod cross-bars
    ctx.strokeStyle='rgba(255,255,255,.15)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(s*.05,-s*.4);ctx.lineTo(-s*.3,-s*.55);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.05,s*.4);ctx.lineTo(-s*.3,s*.55);ctx.stroke();
    // Cockpit
    ctx.fillStyle='rgba(150,220,255,.55)';
    ctx.beginPath();ctx.moveTo(s*.55,0);ctx.lineTo(s*.35,-s*.12);ctx.lineTo(s*.25,0);ctx.lineTo(s*.35,s*.12);ctx.closePath();ctx.fill();
    // Engine glow
    ctx.fillStyle='rgba(100,180,255,.45)';
    ctx.fillRect(-s*.73,-s*.15,s*.08,s*.3);
    // Drill tip glow
    ctx.fillStyle='rgba(255,200,100,.3)';
    ctx.beginPath();ctx.arc(s*1.15,0,s*.04,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(255,200,100,.1)';
    ctx.beginPath();ctx.arc(s*1.15,0,s*.1,0,Math.PI*2);ctx.fill();
  }
  else if(shipType==='hauler'){
    // ═══ SPACE BARGE — flat ultra-wide hull, maximum cargo visibility ═══
    ctx.moveTo(s*.6,  0);              // nose
    ctx.lineTo(s*.48,-s*.15);          // upper nose
    ctx.lineTo(s*.3, -s*.4);           // upper hull
    ctx.lineTo(s*.1, -s*.65);          // upper deck edge
    ctx.lineTo(-s*.3,-s*.7);           // upper flat span
    ctx.lineTo(-s*.55,-s*.65);         // upper rear
    ctx.lineTo(-s*.7,-s*.5);           // engine pylon top
    ctx.lineTo(-s*.65,-s*.35);         // engine inner top
    ctx.lineTo(-s*.65,s*.35);          // engine inner bot
    ctx.lineTo(-s*.7, s*.5);           // engine pylon bot
    ctx.lineTo(-s*.55,s*.65);          // lower rear
    ctx.lineTo(-s*.3, s*.7);           // lower flat span
    ctx.lineTo(s*.1,  s*.65);          // lower deck edge
    ctx.lineTo(s*.3,  s*.4);           // lower hull
    ctx.lineTo(s*.48, s*.15);          // lower nose
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.5;ctx.stroke();
    // Cargo grid lines
    ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(s*.22,-s*.58);ctx.lineTo(s*.22,s*.58);ctx.stroke();
    ctx.beginPath();ctx.moveTo(0,-s*.58);ctx.lineTo(0,s*.58);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-s*.22,-s*.58);ctx.lineTo(-s*.22,s*.58);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.2,-s*.5);ctx.lineTo(-s*.45,-s*.62);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.2,s*.5);ctx.lineTo(-s*.45,s*.62);ctx.stroke();
    // Cockpit (small — emphasizes cargo not crew)
    ctx.fillStyle='rgba(150,220,255,.5)';
    ctx.beginPath();ctx.moveTo(s*.5,0);ctx.lineTo(s*.35,-s*.1);ctx.lineTo(s*.28,0);ctx.lineTo(s*.35,s*.1);ctx.closePath();ctx.fill();
    // Twin pusher engines
    ctx.fillStyle='rgba(255,160,50,.5)';
    ctx.fillRect(-s*.73,-s*.45,s*.1,s*.2);
    ctx.fillRect(-s*.73,s*.25,s*.1,s*.2);
  }
  else if(shipType==='corsair'){
    // ═══ SWITCHBLADE — forward-swept wings, compact & aggressive ═══
    ctx.moveTo(s*1.25,0);              // long nose
    ctx.lineTo(s*.55,-s*.1);           // upper nose
    ctx.lineTo(s*.25,-s*.15);          // fuselage
    ctx.lineTo(s*.05,-s*.18);          // wing root
    ctx.lineTo(s*.35,-s*.55);          // forward-swept wing tip (!)
    ctx.lineTo(s*.2, -s*.6);           // wing tip end
    ctx.lineTo(-s*.05,-s*.45);         // wing trailing inner
    ctx.lineTo(-s*.2,-s*.3);           // wing trailing
    ctx.lineTo(-s*.35,-s*.22);         // fin root
    ctx.lineTo(-s*.45,-s*.42);         // vertical stabilizer top
    ctx.lineTo(-s*.55,-s*.35);         // stabilizer trailing
    ctx.lineTo(-s*.45,-s*.18);         // stabilizer inner
    ctx.lineTo(-s*.6,-s*.12);          // engine top
    ctx.lineTo(-s*.6, s*.12);          // engine bottom
    ctx.lineTo(-s*.45,s*.18);          // stabilizer inner
    ctx.lineTo(-s*.55,s*.35);          // stabilizer trailing
    ctx.lineTo(-s*.45,s*.42);          // vertical stabilizer bot
    ctx.lineTo(-s*.35,s*.22);          // fin root
    ctx.lineTo(-s*.2, s*.3);           // wing trailing
    ctx.lineTo(-s*.05,s*.45);          // wing trailing inner
    ctx.lineTo(s*.2,  s*.6);           // wing tip end
    ctx.lineTo(s*.35, s*.55);          // forward-swept wing tip (!)
    ctx.lineTo(s*.05, s*.18);          // wing root
    ctx.lineTo(s*.25, s*.15);          // fuselage
    ctx.lineTo(s*.55, s*.1);           // lower nose
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=1.5;ctx.stroke();
    // Speed lines
    ctx.strokeStyle='rgba(255,80,80,.3)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(s*1.0,0);ctx.lineTo(-s*.2,0);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.2,-s*.35);ctx.lineTo(-s*.1,-s*.28);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.2,s*.35);ctx.lineTo(-s*.1,s*.28);ctx.stroke();
    // Cockpit
    ctx.fillStyle='rgba(255,200,150,.5)';
    ctx.beginPath();ctx.moveTo(s*.9,0);ctx.lineTo(s*.55,-s*.06);ctx.lineTo(s*.45,0);ctx.lineTo(s*.55,s*.06);ctx.closePath();ctx.fill();
    // Engine glow
    ctx.fillStyle='rgba(255,100,50,.5)';
    ctx.fillRect(-s*.64,-s*.08,s*.08,s*.16);
  }
  else if(shipType==='sentinel'){
    // ═══ PHALANX — overlapping angular armor plates, wide & low ═══
    ctx.moveTo(s*.7, 0);               // nose
    ctx.lineTo(s*.6, -s*.15);          // upper nose
    ctx.lineTo(s*.4, -s*.35);          // first plate edge
    ctx.lineTo(s*.35,-s*.5);           // plate overlap 1
    ctx.lineTo(s*.15,-s*.55);          // plate step
    ctx.lineTo(s*.1, -s*.7);           // plate overlap 2
    ctx.lineTo(-s*.1,-s*.75);          // outer armor
    ctx.lineTo(-s*.3,-s*.78);          // max width
    ctx.lineTo(-s*.5,-s*.72);          // rear armor
    ctx.lineTo(-s*.6,-s*.6);           // engine plate
    ctx.lineTo(-s*.75,-s*.4);          // engine top
    ctx.lineTo(-s*.82,-s*.2);          // nozzle top
    ctx.lineTo(-s*.82,s*.2);           // nozzle bottom
    ctx.lineTo(-s*.75,s*.4);           // engine bot
    ctx.lineTo(-s*.6, s*.6);           // engine plate
    ctx.lineTo(-s*.5, s*.72);          // rear armor
    ctx.lineTo(-s*.3, s*.78);          // max width
    ctx.lineTo(-s*.1, s*.75);          // outer armor
    ctx.lineTo(s*.1,  s*.7);           // plate overlap 2
    ctx.lineTo(s*.15, s*.55);          // plate step
    ctx.lineTo(s*.35, s*.5);           // plate overlap 1
    ctx.lineTo(s*.4,  s*.35);          // first plate edge
    ctx.lineTo(s*.6,  s*.15);          // lower nose
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.5;ctx.stroke();
    // Overlapping plate lines (the key visual feature)
    ctx.strokeStyle='rgba(255,255,255,.2)';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(s*.5,-s*.2);ctx.lineTo(s*.15,-s*.52);ctx.lineTo(-s*.25,-s*.72);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.5,s*.2);ctx.lineTo(s*.15,s*.52);ctx.lineTo(-s*.25,s*.72);ctx.stroke();
    ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(s*.3,-s*.35);ctx.lineTo(-s*.15,-s*.68);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.3,s*.35);ctx.lineTo(-s*.15,s*.68);ctx.stroke();
    // Shield generator nodes
    ctx.fillStyle='rgba(100,255,200,.35)';
    ctx.beginPath();ctx.arc(s*.12,-s*.62,s*.05,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(s*.12,s*.62,s*.05,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(100,255,200,.12)';
    ctx.beginPath();ctx.arc(s*.12,-s*.62,s*.1,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(s*.12,s*.62,s*.1,0,Math.PI*2);ctx.fill();
    // Cockpit slot
    ctx.fillStyle='rgba(100,255,180,.4)';
    ctx.fillRect(s*.35,-s*.06,s*.2,s*.12);
    // Engine glow
    ctx.fillStyle='rgba(50,200,255,.4)';
    ctx.fillRect(-s*.86,-s*.15,s*.1,s*.3);
  }
  else if(shipType==='phantom'){
    // ═══ STEALTH MANTA-RAY PREDATOR — wide flying-wing, top-tier presence ═══
    // Broad manta-ray / flying wing hull — completely distinct silhouette
    ctx.moveTo(s*.85, 0);                // blunt stealth nose (NOT needle-like)
    ctx.lineTo(s*.78,-s*.06);            // upper nose bevel
    ctx.lineTo(s*.6, -s*.14);            // upper forward fuselage
    ctx.lineTo(s*.3, -s*.28);            // wing leading edge start
    ctx.lineTo(s*.05,-s*.52);            // mid wing leading edge
    ctx.lineTo(-s*.2, -s*.78);           // outer wing leading edge
    ctx.lineTo(-s*.45,-s*.92);           // wing tip (wide manta span!)
    ctx.lineTo(-s*.52,-s*.82);           // wing tip trailing notch
    ctx.lineTo(-s*.38,-s*.6);            // wing trailing edge outer
    ctx.lineTo(-s*.28,-s*.42);           // wing trailing edge mid
    ctx.lineTo(-s*.35,-s*.3);            // inner wing step
    ctx.lineTo(-s*.48,-s*.22);           // tail root upper
    ctx.lineTo(-s*.72,-s*.35);           // upper tail fin tip
    ctx.lineTo(-s*.65,-s*.18);           // tail fin inner
    ctx.lineTo(-s*.58,-s*.1);            // engine housing top
    ctx.lineTo(-s*.58, s*.1);            // engine housing bottom
    ctx.lineTo(-s*.65, s*.18);           // tail fin inner
    ctx.lineTo(-s*.72, s*.35);           // lower tail fin tip
    ctx.lineTo(-s*.48, s*.22);           // tail root lower
    ctx.lineTo(-s*.35, s*.3);            // inner wing step
    ctx.lineTo(-s*.28, s*.42);           // wing trailing edge mid
    ctx.lineTo(-s*.38, s*.6);            // wing trailing edge outer
    ctx.lineTo(-s*.52, s*.82);           // wing tip trailing notch
    ctx.lineTo(-s*.45, s*.92);           // wing tip (wide manta span!)
    ctx.lineTo(-s*.2,  s*.78);           // outer wing leading edge
    ctx.lineTo(s*.05,  s*.52);           // mid wing leading edge
    ctx.lineTo(s*.3,   s*.28);           // wing leading edge start
    ctx.lineTo(s*.6,   s*.14);           // lower forward fuselage
    ctx.lineTo(s*.78,  s*.06);           // lower nose bevel
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(200,160,255,.45)';ctx.lineWidth=1.2;ctx.stroke();
    // ── Stealth panel lines (angular facets like B-2 bomber) ──
    ctx.strokeStyle='rgba(180,120,255,.18)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(s*.7,0);ctx.lineTo(s*.15,-s*.4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.7,0);ctx.lineTo(s*.15,s*.4);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.3,-s*.22);ctx.lineTo(-s*.3,-s*.55);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.3,s*.22);ctx.lineTo(-s*.3,s*.55);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.15,-s*.15);ctx.lineTo(-s*.4,-s*.25);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.15,s*.15);ctx.lineTo(-s*.4,s*.25);ctx.stroke();
    // ── Phase cloak vents (glowing wing strips — unique to phantom) ──
    ctx.strokeStyle='rgba(180,120,255,.35)';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(s*.0,-s*.42);ctx.lineTo(-s*.25,-s*.65);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.0,s*.42);ctx.lineTo(-s*.25,s*.65);ctx.stroke();
    ctx.strokeStyle='rgba(180,120,255,.12)';ctx.lineWidth=5;
    ctx.beginPath();ctx.moveTo(s*.0,-s*.42);ctx.lineTo(-s*.25,-s*.65);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.0,s*.42);ctx.lineTo(-s*.25,s*.65);ctx.stroke();
    // ── Wing tip running lights ──
    ctx.fillStyle='rgba(180,120,255,.6)';
    ctx.beginPath();ctx.arc(-s*.45,-s*.9,s*.03,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(-s*.45,s*.9,s*.03,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='rgba(180,120,255,.15)';
    ctx.beginPath();ctx.arc(-s*.45,-s*.9,s*.08,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(-s*.45,s*.9,s*.08,0,Math.PI*2);ctx.fill();
    // ── Cockpit slit (narrow predator eye) ──
    ctx.fillStyle='rgba(180,140,255,.6)';
    ctx.beginPath();ctx.moveTo(s*.78,0);ctx.lineTo(s*.52,-s*.05);ctx.lineTo(s*.4,-s*.03);
    ctx.lineTo(s*.35,0);ctx.lineTo(s*.4,s*.03);ctx.lineTo(s*.52,s*.05);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(180,140,255,.15)';
    ctx.beginPath();ctx.moveTo(s*.82,0);ctx.lineTo(s*.5,-s*.08);ctx.lineTo(s*.3,0);ctx.lineTo(s*.5,s*.08);ctx.closePath();ctx.fill();
    // ── Tail fin accent lines ──
    ctx.strokeStyle='rgba(180,120,255,.3)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(-s*.5,-s*.2);ctx.lineTo(-s*.68,-s*.32);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-s*.5,s*.2);ctx.lineTo(-s*.68,s*.32);ctx.stroke();
    // ── Engine glow (dim purple stealth — twin exhaust) ──
    const phEg=ctx.createRadialGradient(0,0,s*.02,0,0,s*.08);
    phEg.addColorStop(0,'rgba(180,140,255,.6)');phEg.addColorStop(1,'rgba(120,60,255,0)');
    ctx.save();ctx.translate(-s*.6,-s*.06);ctx.fillStyle=phEg;
    ctx.fillRect(-s*.06,-s*.04,s*.1,s*.08);ctx.restore();
    ctx.save();ctx.translate(-s*.6,s*.06);ctx.fillStyle=phEg;
    ctx.fillRect(-s*.06,-s*.04,s*.1,s*.08);ctx.restore();
    ctx.fillStyle='rgba(150,100,255,.12)';
    ctx.fillRect(-s*.68,-s*.06,s*.12,s*.02);
    ctx.fillRect(-s*.68,s*.04,s*.12,s*.02);
  }
  else if(shipType==='carrier'){
    // ═══ DREADNOUGHT CARRIER — angular aggressive capital ship ═══
    // Main hull — sharp aggressive wedge with hard angles
    ctx.moveTo(s*1.1,0);               // razor bow tip
    ctx.lineTo(s*.95,-s*.08);          // upper bow edge
    ctx.lineTo(s*.75,-s*.18);          // upper bow plate
    ctx.lineTo(s*.55,-s*.32);          // upper forward hull
    ctx.lineTo(s*.35,-s*.38);          // upper mid notch
    ctx.lineTo(s*.3,-s*.48);           // upper armor step-out
    ctx.lineTo(s*.1,-s*.52);           // upper broadside
    ctx.lineTo(-s*.15,-s*.58);         // upper flight deck edge
    ctx.lineTo(-s*.18,-s*.7);          // upper hangar bay step
    ctx.lineTo(-s*.45,-s*.75);         // upper hangar rear
    ctx.lineTo(-s*.55,-s*.7);          // upper engine pylon
    ctx.lineTo(-s*.7,-s*.72);          // upper engine nacelle out
    ctx.lineTo(-s*.85,-s*.6);          // upper engine rear
    ctx.lineTo(-s*.78,-s*.42);         // upper engine inner step
    ctx.lineTo(-s*.82,-s*.2);          // upper center engine wall
    ctx.lineTo(-s*.95,-s*.15);         // center engine top out
    ctx.lineTo(-s*1.05,-s*.08);        // center engine nozzle top
    ctx.lineTo(-s*1.05,s*.08);         // center engine nozzle bottom
    ctx.lineTo(-s*.95,s*.15);          // center engine bottom out
    ctx.lineTo(-s*.82,s*.2);           // lower center engine wall
    ctx.lineTo(-s*.78,s*.42);          // lower engine inner step
    ctx.lineTo(-s*.85,s*.6);           // lower engine rear
    ctx.lineTo(-s*.7,s*.72);           // lower engine nacelle out
    ctx.lineTo(-s*.55,s*.7);           // lower engine pylon
    ctx.lineTo(-s*.45,s*.75);          // lower hangar rear
    ctx.lineTo(-s*.18,s*.7);           // lower hangar bay step
    ctx.lineTo(-s*.15,s*.58);          // lower flight deck edge
    ctx.lineTo(s*.1,s*.52);            // lower broadside
    ctx.lineTo(s*.3,s*.48);            // lower armor step-out
    ctx.lineTo(s*.35,s*.38);           // lower mid notch
    ctx.lineTo(s*.55,s*.32);           // lower forward hull
    ctx.lineTo(s*.75,s*.18);           // lower bow plate
    ctx.lineTo(s*.95,s*.08);           // lower bow edge
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=2;ctx.stroke();

    // ── Heavy armor plate lines (angular scarring) ──
    ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(s*.8,-s*.1);ctx.lineTo(s*.3,-s*.35);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.8,s*.1);ctx.lineTo(s*.3,s*.35);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.5,-s*.28);ctx.lineTo(-s*.2,-s*.55);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.5,s*.28);ctx.lineTo(-s*.2,s*.55);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.15,-s*.5);ctx.lineTo(-s*.5,-s*.7);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.15,s*.5);ctx.lineTo(-s*.5,s*.7);ctx.stroke();
    // Cross-hull brace lines
    ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=.6;
    ctx.beginPath();ctx.moveTo(s*.1,-s*.3);ctx.lineTo(s*.1,s*.3);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-s*.3,-s*.45);ctx.lineTo(-s*.3,s*.45);ctx.stroke();

    // ── Flight deck bays (lit trenches) ──
    ctx.strokeStyle='rgba(255,180,80,.3)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(s*.05,-s*.53);ctx.lineTo(-s*.4,-s*.72);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.05,s*.53);ctx.lineTo(-s*.4,s*.72);ctx.stroke();

    // ── Hangar bay openings (glowing) ──
    ctx.fillStyle='rgba(255,160,60,.2)';
    ctx.beginPath();
    ctx.moveTo(-s*.2,-s*.68);ctx.lineTo(-s*.42,-s*.73);
    ctx.lineTo(-s*.42,-s*.65);ctx.lineTo(-s*.2,-s*.6);ctx.closePath();ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-s*.2,s*.6);ctx.lineTo(-s*.42,s*.65);
    ctx.lineTo(-s*.42,s*.73);ctx.lineTo(-s*.2,s*.68);ctx.closePath();ctx.fill();

    // ── Weapon turrets (dorsal & ventral) ──
    ctx.fillStyle='rgba(220,220,255,.5)';
    // Forward turret pair
    ctx.beginPath();ctx.moveTo(s*.42,-s*.35);ctx.lineTo(s*.52,-s*.33);
    ctx.lineTo(s*.52,-s*.28);ctx.lineTo(s*.42,-s*.3);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(s*.42,s*.3);ctx.lineTo(s*.52,s*.28);
    ctx.lineTo(s*.52,s*.33);ctx.lineTo(s*.42,s*.35);ctx.closePath();ctx.fill();
    // Turret barrels
    ctx.strokeStyle='rgba(220,220,255,.6)';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(s*.52,-s*.31);ctx.lineTo(s*.65,-s*.28);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.52,s*.31);ctx.lineTo(s*.65,s*.28);ctx.stroke();
    // Mid turrets
    ctx.fillStyle='rgba(200,200,240,.4)';
    ctx.beginPath();ctx.moveTo(s*.05,-s*.5);ctx.lineTo(s*.15,-s*.48);
    ctx.lineTo(s*.15,-s*.42);ctx.lineTo(s*.05,-s*.44);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(s*.05,s*.44);ctx.lineTo(s*.15,s*.42);
    ctx.lineTo(s*.15,s*.48);ctx.lineTo(s*.05,s*.5);ctx.closePath();ctx.fill();
    // Mid turret barrels
    ctx.strokeStyle='rgba(200,200,240,.5)';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(s*.15,-s*.45);ctx.lineTo(s*.28,-s*.42);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.15,s*.45);ctx.lineTo(s*.28,s*.42);ctx.stroke();

    // ── Command bridge (angular, aggressive) ──
    ctx.fillStyle='rgba(120,200,255,.55)';
    ctx.beginPath();
    ctx.moveTo(s*.85,0);              // bridge nose
    ctx.lineTo(s*.65,-s*.12);         // bridge upper
    ctx.lineTo(s*.45,-s*.14);         // bridge rear upper
    ctx.lineTo(s*.38,-s*.08);         // bridge step
    ctx.lineTo(s*.38,s*.08);          // bridge step lower
    ctx.lineTo(s*.45,s*.14);          // bridge rear lower
    ctx.lineTo(s*.65,s*.12);          // bridge lower
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(180,230,255,.4)';ctx.lineWidth=.8;ctx.stroke();
    // Bridge viewport slit
    ctx.fillStyle='rgba(200,240,255,.7)';
    ctx.beginPath();
    ctx.moveTo(s*.82,0);ctx.lineTo(s*.68,-s*.06);ctx.lineTo(s*.6,0);ctx.lineTo(s*.68,s*.06);
    ctx.closePath();ctx.fill();

    // ── Antenna arrays (command superstructure) ──
    ctx.strokeStyle='rgba(180,220,255,.35)';ctx.lineWidth=.7;
    ctx.beginPath();ctx.moveTo(s*.55,-s*.15);ctx.lineTo(s*.5,-s*.24);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.55,s*.15);ctx.lineTo(s*.5,s*.24);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.42,-s*.14);ctx.lineTo(s*.35,-s*.22);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.42,s*.14);ctx.lineTo(s*.35,s*.22);ctx.stroke();

    // ── Spine trench (central keel detail) ──
    ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(s*.9,0);ctx.lineTo(-s*.75,0);ctx.stroke();
    ctx.strokeStyle='rgba(100,180,255,.15)';ctx.lineWidth=.5;
    ctx.beginPath();ctx.moveTo(s*.7,-s*.03);ctx.lineTo(-s*.6,-s*.03);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.7,s*.03);ctx.lineTo(-s*.6,s*.03);ctx.stroke();

    // ── Quad engine glows (menacing blue) ──
    const eg=ctx.createRadialGradient(0,0,s*.02,0,0,s*.12);
    eg.addColorStop(0,'rgba(150,220,255,.8)');eg.addColorStop(1,'rgba(50,120,255,0)');
    // Top engine
    ctx.save();ctx.translate(-s*.78,-s*.56);ctx.fillStyle=eg;
    ctx.fillRect(-s*.1,-s*.08,s*.14,s*.16);ctx.restore();
    // Upper-center engine
    ctx.save();ctx.translate(-s*.9,-s*.18);ctx.fillStyle=eg;
    ctx.fillRect(-s*.1,-s*.06,s*.14,s*.12);ctx.restore();
    // Lower-center engine
    ctx.save();ctx.translate(-s*.9,s*.18);ctx.fillStyle=eg;
    ctx.fillRect(-s*.1,-s*.06,s*.14,s*.12);ctx.restore();
    // Bottom engine
    ctx.save();ctx.translate(-s*.78,s*.56);ctx.fillStyle=eg;
    ctx.fillRect(-s*.1,-s*.08,s*.14,s*.16);ctx.restore();
    // Central main thruster (biggest)
    ctx.fillStyle='rgba(100,180,255,.6)';
    ctx.fillRect(-s*1.08,-s*.06,s*.12,s*.12);
    ctx.fillStyle='rgba(180,230,255,.3)';
    ctx.fillRect(-s*1.12,-s*.04,s*.08,s*.08);
  }
  else if(shipType==='drone_fighter'){
    // ═══ STRIKE DRONE — small, angular, aggressive delta shape ═══
    ctx.moveTo(s*.9,0);              // sharp nose
    ctx.lineTo(s*.3,-s*.15);         // upper nose
    ctx.lineTo(-s*.1,-s*.5);         // wing tip
    ctx.lineTo(-s*.35,-s*.4);        // wing trailing
    ctx.lineTo(-s*.5,-s*.12);        // engine top
    ctx.lineTo(-s*.5,s*.12);         // engine bottom
    ctx.lineTo(-s*.35,s*.4);         // wing trailing
    ctx.lineTo(-s*.1,s*.5);          // wing tip
    ctx.lineTo(s*.3,s*.15);          // lower nose
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;ctx.stroke();
    // Red racing stripe
    ctx.strokeStyle='rgba(255,80,60,.5)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(s*.7,0);ctx.lineTo(-s*.3,0);ctx.stroke();
    // Sensor eye (single glowing dot)
    ctx.fillStyle='rgba(255,100,80,.8)';
    ctx.beginPath();ctx.arc(s*.5,0,s*.06,0,Math.PI*2);ctx.fill();
    // Engine glow
    ctx.fillStyle='rgba(255,80,50,.5)';
    ctx.fillRect(-s*.54,-s*.08,s*.06,s*.16);
  }
  else if(shipType==='drone_guardian'){
    // ═══ GUARDIAN DRONE — hexagonal shield platform, wide and flat ═══
    ctx.moveTo(s*.6,0);              // front plate
    ctx.lineTo(s*.35,-s*.4);         // upper front
    ctx.lineTo(-s*.2,-s*.55);        // upper side
    ctx.lineTo(-s*.55,-s*.4);        // upper rear
    ctx.lineTo(-s*.65,-s*.15);       // engine top
    ctx.lineTo(-s*.65,s*.15);        // engine bottom
    ctx.lineTo(-s*.55,s*.4);         // lower rear
    ctx.lineTo(-s*.2,s*.55);         // lower side
    ctx.lineTo(s*.35,s*.4);          // lower front
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1.2;ctx.stroke();
    // Shield plate lines (armored look)
    ctx.strokeStyle='rgba(100,200,255,.2)';ctx.lineWidth=.8;
    ctx.beginPath();ctx.moveTo(s*.3,-s*.25);ctx.lineTo(-s*.35,-s*.45);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.3,s*.25);ctx.lineTo(-s*.35,s*.45);ctx.stroke();
    // Central shield emitter (glowing ring)
    ctx.strokeStyle='rgba(80,200,255,.6)';ctx.lineWidth=1;
    ctx.beginPath();ctx.arc(0,0,s*.15,0,Math.PI*2);ctx.stroke();
    ctx.fillStyle='rgba(80,200,255,.3)';
    ctx.beginPath();ctx.arc(0,0,s*.08,0,Math.PI*2);ctx.fill();
    // Engine glow
    ctx.fillStyle='rgba(60,160,255,.4)';
    ctx.fillRect(-s*.68,-s*.1,s*.06,s*.2);
  }
  else if(shipType==='drone_harvester'){
    // ═══ HARVESTER DRONE — compact utility shape with mining arms ═══
    ctx.moveTo(s*.65,0);             // nose
    ctx.lineTo(s*.35,-s*.2);         // upper nose
    ctx.lineTo(s*.1,-s*.35);         // upper body
    ctx.lineTo(-s*.25,-s*.4);        // upper rear
    ctx.lineTo(-s*.5,-s*.25);        // engine top
    ctx.lineTo(-s*.5,s*.25);         // engine bottom
    ctx.lineTo(-s*.25,s*.4);         // lower rear
    ctx.lineTo(s*.1,s*.35);          // lower body
    ctx.lineTo(s*.35,s*.2);          // lower nose
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.6)';ctx.lineWidth=1;ctx.stroke();
    // Mining arm struts (extending forward)
    ctx.strokeStyle='rgba(255,200,50,.5)';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.moveTo(s*.3,-s*.18);ctx.lineTo(s*.75,-s*.3);ctx.stroke();
    ctx.beginPath();ctx.moveTo(s*.3,s*.18);ctx.lineTo(s*.75,s*.3);ctx.stroke();
    // Mining tips (glowing)
    ctx.fillStyle='rgba(255,220,80,.7)';
    ctx.beginPath();ctx.arc(s*.75,-s*.3,s*.04,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(s*.75,s*.3,s*.04,0,Math.PI*2);ctx.fill();
    // Cargo scanner window
    ctx.fillStyle='rgba(100,255,150,.4)';
    ctx.beginPath();ctx.moveTo(s*.45,0);ctx.lineTo(s*.25,-s*.1);ctx.lineTo(s*.2,0);ctx.lineTo(s*.25,s*.1);ctx.closePath();ctx.fill();
    // Engine glow
    ctx.fillStyle='rgba(80,200,100,.4)';
    ctx.fillRect(-s*.54,-s*.08,s*.06,s*.16);
  }
  else{
    // Fallback (same as prospector)
    ctx.moveTo(s*1.05,0);
    ctx.lineTo(s*.4,-s*.25);ctx.lineTo(s*.15,-s*.55);ctx.lineTo(-s*.3,-s*.65);
    ctx.lineTo(-s*.55,-s*.5);ctx.lineTo(-s*.45,-s*.25);ctx.lineTo(-s*.65,-s*.2);
    ctx.lineTo(-s*.65,s*.2);ctx.lineTo(-s*.45,s*.25);ctx.lineTo(-s*.55,s*.5);
    ctx.lineTo(-s*.3,s*.65);ctx.lineTo(s*.15,s*.55);ctx.lineTo(s*.4,s*.25);
    ctx.closePath();ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle='rgba(150,220,255,.6)';
    ctx.beginPath();ctx.moveTo(s*.8,0);ctx.lineTo(s*.4,-s*.15);ctx.lineTo(s*.35,0);ctx.lineTo(s*.4,s*.15);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(100,180,255,.4)';
    ctx.fillRect(-s*.68,-s*.15,s*.08,s*.3);
  }
}
