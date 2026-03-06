"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

type Quality = "high" | "low";

type FragmentData = {
    base: THREE.Vector3;
    dir: THREE.Vector3;
    phase: number;
    amp: number;
    spin: THREE.Vector3;
};

const MODEL_URL = "/models/battery.glb";
const BATTERY_SIZE = new THREE.Vector3(1.85, 2.35, 1.1);

function supportsWebGL(): boolean {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

function makeProceduralBattery(): THREE.Group {
    const group = new THREE.Group();

    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x171a1f,
        roughness: 0.68,
        metalness: 0.12,
    });
    const capMat = new THREE.MeshStandardMaterial({
        color: 0x202833,
        roughness: 0.52,
        metalness: 0.18,
    });
    const labelMat = new THREE.MeshStandardMaterial({
        color: 0x2f3b4b,
        roughness: 0.44,
        metalness: 0.16,
    });
    const plusMat = new THREE.MeshStandardMaterial({
        color: 0xc08b33,
        roughness: 0.35,
        metalness: 0.85,
    });
    const minusMat = new THREE.MeshStandardMaterial({
        color: 0xb6bfca,
        roughness: 0.35,
        metalness: 0.85,
    });

    const body = new THREE.Mesh(new THREE.BoxGeometry(BATTERY_SIZE.x, BATTERY_SIZE.y, BATTERY_SIZE.z), bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.3, 1.22), capMat);
    cap.position.y = BATTERY_SIZE.y * 0.5 - 0.08;
    cap.castShadow = true;
    group.add(cap);

    const label = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 1.45), labelMat);
    label.position.set(0, -0.1, BATTERY_SIZE.z * 0.5 + 0.006);
    group.add(label);

    const barMat = new THREE.MeshStandardMaterial({
        color: 0x4c5b6f,
        roughness: 0.45,
        metalness: 0.2,
    });
    for (let i = 0; i < 5; i += 1) {
        const rib = new THREE.Mesh(new THREE.BoxGeometry(0.22, 2.0, 0.04), barMat);
        rib.position.set(-0.6 + i * 0.3, -0.02, BATTERY_SIZE.z * 0.5 + 0.022);
        group.add(rib);
    }

    const postGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.16, 32);
    const postBaseGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.06, 28);
    const plusPost = new THREE.Mesh(postGeom, plusMat);
    const plusBase = new THREE.Mesh(postBaseGeom, plusMat);
    plusPost.position.set(0.58, BATTERY_SIZE.y * 0.5 + 0.08, -0.14);
    plusBase.position.set(0.58, BATTERY_SIZE.y * 0.5 + 0.0, -0.14);
    group.add(plusPost, plusBase);

    const minusPost = new THREE.Mesh(postGeom, minusMat);
    const minusBase = new THREE.Mesh(postBaseGeom, minusMat);
    minusPost.position.set(-0.58, BATTERY_SIZE.y * 0.5 + 0.08, -0.14);
    minusBase.position.set(-0.58, BATTERY_SIZE.y * 0.5 + 0.0, -0.14);
    group.add(minusPost, minusBase);

    group.scale.setScalar(0.88);
    return group;
}

function sampleBatteryPoint(): { point: THREE.Vector3; outward: THREE.Vector3 } {
    const hx = BATTERY_SIZE.x * 0.5;
    const hy = BATTERY_SIZE.y * 0.5;
    const hz = BATTERY_SIZE.z * 0.5;
    const face = Math.floor(Math.random() * 6);

    const x = (Math.random() * 2 - 1) * hx;
    const y = (Math.random() * 2 - 1) * hy;
    const z = (Math.random() * 2 - 1) * hz;

    switch (face) {
        case 0:
            return { point: new THREE.Vector3(hx, y, z), outward: new THREE.Vector3(1, 0, 0) };
        case 1:
            return { point: new THREE.Vector3(-hx, y, z), outward: new THREE.Vector3(-1, 0, 0) };
        case 2:
            return { point: new THREE.Vector3(x, hy, z), outward: new THREE.Vector3(0, 1, 0) };
        case 3:
            return { point: new THREE.Vector3(x, -hy, z), outward: new THREE.Vector3(0, -1, 0) };
        case 4:
            return { point: new THREE.Vector3(x, y, hz), outward: new THREE.Vector3(0, 0, 1) };
        default:
            return { point: new THREE.Vector3(x, y, -hz), outward: new THREE.Vector3(0, 0, -1) };
    }
}

