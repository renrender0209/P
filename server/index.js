const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Debug logging
console.log('Environment:', process.env.NODE_ENV);
console.log('Starting server...');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes - mount the router properly
app.use(routes);

// Serve static files from client build (for production)
if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, '../client/dist');
  console.log('Serving static files from:', staticPath);
  
  // Check if dist folder exists
  const fs = require('fs');
  if (fs.existsSync(staticPath)) {
    console.log('Static files found:', fs.readdirSync(staticPath));
  } else {
    console.error('Static files directory not found:', staticPath);
  }
  
  // Serve static assets with proper headers
  app.use(express.static(staticPath, {
    maxAge: '1d',
    etag: false
  }));
  
  // Handle video pages with dynamic meta tags for social sharing
  app.get('/watch/:videoId([a-zA-Z0-9_-]+)', async (req, res) => {
    try {
      const { videoId } = req.params;
      
      // Fetch video data for meta tags
      const axios = require('axios');
      const INVIDIOUS_INSTANCES = [
        'https://yewtu.be',
        'https://invidious.private.coffee',
        'https://invidious.projectsegfau.lt',
        'https://invidious.f5.si',
        'https://inv.nadeko.net',
        'https://invidious.nerdvpn.de',
        'https://invidious.tiekoetter.com',
        'https://lekker.gay'
      ];
      
      let videoData = null;
      
      for (const instance of INVIDIOUS_INSTANCES) {
        try {
          const response = await axios.get(`${instance}/api/v1/videos/${videoId}`, {
            params: { region: 'JP' },
            timeout: 5000
          });
          videoData = response.data;
          break;
        } catch (error) {
          continue;
        }
      }
      
      // Read the base HTML file
      const fs = require('fs');
      let html = fs.readFileSync(path.join(__dirname, '../client/dist/index.html'), 'utf8');
      
      if (videoData) {
        const title = `${videoData.title} - YouTube`;
        const description = videoData.description ? 
          videoData.description.substring(0, 160) + '...' : 
          '動画共有サイト - 日本のトレンド動画やおすすめコンテンツを視聴できます。';
        const thumbnail = videoData.videoThumbnails?.[0]?.url || '';
        const url = `${req.protocol}://${req.get('host')}/watch/${videoId}`;
        
        // Replace meta tags
        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
        html = html.replace(/(<meta name="description" content=").*?(">)/, `$1${description}$2`);
        html = html.replace(/(<meta property="og:title" content=").*?(">)/, `$1${videoData.title}$2`);
        html = html.replace(/(<meta property="og:description" content=").*?(">)/, `$1${description}$2`);
        html = html.replace(/(<meta property="og:image" content=").*?(">)/, `$1${thumbnail}$2`);
        html = html.replace(/(<meta property="og:url" content=").*?(">)/, `$1${url}$2`);
        html = html.replace(/(<meta property="twitter:title" content=").*?(">)/, `$1${videoData.title}$2`);
        html = html.replace(/(<meta property="twitter:description" content=").*?(">)/, `$1${description}$2`);
        html = html.replace(/(<meta property="twitter:image" content=").*?(">)/, `$1${thumbnail}$2`);
        html = html.replace(/(<meta property="twitter:url" content=").*?(">)/, `$1${url}$2`);
        
        // Add structured data
        const structuredData = {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": videoData.title,
          "description": description,
          "thumbnailUrl": thumbnail,
          "uploadDate": videoData.publishedText || new Date().toISOString(),
          "duration": videoData.lengthSeconds ? `PT${videoData.lengthSeconds}S` : undefined,
          "author": {
            "@type": "Person",
            "name": videoData.author || 'Unknown'
          },
          "publisher": {
            "@type": "Organization",
            "name": "YouTube"
          },
          "embedUrl": url,
          "interactionStatistic": videoData.viewCount ? {
            "@type": "InteractionCounter",
            "interactionType": { "@type": "WatchAction" },
            "userInteractionCount": videoData.viewCount
          } : undefined
        };
        
        // Remove undefined fields
        Object.keys(structuredData).forEach(key => 
          structuredData[key] === undefined && delete structuredData[key]
        );
        
        const structuredDataScript = `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
        html = html.replace('</head>', `${structuredDataScript}</head>`);
      }
      
      res.send(html);
    } catch (error) {
      console.error('Error serving video page:', error);
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    }
  });
  
  // Debug page for troubleshooting
  app.get('/debug', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/public/debug.html'));
  });

  // Handle all other routes (SPA fallback)
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      console.log('Serving SPA route:', req.path);
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    } else {
      res.status(404).json({ error: 'API endpoint not found' });
    }
  });
}

// Enhanced error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Handle specific path-to-regexp errors
  if (err.message && err.message.includes('Missing parameter name')) {
    return res.status(400).json({ error: 'Invalid route parameter format' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Express version: ${require('express/package.json').version}`);
});