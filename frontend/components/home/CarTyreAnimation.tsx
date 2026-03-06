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

const MODEL_URL = "/assets/tire.glb";

function supportsWebGL(): boolean {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
}

function makeProceduralTire(): THREE.Group {
    const group = new THREE.Group();

    const treadBaseMat = new THREE.MeshStandardMaterial({
        color: 0x191d22,
        roughness: 0.7,
        metalness: 0.08,
    });
    const treadBlockMat = new THREE.MeshStandardMaterial({
        color: 0x171b20,
        roughness: 0.64,
        metalness: 0.06,
    });
    const sidewallMat = new THREE.MeshStandardMaterial({
        color: 0x15181d,
        roughness: 0.77,
        metalness: 0.05,
    });
    const grooveDustMat = new THREE.MeshStandardMaterial({
        color: 0x2b2e32,
        roughness: 0.88,
        metalness: 0,
    });
    const rimMat = new THREE.MeshStandardMaterial({
        color: 0xb8c3d1,
        roughness: 0.28,
        metalness: 0.95,
    });
    const rimShadowMat = new THREE.MeshStandardMaterial({
        color: 0x12161d,
        roughness: 0.62,
        metalness: 0.18,
    });

    const majorRadius = 1.08;
    const crownRadius = 0.33;

    const treadBody = new THREE.Mesh(new THREE.TorusGeometry(majorRadius, crownRadius, 64, 320), treadBaseMat);
    treadBody.castShadow = true;
    treadBody.receiveShadow = true;
    group.add(treadBody);

    const shoulderLeft = new THREE.Mesh(new THREE.TorusGeometry(majorRadius, 0.265, 36, 260), sidewallMat);
    shoulderLeft.position.z = -0.2;
    const shoulderRight = shoulderLeft.clone();
    shoulderRight.position.z = 0.2;
    group.add(shoulderLeft, shoulderRight);

    const protectorA = new THREE.Mesh(new THREE.TorusGeometry(0.79, 0.026, 20, 180), sidewallMat);
    protectorA.position.z = -0.185;
    const protectorB = protectorA.clone();
    protectorB.position.z = 0.185;
    group.add(protectorA, protectorB);

    const ribGeom = new THREE.BoxGeometry(0.09, 0.03, 0.042);
    const ribCount = 900;
    const ribs = new THREE.InstancedMesh(ribGeom, treadBlockMat, ribCount);
    ribs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const ribsPerLane = 180;
    const lanes = [-0.16, -0.06, 0.06, 0.16, -0.24, 0.24];
    const tangent = new THREE.Vector3();
    const outward = new THREE.Vector3();
    const lateral = new THREE.Vector3(0, 0, 1);
    const center = new THREE.Vector3();
    const basis = new THREE.Matrix4();
    const dummy = new THREE.Object3D();
    let ribIndex = 0;

    for (let laneIndex = 0; laneIndex < lanes.length; laneIndex += 1) {
        const lane = lanes[laneIndex];
        for (let i = 0; i < ribsPerLane; i += 1) {
            const a = (i / ribsPerLane) * Math.PI * 2;
            center.set(Math.cos(a) * majorRadius, Math.sin(a) * majorRadius, 0);
            outward.set(Math.cos(a), Math.sin(a), 0).normalize();
            tangent.set(-Math.sin(a), Math.cos(a), 0).normalize();
            basis.makeBasis(tangent, outward, lateral);
            dummy.quaternion.setFromRotationMatrix(basis);
            const siped = (i + laneIndex) % 5 === 0 ? 0.88 : 1;
            const shoulderSkew = Math.abs(lane) > 0.2 ? Math.sign(lane) * 0.016 : 0;
            dummy.position
                .copy(center)
                .addScaledVector(outward, crownRadius + 0.014)
                .addScaledVector(lateral, lane)
                .addScaledVector(tangent, shoulderSkew);
            dummy.scale.set(
                1,
                siped,
                Math.abs(lane) > 0.2 ? 0.86 : 1
            );
            dummy.updateMatrix();
            ribs.setMatrixAt(ribIndex, dummy.matrix);
            ribIndex += 1;
        }
    }
    ribs.castShadow = true;
    ribs.receiveShadow = true;
    group.add(ribs);

    const grooveGeom = new THREE.TorusGeometry(majorRadius, 0.008, 10, 260);
    const grooveOffsets = [-0.2, -0.1, 0, 0.1, 0.2];
    grooveOffsets.forEach((z) => {
        const groove = new THREE.Mesh(grooveGeom, grooveDustMat);
        groove.position.z = z;
        group.add(groove);
    });

    const markGeom = new THREE.BoxGeometry(0.036, 0.012, 0.008);
    const markMat = new THREE.MeshStandardMaterial({
        color: 0x1d2128,
        roughness: 0.82,
        metalness: 0,
    });
    const markCount = 240;
    const marks = new THREE.InstancedMesh(markGeom, markMat, markCount);
    marks.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    const markDummy = new THREE.Object3D();
    let markIdx = 0;
    const zSides = [-0.3, 0.3];
    for (let s = 0; s < zSides.length; s += 1) {
        const zSide = zSides[s];
        for (let i = 0; i < 120; i += 1) {
            const a = (i / 120) * Math.PI * 2;
            center.set(Math.cos(a) * 1.205, Math.sin(a) * 1.205, zSide);
            outward.set(Math.cos(a), Math.sin(a), 0).normalize();
            tangent.set(-Math.sin(a), Math.cos(a), 0).normalize();
            basis.makeBasis(tangent, outward, lateral);
            markDummy.quaternion.setFromRotationMatrix(basis);
            markDummy.position.copy(center);
            markDummy.scale.set(1, 1, i % 9 === 0 ? 1.7 : 1);
            markDummy.updateMatrix();
            marks.setMatrixAt(markIdx, markDummy.matrix);
            markIdx += 1;
        }
    }
    group.add(marks);

    const rimOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 0.36, 96), rimMat);
    rimOuter.rotation.z = Math.PI / 2;
    rimOuter.castShadow = true;
    group.add(rimOuter);

    const rimBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.67, 0.67, 0.44, 96), rimShadowMat);
    rimBarrel.rotation.z = Math.PI / 2;
    group.add(rimBarrel);

    const rimSeatA = new THREE.Mesh(new THREE.CylinderGeometry(0.79, 0.79, 0.03, 96), rimMat);
    rimSeatA.rotation.z = Math.PI / 2;
    rimSeatA.position.x = -0.165;
    const rimSeatB = rimSeatA.clone();
    rimSeatB.position.x = 0.165;
    group.add(rimSeatA, rimSeatB);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.37, 60), rimMat);
    hub.rotation.z = Math.PI / 2;
    group.add(hub);

    for (let i = 0; i < 5; i += 1) {
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.09, 0.115), rimMat);
        const a = (i / 5) * Math.PI * 2;
        spoke.position.set(Math.cos(a) * 0.35, Math.sin(a) * 0.35, 0);
        spoke.rotation.z = a + 0.08;
        spoke.castShadow = true;
        group.add(spoke);
    }

    group.rotation.y = Math.PI / 2;
    group.scale.setScalar(0.95);
    return group;
}

