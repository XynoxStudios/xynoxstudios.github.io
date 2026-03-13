// XYNOX STUDIOS - Minecraft Nether Portal Entry Animation
// Uses Three.js to create an immersive portal entry experience

let portalScene, portalCamera, portalRenderer, portalMesh, particles, vortexMesh;
let isPortalActive = false;
let cameraAnimationProgress = 0;
const PORTAL_DURATION = 2500; // 2.5 seconds

function initPortal() {
    const container = document.getElementById('portalContainer');
    if (!container || isPortalActive) return;

    isPortalActive = true;
    
    // Scene setup
    portalScene = new THREE.Scene();
    portalScene.background = new THREE.Color(0x05070d);

    portalCamera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    portalCamera.position.z = 5;

    portalRenderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: false,
        powerPreference: 'high-performance'
    });
    portalRenderer.setSize(window.innerWidth, window.innerHeight);
    portalRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(portalRenderer.domElement);

    // Create portal geometry
    createNetherPortal();
    createVortexEffect();
    createParticleSwarm();
    addLighting();

    // Start animation sequence
    animatePortalEntry();

    // Cleanup on window resize
    window.addEventListener('resize', () => {
        portalCamera.aspect = window.innerWidth / window.innerHeight;
        portalCamera.updateProjectionMatrix();
        portalRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function createNetherPortal() {
    // Main portal frame - obsidian-like material
    const frameGeometry = new THREE.TorusGeometry(2, 0.3, 16, 100);
    
    const frameMaterial = new THREE.MeshStandardMaterial({
        color: 0x2d0a4e,
        metalness: 0.3,
        roughness: 0.7,
        emissive: 0x6a00ff,
        emissiveIntensity: 0.5
    });

    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    portalScene.add(frame);

    // Portal vortex surface
    const vortexGeometry = new THREE.IcosahedronGeometry(2, 8);
    
    const vortexMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0 },
            colorA: { value: new THREE.Color(0x8a2be2) }, // Blue purple
            colorB: { value: new THREE.Color(0x4b0082) }, // Indigo
            colorC: { value: new THREE.Color(0xff007f) }  // Pink
        },
        vertexShader: `
            uniform float time;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying float vDepth;

            void main() {
                vPosition = position;
                vNormal = normalize(normalMatrix * normal);
                vDepth = length(position);
                
                // Spiral deformation
                vec3 pos = position;
                float spiral = atan(pos.y, pos.x) + time * 0.5;
                float twist = sin(spiral * 3.0 + time * 0.3) * 0.2;
                
                pos += normalize(pos) * twist;
                
                // Pulsing motion
                float pulse = sin(time * 0.003) * 0.1 + 0.9;
                pos *= pulse;
                
                // Inward pull
                pos *= 0.95;
                
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            uniform vec3 colorA;
            uniform vec3 colorB;
            uniform vec3 colorC;
            varying vec3 vPosition;
            varying vec3 vNormal;
            varying float vDepth;

            void main() {
                // Color cycling based on depth
                float cycle = sin(time * 0.004 + vDepth * 5.0) * 0.5 + 0.5;
                vec3 color = mix(colorA, colorB, cycle);
                color = mix(color, colorC, sin(time * 0.005 + vDepth) * 0.5 + 0.5);
                
                // Brightness variation
                float brightness = 0.6 + sin(time * 0.003) * 0.3;
                
                // Fresnel effect for edges
                vec3 viewDir = normalize(cameraPosition - vPosition);
                float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 3.0);
                
                float alpha = 0.9 + fresnel * 0.1;
                
                gl_FragColor = vec4(color * brightness, alpha);
            }
        `,
        wireframe: false,
        transparent: true,
        side: THREE.DoubleSide
    });

    portalMesh = new THREE.Mesh(vortexGeometry, vortexMaterial);
    portalScene.add(portalMesh);

    // Outer portal rings
    for (let i = 1; i <= 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(2 + i * 0.15, 0.08, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0x6a00ff,
            metalness: 0.5,
            roughness: 0.5,
            emissive: 0xff007f,
            emissiveIntensity: 0.3 * (1 - i * 0.2)
        });

        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.z = -0.1 * i;
        ring.rotation.x = (Math.PI / 6) * i;
        ring.rotation.y = (Math.PI / 8) * i;
        portalScene.add(ring);
    }
}

function createVortexEffect() {
    // Central vortex spiral
    const spiralGeometry = new THREE.BufferGeometry();
    const spiralPoints = [];

    for (let i = 0; i < 200; i++) {
        const t = i / 200;
        const angle = t * Math.PI * 8;
        const radius = 2 * (1 - t);
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const z = t * 2 - 1;
        
        spiralPoints.push(x, y, z);
    }

    spiralGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(spiralPoints), 3));

    const spiralMaterial = new THREE.LineBasicMaterial({
        color: 0xff007f,
        linewidth: 2,
        fog: false
    });

    vortexMesh = new THREE.LineSegments(spiralGeometry, spiralMaterial);
    portalScene.add(vortexMesh);
}

