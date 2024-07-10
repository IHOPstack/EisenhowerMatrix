module.exports = {
    mount: {
      public: '/',
      src: '/dist'
    },
    plugins: [
      /* Add any Snowpack plugins here */
    ],
    routes: [
    ],
    optimize: {
      /* Enable minification */
      minify: true,
      /* Enable tree-shaking */
      treeshake: true,
      /* Create a single bundle */
      bundle: true
    },
    packageOptions: {
      /* Add any package options here */
    },
    devOptions: {
      /* Add any development options here */
    },
    buildOptions: {
      /* Add any build options here */
    },
  };
  