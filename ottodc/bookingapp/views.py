import openpyxl
from django.http import HttpResponse
from django.shortcuts import render
from .functions import excel_sheet_data_extraction
from django import forms
from . import forms

def index(request):
    form = forms.DocumentForm()
    return render(request, 'upload.html', {'form': form})


def dealer_details(request):
    if request.method == 'POST':
        field_name_in_form = 'docfile'
        file = request.FILES[field_name_in_form]
        dealer_detail = excel_sheet_data_extraction(file)
        print(dealer_detail)
    return HttpResponse('uoloaded')

