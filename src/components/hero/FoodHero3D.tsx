import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useAudio } from '../../context/AudioContext';
import { Sparkles, ArrowRight } from 'lucide-react';

interface FoodHero3DProps {
  onSelectCuisine?: (cuisine: string) => void;
}

export const FoodHero3D: React.FC<FoodHero3DProps> = ({ onSelectCuisine }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeFood, setActiveFood] = useState<{
    name: string;
    cuisine: string;
    description: string;
    price: string;
    rating: string;
  } | null>(null);

  const { playClick, playAdd } = useAudio();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    container.appendChild(renderer.domElement);

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    keyLight.position.set(8, 12, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x00d084, 1.5);
    rimLight.position.set(-10, -5, -5);
    scene.add(rimLight);

    const warmAccentLight = new THREE.PointLight(0xff5e1e, 3, 20);
    warmAccentLight.position.set(0, 0, 5);
    scene.add(warmAccentLight);

    // Root interactive group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Track objects for raycasting
    const interactiveObjects: THREE.Object3D[] = [];

    // Helper: Material creators
    const createToonMaterial = (color: number, roughness = 0.3, metalness = 0.1) => {
      return new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness
      });
    };

    // 1. BURGER
    const burgerGroup = new THREE.Group();
    burgerGroup.position.set(-3.5, 1.2, 0);
    burgerGroup.userData = {
      name: 'Artisan Smash Burger',
      cuisine: 'Burgers',
      description: 'Double Angus beef patty with dripping cheddar, grilled onions, and truffle aioli on brioche.',
      price: '$14.50',
      rating: '4.9 ★'
    };

    // Top Bun
    const topBunGeo = new THREE.SphereGeometry(1.4, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const bunMat = createToonMaterial(0xd9822b, 0.4);
    const topBun = new THREE.Mesh(topBunGeo, bunMat);
    topBun.scale.set(1, 0.65, 1);
    topBun.position.y = 0.7;
    topBun.castShadow = true;
    burgerGroup.add(topBun);

    // Sesame Seeds
    const seedGeo = new THREE.ConeGeometry(0.04, 0.08, 6);
    const seedMat = createToonMaterial(0xfff4e0, 0.2);
    for (let i = 0; i < 24; i++) {
      const seed = new THREE.Mesh(seedGeo, seedMat);
      const theta = Math.random() * Math.PI * 2;
      const phi = 0.2 + Math.random() * 0.6;
      seed.position.set(
        1.3 * Math.sin(phi) * Math.cos(theta),
        0.7 + 0.85 * Math.cos(phi),
        1.3 * Math.sin(phi) * Math.sin(theta)
      );
      seed.rotation.x = Math.PI / 2;
      burgerGroup.add(seed);
    }

    // Tomato slice
    const tomatoGeo = new THREE.CylinderGeometry(1.35, 1.35, 0.18, 24);
    const tomatoMat = createToonMaterial(0xcc1111, 0.2);
    const tomato = new THREE.Mesh(tomatoGeo, tomatoMat);
    tomato.position.y = 0.45;
    burgerGroup.add(tomato);

    // Melted Cheese
    const cheeseGeo = new THREE.BoxGeometry(2.3, 0.12, 2.3);
    const cheeseMat = createToonMaterial(0xffaa00, 0.3);
    const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
    cheese.position.y = 0.3;
    cheese.rotation.y = 0.4;
    burgerGroup.add(cheese);

    // Meat Patty
    const pattyGeo = new THREE.CylinderGeometry(1.42, 1.42, 0.38, 24);
    const pattyMat = createToonMaterial(0x421e10, 0.7);
    const patty = new THREE.Mesh(pattyGeo, pattyMat);
    patty.position.y = 0.05;
    burgerGroup.add(patty);

    // Lettuce
    const lettuceGeo = new THREE.TorusGeometry(1.3, 0.18, 12, 24);
    const lettuceMat = createToonMaterial(0x44bb22, 0.4);
    const lettuce = new THREE.Mesh(lettuceGeo, lettuceMat);
    lettuce.rotation.x = Math.PI / 2;
    lettuce.position.y = -0.15;
    burgerGroup.add(lettuce);

    // Bottom Bun
    const bottomBunGeo = new THREE.CylinderGeometry(1.38, 1.25, 0.45, 24);
    const bottomBun = new THREE.Mesh(bottomBunGeo, bunMat);
    bottomBun.position.y = -0.45;
    burgerGroup.add(bottomBun);

    rootGroup.add(burgerGroup);
    interactiveObjects.push(burgerGroup);

    // 2. PIZZA SLICE
    const pizzaGroup = new THREE.Group();
    pizzaGroup.position.set(3.6, 1.6, 0.5);
    pizzaGroup.rotation.set(0.3, -0.4, 0.2);
    pizzaGroup.userData = {
      name: 'Neapolitan Burrata Pizza',
      cuisine: 'Pizza',
      description: 'Charred sourdough crust, San Marzano tomato sauce, fresh buffalo burrata, and basil.',
      price: '$18.50',
      rating: '4.9 ★'
    };

    // Crust
    const crustShape = new THREE.Shape();
    crustShape.moveTo(0, 0);
    crustShape.lineTo(2.2, 1.3);
    crustShape.quadraticCurveTo(2.4, 0, 2.2, -1.3);
    crustShape.closePath();

    const extrudeSettings = { depth: 0.22, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.08, bevelThickness: 0.08 };
    const pizzaGeo = new THREE.ExtrudeGeometry(crustShape, extrudeSettings);
    const pizzaMat = createToonMaterial(0xffaa22, 0.5);
    const pizzaMesh = new THREE.Mesh(pizzaGeo, pizzaMat);
    pizzaMesh.rotation.z = Math.PI * 0.5;
    pizzaMesh.position.set(0, -0.8, 0);
    pizzaGroup.add(pizzaMesh);

    // Pepperonis
    const pepGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 16);
    const pepMat = createToonMaterial(0xa01818, 0.3);
    [
      { x: -0.4, y: 0.2, z: 0.26 },
      { x: 0.3, y: 0.5, z: 0.26 },
      { x: 0.2, y: -0.3, z: 0.26 },
      { x: -0.1, y: 0.8, z: 0.26 }
    ].forEach(p => {
      const pep = new THREE.Mesh(pepGeo, pepMat);
      pep.rotation.x = Math.PI / 2;
      pep.position.set(p.x, p.y, p.z);
      pizzaGroup.add(pep);
    });

    rootGroup.add(pizzaGroup);
    interactiveObjects.push(pizzaGroup);

    // 3. FRENCH FRIES BOX
    const friesGroup = new THREE.Group();
    friesGroup.position.set(-2.8, -2.2, 1.2);
    friesGroup.rotation.set(-0.2, 0.3, -0.1);
    friesGroup.userData = {
      name: 'Truffle Parmesan Fries',
      cuisine: 'Burgers',
      description: 'Double-fried crisp russet potatoes tossed in black truffle oil and grated Parmigiano.',
      price: '$6.50',
      rating: '4.8 ★'
    };

    // Box
    const boxGeo = new THREE.BoxGeometry(1.6, 2.0, 1.1);
    const boxMat = createToonMaterial(0xff2222, 0.2); // Crave Red Box
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 0;
    friesGroup.add(box);

    // Fry sticks
    const fryGeo = new THREE.BoxGeometry(0.18, 1.8, 0.18);
    const fryMat = createToonMaterial(0xffcc33, 0.3);
    for (let i = 0; i < 14; i++) {
      const fry = new THREE.Mesh(fryGeo, fryMat);
      const angle = (i - 7) * 0.08;
      fry.position.set((Math.random() - 0.5) * 1.1, 0.8 + Math.random() * 0.4, (Math.random() - 0.5) * 0.7);
      fry.rotation.z = angle + (Math.random() - 0.5) * 0.15;
      fry.rotation.x = (Math.random() - 0.5) * 0.2;
      friesGroup.add(fry);
    }

    rootGroup.add(friesGroup);
    interactiveObjects.push(friesGroup);

    // 4. NIGIRI SUSHI
    const sushiGroup = new THREE.Group();
    sushiGroup.position.set(0, 2.6, 0.2);
    sushiGroup.rotation.set(0.3, 0.2, 0.1);
    sushiGroup.userData = {
      name: 'Salmon Aburi Nigiri',
      cuisine: 'Sushi & Japanese',
      description: 'Torched Norwegian salmon with sweet nikiri glaze, oscietra caviar, and vinegared rice.',
      price: '$12.00',
      rating: '4.95 ★'
    };

    // Rice mound
    const riceGeo = new THREE.BoxGeometry(1.8, 0.7, 1.0);
    const riceMat = createToonMaterial(0xf4f4f4, 0.6);
    const rice = new THREE.Mesh(riceGeo, riceMat);
    sushiGroup.add(rice);

    // Salmon top
    const salmonGeo = new THREE.BoxGeometry(2.1, 0.32, 1.15);
    const salmonMat = createToonMaterial(0xff5533, 0.2, 0.1);
    const salmon = new THREE.Mesh(salmonGeo, salmonMat);
    salmon.position.y = 0.45;
    sushiGroup.add(salmon);

    // Nori seaweed wrap
    const noriGeo = new THREE.BoxGeometry(0.35, 0.85, 1.2);
    const noriMat = createToonMaterial(0x112211, 0.8);
    const nori = new THREE.Mesh(noriGeo, noriMat);
    nori.position.y = 0.1;
    sushiGroup.add(nori);

    rootGroup.add(sushiGroup);
    interactiveObjects.push(sushiGroup);

    // 5. DRINK CUP
    const drinkGroup = new THREE.Group();
    drinkGroup.position.set(2.8, -2.0, 0.8);
    drinkGroup.rotation.set(0.1, -0.2, 0.1);
    drinkGroup.userData = {
      name: 'Brown Sugar Boba Milk',
      cuisine: 'Beverages',
      description: 'Slow-cooked chewy brown sugar pearls with fresh cold organic milk and velvety cream.',
      price: '$6.20',
      rating: '4.9 ★'
    };

    // Cup
    const cupGeo = new THREE.CylinderGeometry(0.85, 0.65, 2.2, 24);
    const cupMat = new THREE.MeshPhysicalMaterial({
      color: 0xaa6622,
      roughness: 0.1,
      transmission: 0.65,
      thickness: 0.5,
      transparent: true,
      opacity: 0.9
    });
    const cup = new THREE.Mesh(cupGeo, cupMat);
    drinkGroup.add(cup);

    // Lid
    const lidGeo = new THREE.CylinderGeometry(0.92, 0.92, 0.15, 24);
    const lidMat = createToonMaterial(0xffffff, 0.2);
    const lid = new THREE.Mesh(lidGeo, lidMat);
    lid.position.y = 1.15;
    drinkGroup.add(lid);

    // Straw
    const strawGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.8, 12);
    const strawMat = createToonMaterial(0x00d084, 0.2);
    const straw = new THREE.Mesh(strawGeo, strawMat);
    straw.rotation.z = 0.2;
    straw.position.set(0.15, 1.2, 0);
    drinkGroup.add(straw);

    rootGroup.add(drinkGroup);
    interactiveObjects.push(drinkGroup);

    // 6. GLAZED DONUT / DESSERT
    const donutGroup = new THREE.Group();
    donutGroup.position.set(0.2, -0.6, 2.2);
    donutGroup.rotation.set(0.6, 0.4, 0.3);
    donutGroup.userData = {
      name: 'Strawberry Glazed Donut',
      cuisine: 'Desserts & Bakery',
      description: 'Fluffy golden fried brioche ring coated in strawberry white chocolate glaze & sprinkles.',
      price: '$4.50',
      rating: '4.8 ★'
    };

    // Donut dough
    const donutGeo = new THREE.TorusGeometry(1.1, 0.55, 20, 32);
    const donutMat = createToonMaterial(0xd8924b, 0.5);
    const donut = new THREE.Mesh(donutGeo, donutMat);
    donutGroup.add(donut);

    // Glaze
    const glazeGeo = new THREE.TorusGeometry(1.1, 0.58, 20, 32, Math.PI * 1.7);
    const glazeMat = createToonMaterial(0xff4488, 0.2);
    const glaze = new THREE.Mesh(glazeGeo, glazeMat);
    glaze.rotation.x = 0.2;
    donutGroup.add(glaze);

    rootGroup.add(donutGroup);
    interactiveObjects.push(donutGroup);

    // Floating particles (sparks & flavor dots)
    const particleCount = 45;
    const particleGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.6 });
    const particleGroup = new THREE.Group();

    for (let i = 0; i < particleCount; i++) {
      const p = new THREE.Mesh(particleGeo, particleMat);
      p.position.set(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6
      );
      p.userData = {
        speedY: 0.005 + Math.random() * 0.01,
        initialY: p.position.y
      };
      particleGroup.add(p);
    }
    scene.add(particleGroup);

    // Mouse movement parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseX = (x / width) * 2 - 1;
      mouseY = -(y / height) * 2 + 1;
    };

    // Raycaster for interactive click
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseVector.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseVector.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects, true);

      if (intersects.length > 0) {
        // Find top group
        let hitObject: THREE.Object3D | null = intersects[0].object;
        while (hitObject && !hitObject.userData.name && hitObject.parent) {
          hitObject = hitObject.parent;
        }

        if (hitObject && hitObject.userData.name) {
          playClick();
          setActiveFood({
            name: hitObject.userData.name,
            cuisine: hitObject.userData.cuisine,
            description: hitObject.userData.description,
            price: hitObject.userData.price,
            rating: hitObject.userData.rating
          });

          // Playful spring bounce
          hitObject.scale.set(1.2, 1.2, 1.2);
          setTimeout(() => {
            if (hitObject) hitObject.scale.set(1, 1, 1);
          }, 300);
        }
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);

    // Window resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 600;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) * 0.001;

      // Smooth camera / root parallax
      targetX += (mouseX * 0.4 - targetX) * 0.05;
      targetY += (mouseY * 0.3 - targetY) * 0.05;
      rootGroup.rotation.y = targetX;
      rootGroup.rotation.x = -targetY;

      // Floating oscillation per food item
      burgerGroup.position.y = 1.2 + Math.sin(elapsedTime * 1.5) * 0.15;
      burgerGroup.rotation.y = elapsedTime * 0.3;

      pizzaGroup.position.y = 1.6 + Math.cos(elapsedTime * 1.3) * 0.18;
      pizzaGroup.rotation.z = 0.2 + Math.sin(elapsedTime * 0.8) * 0.1;

      friesGroup.position.y = -2.2 + Math.sin(elapsedTime * 1.4 + 1) * 0.12;
      friesGroup.rotation.y = 0.3 + Math.cos(elapsedTime * 0.6) * 0.15;

      sushiGroup.position.y = 2.6 + Math.cos(elapsedTime * 1.2 + 2) * 0.14;
      sushiGroup.rotation.y = elapsedTime * 0.4;

      drinkGroup.position.y = -2.0 + Math.sin(elapsedTime * 1.6 + 3) * 0.15;
      drinkGroup.rotation.y = -0.2 + Math.sin(elapsedTime * 0.7) * 0.2;

      donutGroup.position.y = -0.6 + Math.cos(elapsedTime * 1.8 + 1) * 0.15;
      donutGroup.rotation.x = 0.6 + elapsedTime * 0.4;
      donutGroup.rotation.y = 0.4 + elapsedTime * 0.3;

      // Particles float up
      particleGroup.children.forEach(child => {
        const p = child as THREE.Mesh;
        p.position.y += p.userData.speedY;
        if (p.position.y > 5) {
          p.position.y = -5;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('click', handleClick);
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[460px] md:h-[560px] flex items-center justify-center select-none">
      {/* Three.js Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Interaction Hint Badge */}
      <div className="absolute top-4 right-4 pointer-events-none flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-black/5 dark:border-white/10 text-xs font-medium text-slate-600 dark:text-slate-300 shadow-lg">
        <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse" />
        <span>Click 3D items to inspect</span>
      </div>

      {/* Interactive Food Spotlight Popup */}
      {activeFood && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md p-4 rounded-2xl bg-white/90 dark:bg-[#0f1420]/90 backdrop-blur-xl border border-brand-500/20 shadow-2xl shadow-brand-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 z-20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-500">
                  {activeFood.cuisine}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  {activeFood.rating}
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {activeFood.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {activeFood.description}
              </p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {activeFood.price}
              </span>
            </div>
          </div>

          <div className="mt-3.5 flex items-center gap-2">
            <button
              onClick={() => {
                playAdd();
                if (onSelectCuisine) onSelectCuisine(activeFood.cuisine);
                setActiveFood(null);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-brand-500 to-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/20 hover:opacity-95 transition-opacity"
            >
              <span>Explore {activeFood.cuisine}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveFood(null)}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 text-xs font-medium hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
