---
title: "RaLiSat-1 Payload system design"
date: 2021-12-12T01:03:11.000Z
slug: "ralisat-1-payload-design"
tags: ["RaLiSat-1", "Near Space", "electronics", "GPS", "lora", "raspberry pi"]
draft: false
---
To start with, I had basic goals for designing the payload system. Including basic sensors necessary for the tracking, camera to capture the beauty and the design to sustain the system at harsh climatic conditions in the sky.

### Goals for the first flight:

1.  Use a single board computer of smallest form-factor possible to record data
2.  Add a camera capable of taking pictures at 1 sec interval
3.  Add Temperature, humidity, and pressure sensors
4.  GPS module for tracking
5.  RF Module to transmit data to ground station
6.  Battery enough to power the flight time and beyond

With simple goals laid out, I started working on doing some research on each components. For my first flight, I wanted to keep things simple so I get the experience of actual difficulty in the first place. Obviously I've more ambitions on better things in future, but didn't want to keep designing things rather try something.

<figure>
  <img src="/blog/assets/images/2021/12/payload-design.png" alt="" />
  <figcaption>Flight computer design - RaLiSat-1</figcaption>
</figure>

### Raspberry Pi and Camera:

I decided to go with a Raspberry Pi Zero based payload system so I can do enough computing without my hands tied like in-case of microprocessors. Infact, RPi Zero was bit too much for my goal, however, it comes handy and I already had one from my previous projects. The main intension was to keep the design as plug-n-play as possible. I previous attempt in flight computer failed in 2008 primarily because of this reason. RPi camera was an easy option to decide as it is very compact and integration is easy.

### BME680 Environmental Sensors:

SeeedStudio's BME680 sensor module looked very impressive as it supports i2c interface and had all sensors I expected in one module. One downside, the pressure and temperature sensors had an operating range of 300-1100hPa and -40~+85 respectively. With a goal of reaching 25 kms altitude, the environment is going to be at -56 degree celsius and 25 hPa which are both out of the range of the sensors. However, beyond this reading it is very hard to find a sensor that is cheap with integration options as easy as this one. So I decided to go anyway and see how it works.

### GPS Module:

With no knowledge about how the pressure sensor will work beyond 300 hPa, the only other option is to use a GPS module that will work with target altitude. I chose UBlox M8N which had a max altitude of upto 50kms using the Airborne mode. Again this was another easy choice for me. The [UBlox M8N GPS module integration and source code](/blog/interfacing-ublox-gps-m8n-with-raspberry-pi/) are explained in this previous article.

### Lora E32-868T30D as RF module:

For tracking the flight, I wanted the GPS coordinates to be transferred to the ground station at frequent intervals. Lora was an easy choice and Ebyte E32 modules had UART interface which had lot of advatages. [Integrating E32-868T30D with Raspberry Pi is explained here](/blog/transfer-images-over-lora-e32-module/). The primary purpose was to send GPS co-ordinates but eventually I decided to send almost all data recorded including images through Lora module after seeing the capability. The source code and details are provided in [this article](/blog/sending-large-data-like-images-over-lora/). Making my program to efficiently use Lora to send large images and data took a lot of time.

### Battery:

I used an old, small and compact 6000 mAh power bank from my uncle and ripped-off the case to reduce the weight. The battery was able to last upto 5 hours which was more than sufficient for the entire flight time including tracking.

The modules were put-together to work and the entire source code took around 3 months to stabilise and fine-tune. The challenges faced in the design shall be discussed in another post. Stay tuned.
