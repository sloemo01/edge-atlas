# Edge Atlas

An unofficial collection of **50 independent, interactive Cloudflare figures**. Each page is an original one-canvas isom3trics-style object with hand-authored geometry, an original Edge Atlas badge, and a separate working part. No installed example was copied or used as a template.

## Open it

Open `index.html` to browse the collection, or open any page in `figures/` independently. For a local web server, from this folder run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:8000/`. Figures need WebGL and an internet connection for the pinned Three.js CDN modules. They do not require an npm install, an account, or Cloudflare API access.

- Drag or use the arrow keys to orbit. Scroll or pinch to zoom.
- Click a working part, use its button, or press Enter/Space while focused on the figure. The mechanism moves forward, holds, reverses, and briefly rests before the next cycle.
- Use the padlock to disable orbiting without disabling zoom or the part.
- Press **R** on the canvas to reset the camera and mechanism. **Pause motion** freezes the exact pose and all ambient movement. **Finish cycle** stops repeating after the current cycle reaches rest. With reduced motion enabled, the action button toggles between the two endpoint poses without animation.

## Figure index

| # | Cloudflare product | Model |
| - | - | - |
| 01 | DNS | [Rotary record index](figures/dns.html) |
| 02 | CDN | [Edge cache cabinet](figures/cdn.html) |
| 03 | Argo Smart Routing | [Railway turnout](figures/argo.html) |
| 04 | Load Balancing | [Twin-outlet flow manifold](figures/load-balancing.html) |
| 05 | Cloudflare Images | [Image repro press](figures/images.html) |
| 06 | WAF | [Request inspection sorter](figures/waf.html) |
| 07 | DDoS | [Flood-control spillway](figures/ddos.html) |
| 08 | Turnstile | [Visitor verification gate](figures/turnstile.html) |
| 09 | Access | [Identity policy lock](figures/access.html) |
| 10 | Tunnel | [Armored outbound conduit](figures/tunnel.html) |
| 11 | Workers | [Edge Workshop](figures/workers.html) |
| 12 | Durable Objects | [State Flywheel](figures/durable-objects.html) |
| 13 | Queues | [Dispatch Conveyor](figures/queues.html) |
| 14 | R2 | [Object Vault](figures/r2.html) |
| 15 | Web Analytics | [Traffic Plotter](figures/analytics.html) |
| 16 | D1 | [Punched-card Sorter](figures/d1.html) |
| 17 | Workers KV | [Keyed Mail Cabinet](figures/workers-kv.html) |
| 18 | Workers AI | [Inference Print Bench](figures/workers-ai.html) |
| 19 | Vectorize | [Similarity Compass](figures/vectorize.html) |
| 20 | Hyperdrive | [Connection Manifold](figures/hyperdrive.html) |
| 21 | Stream | [Film Playback Station](figures/stream.html) |
| 22 | Calls (Realtime SFU) | [Live Relay Switchboard](figures/calls.html) |
| 23 | Pages | [Publish Proofing Press](figures/pages.html) |
| 24 | Browser Rendering | [Remote Page Scanner](figures/browser-rendering.html) |
| 25 | Zaraz | [Edge Tag Distributor](figures/zaraz.html) |
| 26 | API Shield | [Schema pin gauge](figures/api-shield.html) |
| 27 | Rate Limiting | [Ticket meter](figures/rate-limiting.html) |
| 28 | Email Security | [Mail quarantine chute](figures/email-security.html) |
| 29 | Gateway | [Policy swing-jib](figures/gateway.html) |
| 30 | SSL/TLS | [Bayonet coupling](figures/ssl-tls.html) |
| 31 | Spectrum | [Armoured Signal Gate](figures/spectrum.html) |
| 32 | Smart Placement | [Travelling Workbench](figures/smart-placement.html) |
| 33 | 1.1.1.1 | [Address Embosser](figures/1-1-1-1.html) |
| 34 | Magic WAN (Cloudflare WAN) | [Branch Cableway](figures/magic-wan.html) |
| 35 | Health Checks | [Origin Test Bench](figures/health-checks.html) |
| 36 | Bot Management | [Parcel Sorting Gate](figures/bot-management.html) |
| 37 | Waiting Room | [Visitor Escapement](figures/waiting-room.html) |
| 38 | Cache Reserve | [Cold Storage Lift](figures/cache-reserve.html) |
| 39 | Email Routing | [Envelope Turntable](figures/email-routing.html) |
| 40 | Registrar | [Domain Ledger & Seal](figures/registrar.html) |
| 41 | Magic Transit | [Scrubbing Shuttle](figures/magic-transit.html) |
| 42 | Browser Isolation | [Rendering Cage](figures/browser-isolation.html) |
| 43 | AI Gateway | [Prompt Manifold](figures/ai-gateway.html) |
| 44 | Workflows | [Step Camshaft](figures/workflows.html) |
| 45 | Logpush | [Log Bucket Elevator](figures/logpush.html) |
| 46 | Data Loss Prevention | [Redaction Press](figures/dlp.html) |
| 47 | Containers | [Container Gantry](figures/containers.html) |
| 48 | Page Shield | [Script Inspection Arm](figures/page-shield.html) |
| 49 | Cloudflare Radar | [Traffic Observatory](figures/radar.html) |
| 50 | Network Interconnect | [Cross-Connect Patch](figures/network-interconnect.html) |

## Branding and accuracy

Edge Atlas is an independent project. It was not made by Cloudflare, Inc. and is not affiliated with, sponsored by, or endorsed by the company. Cloudflare and associated Cloudflare product names are trademarks of Cloudflare, Inc. The site and figures use an original Edge Atlas mark.

Each machine is a metaphor rather than an architecture diagram or production simulation. Product documentation is linked from every figure.

## License

The original project files are available under the [MIT License](LICENSE). Cloudflare and GitHub trademarks are not covered by that license; the GitHub mark identifies the repository link.

## Authoring

`node build.mjs` rebuilds the gallery and the 50 standalone HTML pages from `src/`. The gallery uses rendered WebP thumbnails. `qa.mjs` can exercise the generated site in Chromium with `playwright-core` and `sharp` installed in a separate QA environment; set `ATLAS_QA_MODULES` to the directory containing that environment’s `node_modules` and optionally `ATLAS_CHROME` to the Chrome executable. `ATLAS_PREVIEWS=1` regenerates the gallery thumbnails.

## Media

`media/` holds one 1080×1080 MP4 per figure (30 fps, 7.7 s): two full action cycles on white with no UI, built to loop seamlessly. Regenerate with `ATLAS_QA_MODULES=<dir with playwright-core> node media.mjs` (needs Chrome and ffmpeg).
