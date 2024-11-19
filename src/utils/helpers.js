export function convertGoogleDriveUrl(url) {
  if (!url) return '/placeholder.png';
  try {
    if (url.includes('drive.google.com')) {
      let fileId = '';
      if (url.includes('/file/d/')) {
        fileId = url.split('/file/d/')[1].split('/')[0];
      } else if (url.includes('id=')) {
        fileId = url.split('id=')[1].split('&')[0];
      } else {
        fileId = url.match(/[-\w]{25,}/)?.[0];
      }
      return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w500` : '/placeholder.png';
    }
    return url;
  } catch (error) {
    console.error('Error converting URL:', error);
    return '/placeholder.png';
  }
}
