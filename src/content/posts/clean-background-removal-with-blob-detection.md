---
title: "Clean Background removal with blob detection"
date: 2011-03-31T00:52:00.000Z
slug: "clean-background-removal-with-blob-detection"
tags: ["kinect", "hacking"]
featureImage: "/blog/assets/images/2023/08/cleanBGRemoval.png"
draft: false
---
Yes, am a little ahead in the background removal. I have now removed the background noise that escaped from my first layer background removal algorithm. I've added a second layer of background removal that removes smaller moving particles without hassle. Now the blob detection is more meaningful. I am also working on an advanced blob detection to solve some problem I am facing with the current one.

Am also wondering how I can detect overlapping blobs that lie in the same distance from the Kinect. Ofcourse, its easy to separate blobs that are at different distances, but when 2 users shake their hands, I am wondering if I can detect them as different blobs.
