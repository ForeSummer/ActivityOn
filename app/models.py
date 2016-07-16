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

'''class Activity(Document):
    cellphone = StringField(max_length=100)
    email = StringField(max_length=100)
    name = StringField(max_length=1000)
    security_key = StringField(required=True, max_length=1000)
    s_form  = ListField(DictField())
    reg_start = StringField(max_length=100)
    reg_end = StringField(max_length=100)
    total = IntField(default=-1)
    description = StringField(max_length=10000)
    create_time = DateTimeField()
    update_time = DateTimeField()
    has_file = BooleanField(default=False)
    mail_sended = IntField(default=0)
    auth_user = IntField(default=0)

class Registration(Document):
    state = StringField(default='wait', max_length=100) #wait, agree, disagree
    act_id = StringField(required=True, max_length=1000)
    name = StringField(max_length=100)
    cellphone = StringField(max_length=100)
    email = StringField(max_length=100)
    form_data = ListField(DictField())
    has_file = BooleanField()
    student_id = StringField(max_length=100)

class RegBackup(Document):
    state = StringField(default='wait', max_length=100) #wait, agree, disagree
    act_id = StringField(required=True, max_length=1000)
    name = StringField(max_length=100)
    cellphone = StringField(max_length=100)
    email = StringField(max_length=100)
    form_data = ListField(DictField())
    has_file = BooleanField()
    student_id = StringField(max_length=100)

class File(Document):
    name = StringField(max_length=100)
    display_name = StringField(max_length=100)
    description = StringField(max_length=10000)
    file_type = StringField(max_length=100)
    category = StringField(max_length=100)
    value = FileField()
  '''  
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

