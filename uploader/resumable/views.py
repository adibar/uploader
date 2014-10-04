# -*- coding: utf-8 -*-
from django.conf import settings

from django.views.generic import View
from django.http import HttpResponse
from django.core.exceptions import ImproperlyConfigured
from django.core.files.storage import FileSystemStorage

#from resumable.files import ResumableFile
from files import ResumableFile


class ResumableUploadView(View):
    def get(self, *args, **kwargs):
        """Checks if chunk has allready been sended.
        """
        r = ResumableFile(self.storage, self.request.GET)
        if not (r.chunk_exists or r.is_complete):
            return HttpResponse('get chunk not found', status=404)
        return HttpResponse('get chunk already exists')

    def post(self, *args, **kwargs):
        """Saves chunks then checks if the file is complete.
        """
        chunk = self.request.FILES.get('file')
        rf = ResumableFile(self.storage, self.request.POST)
        if rf.chunk_exists:
            return HttpResponse('post chunk already exists')
        rf.process_chunk(chunk)
        if rf.is_complete:
            self.process_file(rf.filename, rf.file)
            rf.delete_chunks()
        #import pdb; pdb.set_trace()
        return HttpResponse()

    def process_file(self, filename, file):
        """Process the complete file.
        """
        self.storage.save(filename, file)

    @property
    def chunks_dir(self):
        chunks_dir = getattr(settings, 'FILE_UPLOAD_TEMP_DIR', None)
        if not chunks_dir:
            raise ImproperlyConfigured(
                'You must set settings.FILE_UPLOAD_TEMP_DIR')
        return chunks_dir

    @property
    def storage(self):
        return FileSystemStorage(location=self.chunks_dir)
