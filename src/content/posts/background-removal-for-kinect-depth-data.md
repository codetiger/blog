---
title: "Background Removal for Kinect Depth data"
date: 2011-03-29T01:47:00.000Z
slug: "background-removal-for-kinect-depth-data"
tags: ["hacking", "kinect"]
featureImage: "/blog/assets/images/2023/08/background-removal.png"
draft: false
---
I am wondering if am atleast 10% towards completion of the skeletonization code. However, here is the best background detection and removal, I could do. This code is not based on any standard bg removal algorithm. I tried to implement more than 5 standard algorithms for background detection but they didn't work well for Kinect's output. They were all meant more for rgb data, so I started working on my own bg detection algorithm. And here is the output.

Yes, there is still some small portions that escape my bg removal code. I've decided to deal with them in blob detection. As it sounds much easier to remove smaller blobs. I am now working on a fast blob detection algorithm. I am yet to test this bg removal code on realtime conditions like larger room and many moving objects.
