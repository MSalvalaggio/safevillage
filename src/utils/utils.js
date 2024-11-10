
export const convertGoogleDriveUrl = (url) => {
  if (!url) return '';
  const fileId = url.match(/\/d\/(.*?)\/view/)?.[1];
  if (fileId) {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return url;
};