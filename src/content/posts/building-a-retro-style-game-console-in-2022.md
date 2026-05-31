---
title: "Building a retro style game console from scratch"
date: 2022-03-12T06:52:34.000Z
slug: "building-a-retro-style-game-console-in-2022"
excerpt: "Game console built from scratch using RPi Pico micro controller and 2 inch LCD display"
tags: ["Pico", "electronics", "display", "GameTiger"]
featureImage: "/blog/assets/images/2022/03/A453673D-B98D-45DF-BA7E-D77E3AA4F09B_1_201_a-3.jpg"
draft: false
---
I have always been and will ever be, passionate about gaming. The very first thing that inspired me into electronics and computers, was the fun around playing and building games.

My most favourite hobby is programming a simple game whenever I pick up a new language or a computing platforms. To add some fun, this time, I wanted to build a small handheld gaming console from the scratch.

My family named this device "GameTiger" and the logo reflects it's name. I'll be talking about the logo more, later in the article. The device looks amateurish and I wanted to keep it that way for sometime until I can call the device complete, both in hardware and software.

### Hardware:

The entire hardware is custom built and is based on Raspberry Pi Pico microcontroller. The choice of the MCU is based on its simplicity, cost and support for various tools. I know very well that with my expert level soldering skills, I'll definitely fry a few components. So I wanted it to be cheap so I don't spend too much.

-   MCU RP2040
    -   32-bit dual ARM Cortex-M0+ Microcontroller
    -   133 MHz Clock speed
    -   264 KB SRAM
    -   2 MB flash storage
    -   26 GPIO pins
-   LCD display module by Waveshare
    -   Resolution: 240×320
    -   Color: 262K RGB (24bit RGB888)
    -   Interface: SPI
    -   Driver: ST7789
    -   Backlight: LED
    -   Operating voltage: 3.3V/5V
-   Tactile Buttons
-   LiPo SHIM for Pico by Pimoroni
    -   MCP73831 charger
    -   XB6096I2S battery protector
    -   Supports battery level measuring on VSYS pin
-   Witty Fox Li-Ion Battery
    -   Voltage: 3.7v
    -   Capacity: 1000 mAh

### Wiring:

The components are based on standard interfaces and thus nothing complicated in wiring. You can feel free to use different GPIO pins based on lot of tutorials but this is what I've used and configured in the software as default.

| Component | Pin | Pico GPIO | Description |
| --- | --- | --- | --- |
| LCD | VCC | VSYS | Power Input |
|  | GND | GND | Ground |
|  | DIN | GP11 | MOSI pin of SPI, data transmitted |
|  | CLK | GP10 | SCK pin of SPI, clock pin |
|  | CS | GP9 | Chip selection of SPI, low active |
|  | DC | GP8 | Data/Command control pin (High:data; Low: command) |
|  | RST | GP12 | Reset pin, low active |
|  | BL | GP13 | Backlight control |
| Buttons | Up | GPIO2 | Up button in the keypad |
|  | Down | GPIO0 | Down button in the keypad |
|  | Left | GPIO1 | Left button in the keypad |
|  | Right | GPIO3 | Right button in the keypad |
|  | A | GPIO4 | A (Action) button in the keypad |
|  | B | GPIO5 | B (Back) button in the keypad |
| LiPo SHIM |  |  | Directly mounted on Pico based on datasheet |

### Software:

Yes, you read it correct, the chip has only 264 KB RAM and that a lot less for these days. To explain the complexity in building the software, the framebuffer alone for storing the on-screen pixel details takes 153.6 KB (320 width \* 240 height \* 2 bytes). While the LCD display supports upto 262K colors, I decided to use only 2 bytes for each pixel to save the RAM usage. To store RGB888, the total memory needed is 230 KB which is more than 85% of the RAM size. Also, we can't do double buffering like most games do, the traditional way. Or even storing a sprite sheet of the size of the screen into the RAM is also not possible. Below are the list of modules I've built into the software.

-   Operating System Drivers
    -   Display driver over SPI using DMA (Direct Memory Access)
    -   Button interrupts
    -   Battery management system driver
-   Framebuffer Library
    -   Supports transparency
    -   Direct streaming to display memory (partial/full updates)
    -   Primitive shape drawing including Line, Circle, Rect and Fill Rect
    -   Supports drawing images with alpha channel
    -   All framebuffer operations support DMA (Direct Memory Access)
-   Sprite sheet
    -   Support for sprite sheet
    -   Basic tilemap support
-   Font system based on Sprite sheet
-   Menu system
    -   Dynamically loading games
    -   Hardware config
        -   Display brightness
        -   Display sleep time after inactivity
-   Filesystem
    -   Support for SD card module to load game assets

The most complex part of software was the frame-buffer implementation. There are 2 modes available for the games, one of-course using the framebuffer that takes 154 kbs of the RAM and update the display memory periodically, or just stream the changes directly to the display. The other complexity is using both the cores available in the chip. Unlike CPUs, the MCU cores are bit different in the way you can use threads in your code.

Just to give you an idea on the complexity again, the splash screen that shows the tiger logo uses full frame buffer and loads the image which is another 32 kb along with a basic font image which is 12 kb. The total RAM used is around 200 kbs already, so my code had to be written very carefully on variable usage and memory allocation. Ex: Use 8bit variable type whereever possible. I can't assume int by default for anything, as it takes 32 bits.

The sample game as always is Snake game very similar to what we use to have in Nokia 1100 handsets. The Frame-buffer is well optimised to achieve a target of 30 frames per second. The Snake game achieves more than 44 FPS on a default settings without overclocking.

### More to come:

I am planning to add more games to this hardware in future when I find time. Shall keep posting updates here. I am also planning to create a 3d printed case for this device to make it look more professional.

### Source code:

The entire source of [GameTiger Console](https://github.com/codetiger/GameTiger-Console) is available in Github. Feel free to share your feedback. Also share the games or applications you would like to see on this device.
