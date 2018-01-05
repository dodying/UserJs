#coding=utf-8
from flask import Flask, request
import sys, os
import ConfigParser
import time
import requests
import json
from random import randint
import cv2
import numpy as np


global now, riddle
app = Flask(__name__)
path = sys.path[0] + '\\'

cf = ConfigParser.ConfigParser()
cf.read(path + 'interval.ini')
config = cf.items("info")
config = dict(config)

imgPath = config['img_path'] + '\\'
abc = ['a', 'b', 'c']
ocrUrl = config['url_ocr']
token = config['token']
sim = round(float(config['sim']), 2)
simMin = float(config['sim_min'])
option = [config['aj'], config['fs'], config['pp'], config['ra'], config['rd'], config['ts']]
#hvUrl = ['http://hentaiverse.org/', 'https://hentaiverse.org/', 'http://alt.hentaiverse.org/']

def work():
  global now, riddle
  #OCR小马图片
  file = open(imgPath + "riddle.jpg", 'rb')
  files = {'image': file}
  headers = {"Authorization": "JWT " + token}
  response = requests.request("POST", ocrUrl, files = files, headers = headers)
  file.close()
  #return response.text
  response = json.loads(response.text)
  scores = response['scores']
  scores = sorted(scores.items(), key = lambda item:item[1], reverse = True)

  #识别小马选项
  img_rgb = cv2.imread(imgPath + 'riddle.jpg')
  img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)
  answers = {}
  for i in option:
    template = cv2.imread(path + '%s.jpg' %i, 0)
    res = cv2.matchTemplate(img_gray, template, cv2.TM_CCOEFF_NORMED)
    loc = np.where(res >= sim)
    if len(loc[::-1][0]) > 0:
      answers[loc[::-1][0][0]] = i

  #匹配小马答案
  answers = answers.items()
  answers.sort()
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
  now = time.time()
  riddle = i[1]
  log(now, scores, answers, abc[answer], isFind == False)
  return abc[answer]

def log(timestamp, scores, option, answer, isRandom):
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
  f.close()

def logResult(isTrue):
  f = open(path + 'log.txt', 'a')
  f.write('是否正确:%s' %str(isTrue))
  f.write('\n')
  f.write('\n')
  f.close()
  _now = str(int(now * 1000))
  if isTrue == 'True':
    os.rename(imgPath + 'riddle.jpg', imgPath + riddle +'_'+ _now + '.jpg')
  else:
    os.rename(imgPath + 'riddle.jpg', imgPath + '_' + _now + '.jpg')

@app.route("/", methods = ['GET', 'POST'])
def index():
  parm = dict(request.args)
  if 'img' in parm:
    image = parm['img'][0]
    image = requests.get(image)
    with open(imgPath + 'riddle.jpg', 'wb') as file:
      file.write(image.content)
      file.close()
      return work()
  elif 'answer' in parm:
    logResult(parm['answer'][0])
    return 'True'
  else:
    return '正常运行中'



if __name__ == '__main__':
  app.run(debug = True)
