"""ActivityOn URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.8/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Add an import:  from blog import urls as blog_urls
    2. Add a URL to urlpatterns:  url(r'^blog/', include(blog_urls))
"""
from django.conf.urls import patterns, include, url
import app.views
from django.contrib import admin
admin.autodiscover()

urlpatterns = [
    url(r'^$', app.views.index),
    url(r'^admin/',admin.site.urls),
    url(r'^api/user/regist',app.views.register),
    url(r'^api/user/login',app.views.login),
    url(r'^user/',app.views.ReturnNone),
    url(r'^act/',app.views.ReturnNone),
    url(r'^api/user/logout',app.views.logout),
    url(r'^api/user/modify$',app.views.modify),
    url(r'^api/user/password/modify',app.views.modifyPassword),
    url(r'^api/user/info/$',app.views.info),
    url(r'^api/act/create',app.views.Create_Activity),
    url(r'^api/act/info/$',app.views.Get_Activity),
    url(r'^api/act/modify',app.views.modify_Activity),
    url(r'^api/act/join',app.views.participate),
    url(r'^api/act/UAinfo/$',app.views.Get_UserActivity),
    url(r'^api/act/ReInfo/$',app.views.Get_Register),
    url(r'^api/act/accept',app.views.Accept),
    url(r'^api/act/reject',app.views.Reject),
    url(r'^api/act/delete/$',app.views.Delete_Activity),
    url(r'^api/user/follow$',app.views.Follow),
    url(r'^api/user/unfollow',app.views.Unfollow),
    url(r'^api/user/followInfo/$',app.views.GetFollow),
    url(r'^api/user/timeline',app.views.GetTimeline),
    url(r'^api/user/changeAvatar',app.views.ChangeAvatar),
    url(r'^api/user/message',app.views.GetMessage),
    url(r'^api/act/search/$',app.views.Search),
    url(r'^api/user/const/$',app.views.GetNum),
    url(r'^api/user/isFollowed',app.views.IsFollowed),
    url(r'^api/user/ispart',app.views.IsParticipated),
    url(r'^api/user/unregist',app.views.UnParticipate),
    url(r'^api/user/avatar/$',app.views.GetAvatar),
]


