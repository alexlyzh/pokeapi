module.exports = {
  plugins: [
    require('postcss-nested'),
    require('postcss-modules-values-replace'),
    require('postcss-custom-properties')({
      // force the plugin to keep variables that it thinks are not used
      preserve: true,
    }),
    require('postcss-custom-media')({
      preserve: false,
    }),
  ],
};
