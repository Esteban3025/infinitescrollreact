import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({
  url,
  playing = false,
  loop = false,
  controls = true,
  muted = false,
  volume = 1,
  preload = "auto",
  poster = null,
  onReady = () => {},
  onPlay = () => {},
  onPause = () => {},
  onEnded = () => {},
  onError = () => {},
  style = {},
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported() && url) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log("Levels disponibles:", hls.levels);
        hls.currentLevel = 0; // 🔹 forzar resolución fija (0 = 480p)
        onReady(videoRef.current);
      });

      hls.on(Hls.Events.ERROR, (evt, data) => {
        console.error("HLS error:", data);
        onError(data);
      });

      hlsRef.current = hls;
    } else if (videoRef.current) {
      // fallback Safari/iOS
      videoRef.current.src = url;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, onError, onReady]);

  // 🔹 controlar play/pause
  useEffect(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [playing]);

  // 🔹 volumen + mute
  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.volume = volume;
    videoRef.current.muted = muted;
  }, [volume, muted]);

  return (
    <video
      ref={videoRef}
      loop={loop}
      controls={controls}
      muted={muted}
      preload={preload}
      poster={poster}
      playsInline
      style={{ width: "100%", height: "100vh", background: "black", ...style }}
      onPlay={onPlay}
      onPause={onPause}
      onEnded={onEnded}
    />
  );
}
