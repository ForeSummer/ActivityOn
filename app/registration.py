# -*- coding: utf-8 -*-
from models import *
from django.http import HttpResponse
from django.template import RequestContext
from django.http import HttpResponseRedirect
import json

def reg(request, act_id):
    re = dict()
    if request.method == 'POST':
        name = request.POST.get('name', '')
        cellphone = request.POST.get('cellphone', '')
        email = request.POST.get('email', '')
        form_data = request.POST.get('form_data', '[]')
        try:
            act = Activity.objects.get(id=act_id)
        except:
            re['error'] = error(10, '活动id不存在')
        else:
            if act.auth_user == 1:
                if request.session.get('student_id', '') == '':
                    re['error'] = error(-1, '需要使用学生账号登录')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
                else:
                    apps = Registration.objects(act_id=act_id, student_id=request.session.get('student_id', ''))
                    if len(apps) >= 1:
                        re['error'] = error(-2, '~(≧▽≦)/~ 一名同学只能提交一次哦')
                        return HttpResponse(json.dumps(re), content_type = 'application/json')
                    
            import time
            today = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time() + 8 * 60 * 60))
            if today<act.reg_start and act.reg_start and act.reg_start != '':
                re['error'] = error(4, '未到活动报名时间')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            if today>act.reg_end and act.reg_end and act.reg_end != '':
                re['error'] = error(4, '已过活动报名时间')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            if act.total != -1 and act.total != '':
                count = Registration.objects(act_id=act_id).count()
                if count >= act.total:
                    re['error'] = error(4, '报名名额已满')
                    return HttpResponse(json.dumps(re), content_type = 'application/json')
            try:
                value = json.loads(form_data)
            except:
                value = json.loads('[]')
            apps = Registration.objects(act_id=act_id, form_data=value)
            if len(apps) >= 1:
                re['error'] = error(11, '~(≧▽≦)/~ 您已成功提交，请不要重复提交')
                return HttpResponse(json.dumps(re), content_type = 'application/json')
            app = Registration()
            app.act_id = act_id
            app.name = name
            app.cellphone = cellphone
            app.email = email
            app.form_data = value
            app.student_id = request.session.get('student_id', '')
            app.save()
            re['error'] = error(1, '报名成功')
            re['reg_id'] = str(app.id)
            re['from_data'] = app.form_data
            re['act_id'] = act_id
            re['state'] = app.state
    else:
        re['error'] = error(2, '错误，需要POST')
    return HttpResponse(json.dumps(re), content_type = 'application/json')

def get_list(request, act_id):
    re = dict()
    if request.method == 'GET':
        try:
            act = Activity.objects.get(id = act_id)
        except:
            re['error'] = error(10, '活动id不存在')
        else:
            input_key = request.GET.get('security_key', '')
            if check_auth(request, act_id, input_key, act):
                reg_list = Registration.objects(act_id = act_id)
                re['list'] = json.loads(reg_list.to_json())
                re['error'] = error(1, '获取成功')
            else:
                re['error'] = error(2, '没有权限')
    else:
        re['error'] = error(2, '错误，需要GET')
    return HttpResponse(json.dumps(re), content_type = 'applicaiton/json')

def current_num(request, act_id):
    re = dict()
    if request.method == 'GET':
        try:
            act = Activity.objects.get(id = act_id)
        except:
            re['error'] = error(10, '活动id不存在')
        else:
            reg_list = Registration.objects(act_id = act_id)
            re['current_num'] = len(reg_list)
            re['error'] = error(1, '获取成功')
    else:
        re['error'] = error(2, '错误，需要GET')
    return HttpResponse(json.dumps(re), content_type = 'applicaiton/json')
    
def get_csv(request, act_id):
    re = dict()
    if request.method == 'GET':
        try:
            act = Activity.objects.get(id = act_id)
        except:
            re['error'] = error(10, '活动id不存在')
        else:
            input_key = request.GET.get('security_key', '')
            if check_auth(reuqest, act_id, input_key, act):
                import csv
                response = HttpResponse(content_type = 'text/csv')
                response['Content-Disposition'] = 'attachment; filename=info.csv'
                reg_list = Registration.objects(act_id = act_id)
                writer = csv.writer(response)  
                response.write('\xEF\xBB\xBF')
                header = ['活动id', '活动名称', '报名者姓名', '报名者手机', '报名者邮箱', '审批状态']
                writer.writerow(header)
                for reg in reg_list:
                    row_info = []
                    row_info.append(unicode(reg.act_id).encode('utf-8'))
                    row_info.append(unicode(act.name).encode('utf-8'))
                    row_info.append(unicode(reg.name).encode('utf-8'))
                    row_info.append(unicode(reg.cellphone).encode('utf-8'))
                    row_info.append(unicode(reg.email).encode('utf-8'))
                    row_info.append(unicode(reg.state).encode('utf-8'))
                    writer.writerow(row_info)
                return response
            else:
                re['error'] = error(2, '错误没有活动权限')
    else:
        re['error'] = error(2, '错误，需要GET')
    return HttpResponse(json.dumps(re), content_type = 'application/json')
    
