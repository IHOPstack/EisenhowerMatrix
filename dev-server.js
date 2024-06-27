const nodemon = require('nodemon');
const browserSync = require('browser-sync').create();

// Start your Express server with nodemon
nodemon({
  script: 'server.js',
  ext: 'js html css',
  ignore: ['node_modules/']
}).on('start', function() {
  // Start BrowserSync once the server starts
  browserSync.init({
    proxy: 'https://localhost:3000', // Your Express server URL
    https: {
      key: './key.pem',
      cert: './cert.pem'
    },
    files: ['public/**/*.{html,css,js}'], // Files to watch for changes
    reloadDelay: 1000, // Delay before reloading (in ms)
    notify: false // Disable annoying notifications
  });
});

// When nodemon restarts, reload browsers
nodemon.on('restart', function() {
  browserSync.reload();
});
