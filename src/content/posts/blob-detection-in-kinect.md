---
title: "Blob Detection in Kinect"
date: 2011-03-30T04:01:00.000Z
slug: "blob-detection-in-kinect"
tags: ["kinect", "hacking", "electronics"]
featureImage: "/blog/assets/images/2023/08/Screen-shot-2011-03-30-at-2.20.23-PM.png"
draft: false
---
After background removal, I've now completed the blob detection algorithm. After reading a bunch of blob detection papers, I ended up with my own (modified version of [http://geekblog.nl/entry/24](http://geekblog.nl/entry/24) ) method that is much faster and uses low CPU. The original code from the link was buggy and was only meant for multi touch detection. I've modified this idea to work with the kinect's depth data. However, I still have some problem where overlapped users/objects are tracked as single object in realtime.

See this image that shows the output. After blob detection, I've removed smaller blobs created by the noise escaped in the background removal code. It was much easier for me to filter the small ones out. In this image on the large objects (humans) are tracked.

My next step would be, to detect the nodes of each users. I might be using some clustering algorithms to detect nodes in the user's body. I've no clue if there is any straight forward algorithm for this.
