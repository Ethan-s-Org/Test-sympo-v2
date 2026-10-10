/* Interactive Web Audio Synthesizer (Space Drone & Warp Jump) */
let audioCtx = null;
let isAudioPlaying = false;
let masterGain = null;
let droneOsc1 = null, droneOsc2 = null, droneFilter = null;

function initAudio() {
    if (audioCtx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Sub low rumble drone
    droneOsc1 = audioCtx.createOscillator();
    droneOsc1.type = 'sawtooth';
    droneOsc1.frequency.setValueAtTime(55, audioCtx.currentTime); // Low A

    droneFilter = audioCtx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(140, audioCtx.currentTime);

    // Shimmering second wave
    droneOsc2 = audioCtx.createOscillator();
    droneOsc2.type = 'sine';
    droneOsc2.frequency.setValueAtTime(110.2, audioCtx.currentTime);

    const droneGain = audioCtx.createGain();
    droneGain.gain.setValueAtTime(0.3, audioCtx.currentTime);

    droneOsc1.connect(droneFilter);
    droneFilter.connect(droneGain);
    droneOsc2.connect(droneGain);
    droneGain.connect(masterGain);

    droneOsc1.start();
    droneOsc2.start();
}

function toggleAudio() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    isAudioPlaying = !isAudioPlaying;
    if (isAudioPlaying) {
        masterGain.gain.setTargetAtTime(0.25, audioCtx.currentTime, 0.5);
        const audioLabel = document.getElementById('audio-label');
        const audioToggle = document.getElementById('audio-toggle');
        if (audioLabel) audioLabel.textContent = 'AUDIO: ON';
        if (audioToggle) audioToggle.classList.add('border-cyan-400', 'text-cyan-300');
    } else {
        masterGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.3);
        const audioLabel = document.getElementById('audio-label');
        const audioToggle = document.getElementById('audio-toggle');
        if (audioLabel) audioLabel.textContent = 'AUDIO: OFF';
        if (audioToggle) audioToggle.classList.remove('border-cyan-400', 'text-cyan-300');
    }
}

function triggerWarpSound() {
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const warpOsc = audioCtx.createOscillator();
    const warpGain = audioCtx.createGain();
    warpOsc.type = 'sawtooth';

    warpOsc.frequency.setValueAtTime(80, audioCtx.currentTime);
    warpOsc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 1.6);
    warpOsc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 3.0);

    warpGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    warpGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.8);
    warpGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);

    warpOsc.connect(warpGain);
    warpGain.connect(audioCtx.destination);
    warpOsc.start();
    warpOsc.stop(audioCtx.currentTime + 3.1);
}

const audioToggleBtn = document.getElementById('audio-toggle');
if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', toggleAudio);
}

/* ==========================================================================
   MATHEMATICAL FRACTAL NOISE ENGINE & PHOTOREALISTIC CELESTIAL RENDERING
   True pixel-level fBm synthesis for photorealistic Sun, Earth, and Saturn.
   ========================================================================== */

const Noise = (function () {
    const p = new Uint8Array(512);
    const permutation = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142,
        8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117,
        35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71,
        134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41,
        55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89,
        18, 169, 200, 196, 135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226,
        250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182,
        189, 28, 42, 223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43,
        172, 9, 129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97,
        228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239,
        107, 49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
        138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
    ];
    for (let i = 0; i < 256; i++) {
        p[i] = permutation[i];
        p[256 + i] = permutation[i];
    }
    function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    function lerp(t, a, b) { return a + t * (b - a); }
    function grad(hash, x, y) {
        const h = hash & 7;
        const u = h < 4 ? x : y;
        const v = h < 4 ? y : x;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }
    return {
        noise2D: function (x, y) {
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            const xf = x - Math.floor(x);
            const yf = y - Math.floor(y);
            const u = fade(xf);
            const v = fade(yf);
            const A = p[X] + Y, AA = p[A], AB = p[A + 1];
            const B = p[X + 1] + Y, BA = p[B], BB = p[B + 1];
            return lerp(v,
                lerp(u, grad(p[AA], xf, yf), grad(p[BA], xf - 1, yf)),
                lerp(u, grad(p[AB], xf, yf - 1), grad(p[BB], xf - 1, yf - 1))
            );
        },
        fbm: function (x, y, octaves = 5, lacunarity = 2.0, gain = 0.5) {
            let total = 0, frequency = 1, amplitude = 1, maxValue = 0;
            for (let i = 0; i < octaves; i++) {
                total += this.noise2D(x * frequency, y * frequency) * amplitude;
                maxValue += amplitude;
                amplitude *= gain;
                frequency *= lacunarity;
            }
            return (total / maxValue + 1) * 0.5;
        }
    };
})();

function optimizeTexture(texture) {
    if (!texture) return texture;
    try {
        if (typeof renderer !== 'undefined' && renderer && renderer.capabilities) {
            texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 16);
        }
    } catch (e) { }
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;
    return texture;
}

const globalTextureLoader = new THREE.TextureLoader();
globalTextureLoader.setCrossOrigin('anonymous');

function loadPlanetTextureSafe(localRelativePath, cdnUrl, fallbackCanvasFn, onLoaded) {
    const isFileProto = window.location.protocol === 'file:';
    // On file:///, CDN allows cross-origin WebGL textures safely. On http(s)://, local path is instant.
    const firstUrl = isFileProto ? cdnUrl : localRelativePath;
    const secondUrl = isFileProto ? localRelativePath : cdnUrl;

    globalTextureLoader.load(
        firstUrl,
        (tex) => {
            tex.wrapS = THREE.RepeatWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            optimizeTexture(tex);
            if (onLoaded) onLoaded(tex);
        },
        undefined,
        () => {
            globalTextureLoader.load(
                secondUrl,
                (tex2) => {
                    tex2.wrapS = THREE.RepeatWrapping;
                    tex2.wrapT = THREE.ClampToEdgeWrapping;
                    optimizeTexture(tex2);
                    if (onLoaded) onLoaded(tex2);
                },
                undefined,
                () => {
                    console.log('Using procedural canvas fallback for ' + localRelativePath);
                    if (fallbackCanvasFn) {
                        try {
                            const fallbackTex = fallbackCanvasFn();
                            if (onLoaded) onLoaded(fallbackTex);
                        } catch (e) {
                            console.warn('Fallback error for ' + localRelativePath, e);
                        }
                    }
                }
            );
        }
    );

    return null;
}

// 1. Point Star Sprite (glowing diamond pinprick)
function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.15, 'rgba(220, 240, 255, 0.9)');
    grad.addColorStop(0.40, 'rgba(100, 190, 255, 0.35)');
    grad.addColorStop(0.70, 'rgba(50, 120, 255, 0.08)');
    grad.addColorStop(1.0, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return optimizeTexture(new THREE.CanvasTexture(canvas));
}

