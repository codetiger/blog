---
title: "RaLiSat-1 design challenges - Payload internal temperature"
date: 2021-12-14T02:01:02.000Z
slug: "ralisat-1-payload-design-challenges"
tags: ["RaLiSat-1", "Near Space", "raspberry pi", "electronics"]
draft: false
---
As we know, the higher you reach in altitude, the lower the temperature and pressure is. At around 25 kms which is my target for this project, the temperature is -56°C. This is way beyond the range of operating temperature for any commercial electronic.

**Generic Solution:** Most projects use a Polystyrene boxes and add a heat source like hand warmer to keep the container within the right temperature. This approach further increases the size of the payload and the weight.

**Solution Used:** As a design target, I wanted the payload weight to be less than 240 grams. Primary reason is to use as less helium as possible and use 350 gram balloon. I built a styrofoam cube using layered sheets with all electronic components within each layer and enclosed it. The components were fitted within small engraving in the layers and used super glue to fit the layers perfectly. Obviously the GPS ceramic antenna, environment sensor, camera and Lora antenna had to be left outside. The overall design looks like the below image.

![](/blog/assets/images/2021/12/IMG_5967.jpg)

**Test Scenarios:** To test the design, the primary approach I tried was, leaving the system inside a freezer (-20°C) to see the min/max CPU temperatures for upto 2 hours. My test criteria was to keep the CPU temperature between 35°C and 75°C. This is very hard to accomplish, as the Raspberry Pi Zero does not have any airflow and easily reached 75°C even when put inside the freezer. Then I make lot of performance tuning to the system to balance the CPU usage and heat produced. At a certain point, I was able to see the temperature was stable at most environmental conditions. I tested in direct sunlight, inside the freezer and room temperature, and the CPU temperature in all conditions were well within the range.

### Conclusion:

Finally I was able to reach a point where, I had to never worry about the internal temperatures reaching unexpected ranges. But remember, I took around a month to stablise this. I tried to under-clock the Raspberry Pi, but gave up on that option as it reduced the heat generation drastically and the internal CPU temperatures reached unexpected low 10°C within 25 mins in the freezer. I couldn't reach a stable temperature range with enough computing power when under-clocking the RPi. I did try writing a CPU intensive bash script which will run for few seconds to increase the temperature if it went below certain range.

> Finally, understanding what part of the code produces more heat and configuring how often it can run, helped solve this problem.

The GPU usage, especially the camera image capture and resizing part was the one which produced enough heat, to make it work. The entire code is available in my GitHub project [RPi-Hab](https://github.com/codetiger/rpi-hab)
