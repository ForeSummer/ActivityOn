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
    UTimelineTime = models.CharField(blank=True,max_length=10000)

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
    
class UMessage(models.Model):
    UId = models.AutoField(primary_key=True)
    MTo = models.CharField(blank=True,max_length=1000)
    MType = models.CharField(blank=True,max_length=1000)
    MTime = models.CharField(blank=True,max_length=5000)
    
