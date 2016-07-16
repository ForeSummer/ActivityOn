# -*- coding: utf-8 -*-
from models import *
from helper import *
from django.http import HttpResponse
import json

def auth_student(request):
    re = dict()
    if request.method == 'POST':
        student_id = request.POST.get('student_id', '')
        password = request.POST.get('password', '')

        userinfo = auth_by_info(student_id, password)
        print userinfo
        if userinfo['error'] == 1:
            re['error'] = error(1, '认证成功')
            re['student_id'] = userinfo['student_id']
            request.session['student_id'] = re['student_id']
        else:
            re['error'] = error(-1, '学号或密码错误')
    else:
        re['error'] = error(2, '错误，需要POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_user_status(request):
    re = dict()
    if request.method == 'GET':
        if request.session.get('student_id', '') != '':
            re['error'] = error(1, '获取信息成功')
            re['student_id'] = request.session.get('student_id', '')
        else:
            re['error'] = error(-1, '尚未登录')
    else:
        re['error'] = error(2, '错误，需要GET')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def logout(request):
    re = dict()
    if request.method == 'POST':
        if request.session.get('student_id', '') != '':
            re['error'] = error(1, '注销成功')
            re['student_id'] = request.session.get('student_id', '')
            request.session['student_id'] = ''
        else:
            re['error'] = error(-1, '尚未登录')
    else:
        re['error'] = error(2, '错误，需要POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')
    
