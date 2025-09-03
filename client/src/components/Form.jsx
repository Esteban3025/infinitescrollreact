import { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import '../App.css';

function Form() {
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(0);
  const [volume, _setVolume] = useState(0.2);
  const [page, setPage] = useState(1); 

  const cardRefs = useRef([]);
  const containerRef = useRef(null);
  const videoRef = useRef();
  const isLoadingMore = useRef(false);
  const triggerIndex = Math.max(0, videos.length - 4);
  const _target = cardRefs.current[triggerIndex];

  async function fetchData() {
    if (isLoadingMore.current) return;

    isLoadingMore.current = true; 

    try {
      const res = await fetch(`http://localhost:8081/api/videosclean?page=${page}`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        setVideos(prev => [...prev, ...data.filter(v => v.url)]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      isLoadingMore.current = false; 
    }
  }

  useEffect(() => {
    fetchData();
  }, [page]);


  // Scroll infinito
  useEffect(() => {
    if (videos.length < 2) return; 

    const options = { 
      root: containerRef.current, 
      rootMargin: '100px', 
      threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoadingMore.current) {
          setPage(prevPage => prevPage + 1);
        }
      });
    }, options);

    const triggerIndex = Math.max(0, videos.length - 4);
    const target = cardRefs.current[triggerIndex];
    
    if (target) {
      observer.observe(target);
      console.log(`Observing video at index ${triggerIndex}`); 
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [videos.length]);

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

  
  return (
    <div id="main-container" className='ml-[30%]' ref={containerRef}>

      {videos.map((video, i) => (
        <div
          className="container"
          key={`${video.id}-${i}`}
          ref={(el) => (cardRefs.current[i] = el)}
          data-index={i}
        >
          <ReactPlayer
          id='video'
          className=' bg-black snap-y snap-start'
            src={video.url}
            ref={videoRef}
            loop
            playing={i === current}
            controls
            muted
            volume={volume}
            style={{ 
              height: '100vh', 
            }}
            preload="none"
          />
        </div>
      ))}

      {isLoadingMore.current && (
        <div className="loading-indicator">
          <p>Loading More...</p>
        </div>
      )}
      
    </div>

  );
}

export default Form;