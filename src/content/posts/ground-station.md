---
title: "RaLiSat-1 Base station system design"
date: 2021-12-14T05:52:19.000Z
slug: "ground-station"
tags: ["Near Space", "RaLiSat-1", "raspberry pi", "lora", "electronics"]
draft: false
---
For my high altitude balloon project, I am designing a portable base station system to recieve the transmission from the payload.

### Hardware:

The base station is a Raspberry Pi 3B+ based system with Lora module E32-868T30D from manufacturer Ebyte. This is very much the same module that I've used in the payload for transmission. I've also added an active buzzer to sound a beep whenever the system receives location data which is designed to happen every 5 seconds. The buzzer helped a lot during the testing phase when I had to keep this constantly running in various conditions. I believe this will help during actual flight as well, as the chasing is going to be continuous.

### Software:

The software system is basically simple and uses the same Lora classes from the [payload source code](https://github.com/codetiger/rpi-hab/blob/main/habmonitor.py). The objective is to just wait for data from the payload and send acknowledgement. Internally the payload sensor data is decoded and stored in InfluxDB. I am using Grafana integrated to InfluxDB, to pull a beautify dashboard for quick data visualisation.

<figure>
  <img src="/blog/assets/images/2021/12/RaLiSat-1-base-station-grafana-dashboard-1.jpg" alt="" />
  <figcaption>Grafana Dashboard - High altitude balloon project - RaLiSat-1</figcaption>
</figure>

### Payload chasing plan:

The idea is to use the base station system connected with a Wifi dongle and a power-bank, so the Grafana dashboard can be accessed using a laptop. The Map shows the latests position of the payload and will help chase it during the return fall. Hoping this will work! Stay tuned for the final results.
