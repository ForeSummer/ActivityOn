# -*- coding: utf-8 -*-
from django.shortcuts import render, render_to_response
from datetime import datetime 
from django.http import HttpResponse
from django.template import RequestContext
from .models import *
from django.contrib.auth import authenticate
from django.template import loader
import json
import os
# Create your views here.

def index(request):
    request.META["CSRF_COOKIE_USED"] = True
    context = {
        'role': request.session.get('role', 1)
    }
    return render_to_response('index.html', RequestContext(request, context))
        
def test(request):
    return HttpResponse('test')

def ChangeAvatar(request):
    UID = request.GET.get('UID')
    f = request.FILES['file']
    destination = open('static/images/'+str(UID)+'.png', 'wb+')
    for chunk in f.chunks():
        destination.write(chunk)
    destination.close()
    user = UserBase.objects,get(UId = int(UID))
    user.UAvatar = 'static/images/'+str(UID)+'.png'
    user.save()
    return HttpResponse({'Avatar':user.UAvatar})

def register(request):
    try :
        user = UserBase.objects.get(UPrivateEmail = request.POST.get('privateemail'))
    except UserBase.DoesNotExist:
        try: 
            user = UserBase.objects.get(UName = request.POST.get('nickname'))
        except UserBase.DoesNotExist:
            p = request.POST
            base = UserBase(UAvatar=p.get('Avatar'),UPrivateEmail = p.get('privateemail'),UPublicEmail = p.get('openemail'),UName = p.get('nickname'),UPassword = p.get('password'))
            me = UMessage(UId = base.UId,MTo ='',MType='',MTime='')
            me.MTo += ',0'
            me.MType += ',0'
            me.MTime += ','+str(datetime.now())
            me.save()
            base.save()
            ac = UserActivity(UId = base.UId, UInAct = '',UInActNum = 0,UOrganizedAct = '', UOrganizedNum = 0, UTags = '')
            ac.save()
            at = UserTimeline(UId = base.UId)
            at.save()
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
        request.session['UID']=user.UId
        return  HttpResponse(json.dumps({"ErrorCode":1,"UID":user.UId,'Avatar':user.UAvatar}))
    
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
        return HttpResponse(json.dumps({'ErrorCode':1, 'UName':user.UName, 'UID':user.UId, 'UPrivateEmail':user.UPrivateEmail, 'UPublicEmail':user.UPublicEmail, 'UAvatar': user.UAvatar, 'UInfo':user.UInfo, 'UStatus':user.UStatus, 'UFollow':user.UFollow, 'UFollowed':user.UFollowed, 'UMessage':user.UMessage}))

def modify(request):
    try:
        user = UserBase.objects.get(UId = request.POST.get('UID'))
    except UserBase.DoesNotExist:
        return HttpResponse(json.dumps({'ErrorCode':0}))
    else:
        if 'UName' in request.POST:
            user.UName = request.POST.get('UName')
        if 'UInfo' in request.POST:
            user.UInfo = request.POST.get('UInfo')
        if 'UPublicEmail' in request.POST:
            user.UPublicEmail = request.POST.get('UPublicEmail')
        user.save()
        return HttpResponse(json.dumps({'ErrorCode':1}))


def modifyPassword(request):
    try:
        user = UserBase.objects.get(UId = request.POST.get('UID'),UPassword = request.POST.get('UPassword'))
    except UserBase.DoesNotExist:
        return HttpResponse(json.dumps({'ErrorCode':0}))
    else:
        user.UPassword = request.POST.get('NewUPassword')
        user.save()
        return HttpResponse(json.dumps({'ErrorCode':1}))


