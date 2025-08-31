import express, { response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors("*"));

app.get("/", (req, res) => {
  res.json({change: "hello"});
})

app.get("/videos", (req, res) => {
  const baseUrls = [
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  ];

  const urlsArray = [];
  const limit = req.query.limit || 5;
  const offset = req.query.offset || 0;

  for (let i = 0; i < 25; i++) {
    const idx = i % baseUrls.length;
    urlsArray.push({
      name: `video${i + 1}`,
      url: baseUrls[idx],
      id: i + 1
    });
  }
  const subArray = urlsArray.slice(offset, limit);
  res.json({ subArray });
});


app.get("/api", async (req, res) => {
  try {
    const url = "https://www.reddit.com/r/damngoodinterracial/.json";
    const response = await fetch(url);
    const data = await response.json();
    const post = data.data.children;
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 5;
    
    const videos = post.map(p => {
      const d = p.data;


      // console.log({
      //   url: d.preview?.reddit_video_preview?.hls_url,
      //   photo: d.secure_media?.oembed?.thumbnail_url
      // });

      if (d.preview?.reddit_video_preview) {
        return {
          id: d.name,
          title: d.title,
          subreddit: d.subreddit,
          url: d.preview?.reddit_video_preview.hls_url,
          photo: d.secure_media?.oembed?.thumbnail_url
        }
      } else if (d.secure_media?.reddit_video?.hls_url) {
        return {
          id: d.name,
          title: d.title,
          subreddit: d.subreddit,
          url: d.secure_media?.reddit_video?.hls_url,
          photo: d.secure_media?.oembed?.thumbnail_url
        }
      }
      return null
    })
    .filter(Boolean);
    res.json(videos.slice(offset, limit));
    } catch (err) {
      console.log("Hubo un error:", err);
    }
});

app.listen(PORT, () => {
  console.log(`Server runing in http://localhost:${PORT}`);
});