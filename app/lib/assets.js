const assetFiles = import.meta.glob('../../src/**/*.{png,jpg,jpeg,webp,mp4}', {
  eager: true,
  import: 'default',
});

export function assetUrl(relativePath) {
  const normalizedPath = relativePath.replace(/^src\//, '');
  return assetFiles[`../../src/${normalizedPath}`] || relativePath;
}