// 2. Photorealistic Solar Photosphere (NASA SDO AIA 304 Å Luminous Incandescent Synthesis 512x256)
function createSunTexture() {
    const width = 512;
    const height = 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    // 1. SDO AIA 304 Å Plasma Lookup Table (256-color LUT)
    const palette = new Uint8Array(256 * 3);
    for (let i = 0; i < 256; i++) {
        const t = i / 255.0;
        let r, g, b;
        if (t < 0.28) {
            const k = t / 0.28;
            r = Math.floor(185 + k * 55);
            g = Math.floor(18 + k * 42);
            b = 0;
        } else if (t < 0.62) {
            const k = (t - 0.28) / 0.34;
            r = Math.floor(240 + k * 15);
            g = Math.floor(60 + k * 70);
            b = Math.floor(k * 4);
        } else if (t < 0.84) {
            const k = (t - 0.62) / 0.22;
            r = 255;
            g = Math.floor(130 + k * 55);
            b = Math.floor(4 + k * 20);
        } else if (t < 0.93) {
            const k = (t - 0.84) / 0.09;
            r = 255;
            g = Math.floor(185 + k * 45);
            b = Math.floor(24 + k * 70);
        } else {
            const k = (t - 0.93) / 0.07;
            r = 255;
            g = Math.floor(230 + k * 25);
            b = Math.floor(94 + k * 161);
        }
        palette[i * 3] = r;
        palette[i * 3 + 1] = g;
        palette[i * 3 + 2] = b;
    }

    // 2. Coarse Turbulent Plasma Grid (64 x 32)
    const GW = 64, GH = 32;
    const coarseField = new Float32Array(GW * GH);
    const coarseTurb = new Float32Array(GW * GH);

    for (let gy = 0; gy < GH; gy++) {
        const ny = gy / GH;
        for (let gx = 0; gx < GW; gx++) {
            const nx = gx / GW;
            const n1 = Noise.noise2D(nx * 10.0, ny * 10.0);
            const n2 = Noise.noise2D(nx * 22.0 + n1 * 1.8, ny * 22.0 + n1 * 1.8) * 0.5;
            const n3 = Noise.noise2D(nx * 48.0 + n2 * 1.4, ny * 48.0 + n2 * 1.4) * 0.25;
            coarseField[gy * GW + gx] = (n1 + n2 + n3 + 1.75) / 3.5;
            coarseTurb[gy * GW + gx] = Noise.noise2D(nx * 28.0 + 9.2, ny * 28.0 + 5.7);
        }
    }

    // Active Magnetic Plage Complexes
    const plages = [
        { cx: 0.50, cy: 0.35, rx: 0.075, ry: 0.055, boost: 0.38, flare: 0.60 },
        { cx: 0.52, cy: 0.72, rx: 0.070, ry: 0.050, boost: 0.40, flare: 0.65 },
        { cx: 0.66, cy: 0.46, rx: 0.065, ry: 0.045, boost: 0.35, flare: 0.55 },
        { cx: 0.16, cy: 0.45, rx: 0.055, ry: 0.045, boost: 0.35, flare: 0.50 },
        { cx: 0.76, cy: 0.28, rx: 0.070, ry: 0.050, boost: 0.38, flare: 0.58 },
        { cx: 0.34, cy: 0.54, rx: 0.045, ry: 0.038, boost: 0.30, flare: 0.45 },
        { cx: 0.44, cy: 0.25, rx: 0.040, ry: 0.035, boost: 0.28, flare: 0.40 },
        { cx: 0.62, cy: 0.62, rx: 0.045, ry: 0.035, boost: 0.30, flare: 0.45 },
        { cx: 0.04, cy: 0.52, rx: 0.045, ry: 0.035, boost: 0.28, flare: 0.40 },
        { cx: 0.96, cy: 0.52, rx: 0.045, ry: 0.035, boost: 0.28, flare: 0.40 }
    ];

    // 3. Synthesize 512 x 256 Organic Luminous Photosphere
    for (let y = 0; y < height; y++) {
        const ny = y / height;
        const gy = ny * (GH - 1);
        const y0 = Math.floor(gy);
        const y1 = Math.min(y0 + 1, GH - 1);
        const fy = gy - y0;

        for (let x = 0; x < width; x++) {
            const nx = x / width;
            const gx = nx * (GW - 1);
            const x0 = Math.floor(gx);
            const x1 = Math.min(x0 + 1, GW - 1);
            const fx = gx - x0;

            const p00 = coarseField[y0 * GW + x0], p10 = coarseField[y0 * GW + x1];
            const p01 = coarseField[y1 * GW + x0], p11 = coarseField[y1 * GW + x1];
            const plasma = (p00 * (1 - fx) + p10 * fx) * (1 - fy) + (p01 * (1 - fx) + p11 * fx) * fy;

            const t00 = coarseTurb[y0 * GW + x0], t10 = coarseTurb[y0 * GW + x1];
            const t01 = coarseTurb[y1 * GW + x0], t11 = coarseTurb[y1 * GW + x1];
            const turb = (t00 * (1 - fx) + t10 * fx) * (1 - fy) + (t01 * (1 - fx) + t11 * fx) * fy;

            const f1 = Noise.noise2D(nx * 40.0 + turb * 2.0, ny * 40.0 + turb * 2.0);
            const f2 = Noise.noise2D(nx * 80.0 + f1 * 1.5, ny * 80.0 + f1 * 1.5) * 0.45;
            const granules = (f1 + f2) * 0.16;

            let energy = 0.32 + plasma * 0.22 + granules;

            for (let i = 0; i < plages.length; i++) {
                const pl = plages[i];
                const dx = (nx - pl.cx) / pl.rx;
                const dy = (ny - pl.cy) / pl.ry;
                const d2 = dx * dx + dy * dy;
                if (d2 < 1.0) {
                    const d = Math.sqrt(d2);
                    const falloff = 1.0 - d;
                    energy += falloff * pl.boost;

                    if (d < 0.38) {
                        const coreT = 1.0 - d / 0.38;
                        energy += coreT * coreT * pl.flare;
                    }
                }
            }

            const eClamped = Math.min(1.0, Math.max(0.0, energy));
            const pIdx = Math.min(255, Math.floor(eClamped * 255)) * 3;
            const idx = (y * width + x) * 4;
            data[idx] = palette[pIdx];
            data[idx + 1] = palette[pIdx + 1];
            data[idx + 2] = palette[pIdx + 2];
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imgData, 0, 0);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return optimizeTexture(texture);
}

// 3. Photorealistic Earth Texture Fallback (512 x 256)
function createEarthTexture() {
    const width = 512;
    const height = 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
        const ny = y / height;
        const lat = Math.abs(ny - 0.5) * 2.0;

        for (let x = 0; x < width; x++) {
            const nx = x / width;
            const idx = (y * width + x) * 4;

            const elev1 = Noise.fbm(nx * 5.0, ny * 3.2, 3);
            const elev2 = Noise.noise2D(nx * 14.0, ny * 9.0) * 0.15;
            const elevation = elev1 + elev2;
            const moisture = Noise.fbm(nx * 7.0 + 8.5, ny * 5.0 + 8.5, 2);

            let r, g, b;
            if (lat > 0.82) {
                const iceNoise = Noise.noise2D(nx * 18.0, ny * 18.0);
                r = Math.floor(235 + iceNoise * 20);
                g = Math.floor(242 + iceNoise * 13);
                b = 255;
            } else if (elevation < 0.48) {
                if (elevation > 0.44) {
                    const t = (elevation - 0.44) / 0.04;
                    r = Math.floor(t * 15);
                    g = Math.floor(145 + t * 75);
                    b = Math.floor(215 + t * 40);
                } else if (elevation > 0.36) {
                    const t = (elevation - 0.36) / 0.08;
                    r = Math.floor(5 + t * 10);
                    g = Math.floor(65 + t * 70);
                    b = Math.floor(165 + t * 50);
                } else {
                    r = 5; g = 55; b = 165;
                }
            } else {
                if (elevation > 0.65) {
                    const t = (elevation - 0.65) / 0.15;
                    if (t > 0.5) {
                        r = 248; g = 252; b = 255;
                    } else {
                        r = Math.floor(40 + t * 25);
                        g = Math.floor(155 + t * 45);
                        b = Math.floor(75 + t * 30);
                    }
                } else if (lat < 0.45 && moisture < 0.40) {
                    const t = (0.40 - moisture) / 0.20;
                    r = Math.floor(55 + t * 25);
                    g = Math.floor(185 + t * 25);
                    b = Math.floor(75 - t * 15);
                } else if (moisture > 0.52) {
                    r = 18; g = 165; b = 48;
                } else {
                    r = 45; g = 195; b = 65;
                }
            }

            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    return optimizeTexture(new THREE.CanvasTexture(canvas));
}

// 4. Earth Night Lights Fallback
function createEarthNightTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    return optimizeTexture(new THREE.CanvasTexture(canvas));
}

// 5. Realistic Atmospheric Clouds Fallback (512 x 256)
function createCloudsTexture() {
    const width = 512;
    const height = 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
        const ny = y / height;
        const latWave = Math.sin(ny * Math.PI * 4.0) * 0.08;

        for (let x = 0; x < width; x++) {
            const nx = x / width;
            const idx = (y * width + x) * 4;

            const cNoise = Noise.fbm((nx + latWave) * 6.5, ny * 4.2, 2);

            let alpha = 0;
            if (cNoise > 0.46) {
                alpha = Math.min(255, Math.floor(((cNoise - 0.46) / 0.32) * 220));
            }

            data[idx] = 255;
            data[idx + 1] = 255;
            data[idx + 2] = 255;
            data[idx + 3] = alpha;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    return optimizeTexture(new THREE.CanvasTexture(canvas));
}

// 6. Photorealistic Saturn Atmosphere (Harmonic Gas Giant Bands 512x256)
function createSaturnTexture() {
    const width = 512;
    const height = 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    for (let y = 0; y < height; y++) {
        const ny = y / height;
        const lat = Math.abs(ny - 0.5) * 2.0;

        const band1 = Math.sin(ny * 48.0) * 0.25;
        const band2 = Math.sin(ny * 110.0) * 0.12;
        const micro = Math.sin(ny * 240.0) * 0.05;
        const baseVal = band1 + band2 + micro;

        for (let x = 0; x < width; x++) {
            const nx = x / width;
            const idx = (y * width + x) * 4;

            const turb = Noise.noise2D(nx * 6.0, ny * 20.0) * 0.15;
            const val = baseVal + turb;

            let r, g, b;
            if (lat > 0.82) {
                r = Math.floor(130 + val * 25);
                g = Math.floor(145 + val * 22);
                b = Math.floor(155 + val * 20);
            } else if (lat < 0.14) {
                r = Math.floor(228 + val * 18);
                g = Math.floor(190 + val * 22);
                b = Math.floor(136 + val * 20);
            } else if (ny < 0.5) {
                r = Math.floor(210 + val * 25);
                g = Math.floor(172 + val * 22);
                b = Math.floor(118 + val * 20);
            } else {
                r = Math.floor(198 + val * 24);
                g = Math.floor(160 + val * 22);
                b = Math.floor(110 + val * 18);
            }

            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
        }
    }
    ctx.putImageData(imgData, 0, 0);
    return optimizeTexture(new THREE.CanvasTexture(canvas));
}

// 7. High-Precision Saturn Ring System Texture (2048 x 64)
function createSaturnRingTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
    grad.addColorStop(0.00, 'rgba(0,0,0,0)');
    grad.addColorStop(0.08, 'rgba(120, 105, 85, 0.10)'); // D Ring
    grad.addColorStop(0.18, 'rgba(165, 145, 120, 0.35)'); // C Ring
    grad.addColorStop(0.31, 'rgba(150, 130, 105, 0.20)');
    grad.addColorStop(0.32, 'rgba(0,0,0,0.02)'); // Maxwell Gap
    grad.addColorStop(0.34, 'rgba(235, 212, 172, 0.92)'); // B Ring (Brightest)
    grad.addColorStop(0.48, 'rgba(250, 230, 190, 1.00)');
    grad.addColorStop(0.64, 'rgba(225, 205, 165, 0.90)');
    grad.addColorStop(0.65, 'rgba(0,0,0,0)'); // Cassini Division
    grad.addColorStop(0.69, 'rgba(0,0,0,0)');
    grad.addColorStop(0.70, 'rgba(215, 195, 160, 0.85)'); // A Ring
    grad.addColorStop(0.83, 'rgba(0,0,0,0.02)'); // Encke Gap
    grad.addColorStop(0.85, 'rgba(205, 185, 150, 0.78)');
    grad.addColorStop(0.92, 'rgba(175, 155, 125, 0.40)');
    grad.addColorStop(0.94, 'rgba(0,0,0,0)');
    grad.addColorStop(0.97, 'rgba(210, 195, 165, 0.45)'); // F Ring
    grad.addColorStop(1.00, 'rgba(0,0,0,0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < canvas.width; x += 3) {
        const micro = (Math.sin(x * 0.4) * 0.5 + 0.5) * 0.10;
        ctx.fillStyle = `rgba(0, 0, 0, ${micro})`;
        ctx.fillRect(x, 0, 1, canvas.height);
    }
    return optimizeTexture(new THREE.CanvasTexture(canvas));
}

// 8. Saturn's Moon Titan Texture
function createTitanTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#d97724');
    grad.addColorStop(0.5, '#e59a44');
    grad.addColorStop(1, '#b55a15');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return optimizeTexture(new THREE.CanvasTexture(canvas));
}

// 9. Photorealistic White & Greyish Lunar Texture Fallback (512 x 256)
function createMoonTexture() {
    const width = 512;
    const height = 256;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const maria = [
        { cx: 0.32, cy: 0.38, rx: 0.16, ry: 0.14, depth: 0.28 },
        { cx: 0.48, cy: 0.42, rx: 0.14, ry: 0.12, depth: 0.25 },
        { cx: 0.25, cy: 0.52, rx: 0.12, ry: 0.10, depth: 0.22 },
        { cx: 0.65, cy: 0.35, rx: 0.13, ry: 0.11, depth: 0.20 },
        { cx: 0.78, cy: 0.50, rx: 0.10, ry: 0.08, depth: 0.18 }
    ];

    const craters = [
        { cx: 0.42, cy: 0.76, r: 0.035, rayLen: 0.22 },
        { cx: 0.34, cy: 0.36, r: 0.030, rayLen: 0.18 },
        { cx: 0.28, cy: 0.42, r: 0.025, rayLen: 0.14 }
    ];

    for (let y = 0; y < height; y++) {
        const ny = y / height;
        for (let x = 0; x < width; x++) {
            const nx = x / width;
            const idx = (y * width + x) * 4;

            const n1 = Noise.noise2D(nx * 8.0, ny * 8.0);
            const n2 = Noise.noise2D(nx * 24.0 + 4.2, ny * 24.0 + 1.8) * 0.4;
            let regolith = (n1 + n2 + 1.4) / 2.8;

            for (let m = 0; m < maria.length; m++) {
                const ma = maria[m];
                const dx = (nx - ma.cx) / ma.rx;
                const dy = (ny - ma.cy) / ma.ry;
                const d2 = dx * dx + dy * dy;
                if (d2 < 1.0) {
                    const falloff = 1.0 - Math.sqrt(d2);
                    regolith -= falloff * ma.depth;
                }
            }

            for (let c = 0; c < craters.length; c++) {
                const cr = craters[c];
                const dx = nx - cr.cx;
                const dy = ny - cr.cy;
                const d = Math.hypot(dx, dy);
                if (d < cr.r) {
                    const rim = Math.sin((d / cr.r) * Math.PI);
                    regolith += rim * 0.25;
                } else if (d < cr.rayLen) {
                    const angle = Math.atan2(dy, dx);
                    const rayNoise = Math.sin(angle * 12.0) * 0.5 + 0.5;
                    regolith += (1.0 - d / cr.rayLen) * rayNoise * 0.18;
                }
            }

            const val = Math.max(0.0, Math.min(1.0, regolith));
            const grey = Math.floor(100 + val * 135);
            data[idx] = Math.min(255, Math.floor(grey * 0.98));
            data[idx + 1] = Math.min(255, Math.floor(grey * 0.99));
            data[idx + 2] = Math.min(255, grey);
            data[idx + 3] = 255;
        }
    }

    ctx.putImageData(imgData, 0, 0);
    return optimizeTexture(new THREE.CanvasTexture(canvas));
}

// ==========================================================================
// THREE.JS SCENE SETUP - CALIBRATED SPACE LIGHTING
// ==========================================================================

const canvas = document.getElementById('webgl-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    powerPreference: "high-performance",
    alpha: false
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020208, 0.0014);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.set(0, 10, 80);

// Calibrated Photorealistic Space Lighting
const ambientLight = new THREE.AmbientLight(0x0c1220, 0.45);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xff8822, 2.8, 680, 0.8);
sunLight.position.set(-350, 40, -450);
scene.add(sunLight);

const sunLightWarm = new THREE.PointLight(0xff3300, 2.0, 500, 1.0);
sunLightWarm.position.set(-350, 40, -450);
scene.add(sunLightWarm);

const fillLight = new THREE.DirectionalLight(0x223650, 0.3);
fillLight.position.set(150, 50, 150);
scene.add(fillLight);

// --- 1. DEEP-SPACE CELESTIAL STARFIELD ---
const starCount = (typeof window !== 'undefined' && window.innerWidth < 768) ? 20000 : 42000;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
const starColors = new Float32Array(starCount * 3);
const starSizes = new Float32Array(starCount);
const starTwinkle = new Float32Array(starCount * 2); // [speed, phase]

// Center of the entire flight corridor
const corridorCenterX = 0;
const corridorCenterY = 20;
const corridorCenterZ = -1100;

