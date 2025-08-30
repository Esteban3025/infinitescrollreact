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
    const url = "https://www.reddit.com/r/pornrelapsed/.json";
    const response = await fetch(url);
    const data = await response.json();
    const post = data.data.children;
    
    const videos = post.map(p => {
      const d = p.data
      let link;

      // console.log(d.secure_media_embed?.media_domain_url);

      if (d.preview?.reddit_video_preview) {
        link = d.preview.reddit_video_preview.fallback_url;
      } else if (d.secure_media_embed?.media_domain_url) {
        link = d.secure_media_embed.media_domain_url;
      } else {
        link = d.secure_media_embed.media_domain_url;
      }

      return {
        title: d.title,
        subreddit: d.subreddit,
        url: link
      }
    })
    .filter(Boolean);
    res.json(videos);
  } catch (err) {
    console.log("Hubo un error:", err);
  }
});


app.listen(PORT, () => {
  console.log(`Server runing in http://localhost:${PORT}`);
});