# Infinite Scroll In React

All the logic is in the client folder: client/src/App.jsx

It's a good starting point for your own projects.
I couldn't find much information on it, but this article was very helpful: 
https://dev.to/easyvipin/reactjs-tutorial-infinite-scrolling-with-intersection-observer-kp3


That article was a mind map to work with.

Currently, this only displays 10 videos. When the end of the list of divs is rendered, the request is executed.
I use query parameters because I think it will be easier, but I don't know.
Videos that don't appear in the view are paused, but not removed. I'll work on this soon.

## Setup

The server run on: http://localhost:8080
And the client... I don't remember.


Install first on the backend and then on the client, not in the root folder.


``
  npm i 
``
