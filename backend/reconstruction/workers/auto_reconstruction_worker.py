from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse
from xray_angio_3d import reconstruction
from reconstruction.parser import parse_reconstruction_params, parse_generation_params

@api_view(['POST'])
def auto_reconstruction_worker(request):
    if request.method != 'POST':
        return JsonResponse({"status": 400, "message": "Bad request", "reason": "Wrong method"})

    xrays, msg = parse_reconstruction_params(request.body)
    if not xrays:
        return JsonResponse({"status": 400, "message": msg})

    print("[RECONSTRUCTION] pending...")
    pts = reconstruction(xrays)
    print("[RECONSTRUCTION] done")

    pts["status"] = 200
    return JsonResponse(pts)