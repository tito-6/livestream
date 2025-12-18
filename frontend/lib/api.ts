export const API_URL = 'http://192.168.1.171:8080/api';

export interface StreamStatus {
  online: boolean;
  viewerCount: number;
  streamTitle?: string;
  playbackId?: string;
}

export async function getStreamStatus(): Promise<StreamStatus> {
  try {
    const response = await fetch(`${API_URL}/streams`);
    if (response.ok) {
      const json = await response.json();
      // Find the first live stream
      const liveStream = json.data?.find((s: any) => s.is_live);

      if (liveStream) {
        return {
          online: true,
          viewerCount: liveStream.viewer_count || 0,
          streamTitle: liveStream.title,
          playbackId: liveStream.playback_id
        };
      }
    }
  } catch (error) {
    console.error('Error fetching stream status:', error);
  }
  return { online: false, viewerCount: 0 };
}

