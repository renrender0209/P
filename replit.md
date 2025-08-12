# YouTube Clone with Invidious API

## Project Overview
A YouTube-like website that uses Invidious API for video search and custom streaming endpoints. Designed to work in environments where YouTube is blocked (like school networks).

## User Preferences
- Language: Japanese interface and documentation
- Home page: Display trending videos from Japan
- Style: Close resemblance to YouTube design
- Video quality: Synchronized video/audio playback for high-quality streams
- Site branding: Use "YouTube" as site name (not InvidiTube)
- Social sharing: Dynamic meta tags with video titles and thumbnails for Discord/social media

## Project Architecture
- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js API server
- **Video API**: Invidious instances for search and metadata
- **Streaming**: Custom endpoint (https://siawaseok.duckdns.org/api/stream/videoId/type2)
- **Storage**: In-memory storage for user preferences and watch history

## Key Features
1. Video search using Invidious API
2. Synchronized video/audio streaming for high-quality content
3. YouTube-like UI design
4. Japanese trending videos on homepage
5. Video player with quality selection
6. Search suggestions and results
7. Video details and metadata display

## API Endpoints
### Custom API
- Trending: `https://siawaseok.duckdns.org/api/trend` (Primary trending source)

### Invidious API (Fallback)
- Search: `/api/v1/search?q={query}&region=JP&type=video`
- Video details: `/api/v1/videos/{videoId}`
- Trending: `/api/v1/trending?region=JP` (Fallback when custom API fails)

### Custom Streaming
- Primary embed: `https://siawaseok.duckdns.org/api/stream/{videoId}` (YouTube Education URLs)
- Video stream: `https://siawaseok.duckdns.org/api/stream/{videoId}/type2`
- Audio stream: `https://siawaseok.duckdns.org/api/stream/{videoId}/type2` (audio part)
- Fallback: Invidious API adaptive formats for audio/video separation

## Recent Changes
- ✓ Full YouTube clone implementation with Invidious API
- ✓ Added ytdl-core for fallback video streaming
- ✓ Implemented custom embed player using https://siawaseok.duckdns.org/api/stream/videoid
- ✓ Enhanced audio extraction from both custom endpoint and Invidious API
- ✓ Created advanced SyncedPlayer with audio/video synchronization controls
- ✓ YouTube-like UI with dark theme matching original design
- ✓ Japanese trending videos on homepage with region-specific content
- ✓ Search functionality with Japanese localization
- ✓ Watch history tracking and management
- ✓ Configured for Render deployment with proper build scripts
- ✓ Audio quality prioritization from multiple sources (Invidious + custom)
- ✓ Fixed Render deployment build errors with proper Vite and dependency configuration
- ✓ Completed proper React/Vite setup with TailwindCSS and all required packages
- ✓ Fixed "Missing parameter name" error for Render deployment by downgrading to Express 4.x
- ✓ Enhanced route parameter validation with regex patterns for security
- ✓ Updated render.yaml for more stable deployment process
- ✓ Added graceful shutdown handling and improved error handling
- ✓ Rebranded site name to "YouTube" instead of "InvidiTube"
- ✓ Added dynamic meta tags for social media sharing (Discord, Twitter, Facebook)
- ✓ Implemented server-side rendering for video page meta tags
- ✓ Added share functionality with URL copying and native share API
- ✓ Enhanced video pages with proper Open Graph and Twitter Card support
- ✓ Added structured data (JSON-LD) for better SEO and social sharing
- ✓ Fixed Render deployment npm ci error by using npm install instead
- ✓ Simplified build process to avoid package-lock.json dependency issues
- ✓ Added client-side package-lock.json for more stable builds
- ✓ Fixed Vite import error for @utils/meta by adding proper alias configuration
- ✓ Updated icon references to use standard /favicon.ico path for better compatibility
- ✓ Corrected all asset paths for production build compatibility
- ✓ Updated site icon to custom anime-style character image
- ✓ Added PWA manifest for better mobile experience
- ✓ Replaced YouTube logo with custom icon in header
- ✓ Added debug logging to server for deployment troubleshooting
- ✓ Enhanced CSS with explicit styling for dark theme
- ✓ Added fallback HTML content for better loading experience
- ✓ Improved static file serving configuration with proper headers
- ✓ Added comprehensive error boundary and JavaScript error handling
- ✓ Enhanced API to fetch 50 trending videos from Japan with pagination
- ✓ Implemented robust fallback rendering for deployment issues
- ✓ Added detailed logging for debugging deployment problems
- ✓ Updated Invidious instances list to latest working servers
- ✓ Enhanced YouTube-like design with improved header, search bar, and video cards
- ✓ Added real-time search suggestions/autocomplete with Japanese language support
- ✓ Implemented keyboard navigation for search suggestions (arrow keys, Enter, Escape)
- ✓ Added Japanese language parameter (hl=ja) to all Invidious API calls
- ✓ Filtered out shorts and live videos from trending for better user experience
- ✓ Updated trending endpoint to use custom API (https://siawaseok.duckdns.org/api/trend)
- ✓ Added fallback to Invidious API when custom trending API is unavailable

## Technical Decisions
- Use multiple Invidious instances for reliability
- Primary video streaming via https://siawaseok.duckdns.org/api/stream/videoid (returns YouTube Education embed URLs)
- Fallback to ytdl-core for direct video streaming
- YouTube-like dark theme UI design
- Support for Japanese region-specific content
- Render deployment configuration
- Embedded player for better compatibility
- React/Vite frontend with TailwindCSS for modern UI
- Audio quality prioritization using both custom endpoints and Invidious adaptive formats