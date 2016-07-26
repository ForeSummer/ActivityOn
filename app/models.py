# -*- coding: utf-8 -*-
from django.db import models
from django.http import HttpResponse
#from mongoengine import *

import re

try:
    # django >= 1.4
    from django.utils.timezone import now as datetime_now
except ImportError:
    from datetime import datetime
    datetime_now = datetime.now


class UserBase (models.Model):
    UId = models.AutoField(primary_key=True)
    UPrivateEmail = models.EmailField()
    UPublicEmail = models.EmailField()
    UName = models.CharField(max_length = 100)
    UPassword = models.CharField(default="123456",max_length = 100)
    UAvatar = models.CharField(blank=True,max_length=100)
    UInfo = models.CharField(blank=True,max_length = 10000)
    UStatus = models.IntegerField(blank=True,default=0)
    UFollow = models.CharField(blank=True,max_length = 2000)
    UFollowed = models.CharField(blank=True,max_length = 2000)
    UFollowTime = models.CharField(blank=True,max_length=10000)
    UMessage = models.CharField(blank=True,max_length = 2000)
    
class UserActivity(models.Model):
    UId = models.AutoField(primary_key=True)
    UInAct = models.CharField(blank=True,max_length = 2000)
    UInActNum = models.IntegerField()
    UOrganizedAct = models.CharField(blank=True,max_length = 2000)
    UOrganizedNum = models.IntegerField()
    UTags = models.CharField(blank=True,max_length = 2000)
    
class UserTimeline(models.Model):
    UId = models.AutoField(primary_key=True)
    UTimelineFrom = models.CharField(blank=True,max_length=10000)
    UTimelineAct = models.CharField(blank=True,max_length=10000)
    UTimelineType = models.CharField(blank=True,max_length=10000)

class Activity(models.Model):
    AId = models.AutoField(primary_key=True)
    AType = models.IntegerField()
    AAdmin = models.IntegerField()
    ARegister = models.CharField(blank=True,max_length=300)
    AUnregister = models.CharField(blank=True,max_length=300)
    AMaxRegister = models.IntegerField()
    ACreateTime = models.DateTimeField(auto_now=True)
    AEntryDDL = models.CharField(max_length=70)
    AStartTime = models.CharField(max_length=70)
    AEndTime = models.CharField(max_length=70)
    AStatus = models.IntegerField()
    ATitle = models.CharField(max_length=300)
    ALocation = models.CharField(max_length=400)
    AInfo = models.CharField(max_length = 5000)
    ASummary = models.CharField(max_length=5000)
    
class Message(models.Model):
    Mid = models.AutoField(primary_key=True)
    MisRead = models.BooleanField()
    MContent = models.CharField(max_length=50)
    MFrom = models.IntegerField()
    MTo = models.ImageField()
    MTime = models.DateTimeField()
    
def auth_by_info(username, password):
    url_login = 'http://www.student.tsinghua.edu.cn/practiceLogin.do'
    data = (
        ('userName', username),
        ('password', password),
    )
    import urllib, urllib2
    req = urllib2.Request(url_login, urllib.urlencode(data))
    res_data = urllib2.urlopen(req)
    res = res_data.read()
    res = res.decode('utf-8')
    ret = {
        'error': 1,
        'student_id': res.split('&')[0].split('=')[1]
    }
    if res!='':
        return ret
    else:
        return {'error': -1}
    
def error(code, message):
    return {'code':code, 'message':message}

def check_cellphone(cellphone):
    if len(cellphone) > 6:
        if re.match("^0\d{2,3}\d{7,8}$|^1[358]\d{9}$|^147\d{8}$", phone) != None:
            return True
    return False

def check_email(email):
    if len(email) > 6:
        if re.match("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$", email) != None:
            return True
    return False

def check_mobile(agent):
    mobile_os = ('Google Wireless Transcoder','Windows CE','WindowsCE','Symbian','Android','armv6l','armv5','Mobile','CentOS','mowser','AvantGo','Opera Mobi','J2ME/MIDP','Smartphone','Go.Web','Palm','iPAQ')
    mobile_token = ('Profile/MIDP','Configuration/CLDC-','160×160','176×220','240×240','240×320','320×240','UP.Browser','UP.Link','SymbianOS','PalmOS','PocketPC','SonyEricsson','Nokia','BlackBerry','Vodafone','BenQ','Novarra-Vision','Iris','NetFront','HTC_','Xda_','SAMSUNG-SGH','Wapaka','DoCoMo','iPhone','iPod')
    for it in mobile_os:
        if it in agent:
            return True
    for it in mobile_token:
        if it in agent:
            return True
    return False

def gen_key():
    import random
    import string
    return ''.join(random.sample(string.ascii_letters + string.digits, 8))

def apply_to_dict(apply_obj):
    d = {}
    for field in APPLY_FIELDS:
        d[field] = getattr(apply_obj, field)
    return d

def check_auth(request, act_id, input_key, act):
    def check_key():
        if 'act_id' in request.session and request.session['act_id'] == act_id:
            return True
        else:
            if input_key == act.security_key:
                request.session['act_id'] = act_id
                return True
            else:
                return False
    if request.user.is_authenticated():
        if request.user.username == act.cellphone:
            return True
        else:
            return check_key()
    else:
        return check_key()

