
import axios from 'axios';

export const fetchYouTubeVideoData = async (videoId) => {
  try {
    const oembedResponse = await axios.get(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    
    const title = oembedResponse.data.title || 'Untitled Video';
    const channel = oembedResponse.data.author_name || 'TRADE X TV Official';
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    
    let duration = '0:00';
    let views = 0;
    
    return {
      title,
      channel,
      thumbnail,
      duration,
      views,
      success: true,
    };
  } catch (error) {
    console.error(`Failed to fetch data for video ${videoId}:`, error.message);
    return {
      title: null,
      channel: 'TRADE X TV Official',
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      duration: '0:00',
      views: 0,
      success: false,
      error: error.message,
    };
  }
};

export const extractVideoId = (url) => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return url;
  }
  
  return null;
};

export const isValidVideoId = (videoId) => {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
};

export const getThumbnailUrl = (videoId, quality = 'hqdefault') => {
  const qualities = ['maxresdefault', 'sddefault', 'hqdefault', 'mqdefault', 'default'];
  if (!qualities.includes(quality)) quality = 'hqdefault';
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

export default {
  fetchYouTubeVideoData,
  extractVideoId,
  isValidVideoId,
  getThumbnailUrl,
};