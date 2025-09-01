import { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(0);
  const [volume, _setVolume] = useState(0.5);
  const [page, setPage] = useState(1); 

  const cardRefs = useRef([]);
  const containerRef = useRef(null);
  const videoRef = useRef();
  const isLoadingMore = useRef(false);

  // 🚀 Fetch desde tu endpoint backend
  async function fetchData() {
    if (isLoadingMore.current) return;

    isLoadingMore.current = true; // ✅ Marcar que está cargando

    try {
      const res = await fetch(`http://localhost:8080/api/videosclean?page=${page}`);
      const data = await res.json();
      
      // ✅ Verificar si hay datos antes de agregar
      if (data && data.length > 0) {
        setVideos(prev => [...prev, ...data.filter(v => v.url)]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      isLoadingMore.current = false; // ✅ Liberar el flag
    }
  }

  useEffect(() => {
    fetchData();
  }, [page]); // ✅ page como dependencia

  // Scroll infinito
  useEffect(() => {
    if (videos.length < 2) return; // ✅ Verificar que hay suficientes videos

    const options = { 
      root: containerRef.current, 
      rootMargin: '100px', // ✅ Más margen para cargar antes
      threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoadingMore.current) {
          console.log('Loading more videos...'); // Debug
          setPage(prevPage => prevPage + 1);
        }
      });
    }, options);

    // ✅ Usar el penúltimo video como trigger (más seguro)
    const triggerIndex = Math.max(0, videos.length - 3);
    const target = cardRefs.current[triggerIndex];
    
    if (target) {
      observer.observe(target);
      console.log(`Observing video at index ${triggerIndex}`); // Debug
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [videos.length]); // ✅ Dependencia correcta

  // Actualizar video actual
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setCurrent(index);
          }
        });
      },
      { threshold: 0.3 }
    );

    cardRefs.current.forEach(card => {
      if (card) observer.observe(card);
    });

    return () => {
      cardRefs.current.forEach(card => {
        if (card) observer.unobserve(card);
      });
    };
  }, [videos.length]);

  console.log('Current video:', current);
  console.log('Current page:', page);
  console.log('Total videos:', videos.length);
  console.log('Is loading:', isLoadingMore.current);

  return (
    <div id="main-container" ref={containerRef}>
      {videos.map((video, i) => (
        <div
          className="container"
          key={`${video.id}-${i}`}
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
            style={{ 
              height: '100vh', 
              backgroundColor: 'black', 
              scrollSnapAlign: 'start' 
            }}
            preload="none"
          />
          <p>{video.title}</p>
          <p>ID: {video.id} | Index: {i}</p>
        </div>
      ))}
      
      {/* ✅ Mostrar indicador cuando realmente está cargando */}
      {isLoadingMore.current && (
        <div className="loading-indicator">
          <p>Cargando más videos...</p>
        </div>
      )}
    </div>
  );
}

export default App;