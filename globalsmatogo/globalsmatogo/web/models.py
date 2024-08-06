from django.db import models

from ckeditor_uploader.fields import RichTextUploadingField 

class SMAParoisse(models.Model):
    name = models.CharField(max_length=255, unique=True, verbose_name="Nom de la paroisse")
    desc = models.CharField(max_length=100, verbose_name="Petite description")
    content = RichTextUploadingField(verbose_name="Page de la paroisse")
    
    def __str__(self):
        return self.name
        
class SMAGeneralInfo(models.Model):
    amicale_jeune = RichTextUploadingField(verbose_name="Amicale Jeune")
    amicale_adulte = RichTextUploadingField(verbose_name="Amicale Adulte")
    our_story = RichTextUploadingField(verbose_name="Notre Histoire")
    
class SOMAGG(models.Model):
    bureau = RichTextUploadingField(verbose_name="Le Bureau SOMAGG")
    somagg = RichTextUploadingField(verbose_name="Détails sur SOMAGG")
    gallery = RichTextUploadingField(verbose_name="Gallerie SOMAGG")

class SMAProject(models.Model):
    leader = RichTextUploadingField(verbose_name="Responsables projets SMA")
    details = RichTextUploadingField(verbose_name="Projets de la province")
    gallery = RichTextUploadingField(verbose_name="Gallerie Photos des projets")
    
class SMANews(models.Model):
    title = models.CharField(max_length=255)
    add_date = models.DateField(auto_now_add=True)
    desc = models.CharField(max_length=250)
    details = RichTextUploadingField(verbose_name="Contenu de l'actualité")
    
    def __str__(self):
        return self.title
