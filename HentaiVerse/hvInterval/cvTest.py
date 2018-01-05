import cv2
import numpy as np
img_rgb = cv2.imread('1.jpg')
img_gray = cv2.cvtColor(img_rgb, cv2.COLOR_BGR2GRAY)
answers={}
option=['AJ','FS','RD','RA','PP','TS']
for i in option:
  template = cv2.imread('%s.jpg'%i,0)
  #w, h = template.shape[::-1]
  res = cv2.matchTemplate(img_gray,template,cv2.TM_CCOEFF_NORMED)
  threshold = 0.8
  loc = np.where( res >= threshold)
  #print loc[::-1]
  if len(loc[::-1][0])>0:
    answers[loc[::-1][0][0]]=i
print answers#{402: 'TS', 219: 'AJ', 77: 'RA'}
answers=answers.items()
answers.sort()
print answers#[(77, 'RA'), (219, 'AJ'), (402, 'TS')]
'''
for pt in zip(*loc[::-1]):
    cv2.rectangle(img_rgb, pt, (pt[0] + w, pt[1] + h), (0,255,255), 2)
cv2.imshow('Detected',img_rgb)
cv2.waitKey(0)
cv2.destroyAllWindows()
'''
