from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt # Allow request without csrf_token set
from rest_framework.decorators import api_view

from xray_angio_3d import reconstruction
from reconstruction.parser import parse


@api_view(['POST']) 
def reconstruction_worker(request):
    if request.method != 'POST':
        return JsonResponse({"status": fail, "reason": "wrong method"})

    # TODO: get reconstruction params and validate them
    xrays, msg = parse(request.body)
    # print(request.body)
    if not xrays:
        return JsonResponse({"status": 1, "msg": msg})

    print("[RECONSTRUCTION] pending...")
    pts = reconstruction(xrays)
    flattened = []
    for pt in pts:
        flattened.append(pt[0])
        flattened.append(pt[1])
        flattened.append(pt[2])
    print("[RECONSTRUCTION] done")

    return JsonResponse({"status": 0, "array": flattened})


@api_view(['POST'])
def generator_worker(request):
    pass
