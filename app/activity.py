# -*- coding: utf-8 -*-
from models import *
from helper import *
from django.http import HttpResponse

import csv
import json
import re as regex
import time, datetime

init_form = [
        {
            'explanation': '请填写您的姓名',
            'required': True,
            'type': 'text',
            'display': '姓名',
            'label': 'name'
        },
        {
            'explanation': '请填写您的手机号',
            'required': True,
            'type': 'text',
            'display': '手机号',
            'label': 'cellphone'
        }
    ]

def test(request):
    return HttpResponse(json.dumps({'error': error(1, '成功')}), content_type = 'application/json')
        
def create_activity(request):
    re = dict()
    if request.method == 'POST':
        act = Activity()
        if request.user.is_authenticated():
            act.cellphone = request.user.username
            act.email = request.user.email
        act.name = request.POST.get('name', '')
        act.create_time = datetime_now()
        act.update_time = datetime_now()
        act.security_key = gen_key()
        act.cellphone = ''
        act.email = ''
        act.s_form = init_form
        act.total = -1
        act.auth_user = 0
        act.save()
        re['error'] = error(1, '创建成功')
        re['act_id'] = str(act.id)
        re['name'] = act.name
        re['security_key'] = act.security_key
        request.session['act_id'] = str(act.id)
    else:
        re['error'] = error(2, '错误，需要POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def set_activity(request, act_id=''):
    re = dict()
    if request.method == 'POST':
        try:
            act = Activity.objects.get(id=act_id)
        except:
            re['error'] = error(10, '活动id不存在')
        else:
            input_key = request.POST.get('security_key', '')
            if check_auth(request, act_id, input_key, act):
                act.name = request.POST.get('name', '')
                try:
                    s_form = json.loads(request.POST.get('s_form', '[]'))
                except:
                    s_form = json.loads('[]')
                print s_form
                act.s_form = s_form
                act.security_key = input_key
                act.reg_start = request.POST.get('reg_start', '')
                act.reg_end = request.POST.get('reg_end', '')
                act.description = request.POST.get('description', '')
                act.cellphone = request.POST.get('cellphone', '')
                act.email = request.POST.get('email', '')
                act.auth_user = request.POST.get('auth_user', 0)
                total = request.POST.get('total', '')
                if total.isdigit() or total == '-1':
                    act.total = int(total)
                    print act.total
                act.save()
                
                re['error'] = error(1, '设置成功')
                re['security_key'] = act.security_key
                re['name'] = act.name
                re['s_form'] = act.s_form
                re['reg_start'] = act.reg_start
                re['reg_end'] = act.reg_end
                re['email'] = act.email
                re['cellphone'] = act.cellphone
                re['description'] = act.description
                re['auth_user'] = 0
            else:
                re['error'] = error(3, '没有活动权限')
    else:
        re['error'] = error(2, '错误，需要POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_activity(request, act_id=''):
    re = dict()
    if request.method == 'GET':
        input_key = request.GET.get('security_key', '')
        try:
            act = Activity.objects.get(id=act_id)
        except:
            re['error'] = error(10, '活动id不存在')
        else:
            re['error'] = error(1, '获取成功')
            re['act_id'] = str(act.id)
            re['name'] = act.name
            re['s_form'] = act.s_form
            re['reg_start'] = act.reg_start
            re['reg_end'] = act.reg_end
            re['description'] = act.description
            re['auth_user'] = act.auth_user
            re['total'] = act.total
            if check_auth(request, act_id, input_key, act):
                re['security_key'] = act.security_key
                re['cellphone'] = act.cellphone
                re['email'] = act.email
            else:
                re['security_key'] = ''
    else:
        re['error'] = error(2, '错误，需要GET')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_activity_count(request):
    re = dict()
    if request.method == 'GET':
        re['count'] = Activity.objects.count()
        re['error'] = error(1, '获取成功')
    else:
        re['error'] = error(2, '错误，需要GET')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def send_base(request, act_id=''):
    re = dict()
    if request.method == 'POST':
        try:
            act = Activity.objects.get(id=act_id)
        except:
            re['error'] = error(10, '活动id不存在')
        else:
            input_key = request.POST.get('security_key', '')
            if check_auth(request, act_id, input_key, act):
                act.email = request.POST.get('email', '')
                if act.mail_sended >= 5:
                    re['error'] = error(201, '您最多可以发送5封邮件')
                else:
                    res = sendact_manage(act.email, act.name, 'http://wq.zhixingthu.com/act/' + str(act.id) + '/manage?security_key=' + act.security_key, act.security_key)
                    if 'success' in res:
                        re['error'] = error(1,'发送成功')
                        act.mail_sended += 1
                    else:
                        err_mes = regex.findall(r'<error>(.*?)</error>', res)[0]
                        re['error'] = error(200, err_mes)
                act.save()
            else:
                re['error'] = error(3, '没有活动权限')
    else:
        re['error'] = error(2, '错误，需要POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def send_info(request, act_id=''):
    re = dict()
    if request.method == 'POST':
        try:
            act = Activity.objects.get(id = act_id)
        except:
            re['error'] = error(10, '活动id不存在')
        else:
            act.email = request.POST.get('email', '')
            act.save()
            # send email
            re['error'] = error(1, '设置成功')
    else:
        re['error'] = error(2, '错误，需要POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def export_csv(request, act_id=''):
    re = dict()
    if request.method == 'GET':
        input_key = request.GET.get('security_key', '')
        try:
            act = Activity.objects.get(id=act_id)
        except:
            re['error'] = error(10, '活动id不存在')
            return HttpResponse(json.dumps(re), content_type = 'application/json')
        else:
            if check_auth(request, act_id, input_key, act):
                reg_list = Registration.objects(act_id = act_id)
                reg_list = json.loads(reg_list.to_json())
                response = HttpResponse(content_type='text/csv')
                response['Content-Disposition'] = ('attachment; filename="' + act.name.encode('utf-8') + '_statistic.csv"')
                writer = csv.writer(response)
                writer.writerow([item['display'].encode('gbk') for item in act.s_form])
                for reg in reg_list:
                    item_list = []
                    for item in reg['form_data']:
                        item_data = item.get('data', '')
                        if type(item_data) == type([]):
                            item_data = ';'.join(item_data)
                        try:
                            item_list.append(item_data.encode('gbk'))
                        except:
                            try:
                                item_list.append(item_data.encode('gb18030'))
                            except:
                                item_list.append(item_data.encode('gb2312'))
                    writer.writerow(item_list)
                return response
            else:
                re['error'] = error(101, '您没有导出列表的权限')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
    else:
        re['error'] = error(2, '错误，需要POST')
        return HttpResponse(json.dumps(re), content_type = 'application/json')
