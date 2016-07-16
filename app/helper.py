# coding=utf-8
import urllib,urllib2

def sendsms(cellphone, content):
    params = urllib.urlencode({'accesskey':30, 'secretkey':"b1114fe4391a8e5021d1fb2eb01c4e64be5c6c54", 'mobile':cellphone,'content':content})  # insecure
    f = urllib.urlopen("http://sms.bechtech.cn/Api/send/data/json?" + params)
    print f.read()

def sendact_manage_sohu(email_addr, act_name, act_url, act_securitykey):
    params = urllib.urlencode({
        'template_invoke_name':u'act_manage',
        'substitution_vars': ('{"to":["' + email_addr + '"], "sub": {"act_name": ["' + act_name + '"], "act_url": ["' + act_url + '"], "act_securitykey": ["' + act_securitykey + '"]}}').encode('utf-8'),
        'subject': (act_name + u' 报名管理页面').encode('utf-8'),
        'fromname': u'我去'.encode('utf-8'),
        'from': 'zhixing.thu@gmail.com',
        'api_user': 'postmaster@zhixing.sendcloud.org',
        'api_key': 'GcrwJv35hP3T2Xcv'
    })
    mail_url = 'https://sendcloud.sohu.com/webapi/mail.send_template.xml'
    res = urllib2.urlopen(mail_url, params)
    return res.read()

def sendact_manage_tsh(email_addr, act_name, act_url, act_securitykey):
    import smtplib
    from email.mime.text import MIMEText
    to_list = [email_addr]
    mail_host="mail.tsinghua.edu.cn"  #设置服务器
    mail_user="xinxi"    #邮箱用户名
    mail_postfix="tsinghua.edu.cn"  #发件箱的后缀
    mail_username="xinxi@tsinghua.edu.cn"    #登录用户名
    mail_password="blooming"   #口令

    content = u"""
<div style="width: 600px;padding: 0px;border:1px solid #ccc;">
	<div style="background-color: #5586e1;color: white;height: 45px;line-height: 15px;padding-left: 10px;font-size: 15px;">
		<div style="float:left;">
			<a href="http://wq.zhixingthu.com" target="_blank">
				<img src="http://wq.zhixingthu.com/static/images/logo.png" style="height: 40px;display: inline;">
			</a>
		</div>
		<div style="float:left;padding-top:13px;">
			<span>高效便捷的校园活动报名平台</span>
		</div>
	</div>
	<div style="padding: 15px;min-height: 150px;">
		<h2>%s&nbsp;管理界面</h2>
		<div style="width:97%%;border-bottom:1px solid #ccc;height:1px;">&nbsp;</div>
		<p>活动管理安全码: &nbsp;&nbsp;%s<br>活动管理页面管理: &nbsp;&nbsp;
			<a href="%s" target="_blank">%s</a>
		</p>
	</div>
	<p>&nbsp;</p>
	<div style="background-color: #e7e6e5;padding-left: 10px;line-height: 35px;font-size: 13px;">
	Copyright©清华大学校团委成才信息中心 知行组
	</div>
</div>
""" % (act_name, act_securitykey, act_url, act_url)

    me = u"我去网" + "<" + mail_user + "@" + mail_postfix + ">"   #这里的hello可以任意设置，收到信后，将按照设置显示
    msg = MIMEText(content, _subtype='html', _charset='UTF-8')    #创建一个实例，这里设置为html格式邮件
    msg['Subject'] = act_name + u" 报名管理页面"    #设置主题
    msg['From'] = me
    msg['To'] = ";".join(to_list)

    try:
        s = smtplib.SMTP()
        s.connect(mail_host)  #连接smtp服务器
        s.login(mail_username, mail_password)  #登陆服务器
        s.sendmail(me, to_list, msg.as_string())  #发送邮件
        s.close()
        return "<success></success>"
    except Exception, e:
        return "<error>" + str(e) + "</error>"

sendact_manage = sendact_manage_tsh
