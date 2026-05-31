---
title: "PowerTiger - Monitoring energy consumption with better granularity"
date: 2024-09-04T23:01:05.000Z
slug: "powertiger-monitoring-energy-consumption-with-better-granularity"
tags: ["electronics", "raspberry pi", "monitoring", "home", "iot"]
featureImage: "/blog/assets/images/2024/09/pcb-render.png"
draft: false
---
A few years before the Covid pandemic, I set out to apply my tech skills to everyday life with the goal of enhancing my lifestyle. Having worked extensively in product development, I found that tracking key metrics often led to long-term improvements. After repeatedly seeing the benefits at work, I realized it was time to use these skills for personal growth. While the Covid lockdown made things more challenging, it also gave me plenty of time to reflect and plan.

After running my initial [home energy monitoring](/blog/home-power-consumption-monitoring-using-esp32/) setup for nearly three years, I decided it was time to revisit and enhance the project. My priorities have shifted, and now I aim to capture data with much higher granularity—ideally down to each individual electric terminal, which would provide insight into specific devices. Going beyond that would require significant changes to the electrical setup, so monitoring each terminal became the most practical solution.

Adding a CT sensor to each terminal can be easily done at the home’s power distribution board, where all the terminals converge. This setup allows for convenient interfacing of all the CT sensors in one location, achieving the desired level of detail. In Indian homes, each room typically has a dedicated circuit breaker for its terminals, often split for high-power appliances like geysers or air conditioners. This arrangement simplifies the process of obtaining granular data by focusing on the master distribution board.

At my home, we have 16 circuit breakers in the distribution board, so I set out to build a device capable of monitoring all 16 circuits. Initially, I planned for 20 interfaces, including the main 3-phase entry points, but the PCB design became unnecessarily complex beyond 16 channels. To keep the design manageable, I decided to cap it at 16 while also incorporating the flexibility for future expansion. The board is designed to be easily multiplexed, allowing for additional channels if needed down the line.

![](/blog/assets/images/2024/09/schematic.jpg)

Having gained solid experience in designing custom PCBs, I decided to create one for this project. At the core of the device is an I2C multiplexer (PCA9546 by Texas Instruments), which interfaces with eight ADCs—analog-to-digital converters (ADS1115 by Texas Instruments). Each ADC is connected to a pair of 3.5mm audio jacks, where the CT sensors are plugged in. Despite the relatively high cost of these ICs, I chose them to ensure the board maintains the highest quality and performance standards. There are many cheaper alternatives available that could be considered if top-tier quality isn’t the primary concern. However, for this project, I opted for more reliable, higher-quality components to ensure accurate and consistent performance over time.

![](/blog/assets/images/2024/09/board-layout.png)

The board layout isn’t visually perfect, but it serves its purpose well and allows for easy installation. My one regret is the spacing between the audio jacks, which is a bit tight, making it challenging to plug in all the sockets at once. However, aside from that, the rest of the design turned out flawless, even in the first batch of fabrication.

![](/blog/assets/images/2024/09/powertiger-case.jpg)

In my setup, the PCB is connected to my favorite MCU module, the Raspberry Pi Pico W, via I2C connections. Since I already have a home server handling various tasks, I decided to go with an MCU-based setup featuring WiFi capability. The home server polls the device to collect data. Once again, I used my go-to tools: Prometheus for data gathering and storage, and Grafana for visualization and UI access, making it easy to monitor and analyze the collected data.

![](/blog/assets/images/2024/09/PowerTiger-Grafana-Dashboard.png)

The final output of the setup is a Grafana dashboard, which provides a clear and interactive interface for visualizing the data. Through this dashboard, I can easily monitor energy usage across different circuits in real-time, track trends, and identify patterns. Grafana’s flexibility allows me to customize the graphs and layouts, giving me full control over how the data is presented. This makes it simple to dive deep into specific metrics or view the overall energy consumption at a glance, completing the home energy monitoring system with an intuitive and powerful visual tool.

The PCB is available for purchase through the link below. Please note that this board is not mass-produced or intended for large commercial distribution. Additionally, I prioritized quality over cost, opting for higher-quality ICs instead of cheaper alternatives. As a result, the price is currently higher. I’m also collaborating with local vendors to make this module more accessible in India, and I’m hopeful that this will help reduce costs and improve availability soon. Stay tuned for updates on that front!

Tindie link: [https://www.tindie.com/products/35688/](https://www.tindie.com/products/35688/)
