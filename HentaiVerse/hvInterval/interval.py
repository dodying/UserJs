#coding=utf-8
from flask import Flask, request
import sys, os
import ConfigParser
import time
import requests
import json
from random import randint
import cv2
import numpy


global timeLog, riddle
app = Flask(__name__)
PATH = sys.path[0] + '\\'
ABC = 'abc'

cf = ConfigParser.ConfigParser()
cf.read(PATH + 'interval.ini')
config = cf.items("info")
config = dict(config)

imgPath = config['img_path'] + '\\'
token = config['token']
taskId = config['task_id']
sim = float(config['sim'])
simMin = float(config['sim_min'])
option = [config['aj'], config['fs'], config['pp'], config['ra'], config['rd'], config['ts']]

def work():
  global riddle
  #识别小马
  file = open(imgPath + "riddle.jpg", 'rb')
  headers = {"Authorization": "Token " + token}
  files = {'image_file': file}
  data = {'task': taskId}
  response = requests.post('https://api.vize.ai/v1/classify/', headers = headers, files = files, data = data)
  file.close()
  response = json.loads(response.text)
  if not 'labels' in response: #识别失败
    time.sleep(1)
    return work()
  scores = map(lambda i: {i['label_name']: round(i['probability'], 2)}, response['labels'])
  timeLog.append(getNow()) #识别小马完毕
  print timeLog[-1], scores

  #识别选项
  img_rgb = cv2.imread(imgPath + 'riddle.jpg')
  img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)
  answers = {}
  for i in option:
    template = cv2.imread(PATH + '%s.jpg' %i, 0)
    res = cv2.matchTemplate(img_gray, template, cv2.TM_CCOEFF_NORMED)
    loc = numpy.where(res >= sim)
    if len(loc[::-1][0]) > 0:
      answers[loc[::-1][0][0]] = i
  answers = answers.items()
  answers.sort()
  timeLog.append(getNow()) #识别选项完毕

  #匹配小马答案
  isFind = False
  order = -1
  while not isFind:
    order = order + 1
    if scores[order].values()[0] < simMin:
      break
    for i in answers:
      if i[1] == scores[order].keys()[0]:
        answer = answers.index(i)
        isFind = True
        break
  if not isFind:
    answer = randint(0, 2)
  riddle = i[1]
  timeLog.append(getNow()) #匹配小马答案完毕
  log(scores, answers, ABC[answer], isFind == False)
  return ABC[answer]

def getNow():
  return time.strftime('%Y-%m-%d %H-%M-%S', time.localtime(time.time()))

def log(response, option, answer, isRandom):
  f = open(PATH + 'log.txt', 'a')
  #http://python.usyiyi.cn/translate/python_278/library/time.html#module-time
  f.write('时间:%s' %str(timeLog))
  f.write('\n')
  f.write('vize返回结果:%s' %str(response))
  f.write('\n')
  f.write('OpenCV识别选项:%s' %str(option))
  f.write('\n')
  f.write('发送的答案:%s' %str(answer))
  f.write('\n')
  f.write('是否随机答案:%s' %str(isRandom))
  f.write('\n')
  f.close()

def logResult(isTrue):
  f = open(PATH + 'log.txt', 'a')
  f.write('是否正确:%s' %str(isTrue))
  f.write('\n')
  f.write('\n')
  f.close()
  if isTrue == 'True':
    os.rename(imgPath + 'riddle.jpg', imgPath + riddle +'_'+ timeLog[0] + '.jpg')
  else:
    os.rename(imgPath + 'riddle.jpg', imgPath + '_' + timeLog[0] + '.jpg')

@app.route("/", methods = ['GET', 'POST'])
def index():
  parm = dict(request.args)
  if 'img' in parm:
    global timeLog
    timeLog = []
    image = parm['img'][0]
    timeLog.append(getNow()) #收到请求
    print timeLog[-1], image
    image = requests.get(image)
    with open(imgPath + 'riddle.jpg', 'wb') as file:
      file.write(image.content)
      file.close()
      timeLog.append(getNow()) #图片下载完毕
      return work()
  elif 'answer' in parm:
    logResult(parm['answer'][0])
    return 'True'
  else:
    return '正常运行中'



if __name__ == '__main__':
  app.run(debug = True)