def Create_Activity(request):
    re = dict()
    if request.method == 'POST':
        act = Activity()
        p = request.POST
        act.AStatus = int(0)
        act.AType = int(p.get('Type'))
        act.AAdmin = int(p.get('Admin'))
        act.AMaxRegister = p.get('MaxRegister')
        act.AEntryDDL = p.get('EntryDDL')
        act.AStartTime = p.get('StartTime')
        act.AEndTime = p.get('EndTime')
        act.ATitle = p.get('Title')
        act.ALocation = p.get('Location')
        act.AInfo = p.get('Info')
        act.ASummary = p.get('Summary')
        act.ACreateTime = datetime.now()
        act.save()
        UActivity = UserActivity.objects.get(UId = p.get('Admin'))
        UActivity.UOrganizedAct += ','+str(act.AId)
        UActivity.UOrganizedNum +=1
        UActivity.save()
        re['ErrorCode'] = 1
        re["AID"] = act.AId
        me = UMessage.objects.get(UId = act.AAdmin)
        me.MTo += ','+str(act.AId)
        me.MType += ',1'
        me.MTime += ','+str(datetime.now())
        me.save()
        user = UserBase.objects.get(UId = act.AAdmin)
        if len(user.UFollowed) != 0:
            followedList = list(map(int,user.UFollowed[1:].split(',')))
            for i in followedList:
                ut = UserTimeline.objects.get(UId = i)
                ut.UTimelineFrom += ',' +str(user.UId)
                ut.UTimelineAct += ',' + str(act.AId)
                ut.UTimelineType += ',0'
                ut.UTimelineTime += ',' + str(datetime.now())
                ut.save()
                    
    else :
        re['ErrorCode']=0 
    return HttpResponse(json.dumps(re))

def modify_Activity(request):
    re = dict()
    if request.method == 'POST':
        act = Activity.objects.get(AId = request.POST.get('AID'))
        if 'Type' in request.POST:
            act.AType = request.POST.get('Type')    
        if 'EntryDDL' in request.POST:
            act.AEntryDDL = request.POST.get('EntryDDL')       
        if 'StartTime' in request.POST:
            act.AStartTime = request.POST.get('StartTime')   
        if 'EndTime' in request.POST:
            act.AEndTime = request.POST.get('EndTime')   
        if 'Title' in request.POST:
            act.ATitle = request.POST.get('Title')   
        if 'Location' in request.POST:
            act.ALocation = request.POST.get('Location')   
        if 'Info' in request.POST:
            act.AInfo = request.POST.get('Info')
        if 'Summary' in request.POST:
            act.ASummary = request.POST.get('Summary')
        act.save()
        re['ErrorCode'] = 1
        return HttpResponse(json.dumps(re))
    else :
        re['ErrorCode'] = 0
        return HttpResponse(json.dumps(re))

def Get_Activity(request):
    try:
        act = Activity.objects.get(AId = request.GET.get('AID'))

    except Activity.DoesNotExist:
        return HttpResponse(json.dumps({'ErrorCode':0}))
    else:
        return HttpResponse(json.dumps({'ErrorCode':1,'Admin':act.AAdmin,'Type':act.AType,'Register':act.ARegister,'Unregister':act.AUnregister, 'MaxRegister':act.AMaxRegister,'StartTime':act.AStartTime, 'EntryDDL':act.AEntryDDL,'EndTime':act.AEndTime,'Title':act.ATitle, 'Location':act.ALocation, 'Info':act.AInfo, 'Summary':act.ASummary})) 