function sampleTirePoint(): { point: THREE.Vector3; outward: THREE.Vector3 } {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    const majorRadius = 1.08;
    const minorRadius = 0.39;
    const x = (majorRadius + minorRadius * Math.cos(v)) * Math.cos(u);
    const y = minorRadius * Math.sin(v);
    const z = (majorRadius + minorRadius * Math.cos(v)) * Math.sin(u);
    const point = new THREE.Vector3(x, y, z);
    const ringCenter = new THREE.Vector3(majorRadius * Math.cos(u), 0, majorRadius * Math.sin(u));
    const outward = point.clone().sub(ringCenter).normalize();
    return { point, outward };
}

export function CarTyreAnimation() {
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
        scene.background = null;
        const camera = new THREE.PerspectiveCamera(34, width / Math.max(height, 1), 0.1, 100);
        camera.position.set(0, 0.18, 5.4);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            premultipliedAlpha: false,
            powerPreference: "high-performance",
        });

        renderer.physicallyCorrectLights = true;
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.06;
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === "high" ? 2 : 1.25));
        renderer.setClearColor(0x000000, 0);
        renderer.setClearAlpha(0);
        renderer.domElement.style.background = "transparent";
        renderer.domElement.style.display = "block";
        container.appendChild(renderer.domElement);

        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
        scene.environment = envTex;

        const key = new THREE.DirectionalLight(0xf7f8ff, 3.6);
        key.position.set(3.5, 3, 4.5);
        scene.add(key);

        const rim = new THREE.DirectionalLight(0x5fa8ff, 2.1);
        rim.position.set(-4.2, 0.9, -3.2);
        scene.add(rim);

        const fill = new THREE.HemisphereLight(0x95b9ff, 0x050608, 1.1);
        scene.add(fill);

        const tireRoot = new THREE.Group();
        scene.add(tireRoot);

        const fragmentCount = quality === "high" ? 420 : 220;
        const fragGeom = new THREE.IcosahedronGeometry(0.022, 0);
        const fragMat = new THREE.MeshStandardMaterial({
            color: 0xaeb8c6,
            roughness: 0.24,
            metalness: 0.84,
            transparent: true,
            opacity: 0,
            vertexColors: true,
        });
        const fragments = new THREE.InstancedMesh(fragGeom, fragMat, fragmentCount);
        fragments.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        tireRoot.add(fragments);

        const fragmentData: FragmentData[] = [];
        const currentPoints: THREE.Vector3[] = [];
        const dummy = new THREE.Object3D();
        const color = new THREE.Color();

        for (let i = 0; i < fragmentCount; i += 1) {
            const { point, outward } = sampleTirePoint();
            const amp = 0.28 + Math.random() * 0.45;
            const phase = Math.random() * Math.PI * 2;
            const spin = new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize();
            fragmentData.push({ base: point, dir: outward, amp, phase, spin });
            currentPoints.push(point.clone());
            color.setHSL(0.58 + Math.random() * 0.05, 0.2 + Math.random() * 0.2, 0.62 + Math.random() * 0.13);
            fragments.setColorAt(i, color);
        }
        if (fragments.instanceColor) {
            fragments.instanceColor.needsUpdate = true;
        }

        const pairCount = quality === "high" ? 160 : 80;
        const linePositions = new Float32Array(pairCount * 2 * 3);
        const lineGeom = new THREE.BufferGeometry();
        lineGeom.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
        const lineMat = new THREE.LineBasicMaterial({
            color: 0x9cc2ff,
            transparent: true,
            opacity: 0,
        });
        const energyLines = new THREE.LineSegments(lineGeom, lineMat);
        tireRoot.add(energyLines);

        let tireMesh: THREE.Object3D = makeProceduralTire();
        let tireMaterials: THREE.MeshStandardMaterial[] = [];

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

        tireRoot.add(tireMesh);
        tireMaterials = collectMaterials(tireMesh);

        const loader = new GLTFLoader();
        loader.load(
            MODEL_URL,
            (gltf: { scene: THREE.Object3D }) => {
                tireRoot.remove(tireMesh);
                tireMesh = gltf.scene;
                tireMesh.scale.setScalar(1.18);
                tireMesh.rotation.y = Math.PI / 2;
                tireRoot.add(tireMesh);
                tireMaterials = collectMaterials(tireMesh);
            },
            undefined,
            () => {
                // Fall back to procedural tire when no GLB is supplied.
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
            splitTarget = reduceMotion ? 0.25 : 1;
        };
        const onPointerLeave = () => {
            splitTarget = 0;
            pointerTarget.set(0, 0);
        };
        const onPointerDown = () => {
            if (coarsePointerQuery.matches) {
                splitTarget = splitTarget > 0.5 ? 0 : reduceMotion ? 0.25 : 1;
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
            composer.addPass(new UnrealBloomPass(new THREE.Vector2(width, height), 0.22, 0.8, 0.72));
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
            split = THREE.MathUtils.damp(split, splitTarget, reduceMotion ? 1.3 : 4.6, dt);
            const splitEase = THREE.MathUtils.smoothstep(split, 0, 1);

            idleSpin += dt * 0.23;
            const bobScale = reduceMotion ? 0.03 : 0.1;
            tireRoot.position.y = Math.sin(t * 1.1) * bobScale;
            tireRoot.rotation.y = idleSpin + pointer.x * 0.23;
            tireRoot.rotation.x = pointer.y * 0.14 + Math.sin(t * 0.7) * 0.02;
            const breathing = 1 + Math.sin(t * 1.35) * (reduceMotion ? 0.002 : 0.009);
            tireRoot.scale.setScalar(breathing);

            for (let i = 0; i < fragmentCount; i += 1) {
                const data = fragmentData[i];
                const wave = Math.sin(t * 1.75 + data.phase) * 0.06 * splitEase;
                const drift = data.amp * splitEase + wave;
                const p = data.base.clone().addScaledVector(data.dir, drift);
                p.x += pointer.x * 0.08 * splitEase;
                p.y += pointer.y * 0.04 * splitEase;

                dummy.position.copy(p);
                const rot = splitEase * (0.45 + data.amp * 0.8);
                dummy.rotation.set(
                    data.spin.x * t * rot,
                    data.spin.y * t * rot,
                    data.spin.z * t * rot
                );
                dummy.scale.setScalar(0.8 + splitEase * 0.75);
                dummy.updateMatrix();
                fragments.setMatrixAt(i, dummy.matrix);
                currentPoints[i].copy(p);
            }
            fragments.instanceMatrix.needsUpdate = true;
            fragMat.opacity = splitEase * 0.95;

            tireMaterials.forEach((material) => {
                material.opacity = Math.max(0.02, 1 - splitEase * 0.98);
            });

            for (let i = 0; i < pairCount; i += 1) {
                const fromIdx = (i * 2) % fragmentCount;
                const toIdx = (fromIdx + 11 + (i % 7) * 3) % fragmentCount;
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
            lineMat.opacity = splitEase > 0.02 ? splitEase * (0.24 + Math.abs(Math.sin(t * 5.2)) * 0.1) : 0;

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
            <div ref={containerRef} className="relative h-full min-h-[360px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-black via-gray-900 to-gray-800">
                {!webglReady && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-3xl border border-white/10 bg-black/60 p-6 text-center text-sm text-white/75">
                        WebGL is unavailable on this device. Showing static fallback.
                    </div>
                )}
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[radial-gradient(135%_102%_at_50%_60%,rgba(0,0,0,0)_63%,rgba(10,18,34,0.34)_84%,rgba(17,28,47,0.72)_100%)]" />
            <div className="pointer-events-none absolute inset-0 rounded-3xl bg-[linear-gradient(to_bottom,rgba(12,21,37,0.72)_0%,rgba(0,0,0,0)_22%,rgba(0,0,0,0)_79%,rgba(13,23,40,0.7)_100%)]" />
        </div>
    );
}
