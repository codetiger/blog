---
title: "Sending large data like images over Lora"
date: 2021-12-06T07:43:23.000Z
slug: "sending-large-data-like-images-over-lora"
tags: ["lora", "raspberry pi", "electronics"]
draft: false
---
Got obsessed with the Lora module E32-868T30D after playing with it for couple of months now. To be honest, this seemed to me like a life saver for hobbyists to start on RF. My previous attempts failed with I had to add RF to my projects. This time it was mostly a plug and play with simple configurations.

### Speed:

I read everywhere saying Lora is for smaller data packets and are not meant for larger data like images. There were some calculations showing Lora would take hours or days to transfer a single image. These are not fully true and are mostly limited to certain providers. In my project I needed a P2P data transfer and it worked just fine.

Initially I started with transfering 40 bytes of sensor data every 5 seconds which worked just fine. After analysing the logs, I found that the Chip completes the air transmission in few milliseconds and just waits for more data. So I decided to push more data by breaking an image into chunks and rebuilding it on the receiver size.

An image of size 38KB takes me around 5 mins to transfer with enough delay inbetween to avoid the buffer overflows. There is no easy way to calculate the exact delay needed for each chunk to get transfered, or depending on AUX alone as well did not help my case much. So I've implemented a hybrid aproach that worked for me.

![](/blog/assets/images/2021/12/latest-7.jpg)

### Acknowledgement:

In my implementation, the Lora class accepts file size of upto few megabytes and internally splits and sends it in chunks. The sender ensures if the chunk was received successfully by marking the chunk after getting an acknowledgement. The reason why AUX alone didn't work for me was, both the transceivers had to send and receive messages and the module didn't support duplex transmission. So a predefined interval of delay helped in my case. Otherwise, the 38KB image can be transferred in less than a minute.

### Implementation:

The source code is available in my [Github project](https://github.com/codetiger/rpi-hab/blob/main/lora.py). The Lora class uses SQLite for keeping track of chunks and acknowledgements. This class is the same as explained in my previous post where I've explained the basics [integrating E32-868T30D with Raspberry Pi](/blog/transfer-images-over-lora-e32-module/)

Using this implementation, I've run the project for couple days in a row and there was no issue in buffer overflow. So this code is tested well but feel free to improve if you can find issues.
