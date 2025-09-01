import express, { response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import {supabase} from './client.js';

dotenv.config({ path: '/env' })

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


app.get("/api/videosclean", async (req, res) => {
  const limit = req.query.limit || 3;
  const offset = req.query.offset || 0;

  let { data: videosclean, error } = await supabase
  .from('videosclean')
  .select('*')
  .range(offset, limit);
  
  
  res.send(videosclean);
});

app.listen(PORT, () => {
  console.log(`Server runing in http://localhost:${PORT}`);
});