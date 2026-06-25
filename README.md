<div align="center">

# Dithering Effect Demo

Real-time ordered (Bayer-style) dithering post-processing for a 3D scene, built with React Three Fiber, three.js and a custom GLSL shader — fully tweakable in the browser.

[![Live demo](https://img.shields.io/badge/Live%20demo-CodeSandbox-151515?logo=codesandbox&logoColor=white)](https://codesandbox.io/p/github/niccolofanton/dithering-effect-demo)
[![GitHub stars](https://img.shields.io/github/stars/niccolofanton/dithering-effect-demo?style=social)](https://github.com/niccolofanton/dithering-effect-demo/stargazers)

**[▶ Open the live demo](https://codesandbox.io/p/github/niccolofanton/dithering-effect-demo)**

</div>

## What it does

This project renders a 3D text scene and applies an **ordered-dithering** post-processing pass on top of it. The dithering is implemented as a custom [`postprocessing`](https://github.com/pmndrs/postprocessing) `Effect` whose fragment shader uses a 4×4 ordered (Bayer-style) threshold map to convert per-pixel luminance into a crisp, retro dithered look.

Every parameter is exposed through a [Leva](https://github.com/pmndrs/leva) control panel, so you can experiment with the effect live without touching the code.

## Features

- **Ordered dithering shader** — 4×4 threshold matrix driven by scene luminance, written in GLSL.
- **Adjustable grid size** — scale the dither pattern from fine to chunky.
- **Contrast & brightness controls** — adjust the luminance value driving the effect.
- **Invert colors** toggle.
- **Optional toon/cel shader** with three customizable color bands (highlight, mid, shadow).
- **Dithering on/off** switch to compare against the raw render.
- Orbit-controlled orthographic camera and HDRI environment lighting via `@react-three/drei`.

## Quick start

Requires Node.js and npm.

```bash
# install dependencies
npm install

# start the dev server (http://localhost:3000)
npm start

# create a production build
npm run build
```

The project is bootstrapped with Create React App (`react-scripts`).

## How it works

The effect lives in `src/App.js` as `DitheredRayMarchEffectImpl`, a subclass of `postprocessing`'s `Effect`. It is wrapped with `wrapEffect` and dropped into an `<EffectComposer>` inside the R3F `<Canvas>`. The fragment shader (`src/shader2.glsl`) computes luminance, optionally applies the toon banding, then maps each pixel against the ordered threshold table to decide whether it is darkened. Uniforms are synced from the Leva panel on every frame via `useFrame`.

## Tech stack

- [React](https://react.dev/) 18
- [three.js](https://threejs.org/) `0.170`
- [@react-three/fiber](https://github.com/pmndrs/react-three-fiber)
- [@react-three/drei](https://github.com/pmndrs/drei)
- [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) + [postprocessing](https://github.com/pmndrs/postprocessing)
- [Leva](https://github.com/pmndrs/leva) for live controls
- Custom GLSL shader
- Create React App (`react-scripts`)

## Credits

Created by [Niccolò Fanton](https://github.com/niccolofanton).
