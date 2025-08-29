import { useEffect, useState, useRef } from 'react'
import './App.css'

function App() {
  const [videos, setVideos] = useState([]);
  const [current, setCurrent] = useState(0);
  const [_isLoading, _setLoanding] = useState(true); // Estado de loading no te olvides de colocar al final


  const videoRefs = useRef([]);
  const cardRefs = useRef([]); 
  const containerRef = useRef(null);
  let isLoadingMore = useRef(false);
  let limit = useRef(5);
  let offset = useRef(0);


async function fetchdata(offset = 0, limit = 5) {
  try {
    const res = await fetch(`http://localhost:8080/videos?limit=${limit}&offset=${offset}`);
    const data = await res.json();
    setVideos((prev) => [...prev, ...data.subArray]);
  } catch (err) {
     console.error(err);
  }
}

useEffect(() => {
  fetchdata();
}, [])

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
      { threshold: 0.1 } 
    );

    const currentRefs = videoRefs.current;
    currentRefs.forEach((video) => {
      if (video) observer.observe(video);
    });

    return () => {
      currentRefs.forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos, current]); 


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
            offset.current = limit.current;
            limit.current += 5;
          });
          observer.unobserve(entry.target);
        }
      });
    }, options);

    const lastvideo = cardRefs.current[videos.length - 1];

    if (lastvideo) {
      observer.observe(lastvideo);
    }

    return () => {
      observer.disconnect(); 
    }
  }, [videos.length]);


  useEffect(() => {
    videoRefs.current.forEach((videoEl, i) => {
      if (!videoEl) return;

      if (i === current) {
        videoEl.play().catch(error => console.log("El navegador bloqueó la reproducción automática:", error));
      } else {
        videoEl.pause();
        videoEl.currentTime = 0; 
      }
    });
  }, [current]); 

  return (
  <div id='main-container' ref={containerRef}>
          { 
            videos.map((video, i) =>  (
                  <div id='container' key={i}
                    ref={(el) => (cardRefs.current[i] = el)}
                  >
                    <video
                      src={video.url}
                      ref={(el) => videoRefs.current[i] = el}
                      loop
                      data-index={i}
                      autoPlay={i == current}
                      controls
                      muted
                      id='video'
                    />
                  </div>
              )
            )
          }
        </div>
  ) 
}

export default App