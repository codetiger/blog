---
title: "Connecting Lora E32 module with Raspberry Pi"
date: 2021-12-01T04:12:26.000Z
slug: "transfer-images-over-lora-e32-module"
excerpt: "Article explaining how to connect Lora E32 module to Raspberry Pi device and python code to send data between 2 modules using Lora communication."
tags: ["lora", "raspberry pi", "electronics"]
draft: false
---
Recently, I've been reading about Lora and how RF industry has changed in the last 5 years. Especially for electronics hobbyists like me who are self taught and have very limited knowledge in RF communication domain, these new Lora modules have made life easier. There is no introduction needed for these modules as the entire community is talking about, so I straightaway jump into the subject.

For my recent hobby project (shall be explained in future posts), I need a long range communications module between 2 Raspberry Pi based devices. The approximate distance is roughly 30 kms within line of sight. The 30kms and line of sight should be enough to guess what am planning to do. However, I'll still keep that for another post. The easiest way to achieve long range communication today without the need for licenses, is using a Lora module. As it already supports ISM band and modules are already available for various bands depending on the country.

### Regulations:

In India, the ISM band range of frequency 865 - 867 MHz is delicensed and allocated for general purpose use. The regulatory documents say, we are allowed to use a max of 1w transmission power within this range. The standard Lora modules are pre-configured for various global ISM bands like 433MHz, 868MHz and 915MHz. Now, if you notice, none of these frequencies are within the ISM band in India. Closest is 868MHz however, it is outside of the specified range.

Thanks to the operating frequency range of the Lora modules, each model supports a range of frequencies meant to support a range of channels. The device I chose for my project is E32-868T30D which supports frequency range from 862 MHz to 893 MHz. I was bit confused as the regulations did not explicitly mention whether the 865 and 867 frequencies are inclusive in the allowed range. So just to be on the safer side, I configured by devices to communicate in 866 MHz which is well within the range.

### Lora E32-868T30D:

In fact, I did a lot of research on various modules and finally chose this device just  because of the 1w transmission power support. The actual advantage of this device comes from the support for UART communication. You can plug 2 devices into a computer with USB-UART adaptors and start  configuring and testing the device. I started using CoolTerm app on my Mac for debugging and understanding the behaviour of this device. The manufacturer EByte has give a beautiful [documentation](https://www.ebyte.com/en/pdf-down.aspx?id=672) for this module. It actually didn't help me much in the beginning while I was trying to understand the behaviour of the device. Later once you get the hang of it, the document comes handy as reference.

The device has M0 and M1 pins for configuring operating modes (Normal, Wake-up, Power svaing and sleep). Many articles say, there pins can be ignored, but neirhter ignoring nor connecting directly to ground worked for me. Only thing that worked for me is connecting them to GPIO pins (17 and 27) and programatically setting the high or low for different modes. To configure the settings using commands, you need to first set the device to Sleep mode. Then in normal mode, the device uses the persisted config. So I decided to use the GPIO pins to configure on program startup so even if I swap the devices, the new settings will take effect.

Note: You can configure and persist the setting once using a computer, and then use the UART to just send data directly. This also did work as expected.

The device has another AUX pin which becomes very important when sending large data continuously. For sending data at an interval greater than the transmission time (usually a few 10 milliseconds), you don't need to worry about this pin. The pin tells us if the data written previously is being ready by the internal transmitter module. So you need to wait until the pin signals you that it is ready for more data.

### Connecting to Raspberry Pi:

For my project, I chose Raspberry Pi Zero W for various obvious reasons. They are small enough and computers running Linux rather than MCUs. Below wiring diagram explains the overall connections used.

![](/blog/assets/images/2021/12/lora-E32-868T30D-2.png)

Remember to connect the Tx pin of RPi to Rx pin of Lora module and the Rx pin of RPi to Tx pin of Lora module. For most people this sounds obvious but I initially had lot of doubts on the Lora module pin naming.

### Source code:

The entire source code is available as part of my [Gihub project](https://github.com/codetiger/rpi-hab/blob/main/lora.py). Below is the reusable Lora Class in Python.

```python
#!/usr/bin/env python3

import serial
import logging, time
from datetime import datetime
import sqlite3
from struct import *
from threading import Thread
import RPi.GPIO as GPIO

AUX_PIN = 18
M0_PIN = 17
M1_PIN = 27

MODE_NORMAL = 0
MODE_WAKEUP = 1
MODE_POWER_SAVING = 2
MODE_SLEEP = 3

MAX_PACKET_SIZE = 58

class LoraModule(Thread):
    ser = None
    dbConn = None
    delayAfterTransmit = 1.5
    lastTransmitTime = None
    addressHigh = 0x0
    addressLow = 0x0
    port = ""
    healthy = True

    def __init__(self, port="/dev/serial0", addressHigh=0xbc, addressLow=0x01, dataTimer=True, delay=1.5):
        logging.getLogger("HABControl")
        logging.info('Initialising Lora Module')
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(AUX_PIN, GPIO.IN)
        GPIO.setup(M0_PIN, GPIO.OUT)
        GPIO.setup(M1_PIN, GPIO.OUT)
        self.delayAfterTransmit = delay
        self.lastTransmitTime = datetime.now()
        self.addressHigh = addressHigh
        self.addressLow = addressLow
        self.port = port

        self.setupPort()

        if dataTimer:
            self.dbConn = sqlite3.connect('data.db', detect_types=sqlite3.PARSE_DECLTYPES, check_same_thread=False)
            self.dbConn.execute("CREATE TABLE IF NOT EXISTS habdata(id INTEGER PRIMARY KEY, data BLOB NOT NULL, chunked INT DEFAULT 0 NOT NULL, created timestamp NOT NULL, ack INT DEFAULT 0 NOT NULL, lasttry timestamp NOT NULL);")

            Thread.__init__(self)
            self.healthy = True
            self.start()

    def setupPort(self):
        self.setMode(MODE_SLEEP)
        try:
            self.ser = serial.Serial(self.port, 9600, timeout=1, bytesize=serial.EIGHTBITS, parity=serial.PARITY_NONE, stopbits=serial.STOPBITS_ONE)
        except Exception as e:
            logging.error("Could not Open Lora Port - %s" % str(e))
            self.ser = None

        self.resetLoraModule(False)
        self.ser.baudrate = 115200

    def resetLoraModule(self, hard=False):
        self.setMode(MODE_SLEEP)
        time.sleep(0.2)

        if hard:
            packet = bytes([0xc4, 0xc4, 0xc4])
            logging.info("Reset Lora Module Data: %s" % (packet.hex()))
            self.ser.write(packet)
            time.sleep(0.2)

        packet = bytes([0xc0, self.addressHigh, self.addressLow, 0x3d, 0x04, 0xc4])
        logging.info("Sending Config Packet Size: %d Data: %s" % (len(packet), packet.hex()))
        self.ser.write(packet)
        time.sleep(0.1)
        res = self.waitForData(6)
        if res is not None:
            logging.info("Config confirmation: %s" % (res.hex()))
        else:
            logging.info("Config confirmation timeout")
        time.sleep(0.1)

        self.setMode(MODE_NORMAL)
        time.sleep(0.1)

    def setMode(self, mode):
        if mode == MODE_NORMAL:
            logging.info("Setting Lora for Normal Mode")
            GPIO.output(M0_PIN, GPIO.LOW)
            GPIO.output(M1_PIN, GPIO.LOW)
        elif mode == MODE_WAKEUP:
            logging.info("Setting Lora for Wakeup Mode")
            GPIO.output(M0_PIN, GPIO.HIGH)
            GPIO.output(M1_PIN, GPIO.LOW)
        elif mode == MODE_POWER_SAVING:
            logging.info("Setting Lora for Power Saving Mode")
            GPIO.output(M0_PIN, GPIO.LOW)
            GPIO.output(M1_PIN, GPIO.HIGH)
        elif mode == MODE_SLEEP:
            logging.info("Setting Lora for Sleep Mode")
            GPIO.output(M0_PIN, GPIO.HIGH)
            GPIO.output(M1_PIN, GPIO.HIGH)

    def run(self):
        while self.healthy:
            duration = datetime.now() - self.lastTransmitTime
            secondsFromLastTransmit = duration.total_seconds()
            while not GPIO.input(AUX_PIN):
                time.sleep(0.025)
                duration = datetime.now() - self.lastTransmitTime
                secondsFromLastTransmit = duration.total_seconds()
                if secondsFromLastTransmit > 25:
                    self.healthy = False
            time.sleep(0.025)

            try:
                if self.ser.in_waiting > 0:
                    self.recieveThread()
                elif secondsFromLastTransmit > self.delayAfterTransmit:
                    self.transmitThread()
            except Exception as e:
                logging.error("Error in Lora module - %s" % str(e), exc_info=True)
                self.healthy = False

    def transmit(self, data):
        try:
            logging.info("Sending Packet Size: %d Data: %s" % (len(data), data.hex()))
            self.ser.write(data)
            self.ser.flush()
            self.lastTransmitTime = datetime.now()
        except Exception as e:
            logging.error("Could not send data to Lora Port - %s" % str(e), exc_info=True)
            self.healthy = False

    def transmitThread(self):
        try:
            packet = bytearray()
            packet.append(0xbc)
            packet.append(0x02)
            packet.append(0x04)
            rows = self.dbConn.execute("SELECT * FROM habdata WHERE ack = 0 and lasttry < Datetime('now', '-10 seconds') ORDER BY chunked ASC, created DESC LIMIT 5").fetchall()
            for row in rows:
                if len(packet) + len(row[1]) <= MAX_PACKET_SIZE:
                    packet.append(0xda)
                    packet.append((int(row[0]) & 0xff00) >> 8) # higher byte of id
                    packet.append(int(row[0]) & 0xff) # lower byte of id
                    size = int(len(row[1])) & 0xff
                    size *= (-1 if row[2] else 1)
                    size = size.to_bytes(1, byteorder='big', signed=True)[0]
                    packet.append(size) # size of data
                    packet.extend(row[1]) # data
                    self.dbConn.execute("UPDATE habdata SET lasttry = datetime('now') WHERE id = ?", [row[0]])
                else:
                    break

            if len(packet) > 3:
                self.transmit(packet)
        except Exception as e:
            logging.error("Could not send data to Lora - %s" % str(e), exc_info=True)
            self.healthy = False

    def waitForData(self, length, timeout=10):
        callTime = datetime.now()
        while self.ser.in_waiting < length:
            time.sleep(0.025)
            duration = datetime.now() - callTime
            secondsFromCallTime = duration.total_seconds()
            if secondsFromCallTime > timeout:
                return None

        data = self.ser.read(length)
        return data

    def recieveThread(self):
        if self.ser.in_waiting >= 3:
            try:
                data = self.ser.read(3)
                if len(data) == 3 and data[0] == 0xac:
                    high = int(data[1])
                    low = int(data[2])
                    dataid = (high << 8) | low
                    logging.info("Recieved ACK for %d" % (dataid))
                    self.dbConn.execute("UPDATE habdata SET ack = 1 WHERE id = ?", [dataid])
            except Exception as e:
                logging.error("Could not update ack to SQLite - %s" % str(e), exc_info=True)

    def sendData(self, data):
        CHUNK_SIZE = MAX_PACKET_SIZE - 8 # CallSign (1 byte) Dataid (2 bytes), Size (1 byte), Chunk index (2 byte), Total Chunks (2 byte)

        try:
            isChunked = len(data) > CHUNK_SIZE
            totalChunks = int(len(data) / CHUNK_SIZE) + 1
            if totalChunks > 255 * 255:
                logging.error("Unable to send file, check file size")
                return

            if isChunked:
                logging.debug("Data: Chunked %d, totalChunks %d" % (isChunked, totalChunks))
                for i in range(0, totalChunks):
                    dt = data[i*CHUNK_SIZE:(i+1)*CHUNK_SIZE]
                    packet = bytearray()
                    indexBytes = i.to_bytes(2, byteorder='big', signed=False)
                    packet.append(indexBytes[0])
                    packet.append(indexBytes[1])
                    totalChunksBytes = totalChunks.to_bytes(2, byteorder='big', signed=False)
                    packet.append(totalChunksBytes[0])
                    packet.append(totalChunksBytes[1])
                    packet.extend(dt)
                    logging.debug("Data added to Queue: %s", packet.hex())
                    self.dbConn.execute("INSERT INTO habdata(data, chunked, created, lasttry) VALUES (?, 1, datetime('now'), datetime('now'));", [sqlite3.Binary(packet)])
            else:
                logging.debug("Data added to Queue: %s", data.hex())
                self.dbConn.execute("INSERT INTO habdata(data, created, lasttry) VALUES (?, datetime('now'), datetime('now'));", [sqlite3.Binary(data)])
        except Exception as e:
            logging.error("Could not insert to SQLite - %s" % str(e), exc_info=True)

    def hasChunkData(self):
        try:
            row = self.dbConn.execute("SELECT COUNT(*) FROM habdata WHERE ack = 0 and chunked = 1").fetchone()
            if row and row[0] > 0:
                logging.debug("Chunk pending transmit: %d" % (row[0]))
                return True
            else:
                self.dbConn.execute("DELETE FROM habdata WHERE ack = 1 and chunked = 1")
                return False
        except Exception as e:
            logging.error("Could not read from SQLite - %s" % str(e), exc_info=True)
            return False

    def close(self):
        logging.info("Closing Lora Module object")
        self.healthy = False
        self.ser.close()
        self.ser = None
        self.dbConn.close()
        self.dbConn = None
        GPIO.cleanup()
```

Feel free to remove need for SQLite DB usage if not needed. The DB approach was introduced for sending large data and waiting for acknoledgement. This shall be covered in detail in another post.
