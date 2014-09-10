from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from django.conf import settings
from django.core.urlresolvers import reverse

from django import forms


from resumable.fields import ResumableFileField
class ResumableForm(forms.Form):
    file = ResumableFileField(
        #allowed_mimes=("audio/ogg",),
        upload_url=lambda: reverse('upload'),
        chunks_dir=getattr(settings, 'FILE_UPLOAD_TEMP_DIR')
    )

def index(request):
	#return HttpResponse('cool')
	ldic = {}
	ldic['form'] = ResumableForm()
	return render(request, 'upload.html', ldic )