module.exports = ({ env }) => ({
  "import-export-entries": {
    enabled: true,
    config: {
      // See `Config` section.
    },
  },
  transformer: {
    enabled: true,
    config: {
      responseTransforms: {
        removeAttributesKey: true,
        removeDataKey: true,
      },
      requestTransforms: {
        wrapBodyWithDataKey: false,
      },
      plugins: {
        ids: {
          slugify: true,
        },
      },
    },
  },
});
