#Phone A Friend#
`phone-a-friend` is a library utilizing service-workers and WebRTC in order to offload retrieval of assets from the server to other peers on the network.

In brief the way that it works is:
 1. A service worker is registered
 2. It intercepts all HTTP requests (images, css, AJAX)
 3. It asks the server if it knows of anyone on the network who has that asset already
 4. If not, the service worker will load the asset as normal
 5. If there is, a P2P connection will be made with them and the asset will be requested from them
 6. That asset is then checked to ensure integrity and if found valid, will be used

This project has several goals
 1. Make it easy for developers to integrate into their project
  * Because it uses service workers, it does not require rewriting your application for all HTTP requests to be intercepted
 2. Ensure the integrity of assets loaded over the P2P network
  * Using the web crypto api, a file is hashed and checked against a hash provided by the server to ensure integrity
 3. Save bandwidth
  * Because we are loading assets via webRTC we can reduce bandwidth consumption on the server

###Getting Started###
To get started with this project:
 1. clone this repository
 2. install redis http://redis.io/topics/quickstart
 3. install nodejs/iojs https://nodejs.org/ https://iojs.org/en/index.html
 3. install peerjs globally `npm install -g peerjs`
 4. go into the server directory and run `npm start`
 5. go into the client directory and run `npm start`
 6. Pull up Chrome Canary and Chrome Beta and navigate to `http://localhost:8080/demo.html`
 7. Open your console in each browser and refresh each one a few times and watch them load assets from one another

Please contribute and help make this project even better!