def participate(request):
    re = dict()
    if request.method == 'POST':
        try:

            useractivity = UserActivity.objects.get(UId = request.POST.get('UID'))
            activity = Activity.objects.get(AId = request.POST.get('AID'))
        except :
            re['ErrorCode']=0
        else:
            if useractivity.UInAct.find(','+str(activity.AId)) == -1:
                useractivity.UInAct+=','+str(activity.AId)
                useractivity.UInActNum+=1
                activity.AUnregister+= ','+str(useractivity.UId)
                useractivity.save()
                activity.save()
                re['ErrorCode']=1
                me = UMessage.objects.get(UId = useractivity.UId)
                me.MTo += ','+str(activity.AId)
                me.MType += ',2'
                me.MTime += ','+str(datetime.now())
                me.save()
                user = UserBase.objects.get(UId = useractivity.UId)
                if len(user.UFollowed) != 0:
                    followedList = list(map(int,user.UFollowed[1:].split(',')))
                    for i in followedList:
                        ut = UserTimeline.objects.get(UId = i)
                        ut.UTimelineFrom += ',' +str(user.UId)
                        ut.UTimelineAct += ',' + str(activity.AId)
                        ut.UTimelineType += ',1'
                        ut.UTimelineTime += ','+str(datetime.now())
                        ut.save()
            else:
                re['ErrorCode'] = -1
    else :
        re['ErrorCode']=0
    return HttpResponse(json.dumps(re))

def Accept(request):
    re = dict()
    if request.method == 'POST':
        try:
            activity = Activity.objects.get(AId = request.POST.get('AID'))
        except:
            re['ErrorCode']=0
        else:
            activity.ARegister+=','+ str(request.POST.get('UID'))
            activity.AUnregister.replace(','+ str(request.POST.get('UID')),'')
            activity.save()
            me = UMessage.objects.get(UId = request.objects.get('UID'))
            me.MType+= ',3'
            me.MTo += ','+str(activity.AId)
            me.MTime += ','+str(datetime.now())
            me.save()
            re['ErrorCode']=1
    else:
        re['ErrorCode']=0
    return HttpResponse(json.dumps(re))

def Reject(request):
    re = dict()
    if request.method == 'POST':
        try:
            activity = Activity.objects.get(AId = request.POST.get('AID'))
        except:
            re['ErrorCode']=0
        else:
            activity.AUnregister.replace(','+ str(request.POST.get('UID')),'')
            activity.save()
            uact = UserActivity.objects.get(UId = request.POST.get('UID'))
            uact.UInAct.replace(','+str(activity.AId),'')
            uact.save()
            me = UMessage.objects.get(request.POST.get('UID'))
            me.MTo += ','+str(activity.AId)
            me.MType += ',4'
            me.MTime += ','+str(datetime.now())
            me.save()
            re['ErrorCode']=1
    else:
        re['ErrorCode']=0
    return HttpResponse(json.dumps(re))


def Get_UserActivity(request):
    re = dict()
    uact = UserActivity.objects.get(UId = request.GET.get('UID'))
    OAct = []
    if uact.UOrganizedAct!='':
        OActList = list(map(int,(uact.UOrganizedAct[1:]).split(',')))
        for i in OActList:
            act = Activity.objects.get(AId = i)
            OAct.append({'AID':act.AId,'Title':act.ATitle,'StartTime':act.AStartTime,'EndTime':act.AEndTime, 'Location':act.ALocation, 'Summary':act.ASummary})
    IAct = []
    if uact.UInAct != '':
        IActList = list(map(int,uact.UInAct[1:].split(',')))
        for i in IActList:
            act = Activity.objects.get(AId = i)
            IAct.append({'AID':act.AId,'Title':act.ATitle,'StartTime':act.AStartTime,'EndTime':act.AEndTime, 'Location':act.ALocation, 'Summary':act.ASummary})
    re['ErrorCode']=1
    re['InActivity'] = IAct 
    re['OrganizedActivity'] = OAct 
    return HttpResponse(json.dumps(re))

def Get_Register(request):
    re =dict()
    act = Activity.objects.get(AId = request.GET.get('AID'))
    Register = []
    if act.ARegister != '':
        RegisterList = list(map(int,act.ARegister[1:].split(',')))
        for i in RegisterList:
            user = UserBase.objects.get(UId = i)
            Register.append({'UID':user.UId,'Name':user.UName,'Avator':user.UAvator})
    Unregister = []
    if act.AUnregister != '':
        UnregisterList = list(map(int,act.AUnregister[1:].split(',')))
        for i in UnregisterList:
            user = UserBase.objects.get(UId = i)
            Unregister.append({'UID':user.UId,'Name':user.UName,'Avator':None})
    re['ErrorCode']=1
    re['Register'] = Register 
    re['Unregister'] = Unregister 
    return HttpResponse(json.dumps(re))

