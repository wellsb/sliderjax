#!/usr/bin/env python

poll_delay = 0.1
#thislog = '../log.txt'

from Adafruit_PWM_Servo_Driver import PWM
import sys, time, random, os

def adaSetup():
	global pwm
	pwm = PWM(0x40, debug=True)
	pwm.setPWMFreq(60)

def QuitIt():
	sys.exit()

def moveSet(s0, s1, s2, s3, s4, s5, s6, s7):
    global pwm
    pwm.setPWM(0, 0, int(s0))
    pwm.setPWM(1, 0, int(s1))
    pwm.setPWM(2, 0, int(s2))
    pwm.setPWM(3, 0, int(s3))
    pwm.setPWM(4, 0, int(s4))
    pwm.setPWM(5, 0, int(s5))
    pwm.setPWM(6, 0, int(s6))
    pwm.setPWM(7, 0, int(s7))

adaSetup()
while True:
    readhandle = file('../log.txt', 'r')
    readcontent = readhandle.readlines()
    t = ''.join(readcontent[-1:])
    u = t.strip().split(',')
    print "FL1:" + u[0] + " FL2:" + u[1] + " FR1:" + u[2] + " FR2:" + u[3] + " BL1:" + u[4] + " BL2:" + u[5] + " BR1:" + u[6] + " BR2:" + u[7]
    moveSet(u[0], u[1], u[2], u[3], u[4], u[5], u[6], u[7])
    time.sleep(poll_delay)