import json

from django.http import JsonResponse
from rest_framework.decorators import api_view

from manual.lines.finder.kalmykova_lines_finder import KalmykovaLinesFinder
from manual.parameters.parser.manual_parameters_parser import ManualParametersParser


@api_view(['POST'])
def manual_lines_worker(request):
    if request.method != 'POST':
        return JsonResponse({"status": 400, "message": "Bad request"})
    try:
        parameters_parser = ManualParametersParser()
        request_body = json.loads(request.body)
        images_info, point_info = parameters_parser.parse_request_body_to_parameters(request_body)
    except Exception as e:
        return JsonResponse({"status": 400, "message": "Bad request", "reason": str(e)})
    lines = _extract_lines_from_info(images_info, point_info)
    lines_response = _map_lines_to_response(lines)
    print(lines_response)
    return lines_response


def _extract_lines_from_info(images_info, point_info):
    print("[LINES] finding...")
    lines_finder = KalmykovaLinesFinder(images_info)
    lines = lines_finder.find_lines(point_info)
    print("[LINES] found")
    return lines


def _map_lines_to_response(lines):
    lines_json = {
        "lines": lines,
        "status": 200,
        "message": "OK"
    }
    return JsonResponse(json.dumps(lines_json))