const sphereStarCount = Math.floor(starCount * 0.68);
for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    let x, y, z;

    if (i < sphereStarCount) {
        // Celestial Sphere stars surrounding the whole scene in all 360 degrees
        const u = Math.random() * 2 - 1; // cos(phi)
        const theta = Math.random() * Math.PI * 2;
        const sinPhi = Math.sqrt(Math.max(0, 1 - u * u));
        const r = 2400 + Math.random() * 1300;

        x = corridorCenterX + r * sinPhi * Math.cos(theta);
        y = corridorCenterY + r * u;
        z = corridorCenterZ + r * sinPhi * Math.sin(theta);
    } else {
        // Mid-depth & corridor stars distributed all along the flight journey
        x = (Math.random() - 0.5) * 2600;
        y = (Math.random() - 0.5) * 1600;
        z = -2700 + Math.random() * 3100;

        // Prevent stars from spawning directly inside Sun or planets
        const dSun = Math.hypot(x - (-350), y - 40, z - (-450));
        if (dSun < 140) x += 160;
        const dEarth = Math.hypot(x - 220, y - (-10), z - (-950));
        if (dEarth < 75) x -= 100;
        const dSaturn = Math.hypot(x - (-280), y - 25, z - (-1550));
        if (dSaturn < 95) x += 130;
    }

    starPos[i3] = x;
    starPos[i3 + 1] = y;
    starPos[i3 + 2] = z;

    // Stellar spectral classification (Natural cosmos: silver, ice-blue, pale gold, amber)
    const randColor = Math.random();
    let r, g, b;
    if (randColor < 0.60) {
        // Crystalline diamond/silver white
        r = 0.94 + Math.random() * 0.06;
        g = 0.96 + Math.random() * 0.04;
        b = 1.00;
    } else if (randColor < 0.80) {
        // Soft ice-blue
        r = 0.74 + Math.random() * 0.12;
        g = 0.86 + Math.random() * 0.08;
        b = 1.00;
    } else if (randColor < 0.93) {
        // Warm pale solar gold/cream
        r = 1.00;
        g = 0.92 + Math.random() * 0.06;
        b = 0.80 + Math.random() * 0.08;
    } else {
        // Subtle amber / rose
        r = 1.00;
        g = 0.84 + Math.random() * 0.06;
        b = 0.70 + Math.random() * 0.08;
    }
    starColors[i3] = r;
    starColors[i3 + 1] = g;
    starColors[i3 + 2] = b;

    // Natural magnitude/size distribution: delicate crisp pinpoints + radiant gems
    const randSize = Math.random();
    if (randSize < 0.72) {
        starSizes[i] = 1.6 + Math.random() * 0.9; // Crisp, clearly visible background pinpoints
    } else if (randSize < 0.91) {
        starSizes[i] = 2.6 + Math.random() * 1.1; // Radiant medium stars
    } else {
        starSizes[i] = 4.0 + Math.random() * 1.8; // Prominent bright navigational stars
    }

    // Twinkle speed & phase
    starTwinkle[i * 2] = 1.2 + Math.random() * 2.8; // frequency
    starTwinkle[i * 2 + 1] = Math.random() * Math.PI * 2; // phase
}

starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
starGeo.setAttribute('aColor', new THREE.BufferAttribute(starColors, 3));
starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
starGeo.setAttribute('aTwinkle', new THREE.BufferAttribute(starTwinkle, 2));

const starMat = new THREE.ShaderMaterial({
    uniforms: {
        uTime: { value: 0.0 },
        uStarTex: { value: createStarTexture() }
    },
    vertexShader: `
        attribute vec3 aColor;
        attribute float aSize;
        attribute vec2 aTwinkle;
        uniform float uTime;
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
            vColor = aColor;
            float tw = sin(uTime * aTwinkle.x + aTwinkle.y) * 0.25 + 0.75;
            vTwinkle = tw;
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * tw * (880.0 / -mvPos.z);
            gl_PointSize = clamp(gl_PointSize, 1.5, 6.5);
            gl_Position = projectionMatrix * mvPos;
        }
    `,
    fragmentShader: `
        uniform sampler2D uStarTex;
        varying vec3 vColor;
        varying float vTwinkle;

        void main() {
            vec4 tex = texture2D(uStarTex, gl_PointCoord);
            gl_FragColor = vec4(vColor, tex.a * vTwinkle * 0.96);
        }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
});
const starField = new THREE.Points(starGeo, starMat);
scene.add(starField);

// --- ELEGANT METEOR SHOWER SYSTEM (Graceful Shooting Stars) ---
const meteorCount = 5;
const meteorGeo = new THREE.BufferGeometry();
const meteorPos = new Float32Array(meteorCount * 4 * 3);
const meteorUV = new Float32Array(meteorCount * 4 * 2);
const meteorColor = new Float32Array(meteorCount * 4 * 3);
const meteorAlpha = new Float32Array(meteorCount * 4);
const meteorIndices = [];

for (let i = 0; i < meteorCount; i++) {
    const v = i * 4;
    meteorIndices.push(v, v + 1, v + 2, v + 2, v + 1, v + 3);
}

meteorGeo.setIndex(meteorIndices);
meteorGeo.setAttribute('position', new THREE.BufferAttribute(meteorPos, 3));
meteorGeo.setAttribute('uv', new THREE.BufferAttribute(meteorUV, 2));
meteorGeo.setAttribute('color', new THREE.BufferAttribute(meteorColor, 3));
meteorGeo.setAttribute('aAlpha', new THREE.BufferAttribute(meteorAlpha, 1));

const meteorMat = new THREE.ShaderMaterial({
    vertexShader: `
        attribute vec3 color;
        attribute float aAlpha;
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
            vUv = uv;
            vColor = color;
            vAlpha = aAlpha;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
            // Lateral profile (smooth rounded cross-section)
            float lat = 1.0 - abs(vUv.y - 0.5) * 2.0;
            float latFalloff = pow(clamp(lat, 0.0, 1.0), 2.2);

            // Longitudinal streak profile (tail 0.0 -> head 1.0)
            float longFalloff = pow(clamp(vUv.x, 0.0, 1.0), 1.6);

            // Blazing white-hot incandescent head core
            float headTip = smoothstep(0.82, 1.0, vUv.x) * latFalloff;

            // Head glows pure white, tail displays ionized streak color
            vec3 col = mix(vColor, vec3(1.0, 1.0, 1.0), headTip * 0.85);

            float alpha = (longFalloff * latFalloff + headTip * 0.7) * vAlpha;
            gl_FragColor = vec4(col, alpha);
        }
    `,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide
});
const meteorMesh = new THREE.Mesh(meteorGeo, meteorMat);
scene.add(meteorMesh);

const meteors = [];
for (let m = 0; m < meteorCount; m++) {
    meteors.push({
        active: false,
        head: new THREE.Vector3(),
        tail: new THREE.Vector3(),
        dir: new THREE.Vector3(),
        speed: 0,
        length: 0,
        progress: 0,
        duration: 0,
        alpha: 0,
        color: new THREE.Color(0xbfe0ff)
    });
}

let nextMeteorTime = 1.8;
let meteorTimer = 0;

function updateMeteors(delta, time) {
    meteorTimer += delta;
    if (meteorTimer >= nextMeteorTime) {
        meteorTimer = 0;
        nextMeteorTime = 2.8 + Math.random() * 3.2; // Spawns every 2.8 - 6.0s (subtle, non-splashy)

        // Find an inactive meteor from the pool
        const m = meteors.find(item => !item.active);
        if (m) {
            // Spawn inside the camera's current field of view
            const camPos = camera.position;
            const forward = new THREE.Vector3();
            camera.getWorldDirection(forward);
            const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();
            const up = camera.up.clone().normalize();

            // Distance in front of camera
            const dist = 650 + Math.random() * 350;
            // Lateral offset across viewport
            const lateral = (Math.random() - 0.5) * 650;
            // Upper celestial sky elevation
            const elev = 160 + Math.random() * 260;

            const startPos = camPos.clone()
                .addScaledVector(forward, dist)
                .addScaledVector(right, lateral)
                .addScaledVector(up, elev);

            // Trajectory: diagonal sweep across viewport
            const sweepRight = (Math.random() > 0.5 ? 1 : -1) * (0.65 + Math.random() * 0.45);
            const sweepDown = -(0.42 + Math.random() * 0.38);
            const sweepForward = (Math.random() - 0.5) * 0.3;

            m.dir.set(0, 0, 0)
                .addScaledVector(right, sweepRight)
                .addScaledVector(up, sweepDown)
                .addScaledVector(forward, sweepForward)
                .normalize();

            m.head.copy(startPos);
            m.tail.copy(startPos);
            m.speed = 520 + Math.random() * 280; // Swift shooting star
            m.length = 75 + Math.random() * 45;  // Trail length
            m.duration = 0.85 + Math.random() * 0.45; // 0.85 - 1.30s
            m.progress = 0;
            m.active = true;
            m.alpha = 0;

            // Natural meteor color: mostly electric ice-blue, occasional warm cream-gold
            if (Math.random() > 0.28) {
                m.color.setHex(0xbfe0ff); // Electric ice-blue
            } else {
                m.color.setHex(0xffe8c8); // Incandescent pale gold
            }
        }
    }

    // Update active meteors & write to geometry buffers
    const posArr = meteorGeo.attributes.position.array;
    const uvArr = meteorGeo.attributes.uv.array;
    const colArr = meteorGeo.attributes.color.array;
    const alphaArr = meteorGeo.attributes.aAlpha.array;

    const camPos = camera.position;

    for (let i = 0; i < meteorCount; i++) {
        const m = meteors[i];
        const vOffset = i * 4;
        const pOffset = vOffset * 3;
        const uOffset = vOffset * 2;

        if (m.active) {
            m.progress += delta / m.duration;
            if (m.progress >= 1.0) {
                m.active = false;
                for (let k = 0; k < 12; k++) posArr[pOffset + k] = 0;
                for (let k = 0; k < 4; k++) alphaArr[vOffset + k] = 0;
                continue;
            }

            // Move head along trajectory
            m.head.addScaledVector(m.dir, m.speed * delta);

            // Tail growth and fade-out catchup
            let tailDist = m.length;
            if (m.progress < 0.20) {
                tailDist = Math.min(m.length, (m.progress / 0.20) * m.length);
            } else if (m.progress > 0.75) {
                tailDist = m.length * (1.0 - (m.progress - 0.75) / 0.25);
            }
            m.tail.copy(m.head).addScaledVector(m.dir, -tailDist);

            // Smooth atmospheric burn lifecycle
            let a = 1.0;
            if (m.progress < 0.18) {
                a = m.progress / 0.18;
            } else if (m.progress > 0.70) {
                a = 1.0 - (m.progress - 0.70) / 0.30;
            }
            m.alpha = a;

            // Camera-facing billboard side vector
            const segDir = m.dir;
            const toCam = camPos.clone().sub(m.head).normalize();
            const side = new THREE.Vector3().crossVectors(segDir, toCam).normalize();

            const headHalfW = 1.5;
            const tailHalfW = 0.2;

            const tL = m.tail.clone().addScaledVector(side, -tailHalfW);
            const tR = m.tail.clone().addScaledVector(side, tailHalfW);
            const hL = m.head.clone().addScaledVector(side, -headHalfW);
            const hR = m.head.clone().addScaledVector(side, headHalfW);

            posArr[pOffset] = tL.x; posArr[pOffset + 1] = tL.y; posArr[pOffset + 2] = tL.z;
            posArr[pOffset + 3] = tR.x; posArr[pOffset + 4] = tR.y; posArr[pOffset + 5] = tR.z;
            posArr[pOffset + 6] = hL.x; posArr[pOffset + 7] = hL.y; posArr[pOffset + 8] = hL.z;
            posArr[pOffset + 9] = hR.x; posArr[pOffset + 10] = hR.y; posArr[pOffset + 11] = hR.z;

            uvArr[uOffset] = 0.0; uvArr[uOffset + 1] = 0.0;
            uvArr[uOffset + 2] = 0.0; uvArr[uOffset + 3] = 1.0;
            uvArr[uOffset + 4] = 1.0; uvArr[uOffset + 5] = 0.0;
            uvArr[uOffset + 6] = 1.0; uvArr[uOffset + 7] = 1.0;

            for (let v = 0; v < 4; v++) {
                colArr[(vOffset + v) * 3] = m.color.r;
                colArr[(vOffset + v) * 3 + 1] = m.color.g;
                colArr[(vOffset + v) * 3 + 2] = m.color.b;
                alphaArr[vOffset + v] = m.alpha;
            }
        } else {
            for (let k = 0; k < 12; k++) posArr[pOffset + k] = 0;
            for (let k = 0; k < 4; k++) alphaArr[vOffset + k] = 0;
        }
    }

    meteorGeo.attributes.position.needsUpdate = true;
    meteorGeo.attributes.uv.needsUpdate = true;
    meteorGeo.attributes.color.needsUpdate = true;
    meteorGeo.attributes.aAlpha.needsUpdate = true;
}

// --- 2. DEEP-SPACE FLOATING ASTEROIDS & STONE METEORITES (Real Tumbling Space Rocks) ---
function createCraggyStoneGeometry(detail = 1, roughness = 0.32, stretchY = 0.85, stretchZ = 1.15) {
    const geo = new THREE.DodecahedronGeometry(1.0, detail);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        const len = v.length();
        const nx = v.x / len;
        const ny = v.y / len;
        const nz = v.z / len;
        const u = Math.atan2(nz, nx) / (Math.PI * 2) + 0.5;
        const w = Math.asin(Math.max(-1, Math.min(1, ny))) / Math.PI + 0.5;
        const n1 = Noise.noise2D(u * 6.0, w * 6.0);
        const n2 = Noise.noise2D(u * 14.0 + 3.7, w * 14.0 + 2.1) * 0.45;
        const disp = 1.0 + (n1 + n2) * roughness;
        v.set(nx * disp, ny * disp * stretchY, nz * disp * stretchZ);
        pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
}

const stoneGeos = [
    new THREE.DodecahedronGeometry(1.0, 0)
];

const stoneMaterials = [
    new THREE.MeshStandardMaterial({
        color: 0x4e4741,
        roughness: 0.90,
        metalness: 0.12,
        flatShading: true
    }),
    new THREE.MeshStandardMaterial({
        color: 0x62574c,
        roughness: 0.85,
        metalness: 0.15,
        flatShading: true
    }),
    new THREE.MeshStandardMaterial({
        color: 0x6e665d,
        roughness: 0.78,
        metalness: 0.28,
        flatShading: true
    })
];

const spaceAsteroidGroup = new THREE.Group();
const floatingStones = [];

// Asteroids completely REMOVED from all planets, arenas, and space across the entire scene
const stoneConfigs = [];

for (let c = 0; c < stoneConfigs.length; c++) {
    const cfg = stoneConfigs[c];
    for (let i = 0; i < cfg.count; i++) {
        const gIdx = Math.floor(Math.random() * stoneGeos.length);
        const mIdx = Math.floor(Math.random() * stoneMaterials.length);
        const mesh = new THREE.Mesh(stoneGeos[gIdx], stoneMaterials[mIdx]);

        const posX = cfg.cx + (Math.random() - 0.5) * cfg.rx * 2;
        const posY = cfg.cy + (Math.random() - 0.5) * cfg.ry * 2;
        const posZ = cfg.cz + (Math.random() - 0.5) * cfg.rz * 2;

        // 1. STRICT SUN EXCLUSION: Completely remove all asteroids from the Sun and its entire sector (Z > -750)
        if (posZ > -750) continue;
        const dSun = Math.hypot(posX - (-350), posY - 40, posZ - (-450));
        if (dSun < 380) continue;

        // 2. STRICT EARTH SIDE EXCLUSION: Completely remove all asteroids from the Earth side
        // Earth is at (220, -10, -950). Ensure zero asteroids on positive X or near Earth's sector
        if (posX > 0 && posZ > -1600 && posZ < -600) continue;
        const dEarth = Math.hypot(posX - 220, posY - (-10), posZ - (-950));
        if (dEarth < 350) continue;

        // 2. REMOVE ALL ASTEROIDS FROM THE LAST ARENA (Warp Gate floating ring theme at Z <= -1940, X ~ 0)
        if (posZ < -1940 && Math.hypot(posX, posY) < 420) continue;

        // 3. SATURN BACKGROUND BLACK SPACE (Saturn at -280, 25, -1550, outer ring radius 62)
        // Must NEVER be on Saturn or its rings (minimum 140 distance from Saturn center)
        const dSaturn = Math.hypot(posX - (-280), posY - 25, posZ - (-1550));
        if (dSaturn < 140) continue;

        // If in Saturn's Z range (-1450 to -1640), reject completely (ensures they are strictly in the BACKGROUND)
        if (posZ > -1640 && posZ < -1460) continue;

        // Ensure background stones don't sit right behind Saturn's disk from the camera's angle
        if (posZ <= -1640 && posZ >= -1950) {
            // Camera at Waypoint 3: (-140, 45, -1420), Saturn: (-280, 25, -1550)
            const t = (posZ - (-1420)) / (-130);
            const rayX = -140 + t * (-140);
            const rayY = 45 + t * (-20);
            const distFromSaturnDiskRay = Math.hypot(posX - rayX, posY - rayY);
            if (distFromSaturnDiskRay < 85) continue; // Leaves Saturn's planetary body and rings completely clear
        }

        mesh.position.set(posX, posY, posZ);
        mesh.rotation.set(
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2
        );

        const sPower = Math.pow(Math.random(), 2.2);
        const scale = cfg.minScale + sPower * (cfg.maxScale - cfg.minScale);
        mesh.scale.set(
            scale * (0.85 + Math.random() * 0.3),
            scale * (0.85 + Math.random() * 0.3),
            scale * (0.85 + Math.random() * 0.3)
        );

        spaceAsteroidGroup.add(mesh);

        floatingStones.push({
            mesh: mesh,
            rot: {
                x: (Math.random() - 0.5) * 0.006,
                y: (Math.random() - 0.5) * 0.006,
                z: (Math.random() - 0.5) * 0.006
            },
            drift: new THREE.Vector3(
                (Math.random() - 0.5) * 0.6,
                (Math.random() - 0.5) * 0.4,
                (Math.random() - 0.5) * 0.5
            )
        });
    }
}
scene.add(spaceAsteroidGroup);

// --- 3. WARP STREAKS ---
const warpCount = 1800;
const warpGeo = new THREE.BufferGeometry();
const warpPositions = new Float32Array(warpCount * 3);

for (let i = 0; i < warpCount; i++) {
    warpPositions[i * 3] = (Math.random() - 0.5) * 75;
    warpPositions[i * 3 + 1] = (Math.random() - 0.5) * 75;
    warpPositions[i * 3 + 2] = -2100 + Math.random() * 500;
}
warpGeo.setAttribute('position', new THREE.BufferAttribute(warpPositions, 3));

const warpMat = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 2.4,
    map: createStarTexture(),
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const warpSystem = new THREE.Points(warpGeo, warpMat);
scene.add(warpSystem);

// --- 3. THE SUN (ARENA 01 / 02 - SDO AIA 304 Å PHOTOSPHERE & PROMINENCES) ---
const sunGroup = new THREE.Group();
sunGroup.position.set(-350, 40, -450);

const sunGeo = new THREE.SphereGeometry(75, 128, 128);
const sunTexture = createSunTexture();

// Photorealistic Solar Photosphere Shader (Eddington Limb Darkening & Convective Boiling)
const sunMat = new THREE.ShaderMaterial({
    uniforms: {
        uMap: { value: sunTexture },
        uTime: { value: 0.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
            vViewPosition = -mvPos.xyz;
            gl_Position = projectionMatrix * mvPos;
        }
    `,
    fragmentShader: `
        uniform sampler2D uMap;
        uniform float uTime;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vViewPosition;

        void main() {
            vec3 N = normalize(vNormal);
            vec3 V = normalize(vViewPosition);
            float NdotV = clamp(dot(N, V), 0.0, 1.0);

            // 1. Dynamic convective boiling (turbulent roiling plasma)
            vec2 warp = vec2(
                sin(vUv.y * 28.0 + uTime * 0.8) * 0.0022 + cos(vUv.x * 36.0 - uTime * 0.6) * 0.0016,
                cos(vUv.x * 28.0 + uTime * 0.7) * 0.0022 + sin(vUv.y * 36.0 - uTime * 0.5) * 0.0016
            );
            vec4 tex = texture2D(uMap, vUv + warp);

            // 2. 3D Spherical Depth (Limb Darkening & Curvature)
            // Center faces viewer directly (NdotV = 1.0), edges curve away gracefully (NdotV -> 0.0)
            // Curvature falloff from radiant golden-orange center to deep burning crimson limb gives authentic 3D depth
            float limb = 0.50 + 0.50 * pow(NdotV, 0.65);
            vec3 color = tex.rgb * limb;

            // Core Warmth: gentle central radiance without blowing out orange saturation
            color += color * pow(NdotV, 2.0) * 0.22;

            // Active Plage Bloom: only true flare cores pop with luminous white-gold
            float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
            float flareBloom = smoothstep(0.82, 0.98, lum);
            color += vec3(1.0, 0.85, 0.45) * flareBloom * 0.45;

            // Burning Chromospheric Rim: intense fiery red-orange edge at the grazing silhouette
            float rim = pow(1.0 - NdotV, 3.2);
            vec3 rimColor = vec3(1.0, 0.22, 0.02) * rim * 0.60;

            gl_FragColor = vec4(color + rimColor, 1.0);
        }
    `
});
const sunMesh = new THREE.Mesh(sunGeo, sunMat);
sunGroup.add(sunMesh);

