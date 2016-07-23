# -*- coding: utf-8 -*-
from django.shortcuts import render, render_to_response
from django.http import HttpResponse
from django.template import RequestContext
from app.models import error
from .models import *
from django.contrib.auth import authenticate
from django.template import loader
import json

# Create your views here.

def index(request):
    request.META["CSRF_COOKIE_USED"] = True
    context = {
        'role': request.session.get('role', 1)
    }
    return render_to_response('index.html', RequestContext(request, context))

def test(request):
    return HttpResponse('test')

def server_time(request):
    import time
    re = dict()
    re['error'] = error(1, 'ok')
    re['current_time'] = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time() + 8 * 60 * 60))
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def register(request):
    try :
        user = UserBase.objects.get(UPrivateEmail = request.POST.get('privateemail'))
    except UserBase.DoesNotExist:
        try: 
            user = UserBase.objects.get(UName = request.POST.get('nickname'))
        except UserBase.DoesNotExist:
            p = request.POST
            base = UserBase(UPrivateEmail = p.get('privateemail'),UPublicEmail = p.get('openemail'),UName = p.get('nickname'),UPassword = p.get('password'))
            base.save()
            return HttpResponse(json.dumps({"ErrorCode":1,"UID":base.UId}))
            pass
        else :
            return HttpResponse(json.dumps({"ErrorCode":-1}))
            pass
    else :
        return HttpResponse(json.dumps({"ErrorCode":0}))
        pass

def login(request):
    try:
        user = UserBase.objects.get(UPrivateEmail = request.POST.get('user_name'), UPassword = request.POST.get('user_password'))
    except UserBase.DoesNotExist:
        return  HttpResponse(json.dumps({"ErrorCode":0}))
    else :
        
        return  HttpResponse(json.dumps({"ErrorCode":1,"UID":user.UId}))
    
def logout(request):
   return  render(request,'index.html',{})

def ReturnNone(request):
    return render(request,'index.html',{})

def info(request):
    try:
        user = UserBase.objects.get(UId = request.GET.get('UID'))
    except UserBase.DoesNotExist:
        return HttpResponse(json.dumps({'ErrorCode':0}))
    else:
        return HttpResponse(json.dumps({'ErrorCode':1, 'UName':user.UName, 'UID':user.UId, 'UPrivateEmail':user.UPrivateEmail, 'UPublicEmail':user.UPublicEmail, 'UAvatar': "/static/images/admin.png", 'UInfo':user.UInfo, 'UStatus':user.UStatus, 'UFollow':user.UFollow, 'UFollowed':user.UFollowed, 'UMessage':user.UMessage}))

def modify(request):
    try:
        user = UserBase.objects.get(UId = request.POST.get('UID'))
    except UserBase.DoesNotExist:
        return HttpResponse(json.dumps({'ErrorCode':0}))
    else:
        for i in request.POST:
            print(i);
            user[i] = request.POST.get(i)
        return HttpResponse(json.dumps({'ErrorCode':1}))
