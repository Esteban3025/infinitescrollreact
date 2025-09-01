import { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(0.5);

  const cardRefs = useRef([]);
  const containerRef = useRef(null);
  const videoRef = useRef();

  const isLoadingMore = useRef(false);
  const limit = useRef(5);
  const offset = useRef(0);

  // 🚀 Fetch desde tu endpoint backend
  async function fetchData() {
    try {
      const res = await fetch(`http://localhost:8080/api/videosclean?limit=${limit.current}&offset=${offset.current}`);
      const data = await res.json();
      setVideos(prev => [...prev, ...data.filter(v => v.url)]);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    console.log("limit in fetch", limit.current);
    console.log("offset in fetch", offset.current);
    fetchData();
  }, []);

  // Scroll infinito
  useEffect(() => {
    const options = { root: containerRef.current, rootMargin: '0px', threshold: 0.5 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoadingMore.current) {
          isLoadingMore.current = true;
          fetchData(offset.current, limit.current).finally(() => {
            isLoadingMore.current = false;
            offset.current += limit.current;
          });
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const lastVideo = cardRefs.current[videos.length - 1];
    if (lastVideo) observer.observe(lastVideo);

    return () => observer.disconnect();
  }, [videos]);

  // Actualizar video actual
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setCurrent(Number(entry.target.dataset.index));
        });
      },
      { threshold: 0.3 }
    );

    cardRefs.current.forEach(card => card && observer.observe(card));

    return () => cardRefs.current.forEach(card => card && observer.unobserve(card));
  }, [videos.length]);

  console.log("limit", limit.current);
  console.log("offset", offset.current);

  return (
    <div id="main-container" ref={containerRef}>
      {videos.map((video, i) => (
        <div
          className="container"
          key={video.id}
          ref={(el) => (cardRefs.current[i] = el)}
          data-index={i}
        >
          <ReactPlayer
            src={video.url}
            ref={videoRef}
            loop
            playing={i === current}
            controls
            muted
            volume={volume}
            style={{ height: '100vh', backgroundColor: 'black', scrollSnapAlign: 'start' }}
            preload="none"
          />
        </div>
      ))}
    </div>
  );
}

export default App;