// --- 3D DYNAMIC SOLAR PROMINENCES (Multi-Region Eruptions Changing Over Time) ---
// Mathematical projection for prominence loops facing camera at Waypoint 1
const vCamDir = new THREE.Vector3(0.7941, -0.0234, 0.6073).normalize();
const vCamRight = new THREE.Vector3(0.6073, 0.0, -0.7941).normalize();
const vCamUp = new THREE.Vector3().crossVectors(vCamDir, vCamRight).normalize();

function createLimbPoint(deg, radius, depth = 0) {
    const rad = (deg * Math.PI) / 180;
    const rc = Math.cos(rad) * radius;
    const rs = Math.sin(rad) * radius;
    return new THREE.Vector3()
        .addScaledVector(vCamRight, rc)
        .addScaledVector(vCamUp, rs)
        .addScaledVector(vCamDir, depth);
}

// Plasma emitting arches removed per user request; prominenceGroup kept empty
const prominenceGroup = new THREE.Group();
const prominenceMaterials = [];

// --- DYNAMIC CME PLASMA SPARK JETS (Dot Particles Erupting from Active Regions) ---
const cmeCount = 200;
const cmeGeo = new THREE.BufferGeometry();
const cmePositions = new Float32Array(cmeCount * 3);
const cmeVelocities = [];
const cmeAngles = [46.0, 134.0, 224.0, 314.0];

for (let i = 0; i < cmeCount; i++) {
    const zoneIdx = i % 4;
    const baseAngle = cmeAngles[zoneIdx] + (Math.random() - 0.5) * 16.0;
    const pt = createLimbPoint(baseAngle, 75.0, (Math.random() - 0.5) * 6.0);
    cmePositions[i * 3] = pt.x;
    cmePositions[i * 3 + 1] = pt.y;
    cmePositions[i * 3 + 2] = pt.z;

    const norm = pt.clone().normalize();
    cmeVelocities.push({
        dir: norm,
        speed: 0.35 + Math.random() * 0.45,
        dist: Math.random() * 25.0,
        maxDist: 20.0 + Math.random() * 25.0,
        zoneIdx: zoneIdx
    });
}
cmeGeo.setAttribute('position', new THREE.BufferAttribute(cmePositions, 3));
const cmeMat = new THREE.PointsMaterial({
    color: 0xff6611,
    size: 3.2,
    map: createStarTexture(),
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const cmeSystem = new THREE.Points(cmeGeo, cmeMat);
sunGroup.add(cmeSystem);

// --- VIBRANT INCANDESCENT CORONAL ATMOSPHERE ---
const glowGeo = new THREE.SphereGeometry(88, 64, 64);
const glowMat = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vNormal;
        void main() {
            float intensity = pow(0.70 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
            gl_FragColor = vec4(1.0, 0.38, 0.04, 1.0) * intensity * 0.70;
        }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
});
const sunGlow = new THREE.Mesh(glowGeo, glowMat);
sunGroup.add(sunGlow);
scene.add(sunGroup);

// --- 4. TERRA - EARTH (ARENA 03 / IT - PHOTOREALISTIC BLUE MARBLE) ---

// Real-time client-side Color Grading Engine for Earth
function gradeEarthTexture(sourceImageOrCanvas) {
    if (!sourceImageOrCanvas) return null;
    try {
        const canvas = document.createElement('canvas');
        const w = Math.min(sourceImageOrCanvas.width || 1024, 1024);
        const h = Math.min(sourceImageOrCanvas.height || 512, 512);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(sourceImageOrCanvas, 0, 0, w, h);
        const imgData = ctx.getImageData(0, 0, w, h);
        const data = imgData.data;
        const total = data.length;

        for (let i = 0; i < total; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            const isSnow = (r > 200 && g > 200 && b > 200 && Math.abs(r - g) < 30 && Math.abs(g - b) < 30);
            const isWater = !isSnow && ((b > r + 3 && b >= g - 12) || (b > 45 && r < 40 && g < 75));

            if (isSnow) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
            } else if (isWater) {
                const luma = (r * 0.299 + g * 0.587 + b * 0.114) * 0.00392157;
                if (luma > 0.26) {
                    const t = Math.min(1.0, (luma - 0.26) * 2.857);
                    data[i] = Math.floor(t * 18);
                    data[i + 1] = Math.floor(135 + t * 85);
                    data[i + 2] = Math.floor(215 + t * 40);
                } else {
                    const t = Math.min(1.0, luma * 3.846);
                    data[i] = Math.floor(5 + t * 10);
                    data[i + 1] = Math.floor(58 + t * 65);
                    data[i + 2] = Math.floor(170 + t * 75);
                }
            } else {
                const newR = Math.floor(r * 0.30 + g * 0.12);
                const newG = Math.min(255, Math.floor(g * 1.25 + r * 0.45 + 40));
                const newB = Math.floor(b * 0.40 + g * 0.18 + 15);

                data[i] = Math.max(12, Math.min(255, newR));
                data[i + 1] = Math.max(80, Math.min(255, Math.max(newG, newR + 50)));
                data[i + 2] = Math.max(20, Math.min(255, newB));
            }
        }

        ctx.putImageData(imgData, 0, 0);
        const tex = new THREE.CanvasTexture(canvas);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        return optimizeTexture(tex);
    } catch (e) {
        console.warn('Canvas grading fallback:', e);
        return null;
    }
}

const earthGroup = new THREE.Group();
earthGroup.position.set(220, -10, -950);
// Real axial tilt (23.4 degrees inclined relative to orbital plane)
earthGroup.rotation.z = THREE.MathUtils.degToRad(-18);
earthGroup.rotation.x = THREE.MathUtils.degToRad(8);

