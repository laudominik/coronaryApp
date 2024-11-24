from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse
from xray_angio_3d import reconstruction
from reconstruction.parser import parse_reconstruction_params, parse_generation_params

@api_view(['POST'])
def auto_reconstruction_worker(request):
    if request.method != 'POST':
        return JsonResponse({"message": "Bad request", "reason": "Wrong method"}, status=400)

    xrays, msg = parse_reconstruction_params(request.body)
    if not xrays:
        return JsonResponse({"message": "Bad request", "reason": msg}, status=400)

    print("[RECONSTRUCTION] pending...")
    pts = reconstruction(xrays)
    print("[RECONSTRUCTION] done")

    return JsonResponse(pts)