function createParticleSwarm() {
    const particleCount = 500;
    const particleGeometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Position - random in sphere
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = Math.random() * 3 + 1;

        positions[i3] = Math.sin(phi) * Math.cos(theta) * radius;
        positions[i3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
        positions[i3 + 2] = Math.cos(phi) * radius;

        // Velocity - towards center
        velocities[i3] = -positions[i3] * 0.01;
        velocities[i3 + 1] = -positions[i3 + 1] * 0.01;
        velocities[i3 + 2] = -positions[i3 + 2] * 0.01;

        // Color - purple/pink palette
        const colorChoice = Math.floor(Math.random() * 3);
        if (colorChoice === 0) {
            colors[i3] = 0.5 + Math.random() * 0.5;      // R
            colors[i3 + 1] = 0;                           // G
            colors[i3 + 2] = 0.8 + Math.random() * 0.2;   // B (purple)
        } else if (colorChoice === 1) {
            colors[i3] = 1;                               // R
            colors[i3 + 1] = 0;                           // G
            colors[i3 + 2] = 0.5 + Math.random() * 0.2;   // B (pink)
        } else {
            colors[i3] = 0.27 + Math.random() * 0.1;      // R (indigo)
            colors[i3 + 1] = 0 + Math.random() * 0.1;     // G
            colors[i3 + 2] = 0.51 + Math.random() * 0.2;  // B
        }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.userData.velocities = velocities;

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        sizeAttenuation: true,
        vertexColors: true,
        fog: false,
        transparent: true,
        opacity: 0.8
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    portalScene.add(particles);
}

function addLighting() {
    // Key light - purple
    const purpleLight = new THREE.PointLight(0x8a2be2, 2, 100);
    purpleLight.position.set(3, 0, 5);
    portalScene.add(purpleLight);

    // Fill light - pink
    const pinkLight = new THREE.PointLight(0xff007f, 1.5, 100);
    pinkLight.position.set(-3, 0, 5);
    portalScene.add(pinkLight);

    // Back light
    const backLight = new THREE.PointLight(0x4b0082, 1, 100);
    backLight.position.set(0, 0, -5);
    portalScene.add(backLight);

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x6a00ff, 0.3);
    portalScene.add(ambientLight);
}

function animatePortalEntry() {
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / PORTAL_DURATION, 1);
        cameraAnimationProgress = progress;

        // Update portal mesh
        if (portalMesh && portalMesh.material.uniforms) {
            portalMesh.material.uniforms.time.value = elapsed;
            portalMesh.rotation.x += 0.002;
            portalMesh.rotation.y += 0.003;
            portalMesh.scale.z = 0.8 + progress * 0.3;
        }

        // Update vortex
        if (vortexMesh) {
            vortexMesh.rotation.z += 0.008;
            vortexMesh.scale.set(
                1 + progress * 0.3,
                1 + progress * 0.3,
                1 + progress * 0.3
            );
        }

        // Update particles
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.geometry.userData.velocities;

            for (let i = 0; i < positions.length; i += 3) {
                // Apply velocity
                positions[i] += velocities[i] * (1 + progress);
                positions[i + 1] += velocities[i + 1] * (1 + progress);
                positions[i + 2] += velocities[i + 2] * (1 + progress);

                // Spiral towards center
                const angle = Math.atan2(positions[i + 1], positions[i]);
                const radius = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2);
                
                positions[i] = Math.cos(angle + progress * 0.1) * radius * (1 - progress * 0.5);
                positions[i + 1] = Math.sin(angle + progress * 0.1) * radius * (1 - progress * 0.5);
                positions[i + 2] -= progress * 0.02;
            }

            particles.geometry.attributes.position.needsUpdate = true;
        }

        // Camera movement - moving forward into portal
        portalCamera.position.z = 5 - progress * 6;
        portalCamera.fov = 75 + progress * 30;
        portalCamera.updateProjectionMatrix();

        // Screen effects
        const darkness = progress * 0.7;
        document.body.style.background = `rgba(5, 7, 13, ${darkness})`;

        // Screen transition - fade to black
        const screenOverlay = document.getElementById('portalOverlay') || 
                            createScreenOverlay();
        screenOverlay.style.opacity = progress > 0.7 ? (progress - 0.7) * 3.33 : 0;

        // Screen shake at the end
        if (progress > 0.8) {
            const shake = Math.random() * (progress - 0.8) * 10;
            portalRenderer.domElement.style.transform = `translate(${shake}px, ${shake}px)`;
        }

        portalRenderer.render(portalScene, portalCamera);

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Animation complete - start redirect
            document.body.style.background = '';
            portalRenderer.domElement.style.transform = '';
            
            // Cleanup
            setTimeout(() => {
                cleanupPortal();
            }, 500);
        }
    }

    animate();
}

function createScreenOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'portalOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 9999;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    document.body.appendChild(overlay);
    return overlay;
}

function cleanupPortal() {
    const container = document.getElementById('portalContainer');
    const overlay = document.getElementById('portalOverlay');

    if (portalRenderer && portalRenderer.domElement && container) {
        container.removeChild(portalRenderer.domElement);
    }

    if (overlay) {
        overlay.remove();
    }

    // Dispose of Three.js resources
    if (portalScene) {
        portalScene.traverse(child => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) child.material.dispose();
        });
    }

    if (portalRenderer) {
        portalRenderer.dispose();
    }

    isPortalActive = false;
}

// Export for use in script.js
function triggerPortalTransition(targetUrl) {
    initPortal();
    
    // Redirect after portal animation
    setTimeout(() => {
        window.location.href = targetUrl;
    }, PORTAL_DURATION + 500);
}