const earthGeo = new THREE.SphereGeometry(38, 128, 128);
const earthMat = new THREE.MeshStandardMaterial({
    color: 0x0c2540,
    roughness: 0.38,
    metalness: 0.08,
    emissive: 0x000000, // Zero brown wash
    emissiveIntensity: 0.0
});
const earthMesh = new THREE.Mesh(earthGeo, earthMat);
// Orient North & South America to face the camera & sunlight
earthMesh.rotation.y = 4.25;
earthGroup.add(earthMesh);

// Load High-Resolution NASA Blue Marble Textures with Color Grading
loadPlanetTextureSafe(
    'assets/earth_day_graded.jpg',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_atmos_2048.jpg',
    createEarthTexture,
    (tex) => {
        const graded = gradeEarthTexture(tex.image);
        earthMat.map = graded || tex;
        earthMat.color.setHex(0xffffff);
        earthMat.needsUpdate = true;
    }
);

loadPlanetTextureSafe(
    'assets/earth_specular.jpg',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_specular_2048.jpg',
    null,
    (tex) => {
        earthMat.roughnessMap = tex;
        earthMat.metalnessMap = tex;
        earthMat.needsUpdate = true;
    }
);

// Earth Dynamic Clouds Layer (NASA Real Swirling Storm Systems in Pure Crisp White)
const cloudsGeo = new THREE.SphereGeometry(38.65, 128, 128);
const cloudsMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.0,
    roughness: 0.85,
    emissive: 0xffffff,
    emissiveIntensity: 0.12, // Keeps clouds crisp, luminous, pure white like seen from orbit
    blending: THREE.NormalBlending,
    depthWrite: false
});
const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
cloudsMesh.rotation.y = 4.28;
earthGroup.add(cloudsMesh);

loadPlanetTextureSafe(
    'assets/earth_clouds.png',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/earth_clouds_1024.png',
    createCloudsTexture,
    (tex) => {
        cloudsMat.map = tex;
        cloudsMat.opacity = 0.92;
        cloudsMat.needsUpdate = true;
    }
);

// Outer Rayleigh Atmospheric Scattering Halo (Electric Cyan-Blue Limb)
const atmosGeo = new THREE.SphereGeometry(40.6, 96, 96);
const atmosMat = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vNormal;
        void main() {
            float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
            gl_FragColor = vec4(0.05, 0.72, 1.0, 1.0) * intensity * 2.6;
        }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
});
const earthAtmos = new THREE.Mesh(atmosGeo, atmosMat);
earthGroup.add(earthAtmos);

// Inner Atmospheric Limb Haze (Soft Horizon Curvature)
const innerAtmosGeo = new THREE.SphereGeometry(38.8, 96, 96);
const innerAtmosMat = new THREE.ShaderMaterial({
    vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec3 vNormal;
        void main() {
            float intensity = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.4);
            gl_FragColor = vec4(0.08, 0.70, 1.0, 1.0) * intensity * 0.95;
        }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    transparent: true,
    depthWrite: false
});
const earthInnerAtmos = new THREE.Mesh(innerAtmosGeo, innerAtmosMat);
earthGroup.add(earthInnerAtmos);

// Dedicated Crisp Solar Illumination for Earth (Pure 6000K White Sunlight from Upper-Left)
const earthSunLight = new THREE.DirectionalLight(0xffffff, 2.8);
earthSunLight.position.set(-250, 150, 180);
earthGroup.add(earthSunLight);

// Soft daytime fill for crystal-clear oceanic and continental illumination
const earthDayFill = new THREE.DirectionalLight(0xdcf0ff, 1.1);
earthDayFill.position.set(-100, 40, 220);
earthGroup.add(earthDayFill);

// Soft Deep-Space Cosmic Ambient Fill
const earthNightFill = new THREE.DirectionalLight(0x06152d, 0.35);
earthNightFill.position.set(180, -80, -120);
earthGroup.add(earthNightFill);

scene.add(earthGroup);

// Luna - Earth's Moon (White & Greyish Cratered Celestial Body)
const moonGroup = new THREE.Group();
const moonGeo = new THREE.SphereGeometry(8.0, 64, 64);
const moonMat = new THREE.MeshStandardMaterial({
    color: 0x909095,
    roughness: 0.92,
    metalness: 0.02
});
const moonMesh = new THREE.Mesh(moonGeo, moonMat);
moonGroup.add(moonMesh);
moonGroup.position.set(earthGroup.position.x + 115, earthGroup.position.y - 12, earthGroup.position.z + 10);
scene.add(moonGroup);

loadPlanetTextureSafe(
    'assets/moon.jpg',
    'https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/textures/planets/moon_1024.jpg',
    createMoonTexture,
    (tex) => {
        moonMat.map = tex;
        moonMat.color.setHex(0xffffff);
        moonMat.needsUpdate = true;
    }
);

// --- 5. SATURN & RINGS (ARENA 04 / ECE) ---
const saturnGroup = new THREE.Group();
saturnGroup.position.set(-280, 25, -1550);
saturnGroup.rotation.z = THREE.MathUtils.degToRad(26.7);
saturnGroup.rotation.x = THREE.MathUtils.degToRad(12.0);

const saturnGeo = new THREE.SphereGeometry(45, 128, 128);
const saturnMat = new THREE.MeshStandardMaterial({
    map: createSaturnTexture(),
    roughness: 0.82,
    metalness: 0.05
});
const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
saturnGroup.add(saturnMesh);

// 360-segment Ring Geometry
const ringInnerR = 58;
const ringOuterR = 126;
const ringGeo = new THREE.RingGeometry(ringInnerR, ringOuterR, 360);

const ringPos = ringGeo.attributes.position;
const ringUVs = ringGeo.attributes.uv;
for (let i = 0; i < ringPos.count; i++) {
    const rx = ringPos.getX(i);
    const ry = ringPos.getY(i);
    const rad = Math.sqrt(rx * rx + ry * ry);
    const u = (rad - ringInnerR) / (ringOuterR - ringInnerR);
    ringUVs.setXY(i, u, 0.5);
}
ringGeo.uvsNeedUpdate = true;

const ringMat = new THREE.MeshBasicMaterial({
    map: createSaturnRingTexture(),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.98
});
const ringMesh = new THREE.Mesh(ringGeo, ringMat);
ringMesh.rotation.x = Math.PI / 2;
saturnGroup.add(ringMesh);

// Titan - Saturn's Moon
const titanGroup = new THREE.Group();
const titanGeo = new THREE.SphereGeometry(4.2, 48, 48);
const titanMat = new THREE.MeshStandardMaterial({
    map: createTitanTexture(),
    roughness: 0.85
});
const titanMesh = new THREE.Mesh(titanGeo, titanMat);
titanGroup.add(titanMesh);
titanGroup.position.set(saturnGroup.position.x + 160, saturnGroup.position.y + 15, saturnGroup.position.z - 80);
scene.add(titanGroup);

// Saturn Orbit Asteroids: close-orbit rocks removed so Saturn's rings and atmosphere remain pristine
const asteroidGroup = new THREE.Group();
scene.add(asteroidGroup);

// Saturn Ring Particles: cleared so Saturn's rings remain clean and unobstructed
const debrisField = new THREE.Group();
scene.add(saturnGroup);

// --- 6. WARP SINGULARITY (ARENA 05 / CYBER) ---
const warpCoreGroup = new THREE.Group();
warpCoreGroup.position.set(0, 0, -2100);

const eventHorizonGeo = new THREE.SphereGeometry(14, 64, 64);
const eventHorizonMat = new THREE.MeshBasicMaterial({ color: 0x000206 });
const eventHorizon = new THREE.Mesh(eventHorizonGeo, eventHorizonMat);
warpCoreGroup.add(eventHorizon);

const ringGlowGeo = new THREE.TorusGeometry(32, 1.4, 24, 120);
const ringGlowMat = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true
});
const warpTorus = new THREE.Mesh(ringGlowGeo, ringGlowMat);
warpCoreGroup.add(warpTorus);

const warpTorus2 = new THREE.Mesh(
    new THREE.TorusGeometry(22, 1.0, 20, 100),
    new THREE.MeshBasicMaterial({ color: 0xbd00ff, wireframe: true })
);
warpCoreGroup.add(warpTorus2);

const diskPartCount = 800;
const diskGeo = new THREE.BufferGeometry();
const diskPositions = new Float32Array(diskPartCount * 3);
const diskColors = new Float32Array(diskPartCount * 3);

for (let d = 0; d < diskPartCount; d++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 16 + Math.random() * 26;
    diskPositions[d * 3] = Math.cos(angle) * r;
    diskPositions[d * 3 + 1] = (Math.random() - 0.5) * 3;
    diskPositions[d * 3 + 2] = Math.sin(angle) * r;

    const isCyan = Math.random() > 0.45;
    diskColors[d * 3] = isCyan ? 0.0 : 0.85;
    diskColors[d * 3 + 1] = isCyan ? 0.95 : 0.05;
    diskColors[d * 3 + 2] = 1.0;
}
diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPositions, 3));
diskGeo.setAttribute('color', new THREE.BufferAttribute(diskColors, 3));

const diskMat = new THREE.PointsMaterial({
    size: 2.2,
    map: createStarTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});
const accretionDisk = new THREE.Points(diskGeo, diskMat);
accretionDisk.rotation.x = Math.PI / 4;
warpCoreGroup.add(accretionDisk);

scene.add(warpCoreGroup);

gsap.registerPlugin(ScrollTrigger);

// Flight coordinates along the journey
const cameraWaypoints = [
    { x: 0, y: 10, z: 80, targetX: 0, targetY: 0, targetZ: -100 },  // 0: Launch
    { x: -180, y: 35, z: -320, targetX: -350, targetY: 40, targetZ: -450 },  // 1: Sun
    { x: 120, y: 0, z: -840, targetX: 220, targetY: -10, targetZ: -950 },  // 2: Earth
    { x: -140, y: 45, z: -1420, targetX: -280, targetY: 25, targetZ: -1550 }, // 3: Saturn
    { x: 0, y: 0, z: -1980, targetX: 0, targetY: 0, targetZ: -2300 }   // 4: Warp Gate
];

let cameraLookAt = new THREE.Vector3(0, 0, -100);
let currentTargetLook = new THREE.Vector3(0, 0, -100);
let mouseX = 0, mouseY = 0;
let isFreeCamActive = false;

// Smooth mouse gyro parallax
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 12;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 12;
}, { passive: true });

// Toggle Look Mode
const freeCamBtn = document.getElementById('camera-free-toggle');
if (freeCamBtn) {
    freeCamBtn.addEventListener('click', () => {
        isFreeCamActive = !isFreeCamActive;
        freeCamBtn.children[1].textContent = isFreeCamActive ? "LOOK MODE: FREE" : "LOOK MODE: GYRO";
        freeCamBtn.children[0].className = isFreeCamActive ? "w-2 h-2 rounded-full bg-cyan-400 animate-pulse" : "w-2 h-2 rounded-full bg-emerald-400";
    });
}

// Connect GSAP ScrollTrigger to camera timeline
const flightTimeline = gsap.timeline({
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
            const prog = self.progress; // 0.0 to 1.0
            updateTelemetryOnScroll(prog);
        }
    }
});

// Interpolate camera through waypoints across 4 intervals
for (let i = 0; i < cameraWaypoints.length - 1; i++) {
    const current = cameraWaypoints[i];
    const next = cameraWaypoints[i + 1];

    flightTimeline.to(camera.position, {
        x: next.x,
        y: next.y,
        z: next.z,
        ease: "power1.inOut",
        duration: 1
    }, i);

    flightTimeline.to(currentTargetLook, {
        x: next.targetX,
        y: next.targetY,
        z: next.targetZ,
        ease: "power1.inOut",
        duration: 1
    }, i);
}

const hudSpeedEl = document.getElementById('hud-speed');
const hudCoordEl = document.getElementById('hud-coordinates');
const hudScrollPrompt = document.getElementById('scroll-prompt');
const hudCoordinatorEl = document.getElementById('hud-coordinator');
let cachedNavDots = null;
let lastActiveDotIndex = -1;
let lastSpeedText = '';
let lastCoordText = '';
let lastScrollPromptHidden = null;
let lastHudCoordinatorHidden = null;

