# ActivityOn
An open site for everyone to set up &amp;join colorful activities!

branch master used to release, branch src used to dev

# Development Guide

## Prepare

First, make sure you have latest nodejs & npm installed,
MySQL-server is also required
Also, your Python version must be at least 3.5.0, pip should be installed too.

    $ pip install -r requirements.txt
    $ npm install

## Preview
    $ grunt
    $ python manage.py runserver

## Release
    $ grunt build

# 注意！

ActivityOn/settings.py中写死了mysql的配置。。本地mysql的帐号密码自己改一下就好。。数据库名字还是按照settings来就行
这次settings有别的地方改了 就不加到gitignore里了 之后会添加进去 之后如果更新了settings会特别说明

python版本3.5.0