def Delete_Activity(request):
    re = dict()
    act = Activity.objects.get(AId = request.GET.get('AID'))
    if act.ARegister != '':
        RegisterList = list(map(int,act.ARegister[1:].split(',')))
        for i in RegisterList:
            uact = UserActivity.objects.get(UId = i)
            uact.UInAct.replace(','+str(request.GET.get('AID')),'')
            uact.UInActNum -=1
            uact.save()
    if act.AUnregister != '':
        UnregisterList = list(map(int,act.AUnregister[1:].split(',')))
        for i in UnregisterList:
            uact = UserActivity.objects.get(UId = i)
            uact.UInAct.replace(','+str(request.GET.get('AID')),'')
            uact.UInActNum -=1
            uact.save()
    uact = UserActivity.objects.get(UId = act.AAdmin)
    uact.UOrganizedAct.replace(','+str(request.GET.get('AID')),'')
    uact.UOrganizedNum -=1
    uact.save()
    act.delete()
    re['ErrorCode']=1
    return HttpResponse(json.dumps(re))
   
def GetFollow(request):
    re = dict()
    user = UserBase.objects.get(UId = request.GET.get('UID'))
    follow = []
    if len(user.UFollow) != 0:
        followList = list(map(int,user.UFollow[1:].split(',')))
        for i in followList:
            u = UserBase.objects.get(UId = i)
            follow.append({'UID':u.UId,'Avatar':u.UAvatar,'Name':u.UName})
    followed = []
    if len(user.UFollowed) != 0:
        followedList = list(map(int,user.UFollowed[1:].split(',')))
        for i in followedList:
            u = UserBase.objects.get(UId = i)
            followed.append({'UID':u.UId,'Avatar':u.UAvatar,'Name':u.UName})
    re['ErrorCode'] = 1
    re['Follow'] = follow 
    re['Followed'] = followed 
    return HttpResponse(json.dumps(re))

def Follow(request):
    re = dict()
    user = UserBase.objects.get(UId = request.POST.get('UID'))
    print(user.UId)
    if user.UFollow.find( ','+str(request.POST.get('FollowID'))) == -1:
        user.UFollow += ','+str(request.POST.get('FollowID'))
        print('FOllow')
        user.save()
    fo = UserBase.objects.get(UId = request.POST.get('FollowID'))
    print(fo.UId)
    if fo.UFollowed.find( ','+str(user.UId)) == -1:
        print('Followed')
        fo.UFollowed += ','+str(user.UId)
    fo.save()
    me = UMessage.objects.get(UId = request.POST.get('UID'))
    me.MTime += ','+str(datetime.now())
    me.MType += ',6'
    me.MTo += ','+str(request.POST.get('FollowID'))
    me.save()
    m = UMessage.objects.get(UId = request.POST.get('FollowID'))
    m.MTime += ','+str(datetime.now())
    m.MType += ',5'
    m.MTo += ','+str(request.POST.get('UID'))
    m.save()
    re['ErrorCode'] = 1
    if len(user.UFollowed) != 0:
        followedList = list(map(int,user.UFollowed[1:].split(',')))
        for i in followedList:
            ut = UserTimeline.objects.get(UId = i)
            ut.UTimelineFrom += ',' +str(user.UId)
            ut.UTimelineAct += ',' + str(fo.UId)
            ut.UTimelineType += ',2'
            ut.UTimelineTime += ','+str(datetime.now())
            ut.save()
       
    return HttpResponse(json.dumps(re))