def set_registration(request, act_id, reg_id):
    re = dict()
    if request.method == 'POST':
        form_data_string = request.POST.get('form_data', '[]')
        try:
            form_data = json.loads(form_data_string)
        except:
            form_data = json.loads('[]')
        try:
            act = Activity.objects.get(id = act_id)
            reg = Registration.objects.get(act_id = act_id, id = reg_id)
            reg.form_data = form_data
            reg.save()
            re['error'] = error(1, '设置成功')
            re['reg_id'] = str(reg.id)
            re['form_data'] = reg.form_data
            re['act_id'] = str(act.id)
            re['state'] = reg.state
        except Activity.DoesNotExist:
            re['error'] = error(10, '活动id不存在')
        except Registration.DoesNotExist:
            re['error'] = error(10, '报名id不存在')
    else:
        re['error'] = error(2, '错误，需要POST')
    return HttpResponse(json.dumps(re), content_type = 'applicaiton/json')

def delete_registration(request, reg_id):
    re = dict()
    if request.method == 'POST':
        try:
            reg = Registration.objects.get(id = reg_id)
        except Registration.DoesNotExist:
            re['error'] = error(10, '报名id不存在')
        else:
            reg_bkp = RegBackup(state=reg.state,act_id=reg.act_id,name=reg.name,cellphone=reg.cellphone,email=reg.email,form_data=reg.form_data,has_file=reg.has_file,student_id=reg.student_id)
            reg_bkp.save()
            reg.delete()
            re['error'] = error(1, '删除成功')
            re['reg_id'] = str(reg.id)
    else:
        re['error'] = error(2, '错误，需要POST')
    return HttpResponse(json.dumps(re), content_type = 'applicaiton/json')
    
def approval(request, act_id, reg_id):
    re = dict()
    if request.method == 'POST':
        state = request.POST.get('state', '')
        security_key = request.POST.get('security_key', '')
        send_notification = request.POST.get('send_notification', '')
        try:
            act = Activity.objects.get(id = act_id)
            if check_auth(request, act_id, security_key, act):
                reg = Registration.objects.get(act_id=act_id, id=reg_id)
                reg.state = state if state != '' else reg.state
                reg.save()
                if send_notification.lower() == 'true':
                    #TODO send
                    pass
                re['error'] = error(1, '操作成功')
                re['reg_id'] = str(reg.id)
                re['form_data'] = reg.form_data
                re['act_id'] = str(act.id)
                re['state'] = reg.state
            else:
                re['error'] = error(3, '没有活动权限')
        except Activity.DoesNotExist:
            re['error'] = error(10, '活动id不存在')
        except Registration.DoesNotExist:
            re['error'] = error(10, '报名id不存在')
    else:
        re['error'] = error(2, '错误，需要POST')
    return HttpResponse(json.dumps(re), content_type = 'applicaiton/json')

def regist_all(request, act_id):
    agent = request.META.get('HTTP_USER_AGENT', "")
    act = Activity.objects.get(id=act_id)
    if check_mobile(agent) and act.auth_user != 1:
        from django.shortcuts import render_to_response
        if request.method == 'POST':
            try:
                act = Activity.objects.get(id=act_id)
            except:
                return render_to_response('mobile/message.html', {'message':'活动不存在'})
            else:
                import time
                today = time.strftime('%Y-%m-%d %H:%M:%S',time.localtime(time.time() + 8 * 60 * 60))
                if today<act.reg_start and act.reg_start and act.reg_start != '':
                    return render_to_response('mobile/message.html', {'message':'未到活动报名时间', 'title': '报名失败'})
                if today>act.reg_end and act.reg_end and act.reg_end != '':
                    return render_to_response('mobile/message.html', {'message':'已过活动报名时间', 'title': '报名失败'})
                if act.total != -1 and act.total != '':
                    count = Registration.objects(act_id=act_id).count()
                    if count >= act.total:
                        return render_to_response('mobile/message.html', {'message':'报名名额已满', 'title': '报名失败'})
                name = request.POST.get('name', '')
                cellphone = request.POST.get('cellphone', '')
                email = request.POST.get('email', '')
                form_data = []
                for item in act.s_form:
                    if item['type'] != 'checkbox':
                        form_data.append({'data':request.POST.get(item['label'], ''), 'label':item['label']})
                    else:
                        form_data.append({'data':request.POST.getlist(item['label'] + '[]'), 'label':item['label']})
                apps = Registration.objects(act_id=act_id, form_data=form_data)
                if len(apps) >= 1:
                    return render_to_response('mobile/message.html', {'message':'~(≧▽≦)/~ 您已成功提交，请不要重复提交', 'title': '报名失败'})
                app = Registration()
                app.act_id = act_id
                app.name = name
                app.cellphone = cellphone
                app.email = email
                app.form_data = form_data 
                app.save()
                return render_to_response('mobile/message.html', {'message':'提交成功', 'title': '提交成功'})
        elif request.method == 'GET':
            try:
                act = Activity.objects.get(id=act_id)
            except:
                return render_to_response('mobile/message.html', {'message':'活动不存在', 'title': '提交失败'})
            else:
                context = {}
                context['act_id'] = act_id
                context['name'] = act.name
                context['description'] = act.description
                context['s_form'] = act.s_form
                context['title'] = act.name + u' 报名'
                return render_to_response('mobile/register.html', RequestContext(request, context))
    else:
        from django.http import HttpResponseRedirect
        return HttpResponseRedirect('/act/' + act_id + '/regist') 
