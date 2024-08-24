import json

from django.http import JsonResponse
from rest_framework.decorators import api_view
from reconstruction.manual_parameters_parser import ManualParametersParser
from xray_angio_3d.manual import find_point


@api_view(['POST'])
def manual_reconstruction_worker(request):
    try:
        parameters_parser = ManualParametersParser()
        request_body = json.loads(request.body)
        images_info, points_info = parameters_parser.parse_reconstruction_request(request_body)
    except Exception as e:
        return JsonResponse({"message": "Bad request", "reason": str(e)}, status=400)

    print("[POINT] finding...")
    point = find_point(points_info, images_info)
    print("[POINT] found")
    
    return JsonResponse({
        "x": point.x,
        "y": point.y,
        "z": point.z,
        "message": "OK"
    })
