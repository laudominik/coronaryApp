import json

from django.http import JsonResponse
from rest_framework.decorators import api_view

from reconstruction.manual_parameters_parser import ManualParametersParser
from xray_angio_3d.manual import find_lines


@api_view(['POST'])
def manual_lines_worker(request):
    try:
        parameters_parser = ManualParametersParser()
        request_body = json.loads(request.body)
        images_info, point_info = parameters_parser.parse_lines_request(request_body)
    except Exception as e:
        return JsonResponse({"status": 400, "message": "Bad request", "reason": str(e)})
    print("[LINES] finding...")
    lines = find_lines(point_info, images_info)
    print("[LINES] found")
    
    return JsonResponse({
        "a": [a for (a, b) in lines],
        "b": [b for (a, b) in lines],
        "status": 200,
        "message": "OK"
    })
