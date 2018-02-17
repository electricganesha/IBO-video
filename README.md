# Immersive Box Office - Video Conference

## Concept
Immersive Box Office (IBO) is an innovative ticket sale system, that transforms ticket purchase into an interactive and immersive experience. Through the most recent technologies of 3D for the web, IBO transports the buyer into an appealing and immersive 3D environment, simplifying the purchase of tickets, through a whole new navigation and virtual reality paradigm. Simultaneously, IBO simplifies the sales system through a web-based technology: WebGL, enabling a multi-platform and compatible usage. IBO intends to solve all the usability issues with current ticket sales systems, while rendering the whole process more interesting and desirable for end customers. IBO presents a series of innovative features like a 3D interactive interface, VR experience, Immersive Advertising and Multi-Platform compatibilities. 

On top of all this, IBO is also usable as a VR conference room, allowing speakers to broadcast live videos, or play deferred videos to a series of attendants. This is made using the latest WebRTC technologies, and has unlimited potential, in the areas of education, video-conferencing, and many others.

This version of IBO (IBO-video) is an implementation of WebRTC inside the original IBO concept. With this, we achieve a video-conference environment inside the virtual room, rendering it able to host video-conferences in virtual reality.

## Tech
IBO-video was developed in HTML/CSS/Javascript using the [Three.js](https://threejs.org/) framework and the [Peer.js](http://peerjs.com/) framework.

## Demo 
* [Client](https://pushvfx.com:1409/demos/p4ptest/) - with password "playroom" in order to access the demo
* [Admin](https://pushvfx.com:1409/demos/p4ptest/admin.php)

### Instructions for the Demo
In order to fully experience this implementation of IBO, you will need to connect with two or more devices - one pretending to be a host (admin) which will be streaming the video to the clients, and the remaining devices pretending to be clients, which will be in the virtual room watching the host's streamed video. 

To do this, you will first need to access the Admin page, and choose a name for yourself, and a name for the conference room. 

Secondly, access, once or more, the client page (you can even open several tabs in your browser) and choose the live conference that is being streamed - with the same name that you chose in the admin section. 
