const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// SSL certificate files
const privateKey = fs.readFileSync('./secrets/key.pem', 'utf8');
const certificate = fs.readFileSync('./secrets/cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

// Start the server
const PORT = 8443;
httpsServer.listen(PORT, () => {
  console.log(`HTTPS server running on port ${PORT}`);
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please choose a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down gracefully...');
  httpsServer.close(() => {
    console.log('Server has been shut down.');
    process.exit(0);
  });
});
