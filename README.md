# Let’s Corp

A mobile-first Next.js frontend prototype for a Puerto Princesa / Palawan local super app. Six connected services: **Eat, Work, See, Travel, Chat, Create**.

## Run locally

Requires Node.js 20.9+ and npm.

```sh
npm install
npm run dev
```

Open **http://127.0.0.1:3000**. The primary viewport is 390 px; tablet and desktop use wider grids and a persistent six-service sidebar.

## Build and verify

```sh
npm run typecheck
npm run build
npx playwright install chromium
npm test
npm run qa:responsive
```

Browser checks expect a local server at port 3000. The responsive check covers 390, 768, 1024, and 1440 px. Production output is a static Next.js App Router export in `out/`; serve it with any static host that supports directory index files. With Python installed, `npm run preview` serves the production output locally.

## Presentation flows

- **Discover → Work → Map → marker → business → Message Business → Chat.**
- **See → promotion → business → View on Map.** Likes, comments, saves, and share-link copying work locally.
- **Travel → resort or experience → map → message provider.** Rates are illustrative, with no booking engine.
- **Create → package → five-step brief → sample/real local image previews → review → submit → order timeline.** Demo status controls enable revisions and completed-content previews; download exports a clearly labeled demo summary.
- **Create → AI Do It Yourself → workspace → Generate → select → save.** Uses simulated template results, captions, and video storyboards; no AI API is connected.
- **Eat → Coming Soon → restaurant discovery → business → map/chat.** No cart, checkout, logistics, or payments.
- **Header avatar → Profile → Customer / Business / Admin.** Business-management drafts, conceptual subscriptions, advertising interest forms, and an admin overview are included.

## Maps

The map adapter uses Leaflet with OpenStreetMap tiles and requires **no API key**. It supports pan, zoom, custom markers, previews, filters, recentering, and links to business profiles. If no tiles load within nine seconds, an interactive simulated map replaces it. `Offline preview` provides a deterministic presentation fallback at any time.

Copy `.env.example` to `.env.local` to change the tile endpoint, attribution, or set `NEXT_PUBLIC_MAP_MODE=fallback`. These are build-time public configuration values, never secrets. Always retain your chosen provider’s required attribution. The demo current-location marker is fixed, not live geolocation.

## State and limits

Business records, posts, packages, coordinates, and example conversations are centralized in `data/mock.ts`. Shared React context holds device-local favorites, likes, messages, creative requests, drafts, account role, and area selection. Data is saved to browser localStorage. Uploads remain on the device; no backend, authentication, payments, bookings, live chat, or production generation is included. Business-management edits are saved as private mock drafts; they do not change the fictional public directory. Area selection changes discovery context; directory search and categories independently filter the shared sample records.

Mock business identities and contact information are fictional. Subscription tiers beyond Entry use fictional placeholder prices. Creative package prices are sample/test prices and are not final.

## Structure

`app/` contains App Router pages and the shared design system. `components/screens/` holds focused service screens; `components/business/`, `feed/`, `create/`, `maps/`, `navigation/`, and `ui/` provide reusable features and primitives. Tabs and dialogs compose Radix primitives with project-specific styling. `types/` defines the shared data contracts.

Fonts and photos are local assets. `data/image-credits.json` and `/credits/` contain source pages, authors, and licenses. Wikimedia Underground River photos carry CC BY-SA attribution, including cropping/resizing notes. Illustrative business imagery does not imply endorsement or depict the fictional businesses.

Feature-detected browser WebMCP tools expose directory search, service navigation, and batched favorites. Their behavior is tested with a browser registry shim; native WebMCP validation is unavailable in this environment. Ordinary browsers require no WebMCP support.

The private Sites registration is recorded in `.openai/hosting.json`. The same static export can be hosted elsewhere without changing the frontend.
