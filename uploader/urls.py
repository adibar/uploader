from django.conf.urls import patterns, include, url
from resumable.views import ResumableUploadView

import views

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'uploader.views.home', name='home'),
    # url(r'^uploader/', include('uploader.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # url(r'^admin/', include(admin.site.urls)),
)


urlpatterns += patterns('',
    url(r'^$', views.index, name='home'),
	
    url('^upload/$', ResumableUploadView.as_view(), name='upload'),

    url('^index.html/$', views.index, name='index'),
)
