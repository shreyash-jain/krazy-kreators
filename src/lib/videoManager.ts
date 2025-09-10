// Global video manager to ensure only one video plays at a time
class VideoManager {
  private static instance: VideoManager;
  private currentVideo: HTMLVideoElement | null = null;
  private currentVideoId: string | null = null;

  private constructor() {}

  public static getInstance(): VideoManager {
    if (!VideoManager.instance) {
      VideoManager.instance = new VideoManager();
    }
    return VideoManager.instance;
  }

  public registerVideo(videoId: string, videoElement: HTMLVideoElement) {
    // If there's already a video playing, pause it
    if (this.currentVideo && this.currentVideo !== videoElement && !this.currentVideo.paused) {
      this.currentVideo.pause();
    }
    
    this.currentVideo = videoElement;
    this.currentVideoId = videoId;
  }

  public unregisterVideo(videoId: string) {
    if (this.currentVideoId === videoId) {
      this.currentVideo = null;
      this.currentVideoId = null;
    }
  }

  public pauseAllVideos() {
    if (this.currentVideo && !this.currentVideo.paused) {
      this.currentVideo.pause();
    }
  }

  public getCurrentVideo(): HTMLVideoElement | null {
    return this.currentVideo;
  }

  public getCurrentVideoId(): string | null {
    return this.currentVideoId;
  }
}

export default VideoManager;
