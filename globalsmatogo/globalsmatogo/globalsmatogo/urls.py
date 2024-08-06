"""globalsmatogo URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include

from web import views as vs

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', vs.sma_index),
    path('sma-news/', vs.sma_news),
    re_path(r'^news/(?P<news_id>\d+)/details/', vs.sma_news_details),
    path('sma-paroisses/', vs.sma_paroisses),
    
    re_path(r'^ckeditor/', include('ckeditor_uploader.urls')),
    
    path('projets-sma/', vs.sma_projets),
    path('conseil-provincial/', vs.sma_conseil_provincial),
    path('nos-membres/', vs.sma_nos_membres),
    path('notre-histoire/', vs.sma_notre_histoire),
    path('nos-communautes/', vs.sma_nos_communautes),
    path('sma-contact/', vs.sma_contact),
    path('sma-tv/', vs.sma_tv),
    path('gallery/photos/', vs.sma_gallery_photo),
    
    re_path(r'^paroisse/(?P<p_id>\d+)/details/', vs.sma_paroisse_details),
    
    re_path(r'^somagg/(?P<content>bureau|somagg|gallery)/', vs.sma_somagg),
    re_path(r'^amicale/(?P<content>jeune|adulte|story)/', vs.sma_amicale),
    re_path(r'^project/(?P<content>leader|details|gallery)/', vs.sma_projects),
]

