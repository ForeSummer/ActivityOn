# -*- coding: utf-8 -*-
from django.shortcuts import render, render_to_response
from django.http import HttpResponse
from django.template import RequestContext
from app.models import error
from django.contrib.auth.models import User 
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
        print(User.objects.all())
    except UserBase.DoesNotExist:
        print("aaa")
        try:
            user = UserBase.objects.get(UName = request.POST.get('nickname'))
            print("aa")
        except UserBase.DoesNotExist:
            p = request.POST
            print("1")
            user = User.objects.create_user(username = p.get('nickname'),password = p.get('password'),email = p.get('privateemail'),first_name = p.get('openemail'))
            base = UserBase(UPrivateEmail = p.get('privateemail'),UPublicEmail = p.get('openemail'),UName = p.get('nickname'))
            base.save()
            return HttpResponse(json.dumps({"ErrorCode":1,"UID":base.UId}))
            pass
        else :
            print("-1")
            return HttpResponse(json.dumps({"ErrorCode":-1}))
            pass
    else :
        print('0')
        return HttpResponse(json.dumps({"ErrorCode":0}))
        pass
    print("fuckingdjango")

def login(request):
    user = authenticate(request.POST.get('username'),request.POST.get('password'))
    if user is not None and user.is_active:
        return {"ErrorCode":1,"UID":UserBase.objects.get(UName = request.POST.get('username'))}
    else:
        return {"ErrorCode":0}
    
def logout(request):
   return 

def ReturnNone(request):
    return render(request,'index.html',{})