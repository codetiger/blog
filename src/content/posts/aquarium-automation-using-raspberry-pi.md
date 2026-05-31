---
title: "Aquarium automation using Raspberry Pi"
date: 2021-12-08T08:35:49.000Z
slug: "aquarium-automation-using-raspberry-pi"
tags: ["raspberry pi", "electronics", "Aquarium"]
draft: false
---
As a childhood desire, I always wanted to try setup an aquarium at my home. The desire was always there deep inside and never sparked until my daughter had to do some school activity on aquariums. So we decided to buy a small 10 liter aquarium tank with 3 molly fishes. To our surprise, the fishes started giving birth and the desire got intensified. So we planned to setup a 150 Liter large aquarium in our house and do some lanscaping with beautiful plants.

After 6 months of hardwork, we were able to reach to the below state. Please don't judge me on the landscaping skills. Our objective was to simulate the closest natural habitate of the fishes we had.

![](/blog/assets/images/2021/12/IMG_0571-1.jpeg)

### Challenges and why automation:

If you are an aquarium enthusiast like me and have tried planted tank, the challenges are going to be very obvious. You need to maintain lot of things like good bacteria level, CO2 level plants, O2 level for fishes, overall lighting for plants, fish food, and ofcourse plants need nutritions as well. The challenges grow from there to weekly water maintanence and trimming the plants. Overall, I got bit frustrated to repeatedly do lot of these things on a daily basis. As a programmer, my brain motivated to automate it. The overall challenge is to schedule various equipements based on below requirements.

1.  High intensity plant lights need to be switched on for only a few hours during the day.
2.  Low intensity light needs to be ON for an before and after plant lights are ON. Just to simulate dawn and dusk.
3.  CO2 needs to be ON around the same time as high intensity light as the plants will only consume CO2 when there is light. The CO2 tank needs to be switched off 30 mins before the high intesity lights to save CO2.
4.  Air pump to bring up the O2 level after the CO2 is OFF. O2 is essential for the fishes and plants at night, so the pump has to work all the time other than CO2 flow.
5.  Heavy duty filter needs to work only for few hours of the day as it should be enough to clean up the dirt and fish waste. There is another filter that work round the clock which is less powerful.
6.  Water cooler to bring down and maintain the water temperature during the day time. My location is mostly very hot during the day.
7.  Did I forget about feeding the fishes? Yes, I made a small feeder using a motor and food container with a small hole.

### Electronics:

The overall automation setup is very simple, as all these equipments already were connected to power and only needed manual swtching on and off. I decided to go with a Raspberry Pi 3 B+ and a relay controller module. The wiring is simple as the relay module needs to be connected to 8 GPIO pins for On/Off signal.

<figure>
  <img src="/blog/assets/images/2021/12/8-channel-relay-module-10a-640x640.jpg-copy.jpg" alt="" />
  <figcaption>Relay module</figcaption>
</figure>

The overall setup had the relay module connected to a power extension so the same setup can be reused in future. Below image shows the power extension with all exquipements connected and the cardboard box has the relay module and Raspberry Pi.

![](/blog/assets/images/2021/12/B43DBC96-DB56-4763-BC71-2BC4E0A62A80_1_105_c.jpeg)

### You should have lot of questions:

Why use a full blown computer while you can use a simple timer chip or micro controller for this?  
**Ans:** I've built a Web interface which will allow my family to manually override the config if needed and will also show the current state of the equipments. For example, we wanted the high intensity lights to be switched on if someone wants to take a look at the Aquarium. The below image shows the web page to control the individual equipments manually.

![](/blog/assets/images/2021/12/image-1.png)

On top of this, I've been already using this Raspberry Pi as a home server and local DNS server with PiHole software running. The whole source code is available in my [Github Aquarium project](https://github.com/codetiger/AquariumControl).

### Stability of the setup:

I've been running this setup for almost 3 years in a row without any issues. No wait, with all known issues fixed. And the Aquarium managed to last for 8 months without any human intervension during the Covid-19 country wide lockdown. We had to move to our native town early during the lockdown and couldn't goto the citi for 8 months. All we had was this automated setup that worked well and kept most fishes alive. The only manual work during the last 2 years, was changing water and refilling fish food once in 3 to 5 months.

> I would say, this was one of the remarkable works I've every done to save lives. :-)
