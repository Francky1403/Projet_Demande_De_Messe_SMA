from django.shortcuts import render, get_object_or_404

from web.models import SMAParoisse, SMAGeneralInfo, SOMAGG, SMAProject, SMANews

def sma_index(request):
    news = SMANews.objects.order_by("-id")
    return render(request, "index.html", {"news": news,})
    
def sma_contact(request):
    return render(request, "contact.html")
    
def sma_news(request):
    return render(request, "news.html")
    
def sma_news_details(request, news_id):
    news = get_object_or_404(SMANews, id=news_id)
    return render(request, "news_details.html", {"news": news,})
    
def sma_paroisses(request):
    paroisses = SMAParoisse.objects.order_by("-id")
    return render(request, "paroisses.html", {"paroisses": paroisses,})
    
def sma_amicale(request, content):
    amicale = SMAGeneralInfo.objects.all()[0]
    return render(request, "amicale.html", {"amicale": amicale, "content": content,})

def sma_projects(request, content):
    project = SMAProject.objects.all()[0]
    return render(request, "projects.html", {"project": project, "content": content,})

def sma_conseil_provincial(request):
    return render(request, "conseil_provincial.html")
    
def sma_nos_membres(request):
    return render(request, "nos_membres.html")
    
def sma_notre_histoire(request):
    return render(request, "notre_histoire.html")
    
def sma_nos_communautes(request):
    return render(request, "nos_communautes.html")
    
def sma_tv(request):
    return render(request, "sma_tv.html")
    
def sma_projets(request):
    return render(request, "projets.html")
    
def sma_gallery_photo(request):
    return render(request, "gallery_photos.html")

def sma_paroisse_details(request, p_id):
    paroisse = get_object_or_404(SMAParoisse, id=p_id)
    return render(request, "paroisse_details.html", {"paroisse": paroisse,})

def sma_somagg(request, content):
    somagg = SOMAGG.objects.all()[0]
    return render(request, "somagg.html", {"somagg": somagg, "content": content,})
  
    