def Unfollow(request):
    try:
        re = dict()
        user = UserBase.objects.get(UId = request.POST.get('UID'))
        if user.UFollow.find(','+str(request.POST.get('UnfollowID')))!=-1: 
            user.UFollow = user.UFollow.replace(','+str(request.POST.get('UnfollowID')),'')   
            user.save()
            re['ErrorCode'] = 1
            
        else:
            re['ErrorCode'] = 0
        uf = UserBase.objects.get(UId = request.POST.get('UnfollowID'))
        if uf.UFollowed.find(','+str(request.POST.get('UID'))) != -1:
            uf.UFollowed = uf.UFollowed.replace(','+str(request.POST.get('UID')),'')
            uf.save()
            re['ErrorCode']=1
        else:
            re['ErrorCode']=0
    except:
        re = {'ErrorCode':-1}
    return HttpResponse(json.dumps(re))

def GetTimeline(request):
    try:
        timeline = UserTimeline.objects.get(UId = request.POST.get('UID'))
        time = datetime.now()
        re = dict()
        tl = []
        if len(timeline.UTimelineFrom) != 0:
            fromList = list(map(int,timeline.UTimelineFrom[1:].split(',')))
            actList = list(map(int,timeline.UTimelineAct[1:].split(',')))
            typeList = list(map(int,timeline.UTimelineType[1:].split(',')))
            timeList = list(timeline.UTimelineTime[1:].split(','))
            start = int(request.POST.get('Start'))
            end = int(request.POST.get('End'))
            for i in range(len(fromList)-start-1 ,len(fromList)-end-2 if (len(fromList)-end-2 > 0 )else -1,-1):
                if typeList[i] != 2:
                    user = UserBase.objects.get(UId = fromList[i])
                    act = Activity.objects.get(AId = actList[i])
                    tl.append({'UID':user.UId,'Avatar':user.UAvatar,'Name':user.UName,'AID':act.AId,'Type':typeList[i],'Title':act.ATitle,'Summary':act.ASummary,'Location':act.ALocation,'Time':timeList[i]})
                else :
                    user = UserBase.objects.get(UId = fromList[i])
                    act = UserBase.objects.get(UId = actList[i])
                    CTime = timeList[i]
                    tl.append({'UID':user.UId,'Avatar':user.UAvatar,'Name':user.UName,'AID':act.UId,'Type':typeList[i],'AAvatar':UserBase.objects.get(UId = act.UId).UAvatar,'AName':act.UName,'Time':CTime})
        re['ErrorCode']=1
        re['Timeline'] = tl
        re['EndTime'] = str(time)
    except:
        re = {'ErrorCode':0}
    return HttpResponse(json.dumps(re))


def GetMessage(request):
    re = dict()
    try:
        message = UMessage.objects.get(UId = request.POST.get('UID'))
        time = datetime.now()
        me = []
        if len(message.MType) != 0:
            ToList = list(map(int,message.MTo[1:].split(',')))
            typeList = list(map(int,message.MType[1:].split(',')))
            timeList = list(message.MTime[1:].split(','))
            start = int(request.POST.get('Start'))
            end = int(request.POST.get('End'))
            for i in range(len(typeList)-start-1 ,len(typeList)-end-2 if (len(typeList)-end-2 > 0 )else -1,-1):
                if typeList[i] == 0:
                    me.append({'UID':message.UId,'Type':typeList[i],'Time':timeList[i]})
                elif typeList[i] < 5:
                    me.append({'UID':message.UId,'Type':typeList[i],'AId':ToList[i],'Title':Activity.objects.get(AId=ToList[i]).ATitle,'Time':timeList[i]})
                else:
                    me.append({'UID':message.UId,'Type':typeList[i],'FUID':ToList[i],'Name':UserBase.objects.get(UId = ToList[i]).UName,'Time':timeList[i]})
        re['ErrorCode']=1
        re['Timeline'] = me
        re['EndTime'] = str(time)
    except :
        re = {'ErrorCode':0}
    return HttpResponse(json.dumps(re))

