---
title: "Remote ePaper display using ESP32"
date: 2022-01-28T21:30:10.000Z
slug: "remote-epaper-display-using-esp32"
tags: ["electronics", "ESP32", "raspberry pi", "ePaper", "eInk", "display"]
featureImage: "/blog/assets/images/2022/01/E695CC21-D1FA-4CEA-865C-77B266A02730_1_105_c.jpeg"
draft: false
---
I had a 7.8 inch ePaper display from Waveshare lying around for a while. This is an expensive eInk display with 1872x1404 pixel resolution that supports 4 bit grayscale values.

**Objective:** Building a photo frame with the content streamed from my home server built using a Raspberry Pi. The RPi will stream family pics available in the storage and intermittently show home power consumption dashboard on screen.

**Challenges:** As with any project, this one had very particular challenge of keeping the hardware simple. ESP32 has Wifi support but not enough RAM to hold the frame buffer needed. The display has 2628288 pixels each needs 4 bit which makes it 1.25 MB. The MCU that is going to drive the display needs at least 1.25MB as a frame buffer. The reason for this expectation is, the display needs the data available to the driver in a sequence of commands.

Our powerful ESP32 has only 500 KB of RAM and not all is available to the program. The display is driven by IT8951 chip module. The available driver for IT8951, open sourced by the device manufacturer does not support streaming or ESP32 chip. Their code assumes the entire image buffer is available before pushing it to the driver.

After taking a look at how the code works, I had some hope that this can be achieved by rewriting the code. However, the chip and the display were going to be powered using battery and needs to be as efficient as possible. I had to rewrite most part of the buffering and remove the need to RAM.

I used a TCP connection between RPi and ESP32. My ESP32 code will listen to TCP port 8319. The RPi code is written using python and configured as a cron job. Every time the code randomly pushes an image from a given directory. The whole post processing like resizing and color conversion had to be done at RPi as this cannot be handled in the ESP32 for lack of RAM. The ESP32 code receives the sequence of bytes from RPi and directly streams it to the IT8951 module. I was able to achieve this easily and got an image displayed on screen. Please ignore the noise in the image which comes from encoding issue which I solved later.

![](/blog/assets/images/2022/01/FE4A22F8-115B-4A3A-BF47-174564B4F3F0_1_105_c.jpeg)

After fixes the noise issue, and getting a proper image on screen, I had another challenge. It took upto 30 seconds to stream a full size image from RPi which is way too much for what we are doing. I realised the TCP overhead for each packet added-up and eventually slowed down the whole thing.

I added intermediate buffering. Our ESP32 has some RAM which cannot be ignored. So I decided to buffer the data stream which should speed up the task. Instead of reading each byte from the TCP socket, I configured the code to read a buffer of 1KB. The buffer size is configurable. After reading the buffer, TCP socket is free to receive more data and meanwhile, I can push the data to IT8951. When trying with 1KB, I was able to stream the content in less than a second which was my target.

The reason for having 1 second as a target is, the refresh rate of the display is more than a second, so I anyway have to wait for the display to get ready. Finally the streaming worked perfect and but images had some issue. If you notice the below picture, you see the text pixelated. This was definitely not how the image looked.

![](/blog/assets/images/2022/01/FE91959F-EABF-4F1A-A4E8-D2D6E151ACEC_1_105_c.jpeg)

After fighting for a whole day, I figured out that I was sending the pixel data in BIG Endian formate which the device was configured to receive in LITTLE endian format. After fixing this issue, the picture looked perfect on screen. unfortunately many open-source drivers available in Github has similar issue. The issue does not show-up well when you display an image, but is very much noticeable when you display text.

![](/blog/assets/images/2022/01/0EB99228-8C55-4F3A-83AD-CC8C73C0F983_1_105_c.jpeg)

In the picture above, I've scrapped the Grafana dashboard and streamed it to the display. I used selenium to take screenshot of the page and used the same code to push it to the display. The entire source code is available [here](https://github.com/codetiger/ePaper-display-using-ESP32).
