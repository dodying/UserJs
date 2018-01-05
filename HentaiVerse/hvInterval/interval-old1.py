#coding=utf-8
import sys, os
from platform import system
import ConfigParser
import time
import requests
import json
from random import randint
import cv2
import numpy as np

def work():
  if system:
    a = os.system('cls')
  print 'RIDDLE'

  #OCR小马图片
  file = open(imgPath + "riddle.jpg", 'rb')
  files = {'image': file}
  headers = {"Authorization": "JWT " + token}
  response = requests.request("POST", ocrUrl, files = files, headers = headers)
  file.close()
  response = json.loads(response.text)
  scores = response['scores']
  scores = sorted(scores.items(), key = lambda item:item[1], reverse = True)

  #识别小马选项
  img_rgb = cv2.imread('riddle.jpg')
  img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)
  answers = {}
  for i in option:
    template = cv2.imread('%s.jpg' %i, 0)
    res = cv2.matchTemplate(img_gray, template, cv2.TM_CCOEFF_NORMED)
    loc = np.where(res >= sim)
    if len(loc[::-1][0]) > 0:
      answers[loc[::-1][0][0]] = i

  #匹配小马答案
  #{402: 'TS', 219: 'AJ', 77: 'RA'}
  answers = answers.items()
  answers.sort()
  #[(77, 'RA'), (219, 'AJ'), (402, 'TS')]
  isFind = False
  order = -1
  while not isFind:
    order = order + 1
    if scores[order][1] < simMin:
      break
    for i in answers:
      if i[1] == scores[order][0]:
        answer = answers.index(i)
        isFind = True
        break
  if not isFind:
    answer = randint(0, 2)

  #发送答案
  r = requests.request('post', hvUrl, data = {'riddleanswer': abc[answer]}, cookies = cookies)
  result = r.text.find('The RiddleMaster is pleased with your answer') >- 1
  print result
  now = time.time()
  log(now, scores, answers, abc[answer], isFind == False, result)
  now = str(int(now * 1000))

  #查看结果-删除文件
  if result:
    os.rename(imgPath + 'riddle.jpg', imgPath + i[1] +'_'+ now + '.jpg')
  else:
    os.rename(imgPath + 'riddle.jpg', imgPath + '_' + now + '.jpg')


def log(timestamp, scores, option, answer, isRandom, isTrue):
  f = open(path + 'log.txt', 'a')
  #http://python.usyiyi.cn/translate/python_278/library/time.html#module-time
  localtime = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(timestamp))
  f.write('当前时间:%s' %str(localtime))
  f.write('\n')
  f.write('当前时间戳:%s' %str(int(timestamp * 1000)))
  f.write('\n')
  f.write('vize.it识别情况:%s' %str(scores))
  f.write('\n')
  f.write('OpenCV识别选项:%s' %str(option))
  f.write('\n')
  f.write('发送的答案:%s' %str(answer))
  f.write('\n')
  f.write('是否随机答案:%s' %str(isRandom))
  f.write('\n')
  f.write('是否正确:%s' %str(isTrue))
  f.write('\n')
  f.write('\n')
  f.close()


if system() == 'Windows':
  system = True
else:
  system = False
path = sys.path[0] + '\\'

cf = ConfigParser.ConfigParser()
cf.read(path + 'interval.ini')
config = cf.items("info")
config = dict(config)

imgPath = config['img_path'] + '\\'
abc = ['a', 'b', 'c']
hvUrl = config['url_hv']
ocrUrl = config['url_ocr']
cookies = dict(__cfduid = config['cookie_cfduid'], ipb_member_id = config['cookie_id'], ipb_pass_hash = config['cookie_pass'])
token = config['token']
intervalSec = int(config['sec'])
intervalSec2 = int(config['sec2'])
sim = round(float(config['sim']), 2)
simMin = float(config['sim_min'])
option = [config['aj'], config['fs'], config['pp'], config['ra'], config['rd'], config['ts']]


while True:
  print time.time()
  if os.path.exists(imgPath + 'riddle.jpg'):
    work()
    time.sleep(intervalSec2)
  else:
    time.sleep(intervalSec)
