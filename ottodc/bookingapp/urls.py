from django.urls import path

from . import views
from .views import index

otto_urls = [
    path('', views.index, name='index'),
    path('dealer/', views.dealer_details, name='dealer_details'),

]