def Search(request):
    re = dict()
    try:
        actList = []
        typeList = []
        Type = request.GET.get('Type')
        print(Type)
        if Type !=-1:
            try:
                TypeList = Activity.objects.filter(AType= Type)
            except:
                TypeList=[]
        if Type == -1 or len(TypeList) < 10:
            print(len(Activity.objects.all()))
            for i in range(len(Activity.objects.all())-1,len(Activity.objects.all())-11 if len(Activity.objects.all())>11 else -1,-1):
                print(i)
                x = Activity.objects.all()[i]
                print(x)
                actList.append({'AID':x.AId,'Title':x.ATitle,'Summary':x.ASummary,'StartTime':x.AStartTime,'EndTime':x.AEndTime,'Location':x.ALocation,'Summary':x.ASummary})
        print(Type)
        if int(Type) != -1 :
            print('test')
            try:
                TypeList = Activity.objects.filter(AType= Type)
                print(TypeList)
            except:
                TypeList=[]
            print(TypeList)
            for i in TypeList:
                typeList.append({'AID':x.AId,'Title':x.ATitle,'Summary':x.ASummary,'StartTime':x.AStartTime,'EndTime':x.AEndTime,'Location':x.ALocation,'Summary':x.ASummary})
        print('aa')
        re['ActList'] = actList
        re['TypeList'] = typeList
        print('Hello')
    except:
        re['ErrorCode'] = 0
    else:
        re['ErrorCode'] = 1
    return HttpResponse(json.dumps(re))

def GetNum(request):
    re =dict()
    try:
        user = UserBase.objects.get(UId = request.GET.get('UID'))
        uact = UserActivity.objects.get(UId = request.GET.get('UID'))
        re['Follow'] = len(list(map(int,user.UFollow[1:].split(','))))
        re['Followed'] = len(list(map(int,user.UFollowed[1:].split(','))))
        re['InAct'] = uact.UInActNum
        re['OAct'] = uact.UOrganizedNum
        re['ErrorCode'] = 1
    except:
        re['ErrorCode'] = 0
    return HttpResponse(json.dumps(re))

def IsFollowed(request):
    re = dict()
    try:
        user = UserBase.objects.get(UId = request.POST.get('UID'))
        followID = int(request.POST.get('FollowID'))
        followList = list(map(int,user.UFollow[1:].split(',')))
        if followID in followList:
            re['IsFollowed']=True
        else:
            re['IsFollowed']=False
        re['ErrorCode']=1
    except:
        print('111')
        re['ErrorCode']=0
    return HttpResponse(json.dumps(re))

def IsParticipated(request):
    re = dict()
    try:
        uact = UserActivity.objects.get( UId = request.POST.get('UID'))
        AID = int(request.POST.get('AID'))
        InList = list(map(int,uact.UInAct[1:].split(',')))
        if AID in InList:
            re['IsParticipated']=True
        else:
            re['IsParticipated']=False
        re['ErrorCode']=1
    except:
        re['ErrorCode'] = 0
    return HttpResponse(json.dumps(re))

def UnParticipate(request):
    re = dict()
    try:
        UID =  request.POST.get('UID')
        AID = request.POST.get('AID')
        uact = UserActivity.objects.get( UId = UID)
        act = Activity.objects.get(AId = AID)
        if uact.UInAct.find(str(AID)) != -1:
            print(uact.UInAct)
            print(','+str(AID))
            uact.UInActNum -=1
            uact.UInAct.replace(','+str(AID),'')
            print(uact.UInAct)
        if act.ARegister.find(str(UID)) != -1:
            print(uact.UInAct)
            act.ARegister.replace(','+str(UID),'')
            print(uact.UInAct)
        if act.AUnregister.find(str(UID)) != -1:
            print(uact.UInAct)
            act.AUnregister.replace(','+str(UID),'')
            print(uact.UInAct)
        uact.save()
        act.save()
        re['ErrorCode'] = 1
    except:
        re['ErrorCode'] = 0
    return HttpResponse(json.dumps(re))