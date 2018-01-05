#coding=utf-8
import os
import cv2
import shutil

path = {'aj': 'Applejack', 'fs': 'Fluttershy', 'pp': 'Pinkie Pie', 'rd': 'Rainbow Dash', 'ra': 'Rarity', 'ts': 'Twilight Sparkle'}

while True:
  dir = os.listdir('E:\\Desktop\\riddle')
  for i in dir:
    if os.path.isfile(i):
      break
  img_rgb = cv2.imread(i)
  cv2.imshow('Detected',img_rgb)
  a = cv2.waitKey(0)
  a = chr(a)
  cv2.destroyAllWindows()
  _input = a + raw_input('AJ FS PP RD RA TS: %s' %a)
  _path = path[_input]
  print i + ' >> ' + _path + '/' + i + '\n'
  shutil.move(i, _path + '/' + i)
