from django.contrib import admin
from .models import *

admin.site.register(UserBase)
admin.site.register(UserActivity)
admin.site.register(UserTimeline)
admin.site.register(Activity)
admin.site.register(UMessage)