function updateTelemetryOnScroll(progress) {
    // Speed telemetry calculation
    const speed = (0.18 + progress * 8.42).toFixed(2) + ' c';
    if (speed !== lastSpeedText && hudSpeedEl) {
        hudSpeedEl.textContent = speed;
        lastSpeedText = speed;
    }

    // Active dot navigation indicator
    const sectionIndex = Math.min(Math.floor(progress * 5), 4);
    if (sectionIndex !== lastActiveDotIndex) {
        if (!cachedNavDots) cachedNavDots = document.querySelectorAll('.nav-dot');
        cachedNavDots.forEach((dot, idx) => {
            if (idx === sectionIndex) {
                dot.className = "nav-dot w-3 h-3 rounded-full bg-cyan-400 scale-125 shadow-[0_0_10px_#00f0ff] transition-all";
            } else {
                dot.className = "nav-dot w-3 h-3 rounded-full bg-slate-700 transition-all hover:scale-125";
            }
        });
        lastActiveDotIndex = sectionIndex;
    }

    // Warp system streaks visibility increases toward section 5
    if (progress > 0.7) {
        warpMat.opacity = (progress - 0.7) * 3.0;
    } else {
        warpMat.opacity = 0.05;
    }

    // Update Galactic Coordinates display
    const raH = Math.floor(18 + progress * 4);
    const decDeg = Math.floor(38 - progress * 24);
    const coordStr = `RA ${raH}h 36m | DEC +${decDeg}° 12′`;
    if (coordStr !== lastCoordText && hudCoordEl) {
        hudCoordEl.textContent = coordStr;
        lastCoordText = coordStr;
    }

    // Auto-hide scroll prompt once user starts navigating so it doesn't obstruct mobile cards
    if (hudScrollPrompt) {
        const shouldHidePrompt = progress > 0.03;
        if (shouldHidePrompt !== lastScrollPromptHidden) {
            lastScrollPromptHidden = shouldHidePrompt;
            hudScrollPrompt.style.opacity = shouldHidePrompt ? '0' : '1';
            hudScrollPrompt.style.pointerEvents = shouldHidePrompt ? 'none' : 'auto';
            hudScrollPrompt.style.transition = 'opacity 0.3s ease';
        }
    }

    // On mobile viewports, auto-hide the fixed coordinator card while scrolling through department cards
    if (hudCoordinatorEl) {
        if (window.innerWidth < 768) {
            const shouldHideHud = (progress > 0.03 && progress < 0.95);
            if (shouldHideHud !== lastHudCoordinatorHidden) {
                lastHudCoordinatorHidden = shouldHideHud;
                hudCoordinatorEl.style.opacity = shouldHideHud ? '0' : '1';
                hudCoordinatorEl.style.pointerEvents = shouldHideHud ? 'none' : 'auto';
            }
        } else if (lastHudCoordinatorHidden !== false) {
            lastHudCoordinatorHidden = false;
            hudCoordinatorEl.style.opacity = '1';
            hudCoordinatorEl.style.pointerEvents = 'auto';
        }
    }
}

function jumpToSection(index) {
    const targetElem = document.getElementById(`sec-${index}`);
    if (targetElem) {
        targetElem.scrollIntoView({ behavior: 'smooth' });
    }
}

// Warp Button Burst Effect
let isHyperdriveBoosting = false;
const warpBtn = document.getElementById('warp-btn');
if (warpBtn) {
    warpBtn.addEventListener('click', () => {
        if (isHyperdriveBoosting) return;
        isHyperdriveBoosting = true;

        gsap.to(camera.position, {
            z: "-=350",
            duration: 2.2,
            ease: "power3.in",
            onComplete: () => {
                gsap.to(camera.position, {
                    z: -1980,
                    duration: 1.5,
                    ease: "power2.out",
                    onComplete: () => {
                        isHyperdriveBoosting = false;
                    }
                });
            }
        });

        gsap.to(warpMat, {
            size: 6.0,
            opacity: 1.0,
            duration: 1.2,
            yoyo: true,
            repeat: 1
        });
    });
}

// System Clock HUD
function updateClock() {
    const clockEl = document.getElementById('hud-clock');
    if (!clockEl) return;
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, '0');
    const d = String(now.getUTCDate()).padStart(2, '0');
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const ss = String(now.getUTCSeconds()).padStart(2, '0');
    clockEl.textContent = `${y}.${m}.${d} // ${hh}:${mm}:${ss} UTC`;
}
setInterval(updateClock, 1000);
updateClock();

// Responsive Resize Listener & Mobile FOV Calibration
function handleWindowResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    // On narrower / portrait screens, adjust vertical FOV to preserve framing of celestial bodies
    if (w < 768) {
        camera.fov = 62;
    } else {
        camera.fov = 50;
    }
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(w, h);
    const hudCoord = document.getElementById('hud-coordinator');
    if (hudCoord && w >= 768) {
        hudCoord.style.opacity = '1';
        hudCoord.style.pointerEvents = 'auto';
    }
}
window.addEventListener('resize', handleWindowResize, { passive: true });
handleWindowResize();

// Animation Loop
const clock = new THREE.Clock();
let isPageVisible = !document.hidden;

document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) {
        clock.getDelta();
        requestAnimationFrame(animate);
    }
}, { passive: true });

function animate() {
    if (!isPageVisible) return;
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.1);
    const elapsedTime = clock.getElapsedTime();

    // Animate Starfield Twinkle
    if (typeof starMat !== 'undefined' && starMat.uniforms && starMat.uniforms.uTime) {
        starMat.uniforms.uTime.value = elapsedTime;
    }

    // Animate Elegant Meteor Streaks
    if (typeof updateMeteors === 'function') {
        updateMeteors(delta, elapsedTime);
    }

    // Animate Tumbling Deep-Space Floating Asteroids & Stone Meteorites
    if (typeof floatingStones !== 'undefined') {
        for (let sIdx = 0; sIdx < floatingStones.length; sIdx++) {
            const st = floatingStones[sIdx];
            st.mesh.rotation.x += st.rot.x;
            st.mesh.rotation.y += st.rot.y;
            st.mesh.rotation.z += st.rot.z;
            st.mesh.position.x += st.drift.x * delta;
            st.mesh.position.y += st.drift.y * delta;
            st.mesh.position.z += st.drift.z * delta;
        }
    }

    // Rotate & Animate Sun (SDO Convective Boiling, Dynamic Multi-Region Prominences & CME Spark Jets)
    sunMesh.rotation.y += 0.0015;
    if (sunMat && sunMat.uniforms && sunMat.uniforms.uTime) {
        sunMat.uniforms.uTime.value = elapsedTime;
    }
    if (typeof prominenceMaterials !== 'undefined') {
        for (let pIdx = 0; pIdx < prominenceMaterials.length; pIdx++) {
            prominenceMaterials[pIdx].uniforms.uTime.value = elapsedTime;
        }
    }
    // Animate dynamic erupting CME plasma spark jets from active regions
    if (typeof cmeGeo !== 'undefined' && typeof cmeVelocities !== 'undefined') {
        const cmePosArr = cmeGeo.attributes.position.array;
        for (let i = 0; i < cmeCount; i++) {
            const v = cmeVelocities[i];
            // Check if particle's zone is currently erupting
            const zoneCycle = Math.sin(elapsedTime * 0.35 + (v.zoneIdx * Math.PI * 0.5));
            const isErupting = zoneCycle > -0.25;
            v.dist += v.speed * (isErupting ? 1.0 : 0.2);
            if (v.dist > v.maxDist) {
                v.dist = 0;
                const baseAngle = cmeAngles[v.zoneIdx] + (Math.random() - 0.5) * 16.0;
                const pt = createLimbPoint(baseAngle, 75.0, (Math.random() - 0.5) * 6.0);
                cmePosArr[i * 3] = pt.x;
                cmePosArr[i * 3 + 1] = pt.y;
                cmePosArr[i * 3 + 2] = pt.z;
            } else {
                cmePosArr[i * 3] += v.dir.x * v.speed;
                cmePosArr[i * 3 + 1] += v.dir.y * v.speed;
                cmePosArr[i * 3 + 2] += v.dir.z * v.speed;
            }
        }
        cmeGeo.attributes.position.needsUpdate = true;
    }
    sunGlow.rotation.y += 0.0006;
    const sunPulse = 1.0 + Math.sin(elapsedTime * 1.8) * 0.012;
    sunGlow.scale.set(sunPulse, sunPulse, sunPulse);

    earthMesh.rotation.y += 0.0007;
    cloudsMesh.rotation.y += 0.0011; // Clouds drift realistically across the landmasses

    // Animate Earth's Moon (Luna) with exact same orbital speed as Saturn's moon (~15.7s cycle)
    if (typeof moonGroup !== 'undefined' && moonGroup) {
        moonMesh.rotation.y += 0.004;
        const moonAngle = elapsedTime * 0.40 + 2.2;
        moonGroup.position.x = earthGroup.position.x + Math.cos(moonAngle) * 125;
        moonGroup.position.y = earthGroup.position.y - 12 + Math.sin(moonAngle * 1.3) * 16;
        moonGroup.position.z = earthGroup.position.z + Math.sin(moonAngle) * 125;
    }

    saturnMesh.rotation.y += 0.0045;
    ringMesh.rotation.z += 0.0008;
    debrisField.rotation.y += 0.0015;

    // Animate Saturn's Moon Titan in frequent orbit (increased speed ~15s per cycle)
    if (typeof titanGroup !== 'undefined' && titanGroup) {
        titanMesh.rotation.y += 0.008;
        const titanAngle = elapsedTime * 0.40;
        titanGroup.position.x = saturnGroup.position.x + Math.cos(titanAngle) * 165;
        titanGroup.position.y = saturnGroup.position.y + 12 + Math.sin(titanAngle) * 25;
        titanGroup.position.z = saturnGroup.position.z + Math.sin(titanAngle) * 165;
    }

    // Orbit & Tumble 3D Asteroid Rocks
    if (typeof asteroidGroup !== 'undefined' && asteroidGroup) {
        asteroidGroup.rotation.y += 0.0012;
        asteroidGroup.children.forEach((rock, rIdx) => {
            rock.rotation.x += 0.006 * (rIdx % 2 === 0 ? 1 : -1);
            rock.rotation.y += 0.004;
        });
    }

    // Animate Warp Singularity Toruses & Relativistic Accretion Disk
    warpTorus.rotation.x = elapsedTime * 0.8;
    warpTorus.rotation.y = elapsedTime * 0.6;
    warpTorus2.rotation.z = -elapsedTime * 1.2;
    if (typeof accretionDisk !== 'undefined' && accretionDisk) {
        accretionDisk.rotation.z = elapsedTime * 0.55;
    }

    // Twinkle and drift stars
    starField.rotation.y = elapsedTime * 0.0003;

    // Animate warp particles forward
    const warpPosAttr = warpGeo.attributes.position;
    const positions = warpPosAttr.array;
    const warpSpeedMultiplier = isHyperdriveBoosting ? 90 : 8;

    for (let i = 0; i < warpCount; i++) {
        positions[i * 3 + 2] += warpSpeedMultiplier;
        if (positions[i * 3 + 2] > camera.position.z + 50) {
            positions[i * 3 + 2] = camera.position.z - 600 - Math.random() * 400;
        }
    }
    warpPosAttr.needsUpdate = true;

    // Camera orientation smoothing
    if (isFreeCamActive) {
        cameraLookAt.x += (currentTargetLook.x + mouseX * 6.0 - cameraLookAt.x) * 0.05;
        cameraLookAt.y += (currentTargetLook.y - mouseY * 6.0 - cameraLookAt.y) * 0.05;
        cameraLookAt.z += (currentTargetLook.z - cameraLookAt.z) * 0.05;
    } else {
        cameraLookAt.x += (currentTargetLook.x + mouseX * 1.5 - cameraLookAt.x) * 0.05;
        cameraLookAt.y += (currentTargetLook.y - mouseY * 1.5 - cameraLookAt.y) * 0.05;
        cameraLookAt.z += (currentTargetLook.z - cameraLookAt.z) * 0.05;
    }
    camera.lookAt(cameraLookAt);

    renderer.render(scene, camera);
}

// Initialize on load
window.onload = function () {
    animate();
    // Trigger initial scroll update
    ScrollTrigger.refresh();
};

// =====================================================
// TECHFEST' 26 COUNTDOWN TIMER
// Target: October 17, 2026
// =====================================================

