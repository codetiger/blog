---
title: "Home power consumption monitoring using ESP32"
date: 2021-12-28T02:19:57.000Z
slug: "home-power-consumption-monitoring-using-esp32"
tags: ["ESP32", "raspberry pi", "CT-sensor", "electronics"]
featureImage: "/blog/assets/images/2022/01/home-monitoring-grafana-dashboard.jpg"
draft: false
---
Its always fun to collect data around you and understand your needs better. When it comes to power consumption, end of the month bill gives us a pretty good view, but I wanted to make it slightly interesting. I wanted to collect power consumption every second in my house and see how the data looks like.

### Components used:

1.  ESP WROOM 32 MCU Module - ([Robu.in](https://robu.in/product/esp-wroom-32-wifi-bluetooth-networking-smart-component-development-board/))
2.  SCT-013-030 Non-invasive AC Current Sensor Clamp Sensor - ([Robu.in](https://robu.in/product/sct-013-030-non-invasive-ac-current-sensor-clamp-sensor-30a/))
3.  100k Ohm resistors - 2 pieces
4.  10uF capacitor - 1 piece
5.  3.5mm jack female connector - 1 piece

### Wiring diagram:

The wiring diagram were taken mostly from [this article](https://savjee.be/2019/07/Home-Energy-Monitor-ESP32-CT-Sensor-Emonlib/) and [OpenEnergyMonitor](https://openenergymonitor.org) project. The wiring diagram is same as the standard ones mentioned in these websites. I just didn't want to copy or redo the same as the other articles are already explaining these things at the best.

<figure>
  <img src="/blog/assets/images/2021/12/esp32-energy-monitor-front.jpg" alt="" />
  <figcaption>ESP32 Energy Monitor Circuit</figcaption>
</figure>

<figure>
  <img src="/blog/assets/images/2021/12/esp32-energy-monitor-back.jpg" alt="" />
  <figcaption>ESP32 Energy Monitor Circuit</figcaption>
</figure>

As you can clearly see, my soldering skills are not that great. :-)

### Software:

With not much changes in the hardware, I did a lot of research on making the software better. Especially with ESP32 having issues in accuracy with its ADC controller, I spent a lot of time making it better.  
I used the open source Emon library and added a look up table for my ESP32 ADC which gives a very good results in accurately measuring the analog input. As it is well known each ESP32 needs to be calibrated for ADC. While the recently manufactured ESP32 are calibrated at factory, I still didn't find it quite accurate in my case. So I calibrated and generated a look up table for my chip. The calibration code is available [here](https://github.com/e-tinkers/esp32-adc-calibrate).

The entire code is available here: [ESP32 Home energy monitoring](https://github.com/codetiger/PowerConsumptionMonitor-ESP32)

The ESP32 sketch works as a prometheus exporter making it easy to log the data easily in timeseries. Prometheus also has been my personal favourite in terms of resource usage.

![](/blog/assets/images/2021/12/energy-monitor-grafana.jpg)

Finally the data is available in Grafana. As I already have a Raspberry Pi running in my house for various other things, I added Prometheus and Grafana for monitoring the energy consumption as well.

### Final packing:

<figure>
  <img src="/blog/assets/images/2021/12/E391E3DB-AEEA-4FEA-B16F-1BF1C112E07D_1_105_c.jpeg" alt="" />
  <figcaption>ESP32 + SCT-13-030 CT sensor for home power monitoring</figcaption>
</figure>
