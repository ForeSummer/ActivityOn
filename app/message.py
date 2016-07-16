#encoding=utf8
from urllib import quote
import urllib2
import json

TEXT = quote("验证码：1142【hellothu】")
USER = {"accessKey": "30",
        "secretKey": "b1114fe4391a8e5021d1fb2eb01c4e64be5c6c54"}
ADDR = 18911678026

def send_message(user, address, text):
    content = urllib2.urlopen("http://sms.bechtech.cn/Api/send/data/json?accesskey=" + user["accessKey"] + "&secretkey=" + user["secretKey"] + "&mobile=" + str(address) + "&content=" + text).read()
    return json.loads(content)

print send_message(USER, ADDR, TEXT)
