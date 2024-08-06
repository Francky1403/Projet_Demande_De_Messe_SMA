from django.contrib import admin



from web.models import (
    SOMAGG,
    SMAParoisse,
    SMAGeneralInfo,
    SMAProject,
    SMANews,
)

admin.site.register(SOMAGG)
admin.site.register(SMAGeneralInfo)
admin.site.register(SMAParoisse)
admin.site.register(SMAProject)
admin.site.register(SMANews)

