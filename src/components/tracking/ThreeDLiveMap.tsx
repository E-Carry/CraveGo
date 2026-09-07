import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Navigation,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Zap,
  Rotate3d,
  Layers,
  Sparkles
} from 'lucide-react';

interface ThreeDLiveMapProps {
  progressPercent: number; // 0 to 100
  restaurantName: string;
  deliveryAddress: string;
  riderName?: string;
}

export const ThreeDLiveMap: React.FC<ThreeDLiveMapProps> = ({
  progressPercent,
  restaurantName,
  deliveryAddress,
  riderName = 'Rajesh Kumar'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cameraMode, setCameraMode] = useState<'follow' | 'overview'>('follow');
  const [isNightMode, setIsNightMode] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentSpeed, setCurrentSpeed] = useState(28);

  // References to communicate with Three.js loop
  const threeState = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    bikeGroup: THREE.Group | null;
    frontWheel: THREE.Mesh | null;
    rearWheel: THREE.Mesh | null;
    curve: THREE.CatmullRomCurve3 | null;
    progress: number;
    cameraMode: 'follow' | 'overview';
    isNightMode: boolean;
    zoom: number;
    lightMap: {
      ambient: THREE.AmbientLight | null;
      directional: THREE.DirectionalLight | null;
    };
  }>({
    scene: null,
    camera: null,
    renderer: null,
    bikeGroup: null,
    frontWheel: null,
    rearWheel: null,
    curve: null,
    progress: Math.min(1, Math.max(0, progressPercent / 100)),
    cameraMode: 'follow',
    isNightMode: true,
    zoom: 1,
    lightMap: { ambient: null, directional: null }
  });

  // Sync state into ref
  useEffect(() => {
    threeState.current.progress = Math.min(0.99, Math.max(0.01, progressPercent / 100));
  }, [progressPercent]);

  useEffect(() => {
    threeState.current.cameraMode = cameraMode;
  }, [cameraMode]);

  useEffect(() => {
    threeState.current.zoom = zoomLevel;
  }, [zoomLevel]);

  // Three.js Mount & Animation Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightMode ? 0x070b14 : 0xe2e8f0);
    scene.fog = new THREE.FogExp2(isNightMode ? 0x070b14 : 0xe2e8f0, 0.012);
    threeState.current.scene = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 35, 45);
    threeState.current.camera = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);
    threeState.current.renderer = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isNightMode ? 0.6 : 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, isNightMode ? 1.2 : 2.0);
    dirLight.position.set(40, 60, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 150;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;
    scene.add(dirLight);

    threeState.current.lightMap = { ambient: ambientLight, directional: dirLight };

    // Ground Plane (City Terrain)
    const groundGeo = new THREE.PlaneGeometry(300, 300);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x0c121e : 0xd8e0e8,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // City Grid Floor Lines
    const gridHelper = new THREE.GridHelper(260, 52, 0xef4444, isNightMode ? 0x1a2638 : 0xb0bec5);
    gridHelper.position.y = 0.05;
    scene.add(gridHelper);

    // Roads
    const roadMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x131a29 : 0x475569,
      roughness: 0.8
    });

    const createRoad = (w: number, l: number, x: number, z: number, rotY = 0) => {
      const roadGeo = new THREE.PlaneGeometry(w, l);
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.rotation.z = rotY;
      road.position.set(x, 0.08, z);
      road.receiveShadow = true;
      scene.add(road);

      // Lane separator dashes
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const lineGeo = new THREE.PlaneGeometry(0.3, l);
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.rotation.z = rotY;
      line.position.set(x, 0.09, z);
      scene.add(line);
    };

    createRoad(8, 220, 0, 0, 0); // Main Avenue
    createRoad(8, 220, -35, 0, 0);
    createRoad(8, 220, 35, 0, 0);
    createRoad(8, 220, 0, 0, Math.PI / 2); // Cross Street
    createRoad(8, 220, 0, -40, Math.PI / 2);
    createRoad(8, 220, 0, 40, Math.PI / 2);

    // Procedural 3D City Skyscrapers
    const buildingMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x182236 : 0x94a3b8,
      roughness: 0.4,
      metalness: 0.6
    });

    const glassMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x1e3a8a : 0x38bdf8,
      emissive: isNightMode ? 0x0e2a47 : 0x000000,
      roughness: 0.1,
      metalness: 0.9
    });

    const createBuilding = (x: number, z: number, w: number, d: number, h: number) => {
      const bGroup = new THREE.Group();
      bGroup.position.set(x, h / 2, z);

      const bGeo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(bGeo, Math.random() > 0.4 ? glassMat : buildingMat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      bGroup.add(mesh);

      // Rooftop HVAC
      const hvacGeo = new THREE.BoxGeometry(w * 0.4, 1.5, d * 0.4);
      const hvacMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
      const hvac = new THREE.Mesh(hvacGeo, hvacMat);
      hvac.position.y = h / 2 + 0.75;
      bGroup.add(hvac);

      scene.add(bGroup);
    };

    // Populate City Blocks
    const blockPositions = [
      [-18, -20], [-18, 20], [18, -20], [18, 20],
      [-55, -20], [-55, 20], [55, -20], [55, 20],
      [-18, -60], [-18, 60], [18, -60], [18, 60],
      [-55, -60], [-55, 60], [55, -60], [55, 60]
    ];

    blockPositions.forEach(([bx, bz]) => {
      const height = 12 + Math.random() * 26;
      createBuilding(bx, bz, 14, 16, height);
    });

    // Curving 3D Delivery Route Path
    // Origin (Restaurant): (-35, 0.2, -40) -> Destination (Customer): (35, 0.2, 40)
    const points = [
      new THREE.Vector3(-35, 0.2, -40),
      new THREE.Vector3(-35, 0.2, -15),
      new THREE.Vector3(-35, 0.2, 0),
      new THREE.Vector3(-15, 0.2, 0),
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(0, 0.2, 25),
      new THREE.Vector3(0, 0.2, 40),
      new THREE.Vector3(20, 0.2, 40),
      new THREE.Vector3(35, 0.2, 40)
    ];

    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.1);
    threeState.current.curve = curve;

    // Route Neon Tube
    const tubeGeo = new THREE.TubeGeometry(curve, 100, 0.4, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: false });
    const routeTube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(routeTube);

    // Traveled Glowing Path Overlay
    const traveledMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const traveledTube = new THREE.Mesh(tubeGeo, traveledMat);
    scene.add(traveledTube);

    // Origin 3D Restaurant Marker
    const restMarkerGroup = new THREE.Group();
    restMarkerGroup.position.set(-35, 0, -40);

    const restCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(3, 3, 0.4, 24),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    restMarkerGroup.add(restCylinder);

    const restPin = new THREE.Mesh(
      new THREE.ConeGeometry(1.8, 4, 16),
      new THREE.MeshStandardMaterial({ color: 0xff3b30 })
    );
    restPin.position.y = 4;
    restPin.rotation.x = Math.PI;
    restMarkerGroup.add(restPin);

    scene.add(restMarkerGroup);

    // Destination 3D Customer House Marker
    const destMarkerGroup = new THREE.Group();
    destMarkerGroup.position.set(35, 0, 40);

    const destCylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, 0.4, 24),
      new THREE.MeshBasicMaterial({ color: 0x10b981 })
    );
    destMarkerGroup.add(destCylinder);

    const destPin = new THREE.Mesh(
      new THREE.ConeGeometry(1.8, 4, 16),
      new THREE.MeshStandardMaterial({ color: 0x10b981 })
    );
    destPin.position.y = 4;
    destPin.rotation.x = Math.PI;
    destMarkerGroup.add(destPin);

    scene.add(destMarkerGroup);

    // Build the 3D Ather EV Scooter with CraveGo Delivery Trunk!
    const bikeGroup = new THREE.Group();

    // Scooter Body / Frame
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.8 });
    const fairingMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.2, metalness: 0.5 }); // Ather Mint Green

    const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 3.2), fairingMat);
    chassis.position.y = 1.2;
    chassis.castShadow = true;
    bikeGroup.add(chassis);

    // Footboard
    const deck = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 1.6), bodyMat);
    deck.position.set(0, 0.8, 0);
    bikeGroup.add(deck);

    // Wheels (Front & Rear that will spin)
    const wheelGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 16);
    wheelGeo.rotateZ(Math.PI / 2);
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });

    const frontWheel = new THREE.Mesh(wheelGeo, tireMat);
    frontWheel.position.set(0, 0.7, 1.4);
    frontWheel.castShadow = true;
    bikeGroup.add(frontWheel);

    const rearWheel = new THREE.Mesh(wheelGeo, tireMat);
    rearWheel.position.set(0, 0.7, -1.3);
    rearWheel.castShadow = true;
    bikeGroup.add(rearWheel);

    threeState.current.frontWheel = frontWheel;
    threeState.current.rearWheel = rearWheel;

    // Handlebars & Stem
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.4), bodyMat);
    stem.position.set(0, 1.8, 1.3);
    stem.rotation.x = -0.2;
    bikeGroup.add(stem);

    const handlebar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.15), bodyMat);
    handlebar.position.set(0, 2.4, 1.1);
    bikeGroup.add(handlebar);

    // Headlight Lens + Volumetric Light Cone
    const headlightLens = new THREE.Mesh(
      new THREE.CircleGeometry(0.3, 16),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    headlightLens.position.set(0, 2.0, 1.6);
    headlightLens.rotation.x = -0.1;
    bikeGroup.add(headlightLens);

    const headlightLight = new THREE.SpotLight(0xfffbeb, 4, 25, Math.PI / 5, 0.4, 1);
    headlightLight.position.set(0, 2.0, 1.7);
    headlightLight.target.position.set(0, 0, 10);
    bikeGroup.add(headlightLight);
    bikeGroup.add(headlightLight.target);

    // CraveGo Insulated Food Delivery Box on Rear!
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // CraveGo Signature Red
      roughness: 0.4
    });
    const trunk = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.3), trunkMat);
    trunk.position.set(0, 2.1, -1.0);
    trunk.castShadow = true;
    bikeGroup.add(trunk);

    // Delivery Rider with Helmet
    const riderTorso = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 1.2, 0.7),
      new THREE.MeshStandardMaterial({ color: 0x334155 })
    );
    riderTorso.position.set(0, 2.0, 0.1);
    bikeGroup.add(riderTorso);

    const helmet = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.2 })
    );
    helmet.position.set(0, 2.85, 0.15);
    bikeGroup.add(helmet);

    scene.add(bikeGroup);
    threeState.current.bikeGroup = bikeGroup;

    // Animation variables
    let animationFrameId: number;
    let wheelAngle = 0;
    let localProgress = threeState.current.progress;

    // Animation Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth progress interpolation towards target
      const targetProg = threeState.current.progress;
      localProgress += (targetProg - localProgress) * 0.05;

      if (curve && bikeGroup) {
        // Sample position and forward tangent along curve
        const pt = curve.getPointAt(localProgress);
        const tangent = curve.getTangentAt(localProgress).normalize();

        bikeGroup.position.copy(pt);

        // Orient bike towards tangent
        const lookTarget = pt.clone().add(tangent);
        bikeGroup.lookAt(lookTarget);

        // Spin wheels based on speed
        wheelAngle -= 0.18;
        if (frontWheel) frontWheel.rotation.x = wheelAngle;
        if (rearWheel) rearWheel.rotation.x = wheelAngle;

        // Camera positioning logic
        const currentMode = threeState.current.cameraMode;
        const currentZoom = threeState.current.zoom;

        if (currentMode === 'follow') {
          // 3rd person isometric follow camera directly behind bike
          const offset = tangent.clone().multiplyScalar(-18 * currentZoom).add(new THREE.Vector3(0, 14 * currentZoom, 0));
          const camTargetPos = pt.clone().add(offset);
          camera.position.lerp(camTargetPos, 0.06);
          camera.lookAt(pt.clone().add(new THREE.Vector3(0, 2, 0)));
        } else {
          // Panoramic Overview
          const overviewPos = new THREE.Vector3(0, 65 * currentZoom, 60 * currentZoom);
          camera.position.lerp(overviewPos, 0.04);
          camera.lookAt(0, 0, 0);
        }

        // Slight speed oscillation for realism
        setCurrentSpeed(Math.round(26 + Math.sin(Date.now() * 0.003) * 6));
      }

      // Gentle pulsing of restaurant and destination pins
      const pulseScale = 1 + Math.sin(Date.now() * 0.005) * 0.15;
      restPin.scale.set(pulseScale, pulseScale, pulseScale);
      destPin.scale.set(pulseScale, pulseScale, pulseScale);

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isNightMode]);

  return (
    <div className="relative w-full h-72 sm:h-96 rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/10 shadow-2xl bg-neutral-950 select-none">
      {/* Three.js 3D WebGL Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Turn-By-Turn Navigation HUD (Top-Left) */}
      <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 max-w-[280px] sm:max-w-xs p-3 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 text-white shadow-2xl flex items-center gap-3 pointer-events-none">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
          <Navigation className="w-5 h-5 animate-pulse" />
        </div>
        <div className="truncate">
          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 block">
            Turn-By-Turn Telemetry
          </span>
          <p className="text-xs font-black truncate leading-tight">
            {progressPercent >= 80
              ? 'Approaching Destination • Gate entry'
              : progressPercent >= 45
              ? 'Cruising 100 Feet Rd, Indiranagar'
              : 'Dispatched from Restaurant Kitchen'}
          </p>
          <span className="text-[10px] text-neutral-400">
            {progressPercent >= 80 ? 'In 80m, reach destination' : 'Speed: 28 km/h • GPS Lock ±1m'}
          </span>
        </div>
      </div>

      {/* Real-time Valet Status Chip (Top-Right) */}
      <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 text-white text-xs font-bold flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Ather EV Gen 3</span>
          <span className="text-neutral-400 font-mono text-[11px]">• {currentSpeed} km/h</span>
        </div>
      </div>

      {/* Floating 3D Map View Controls (Bottom-Right) */}
      <div className="absolute bottom-3.5 right-3.5 sm:bottom-4 sm:right-4 flex items-center gap-1.5 p-1 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 shadow-2xl">
        <button
          onClick={() => setCameraMode(cameraMode === 'follow' ? 'overview' : 'follow')}
          title={cameraMode === 'follow' ? 'Switch to 3D Overview' : 'Follow Valet 3D'}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
            cameraMode === 'follow'
              ? 'bg-red-600 text-white shadow-md'
              : 'text-neutral-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Rotate3d className="w-3.5 h-3.5" />
          <span>{cameraMode === 'follow' ? 'Follow Bike' : 'Overview'}</span>
        </button>

        <button
          onClick={() => setZoomLevel(z => Math.max(0.6, z - 0.2))}
          title="Zoom In"
          className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => setZoomLevel(z => Math.min(1.6, z + 0.2))}
          title="Zoom Out"
          className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsNightMode(!isNightMode)}
          title={isNightMode ? 'Switch to Day Mode' : 'Switch to Dark Map'}
          className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Layers className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* Bottom-Left Live Telemetry Stats */}
      <div className="absolute bottom-3.5 left-3.5 sm:bottom-4 sm:left-4 hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 text-white text-xs font-semibold pointer-events-none">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Zap className="w-3.5 h-3.5 fill-emerald-400" />
          <span>Battery 84%</span>
        </div>
        <span className="w-1 h-1 rounded-full bg-neutral-600" />
        <span>Rider: {riderName}</span>
        <span className="w-1 h-1 rounded-full bg-neutral-600" />
        <span className="text-neutral-400">KA 03 EV 2026</span>
      </div>
    </div>
  );
};