export function CarBatteryAnimation() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [webglReady, setWebglReady] = useState(true);
    const [quality] = useState<Quality>(() => {
        const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency : 8;
        const mem = typeof navigator !== "undefined" ? (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8 : 8;
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
        return cores <= 4 || mem <= 4 || dpr > 2 ? "low" : "high";
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) {
            return;
        }
        if (!supportsWebGL()) {
            setWebglReady(false);
            return;
        }

        setWebglReady(true);
        const width = container.clientWidth;
        const height = container.clientHeight;
        const clock = new THREE.Clock();

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xc8d4e2);
        const camera = new THREE.PerspectiveCamera(34, width / Math.max(height, 1), 0.1, 100);
        camera.position.set(0, 0.12, 6.3);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
        });
        renderer.physicallyCorrectLights = true;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.03;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 2 : 1.25));
        renderer.setClearColor(0xc8d4e2, 1);
        renderer.setClearAlpha(0);
        renderer.domElement.style.background = "transparent";
        renderer.domElement.style.display = "block";
        container.appendChild(renderer.domElement);

        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
        scene.environment = envTex;

        const key = new THREE.DirectionalLight(0xffffff, 3.0);
        key.position.set(3.2, 2.4, 4.2);
        scene.add(key);

        const rim = new THREE.DirectionalLight(0x8eb8ff, 1.4);
        rim.position.set(-3.6, 0.9, -3.2);
        scene.add(rim);

        const fill = new THREE.HemisphereLight(0xd8e7ff, 0xe9eef8, 1.35);
        scene.add(fill);

        const batteryRoot = new THREE.Group();
        scene.add(batteryRoot);

        const fragmentCount = quality === "high" ? 300 : 170;
        const fragGeom = new THREE.IcosahedronGeometry(0.026, 0);
        const fragMat = new THREE.MeshStandardMaterial({
            color: 0xa8b7cc,
            roughness: 0.28,
            metalness: 0.78,
            transparent: true,
            opacity: 0,
            vertexColors: true,
        });
        const fragments = new THREE.InstancedMesh(fragGeom, fragMat, fragmentCount);
        fragments.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        batteryRoot.add(fragments);

        const fragmentData: FragmentData[] = [];
        const currentPoints: THREE.Vector3[] = [];
        const dummy = new THREE.Object3D();
        const color = new THREE.Color();

        for (let i = 0; i < fragmentCount; i += 1) {
            const { point, outward } = sampleBatteryPoint();
            const amp = 0.22 + Math.random() * 0.42;
            const phase = Math.random() * Math.PI * 2;
            const spin = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
            fragmentData.push({ base: point, dir: outward, amp, phase, spin });
            currentPoints.push(point.clone());
            color.setHSL(0.57 + Math.random() * 0.07, 0.16 + Math.random() * 0.16, 0.65 + Math.random() * 0.12);
            fragments.setColorAt(i, color);
        }
        if (fragments.instanceColor) {
            fragments.instanceColor.needsUpdate = true;
        }

        const pairCount = quality === "high" ? 110 : 64;
        const linePositions = new Float32Array(pairCount * 2 * 3);
        const lineGeom = new THREE.BufferGeometry();
        lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x8eb5ff,
            transparent: true,
            opacity: 0,
        });
        const energyLines = new THREE.LineSegments(lineGeom, lineMat);
        batteryRoot.add(energyLines);

        let batteryMesh: THREE.Object3D = makeProceduralBattery();
        let batteryMaterials: THREE.MeshStandardMaterial[] = [];

        const collectMaterials = (root: THREE.Object3D) => {
            const mats: THREE.MeshStandardMaterial[] = [];
            root.traverse((obj: THREE.Object3D) => {
                const mesh = obj as THREE.Mesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
                if (!mesh.isMesh) {
                    return;
                }
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                if (Array.isArray(mesh.material)) {
                    mesh.material.forEach((material: THREE.Material) => {
                        if (material instanceof THREE.MeshStandardMaterial) {
                            material.transparent = true;
                            mats.push(material);
                        }
                    });
                } else if (mesh.material instanceof THREE.MeshStandardMaterial) {
                    mesh.material.transparent = true;
                    mats.push(mesh.material);
                }
            });
            return mats;
        };

        batteryRoot.add(batteryMesh);
        batteryMaterials = collectMaterials(batteryMesh);

        const loader = new GLTFLoader();
        loader.load(
            MODEL_URL,
            (gltf: { scene: THREE.Object3D }) => {
                batteryRoot.remove(batteryMesh);
                batteryMesh = gltf.scene;
                batteryMesh.scale.setScalar(1.1);
                batteryRoot.add(batteryMesh);
                batteryMaterials = collectMaterials(batteryMesh);
            },
            undefined,
            () => {
                // Fall back to procedural battery when no GLB is supplied.
            }
        );

        const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
        let reduceMotion = reducedMotionQuery.matches;
        const onReducedMotion = (event: MediaQueryListEvent) => {
            reduceMotion = event.matches;
        };
        reducedMotionQuery.addEventListener("change", onReducedMotion);

        const pointerTarget = new THREE.Vector2();
        const pointer = new THREE.Vector2();
        let splitTarget = 0;
        let split = 0;
        let running = true;
        let idleSpin = 0;

        const setPointerFromEvent = (event: PointerEvent) => {
            const rect = container.getBoundingClientRect();
            pointerTarget.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointerTarget.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
        };
        const onPointerMove = (event: PointerEvent) => setPointerFromEvent(event);
        const onPointerEnter = () => {
            splitTarget = reduceMotion ? 0.22 : 1;
        };
        const onPointerLeave = () => {
            splitTarget = 0;
            pointerTarget.set(0, 0);
        };
        const onPointerDown = () => {
            if (coarsePointerQuery.matches) {
                splitTarget = splitTarget > 0.5 ? 0 : reduceMotion ? 0.22 : 1;
            }
        };

        container.addEventListener("pointermove", onPointerMove);
        container.addEventListener("pointerenter", onPointerEnter);
        container.addEventListener("pointerleave", onPointerLeave);
        container.addEventListener("pointerdown", onPointerDown);

        const bloomEnabled = quality === "high" && !reduceMotion;
        const composerTarget = bloomEnabled
            ? new THREE.WebGLRenderTarget(width, height, {
                format: THREE.RGBAFormat,
                type: THREE.HalfFloatType,
                depthBuffer: true,
                stencilBuffer: false,
            })
            : null;
        const composer = bloomEnabled ? new EffectComposer(renderer, composerTarget) : null;
        if (composer) {
            composer.addPass(new RenderPass(scene, camera));
            composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.16, 0.6, 0.85));
        }

        const onResize = () => {
            const nextWidth = container.clientWidth;
            const nextHeight = container.clientHeight;
            camera.aspect = nextWidth / Math.max(nextHeight, 1);
            camera.updateProjectionMatrix();
            renderer.setSize(nextWidth, nextHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 2 : 1.25));
            if (composer) {
                composer.setSize(nextWidth, nextHeight);
            }
        };
        window.addEventListener("resize", onResize);

        const animate = () => {
            if (!running) {
                return;
            }
            requestAnimationFrame(animate);

            const dt = Math.min(clock.getDelta(), 0.033);
            const t = clock.elapsedTime;
            pointer.lerp(pointerTarget, 0.08);
            split = THREE.MathUtils.damp(split, splitTarget, reduceMotion ? 1.25 : 4.5, dt);
            const splitEase = THREE.MathUtils.smoothstep(split, 0, 1);

            idleSpin += dt * 0.19;
            const bobScale = reduceMotion ? 0.024 : 0.085;
            batteryRoot.position.y = Math.sin(t * 1.1) * bobScale;
            batteryRoot.rotation.y = idleSpin + pointer.x * 0.2;
            batteryRoot.rotation.x = pointer.y * 0.1 + Math.sin(t * 0.7) * 0.012;
            const breathing = 1 + Math.sin(t * 1.2) * (reduceMotion ? 0.002 : 0.007);
            batteryRoot.scale.setScalar(breathing);

            for (let i = 0; i < fragmentCount; i += 1) {
                const data = fragmentData[i];
                const wave = Math.sin(t * 1.6 + data.phase) * 0.05 * splitEase;
                const drift = data.amp * splitEase + wave;
                const p = data.base.clone().addScaledVector(data.dir, drift);
                p.x += pointer.x * 0.05 * splitEase;
                p.y += pointer.y * 0.04 * splitEase;

                dummy.position.copy(p);
                const rot = splitEase * (0.38 + data.amp * 0.75);
                dummy.rotation.set(
                    data.spin.x * t * rot,
                    data.spin.y * t * rot,
                    data.spin.z * t * rot
                );
                dummy.scale.setScalar(0.76 + splitEase * 0.8);
                dummy.updateMatrix();
                fragments.setMatrixAt(i, dummy.matrix);
                currentPoints[i].copy(p);
            }
            fragments.instanceMatrix.needsUpdate = true;
            fragMat.opacity = splitEase * 0.9;

            batteryMaterials.forEach((material) => {
                material.opacity = Math.max(0.02, 1 - splitEase * 0.98);
            });

            for (let i = 0; i < pairCount; i += 1) {
                const fromIdx = (i * 3) % fragmentCount;
                const toIdx = (fromIdx + 17 + (i % 5) * 4) % fragmentCount;
                const from = currentPoints[fromIdx];
                const to = currentPoints[toIdx];
                const base = i * 6;
                linePositions[base] = from.x;
                linePositions[base + 1] = from.y;
                linePositions[base + 2] = from.z;
                linePositions[base + 3] = to.x;
                linePositions[base + 4] = to.y;
                linePositions[base + 5] = to.z;
            }
            lineGeom.attributes.position.needsUpdate = true;
            lineMat.opacity = splitEase > 0.02 ? splitEase * (0.2 + Math.abs(Math.sin(t * 5.5)) * 0.08) : 0;

            if (composer) {
                composer.render();
            } else {
                renderer.render(scene, camera);
            }
        };

        animate();

        return () => {
            running = false;
            container.removeEventListener("pointermove", onPointerMove);
            container.removeEventListener("pointerenter", onPointerEnter);
            container.removeEventListener("pointerleave", onPointerLeave);
            container.removeEventListener("pointerdown", onPointerDown);
            reducedMotionQuery.removeEventListener("change", onReducedMotion);
            window.removeEventListener("resize", onResize);

            lineGeom.dispose();
            lineMat.dispose();
            fragGeom.dispose();
            fragMat.dispose();
            pmrem.dispose();
            envTex.dispose();
            composerTarget?.dispose();
            renderer.dispose();
            composer?.dispose();
            container.removeChild(renderer.domElement);
        };
    }, [quality]);

    return (
        <div className="relative h-full w-full">
            <div ref={containerRef} className="relative h-full min-h-[360px] w-full overflow-hidden rounded-3xl">
                {!webglReady && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-slate-300/60 bg-white/65 p-6 text-center text-sm text-slate-700">
                        WebGL is unavailable on this device. Showing static fallback.
                    </div>
                )}
            </div>
        </div>
    );
}
