---
title: "Skeleton detection code for Kinect"
date: 2011-03-15T06:36:00.000Z
slug: "skeleton-detection-code-for-kinect"
tags: ["hacking", "kinect"]
draft: false
---
As I promised earlier, I am now working on a Skeleton detection code that can work independently on any device. It will mostly be on c and c++ so it can be ported on to any platform. I have decided to split the code into different modules.

1.  **Background removal**: I have an idea on background removal technique that will self learn during run time and does not require capturing empty background. This technique is simple and I've started working on implementing this now. Will soon post some videos on this.
2.  **Blob detection**: I am planning to adopt some algorithm for blob detections. I've not decided on which one yet, but I am going to start from edge detection algorithm.
3.  **Skeleton tracking**: This part, am still clueless right now. But I am sure I'll find some decent way to atleast detect hands and head. This is still a dream right now.

The whole objective of this project is to make a Skeleton detection program that uses Kinect's output and does not require any calibration posture like in OpenNI. Will post the progress here soon.
