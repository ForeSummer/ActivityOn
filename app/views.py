# -*- coding: utf-8 -*-
from django.shortcuts import render, render_to_response
from django.http import HttpResponse
from django.template import RequestContext
from app.models import error
from django.contrib.auth.models import User 
from django.contrib.auth import authenticate
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

def Register(request):
    user = User.objects.get(email = request.POST.get('privateemail'))
    if not user:
        return {ErrorCode:0}
    user = User.objects.get(name = request.POST.get('nickname'))
    if not user:
        return {ErrorCode:-1}
    p = request.POST
    user = User.objects.create_user(p.get('nickname'),p.get('password'),p.get('privateemail'),p.get('publicemail'))
    base = UserBase(UPrivateEmail = p.get('privateemail'),UPublicEmail = p.get('publicemail'),UName = p.get('nickname'))
    base.save()
    return {ErrorCode:1,UID:base.UId}

def Login(request):
    user = authenticate(request.POST.get('username'),request.POST.get('password'))
    if user is not None and user.is_active:
        return {ErrorCode:1,UID:UserBase.objects.get(UName = request.POST.get('username'))}
    else:
        return {ErrorCode:0}
    
def Logout(request):
    
