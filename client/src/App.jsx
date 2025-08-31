import { useEffect, useState, useRef } from 'react'
import './App.css'
import ReactPlayer from 'react-player'
import Hls from "hls.js";

function App() {
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(0);
  const [volume, _setVolume] = useState(0.5);
  const [_isLoading, _setLoanding] = useState(true); // Estado de loading no te olvides de colocar al final

  const cardRefs = useRef([]); 
  const containerRef = useRef(null);
  let isLoadingMore = useRef(false);
  let limit = useRef(3);
  let offset = useRef(0);

  const videoRef = useRef();

  useEffect(() => {
    const hls = new Hls({
      debug: true,
      liveSyncDuration: 10,
      liveMaxLatencyDuration: 30,
      startLevel: 2
    });

    

    if (Hls.isSupported() && videoRef.current) {
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
      hls.currentLevel = 2; // 🔹 fuerza a usar solo esa resolución
      });
      hls.on(Hls.Events.ERROR, (err) => {
        console.log(err);
      });
    } else {
      console.log("load");
    }
    return () => {
      hls.destroy();
    };
  }, []);

async function fetchdata(offset = 0, limit = 5) {
  try {
    const res = await fetch(`http://localhost:8080/api?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    setVideos((prev) => [...prev, ...data]);
  } catch (err) {
     console.error(err);
  }
}

useEffect(() => {
  fetchdata();
}, []) 


  useEffect(() => {
    const options = {
      root: containerRef.current,
      rootMargin: "0px",
      threshold: 0.5,
    };
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoadingMore.current) {
          isLoadingMore.current = true
          fetchdata(offset.current, limit.current).finally(() => {
            isLoadingMore.current = false;
            offset.current += limit.current;
          });
          observer.unobserve(entry.target);
        }
      });
    }, [options]);

    const lastvideo = cardRefs.current[videos.length - 1];

    if (lastvideo) {
      observer.observe(lastvideo);
    }

    return () => {
      observer.disconnect(); 
    }
  }, [videos]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setCurrent(index);
          }
        });
      },
      { threshold: 0.3 } 
    );

    cardRefs.current.forEach((card) => {
    if (card) observer.observe(card);
  });

  return () => {
    cardRefs.current.forEach((card) => {
      if (card) observer.unobserve(card);
    });
    };
  }, [videos.length]);

  console.log("limit", limit.current);
  console.log("offset", offset.current);

  const handleResetVideo = () => {
        if (videoRef.current) {
          videoRef.current.seekTo(0, 'seconds'); // Resets to the beginning
          // Or, to seek to a specific time, e.g., 30 seconds:
          // playerRef.current.seekTo(30, 'seconds');
        }
  };

  return (

  <div id='main-container' ref={containerRef}>
    
          { 
            videos.map((video, i) =>  (
                  <div className='container' key={i - 1}
                    ref={(el) => (cardRefs.current[i] = el)}
                    data-index={i}
                  >
                    <ReactPlayer
                      src={video.url}
                      ref={videoRef}
                      loop
                      playing={i === current ? true : null}
                      controls={true}
                      muted
                      volume={volume}
                      style={{height: '100vh',
                        backgroundColor: 'black',
                        scrollSnapAlign: 'start',
                      }}
                      config={{
                        startLevel: 2,
                      }}
                      
                      preload='none'
                    />
                  </div>
              )
            )
          }
        </div>
  ) 
}

export default App