function updateCountdown() {

    // October 17, 2026 - 09:00:00 AM
    const targetDate = new Date("2026-10-17T09:00:00");

    const now = new Date();

    const difference = targetDate - now;

    const countdownElement = document.getElementById("countdown");

    if (!countdownElement) return;

    // If countdown is finished
    if (difference <= 0) {

        countdownElement.innerHTML = "EVENT STARTED";

        return;
    }

    // Calculate time
    const days = Math.floor(
        difference / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (difference / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (difference / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (difference / 1000) % 60
    );


    // Add leading zero
    const d = String(days).padStart(2, "0");
    const h = String(hours).padStart(2, "0");
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");


    countdownElement.innerHTML =
        `${d}D : ${h}H : ${m}M : ${s}S`;
}


// Update immediately
updateCountdown();

// Update every second
setInterval(updateCountdown, 1000);


/* ==========================================================================
   DEPARTMENT EVENTS POPUP MODAL SYSTEM
   ========================================================================== */
const deptEventsData = {
    cse: {
        code: "01 // CSE ARENA",
        name: "COMPUTER SCIENCE & ENGINEERING",
        badge: "6 CHAMPIONSHIP EVENTS • 17 OCT 2026",
        arenaUrl: "../cse/cse.html",
        accentColor: "cyan",
        borderClass: "border-cyan-400/50",
        shadowClass: "shadow-[0_0_50px_rgba(0,240,255,0.25)]",
        btnGradient: "from-cyan-500 via-cyan-400 to-blue-600",
        events: [
            {
                num: "01",
                tag: "TECHNICAL // PRESENTATION",
                title: "PAPER PRESENTATION",
                desc: "Abstract submission required before deadline (250–300 words). Focus on emerging tech: AI, ML, Cybersecurity, IoT, Cloud.",
                rulesLink: "../cse/cse.html#events"
            },
            {
                num: "02",
                tag: "HACKATHON // SPRINT",
                title: "HACKATHON",
                desc: "Problem statements announced at start. Write code during event duration. Bring your own hardware/laptops.",
                rulesLink: "../cse/cse.html#events"
            },
            {
                num: "03",
                tag: "PROJECT // EXPO",
                title: "PROJECT EXPO (MOBILE APP DEVELOPMENT)",
                desc: "Working mobile applications (Android/iOS/Flutter/React Native) with architecture diagram display and live demo.",
                rulesLink: "../cse/cse.html#events"
            },
            {
                num: "04",
                tag: "AI // POSTER MAKING",
                title: "SNAP WITH AI (POSTER MAKING)",
                desc: "Create high-impact visual posters using AI image generators (Midjourney, DALL-E, Leonardo AI, Canva AI). Prompts logged.",
                rulesLink: "../cse/cse.html#events"
            },
            {
                num: "05",
                tag: "TECH // QUIZ",
                title: "CYBER HUNT (TECHNICAL QUIZ)",
                desc: "Round 1 (Prelims): MCQs on Networking, OS, Cryptography, Security. Round 2 (Finals): CTF challenges and log analysis.",
                rulesLink: "../cse/cse.html#events"
            },
            {
                num: "06",
                tag: "PROMPT // BATTLE",
                title: "AI PROMPT BATTLE (USING CLAUDE AI)",
                desc: "Identical target output requirements. Competitors write and refine prompts using Claude AI within time limit.",
                rulesLink: "../cse/cse.html#events"
            }
        ]
    },
    aids: {
        code: "02 // AI & DS ARENA",
        name: "ARTIFICIAL INTELLIGENCE & DATA SCIENCE",
        badge: "5 INTELLIGENT MODULES • 17 OCT 2026",
        arenaUrl: "../ai&ds/aids.html",
        accentColor: "yellow",
        borderClass: "border-yellow-400/50",
        shadowClass: "shadow-[0_0_50px_rgba(255,170,0,0.25)]",
        btnGradient: "from-yellow-500 via-amber-400 to-yellow-600",
        events: [
            {
                num: "01",
                tag: "RESEARCH // PRESENTATION",
                title: "PAPER PRESENTATION",
                desc: "Participants present a research-based or innovative technical topic before judges using PowerPoint.",
                rulesLink: "../ai&ds/aids.html#events"
            },
            {
                num: "02",
                tag: "PROMPT // APP INNOVATION",
                title: "PRO-PITCH (PROMPT TO APP)",
                desc: "Participants use AI prompts to develop a functional app based on an app/idea selected through a Lucky Draw.",
                rulesLink: "../ai&ds/aids.html#events"
            },
            {
                num: "03",
                tag: "DATA // VISUALIZATION",
                title: "VIZ CRAFT (AI DATA VISUALIZATION)",
                desc: "Analyze a given dataset and use AI-assisted tools to create meaningful visualizations and communicate useful insights.",
                rulesLink: "../ai&ds/aids.html#events"
            },
            {
                num: "04",
                tag: "MULTI-LANG // CODING",
                title: "CODE FLEX (MULTI-LANGUAGE CODING CHALLENGE)",
                desc: "Solve programming problems using a programming language of choice (Python, Java, C, C++) without internet or AI.",
                rulesLink: "../ai&ds/aids.html#events"
            },
            {
                num: "05",
                tag: "INTELLIGENCE // QUIZ",
                title: "COGNIX (QUIZ)",
                desc: "Compete in a 2-round technical quiz covering AI, Data Science, Machine Learning, Deep Learning, and Generative AI.",
                rulesLink: "../ai&ds/aids.html#events"
            }
        ]
    },
    it: {
        code: "03 // IT ARENA",
        name: "INFORMATION TECHNOLOGY",
        badge: "6 INNOVATIVE MODULES • 17 OCT 2026",
        arenaUrl: "../it/it.html",
        accentColor: "darkblue",
        borderClass: "border-blue-500/50",
        shadowClass: "shadow-[0_0_50px_rgba(37,99,235,0.35)]",
        btnGradient: "from-blue-700 via-blue-600 to-indigo-700",
        events: [
            {
                num: "01",
                tag: "RESEARCH // PRESENTATION",
                title: "PAPER PRESENTATION: INNOPAPERS",
                desc: "The Spectrum of Innovation — Choose an innovative topic, prepare informative slides, and present original paper.",
                rulesLink: "../it/it.html#events"
            },
            {
                num: "02",
                tag: "AI // PROMPT BATTLE",
                title: "CLAUDE PROMPT BATTLE",
                desc: "Create optimal prompts for Claude AI to solve specific tasks and generate required solutions under timed scoring.",
                rulesLink: "../it/it.html#events"
            },
            {
                num: "03",
                tag: "WEB // ARCHITECTURE",
                title: "WEB ARCHITECTS",
                desc: "Create a website during the event based on the announced theme within 45–60 minutes, evaluated on UI, creativity, and responsiveness.",
                rulesLink: "../it/it.html#events"
            },
            {
                num: "04",
                tag: "CODE // DEBUGGING",
                title: "CODE DEBUGGING (BUG HUNT)",
                desc: "Compete across Round 1 (Preliminary debugging) and Round 2 (Advanced debugging) in C, C++, Java, or Python.",
                rulesLink: "../it/it.html#events"
            },
            {
                num: "05",
                tag: "PITCH // DISPLAY",
                title: "POSTER PITCH",
                desc: "Present creative technical posters on chosen topics with clear information, diagrams, and visual designs.",
                rulesLink: "../it/it.html#events"
            },
            {
                num: "06",
                tag: "PROJECT // SHOWCASE",
                title: "PROJECT PRESENTATION",
                desc: "Present innovative and original projects with PPT presentation (5–7 mins) followed by Q&A (2–3 mins).",
                rulesLink: "../it/it.html#events"
            }
        ]
    },
    ece: {
        code: "04 // ECE ARENA",
        name: "ELECTRONICS & COMMUNICATION ENGINEERING",
        badge: "6 HARDWARE & EMBEDDED EVENTS • 17 OCT 2026",
        arenaUrl: "../ece/ece.html",
        accentColor: "red",
        borderClass: "border-red-500/50",
        shadowClass: "shadow-[0_0_50px_rgba(239,68,68,0.25)]",
        btnGradient: "from-red-500 via-rose-500 to-orange-600",
        events: [
            {
                num: "01",
                tag: "TECHNICAL // PRESENTATION",
                title: "PAPER PRESENTATION",
                desc: "Present original research papers and technical concepts on emerging areas of ECE like 5G/6G, VLSI, IoT, and AI/ML.",
                rulesLink: "../ece/ece.html#events"
            },
            {
                num: "02",
                tag: "PROJECT // EXPO",
                title: "PROJECT EXPO",
                desc: "Showcase innovative practical ECE applications, IoT systems, automation prototypes, and hardware engineering projects.",
                rulesLink: "../ece/ece.html#events"
            },
            {
                num: "03",
                tag: "CIRCUIT // DEBUGGING",
                title: "CIRCUIT DEBUGGING",
                desc: "Identify and rectify faults in given electronic circuits, testing circuit analysis and troubleshooting speed.",
                rulesLink: "../ece/ece.html#events"
            },
            {
                num: "04",
                tag: "DRONE // INNOVATION",
                title: "DRONOVA",
                desc: "Perform technical drone and UAV tasks demonstrating flight control, aerial stability, maneuvers, and safety protocols.",
                rulesLink: "../ece/ece.html#events"
            },
            {
                num: "05",
                tag: "TACTICAL // ESCAPE QUEST",
                title: "TECH ESCAPE ROOM",
                desc: "Solve electronics and technology-based puzzles and challenges under time pressure to unlock stages and escape.",
                rulesLink: "../ece/ece.html#events"
            },
            {
                num: "06",
                tag: "HARDWARE // HACKATHON",
                title: "ECE HACKATHON",
                desc: "Develop innovative solutions to given ECE problem statements across Embedded Systems, IoT, AI, or Communication.",
                rulesLink: "../ece/ece.html#events"
            }
        ]
    },
    cyber: {
        code: "05 // CYBER ARENA",
        name: "COMPUTER SCIENCE & ENGINEERING (CYBER SECURITY)",
        badge: "6 THREAT DEFENSE EVENTS • 17 OCT 2026",
        arenaUrl: "../cyber/cyber.html",
        accentColor: "orange",
        borderClass: "border-orange-500/50",
        shadowClass: "shadow-[0_0_50px_rgba(249,115,22,0.25)]",
        btnGradient: "from-orange-500 via-amber-500 to-yellow-600",
        events: [
            {
                num: "01",
                tag: "RESEARCH // PRESENTATION",
                title: "CYBER PAPER PRESENTATION",
                desc: "Abstract submission required before deadline (250–300 words). Focus on cybersecurity, ethical hacking, network security, forensics, cryptography, or privacy.",
                rulesLink: "../cyber/cyber.html#events"
            },
            {
                num: "02",
                tag: "INTEL // QUIZ",
                title: "CYBER HUNT (TECHNICAL QUIZ)",
                desc: "Round 1 (CRT & technical), Round 2 (CRT & technical), and Round 3 Rapid Fire with 10 questions to be answered within 100 seconds.",
                rulesLink: "../cyber/cyber.html#events"
            },
            {
                num: "03",
                tag: "DEFENSE // DETECTION",
                title: "PHISHGUARD: PHISHING WEBSITE DETECTION",
                desc: "3 levels of phishing identification. Participants analyze messages, emails, websites, or screenshots to identify Phishing vs Legitimate.",
                rulesLink: "../cyber/cyber.html#events"
            },
            {
                num: "04",
                tag: "TACTICAL // SURVIVAL",
                title: "CYBER ESCAPE ROOM: INCIDENT RESPONSE CHALLENGE",
                desc: "Teams solve a sequence of cybersecurity puzzles (password hygiene, phishing, log analysis, cryptography) to unlock the final code.",
                rulesLink: "../cyber/cyber.html#events"
            },
            {
                num: "05",
                tag: "KEYNOTE // INNOVATION",
                title: "CYBERSECURITY SPOTLIGHT: TECH TALKS",
                desc: "5–7 minute presentation followed by 2–3 minutes Q&A on AI security, cloud security, digital forensics, or privacy.",
                rulesLink: "../cyber/cyber.html#events"
            },
            {
                num: "06",
                tag: "SECURITY // HACKATHON",
                title: "CYBERSECURE HACKATHON",
                desc: "Cybersecurity problem statements announced at start; teams build working prototypes and defenses on authorized systems.",
                rulesLink: "../cyber/cyber.html#events"
            }
        ]
    },
    eee: {
        code: "06 // EEE ARENA",
        name: "ELECTRICAL & ELECTRONICS ENGINEERING",
        badge: "5 HIGH-VOLTAGE EVENTS • 17 OCT 2026",
        arenaUrl: "../eee/eee.html",
        accentColor: "indigo",
        borderClass: "border-indigo-500/50",
        shadowClass: "shadow-[0_0_50px_rgba(99,102,241,0.25)]",
        btnGradient: "from-indigo-500 via-purple-500 to-blue-600",
        events: [
            {
                num: "01",
                tag: "RESEARCH // PRESENTATION",
                title: "PAPER PRESENTATION",
                desc: "Showcase innovative research in power electronics, renewable microgrids, and electric vehicle drives.",
                rulesLink: "../eee/eee.html#events"
            },
            {
                num: "02",
                tag: "PROJECT // EXPO",
                title: "PROJECT EXPO",
                desc: "Showcase working power systems, smart metering, motor controllers, and sustainable energy projects.",
                rulesLink: "../eee/eee.html#events"
            },
            {
                num: "03",
                tag: "QUIZ // TECHNICAL",
                title: "TECHNICAL QUIZ",
                desc: "Speed quiz covering electromagnetism, electric machines, power grid stability, and modern sensors.",
                rulesLink: "../eee/eee.html#events"
            },
            {
                num: "04",
                tag: "CIRCUIT // WARRIORS",
                title: "CIRCUIT WARRIORS",
                desc: "Diagnose short circuits, trace phase anomalies, and debug live electrical bench circuitry.",
                rulesLink: "../eee/eee.html#events"
            },
            {
                num: "05",
                tag: "MACHINES // MASTER",
                title: "MACHINE MASTER",
                desc: "Master motor connections, transformer testing, electrical drives, and control machinery challenges.",
                rulesLink: "../eee/eee.html#events"
            }
        ]
    },
    mech: {
        code: "07 // MECH ARENA",
        name: "MECHANICAL ENGINEERING",
        badge: "6 CAD & INDUSTRIAL EVENTS • 17 OCT 2026",
        arenaUrl: "../mech/mech.html",
        accentColor: "teal",
        borderClass: "border-teal-500/50",
        shadowClass: "shadow-[0_0_50px_rgba(20,184,166,0.25)]",
        btnGradient: "from-teal-500 via-emerald-500 to-cyan-600",
        events: [
            {
                num: "01",
                tag: "DESIGN // PRESENTATION",
                title: "PAPER PRESENTATION",
                desc: "Present on Next-Gen Technologies: EVs, AI, Robotics, 3D Printing, Smart Manufacturing & Advanced Materials.",
                rulesLink: "../mech/mech.html#events"
            },
            {
                num: "02",
                tag: "ENGINEERING // HACKATHON",
                title: "MECH HACK X",
                desc: "Problem statements announced at start. Teams develop solutions and build working prototypes within the time.",
                rulesLink: "../mech/mech.html#events"
            },
            {
                num: "03",
                tag: "PROJECT // EXPO",
                title: "PROJECT XPLORE",
                desc: "Original, innovative Mechanical Engineering projects and hybrid working models with live demonstration.",
                rulesLink: "../mech/mech.html#events"
            },
            {
                num: "04",
                tag: "POSTER // PRESENTATION",
                title: "POSTER PRO",
                desc: "Individual visual technical poster design on on-the-spot topics completed within the allotted duration.",
                rulesLink: "../mech/mech.html#events"
            },
            {
                num: "05",
                tag: "QUIZ // TECHNICAL",
                title: "QUIZ - BRAIN BOLT",
                desc: "Fast-paced technical quiz with time limits, rapid-fire questions, and strict rules testing engineering depth.",
                rulesLink: "../mech/mech.html#events"
            },
            {
                num: "06",
                tag: "ROCKET // LAUNCH",
                title: "AQUA ROCKET",
                desc: "Design and build water-powered rockets with compressed air, judged on height, duration and accuracy.",
                rulesLink: "../mech/mech.html#events"
            }
        ]
    },
    sh: {
        code: "08 // S & H ARENA",
        name: "SCIENCE & HUMANITIES",
        badge: "4 FOUNDATIONAL EVENTS • 17 OCT 2026",
        arenaUrl: "../s&h/s&h.html",
        accentColor: "blue",
        borderClass: "border-blue-500/50",
        shadowClass: "shadow-[0_0_50px_rgba(59,130,246,0.25)]",
        btnGradient: "from-blue-500 via-indigo-500 to-cyan-500",
        events: [
            {
                num: "01",
                tag: "PHYSICS // PRESENTATION",
                title: "PAPER PRESENTATION (PHYSICS)",
                desc: "Original research with meaningful review of a Physics-related topic. Abstract submission required before deadline (150-300 words).",
                rulesLink: "../s&h/s&h.html#events"
            },
            {
                num: "02",
                tag: "LOGIC // MATHEMATICS",
                title: "MATH PUZZLES & LOGIC - QUIZ (MATHS)",
                desc: "Round 1 (Prelims): Logical Warm-up objective puzzles. Round 2: Visual & Graph puzzles. Round 3: Rapid Fire Round. Strict ban on search engines and phones.",
                rulesLink: "../s&h/s&h.html#events"
            },
            {
                num: "03",
                tag: "CHEMISTRY // DISPLAY",
                title: "POSTER PRESENTATION (CHEMISTRY)",
                desc: "Abstract submission required before deadline (250-300 words). Poster size A0 : 84.1*118.9 cm, Orientation: Portrait (Vertical).",
                rulesLink: "../s&h/s&h.html#events"
            },
            {
                num: "04",
                tag: "ORATORY // ENGLISH",
                title: "EXTEMPORE SPEECH (ENGLISH)",
                desc: "Speech with a clear introduction, body and conclusion. Speech to be audible to the audience and precise to the point.",
                rulesLink: "../s&h/s&h.html#events"
            }
        ]
    }
};

const accentStyles = {
    cyan: {
        num: 'text-cyan-400',
        tag: 'text-cyan-400/90 bg-cyan-950/60 border-cyan-500/30',
        detailBtn: 'bg-cyan-500/15 hover:bg-cyan-400 text-cyan-300 hover:text-slate-950 border-cyan-500/40 hover:border-cyan-300',
        pingBg: 'bg-cyan-400'
    },
    yellow: {
        num: 'text-yellow-400',
        tag: 'text-yellow-400/90 bg-yellow-950/60 border-yellow-500/30',
        detailBtn: 'bg-yellow-500/15 hover:bg-yellow-400 text-yellow-300 hover:text-slate-950 border-yellow-500/40 hover:border-yellow-300',
        pingBg: 'bg-yellow-400'
    },
    red: {
        num: 'text-red-400',
        tag: 'text-red-400/90 bg-red-950/60 border-red-500/30',
        detailBtn: 'bg-red-500/15 hover:bg-red-400 text-red-300 hover:text-slate-950 border-red-500/40 hover:border-red-300',
        pingBg: 'bg-red-400'
    },
    orange: {
        num: 'text-orange-400',
        tag: 'text-orange-400/90 bg-orange-950/60 border-orange-500/30',
        detailBtn: 'bg-orange-500/15 hover:bg-orange-400 text-orange-300 hover:text-slate-950 border-orange-500/40 hover:border-orange-300',
        pingBg: 'bg-orange-400'
    },
    indigo: {
        num: 'text-indigo-400',
        tag: 'text-indigo-400/90 bg-indigo-950/60 border-indigo-500/30',
        detailBtn: 'bg-indigo-500/15 hover:bg-indigo-400 text-indigo-300 hover:text-slate-950 border-indigo-500/40 hover:border-indigo-300',
        pingBg: 'bg-indigo-400'
    },
    teal: {
        num: 'text-teal-400',
        tag: 'text-teal-400/90 bg-teal-950/60 border-teal-500/30',
        detailBtn: 'bg-teal-500/15 hover:bg-teal-400 text-teal-300 hover:text-slate-950 border-teal-500/40 hover:border-teal-300',
        pingBg: 'bg-teal-400'
    },
    blue: {
        num: 'text-blue-400',
        tag: 'text-blue-400/90 bg-blue-950/60 border-blue-500/30',
        detailBtn: 'bg-blue-500/15 hover:bg-blue-400 text-blue-300 hover:text-slate-950 border-blue-500/40 hover:border-blue-300',
        pingBg: 'bg-blue-400'
    },
    darkblue: {
        num: 'text-blue-300',
        tag: 'text-blue-300/90 bg-blue-950/80 border-blue-500/40',
        detailBtn: 'bg-blue-600/25 hover:bg-blue-500 text-blue-200 hover:text-white border-blue-500/50 hover:border-blue-300',
        pingBg: 'bg-blue-500'
    },
    fuchsia: {
        num: 'text-fuchsia-400',
        tag: 'text-fuchsia-400/90 bg-fuchsia-950/60 border-fuchsia-500/30',
        detailBtn: 'bg-fuchsia-500/15 hover:bg-fuchsia-400 text-fuchsia-300 hover:text-slate-950 border-fuchsia-500/40 hover:border-fuchsia-300',
        pingBg: 'bg-fuchsia-400'
    }
};

function openEventsModal(deptKey) {
    const data = deptEventsData[deptKey] || deptEventsData.cse;
    const theme = accentStyles[data.accentColor] || accentStyles.cyan;
    const modal = document.getElementById('events-popup-modal');
    const container = document.getElementById('events-popup-container');
    const deptTag = document.getElementById('modal-dept-tag');
    const deptTitle = document.getElementById('modal-dept-title');
    const deptSubtitle = document.getElementById('modal-dept-subtitle');
    const arenaLink = document.getElementById('modal-arena-link');
    const eventsList = document.getElementById('modal-events-list');

    if (!modal) return;

    if (deptTag) {
        deptTag.textContent = data.code;
        deptTag.className = theme.num;
    }
    if (deptTitle) deptTitle.textContent = data.name;
    if (deptSubtitle) deptSubtitle.textContent = data.badge;
    if (arenaLink) {
        arenaLink.href = data.arenaUrl;
        arenaLink.className = `flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r ${data.btnGradient} text-slate-950 font-orbitron font-extrabold text-xs tracking-wider transition-all shadow-lg hover:brightness-110 flex items-center justify-center gap-2`;
    }

    if (container) {
        container.className = `relative w-full max-w-2xl bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-black/95 border ${data.borderClass} rounded-2xl sm:rounded-3xl p-5 sm:p-7 ${data.shadowClass} transform transition-all duration-300 max-h-[88vh] flex flex-col overflow-hidden`;
    }

    if (eventsList) {
        eventsList.innerHTML = data.events.map(ev => `
            <div class="p-3.5 sm:p-4 rounded-xl bg-slate-900/75 border border-slate-700/60 hover:border-slate-500 hover:bg-slate-800/80 transition-all duration-200 group flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div class="flex items-start gap-3.5">
                    <span class="font-orbitron font-black ${theme.num} text-lg sm:text-xl w-7 shrink-0 tracking-wider">${ev.num}</span>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-[10px] font-mono-tech ${theme.tag} uppercase tracking-widest px-2 py-0.5 rounded border">${ev.tag}</span>
                        </div>
                        <h4 class="text-sm sm:text-base font-orbitron font-bold text-white group-hover:text-slate-200 transition-colors mt-1.5">${ev.title}</h4>
                        <p class="text-xs text-slate-100 font-mono-tech line-clamp-2 mt-1 leading-relaxed">${ev.desc}</p>
                    </div>
                </div>
                <a href="${ev.rulesLink}" class="shrink-0 self-end sm:self-center px-3.5 py-1.5 rounded-lg ${theme.detailBtn} border text-xs font-mono-tech font-bold transition-all flex items-center gap-1.5 shadow-sm">
                    <span>DETAILS</span>
                    <span class="group-hover:translate-x-0.5 transition-transform">→</span>
                </a>
            </div>
        `).join('');
    }

    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100', 'pointer-events-auto', 'modal-active');
    document.body.style.overflow = 'hidden';
    pushEventsModalHistory();
}

let isEventsModalHistoryPushed = false;

function isHomeMobileView() {
    return window.innerWidth <= 900 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
}

function pushEventsModalHistory() {
    if (isHomeMobileView() && !isEventsModalHistoryPushed) {
        isEventsModalHistoryPushed = true;
        try {
            history.pushState({ eventsModalOpen: true }, "");
        } catch (e) {}
    }
}

function closeEventsModalInternal() {
    const modal = document.getElementById('events-popup-modal');
    if (!modal) return;
    modal.classList.remove('opacity-100', 'pointer-events-auto', 'modal-active');
    modal.classList.add('opacity-0', 'pointer-events-none');
    document.body.style.overflow = '';
}

function closeEventsModal() {
    if (isEventsModalHistoryPushed) {
        isEventsModalHistoryPushed = false;
        try {
            history.back();
        } catch (e) {}
    }
    closeEventsModalInternal();
}

window.addEventListener('popstate', () => {
    if (isEventsModalHistoryPushed) {
        isEventsModalHistoryPushed = false;
        closeEventsModalInternal();
    } else {
        const modal = document.getElementById('events-popup-modal');
        if (modal && modal.classList.contains('opacity-100') && isHomeMobileView()) {
            closeEventsModalInternal();
        }
    }
});

if (window.history.state && window.history.state.eventsModalOpen) {
    try {
        history.replaceState(null, "");
    } catch (e) {}
}

function handleModalBackdropClick(event) {
    if (event.target.id === 'events-popup-modal') {
        closeEventsModal();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeEventsModal();
    }
});

// Clear any stored mobile department switcher scroll when returning to home page
try {
    sessionStorage.removeItem('deptNavScrollLeft');
} catch (e) {}

// ========================================================
// RPSIT HOME PAGE LOADING SCREEN CONTROLLER
// ========================================================
(function initLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    if (!loader) return;

    // Minimum display time (1.8s) so visitors experience the futuristic loading animation
    const minDisplayTime = 1800;
    const startTime = performance.now();
    let isDismissed = false;

    function dismissLoader() {
        if (isDismissed) return;
        isDismissed = true;

        const elapsedTime = performance.now() - startTime;
        const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

        setTimeout(() => {
            loader.classList.add('loaded');
            document.body.classList.remove('loading-active');

            // Deactivate and remove from rendering after fade-out transition
            setTimeout(() => {
                loader.style.display = 'none';
            }, 750);
        }, remainingTime);
    }

    if (document.readyState === 'complete') {
        dismissLoader();
    } else {
        window.addEventListener('load', dismissLoader);
        // Fallback safety timeout so slow asset loading never leaves user stuck
        setTimeout(dismissLoader, 4500);
    }
})();



