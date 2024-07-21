import json

from django.http import JsonResponse
from rest_framework.decorators import api_view

from xray_angio_3d.manual.parameters.parser.manual_parameters_parser import ManualParametersParser
from xray_angio_3d.manual.service import kalmykova_service


@api_view(['POST'])
def manual_lines_worker(request):
    if request.method != 'POST':
        return JsonResponse({"status": 400, "message": "Bad request"})
    try:
        parameters_parser = ManualParametersParser()
        request_body = json.loads(request.body)
        images_info, point_info = parameters_parser.parse_lines_request(request_body)
    except Exception as e:
        return JsonResponse({"status": 400, "message": "Bad request", "reason": str(e)})
    lines = __extract_lines_from_info(images_info, point_info)
    lines_response = __map_lines_to_response(lines)
    return lines_response


def __extract_lines_from_info(images_info, point_info):
    print("[LINES] finding...")
    lines = kalmykova_service.find_lines(point_info, images_info)
    print("[LINES] found")
    return lines


def __map_lines_to_response(lines):
    lines_json = {
        "service": [line.tolist() for line in lines],
        "status": 200,
        "message": "OK"
    }
    return JsonResponse(lines_json)
