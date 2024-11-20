const YOUTUBE_API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
const CHANNEL_ID = 'UCHPszxtOERYU6gzWmBHytJQ';

// Function to get channel ID from username/custom URL
export const getChannelIdFromUsername = async (username) => {
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${YOUTUBE_API_KEY}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.items[0]?.id?.channelId;
  } catch (error) {
    console.error('Error fetching channel ID:', error);
    return null;
  }
};

export const getChannelInfo = async () => {
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.items[0];
  } catch (error) {
    console.error('Error fetching channel info:', error);
    return null;
  }
};

export const getLatestVideo = async () => {
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&maxResults=1&order=date&type=video&key=${YOUTUBE_API_KEY}`
    );
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.items[0];
  } catch (error) {
    console.error('Error fetching latest video:', error);
    return null;
  }
};
