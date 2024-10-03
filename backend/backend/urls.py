from django.urls import path
from reconstruction.workers.auto_reconstruction_worker import *
from reconstruction.workers.generation_worker import *
from reconstruction.workers.manual_reconstruction_worker import *
from reconstruction.workers.manual_lines_worker import *

urlpatterns = [
    path('auto', auto_reconstruction_worker),
    path('manual', manual_reconstruction_worker),
    path("generation/", generation_worker),
    path("lines/", manual_lines_worker)
]
