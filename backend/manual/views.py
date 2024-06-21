from django.http import JsonResponse
from rest_framework.decorators import api_view

from manual.parameters.parser.manual_parameters_parser import ManualParametersParser


@api_view(['POST'])
def manual_lines_worker(request):
    if request.method != 'POST':
        return JsonResponse({"status": 400, "message": "Bad request"})
    try:
        parameters_parser = ManualParametersParser()
        images_info, point_info = parameters_parser.parse_request_body_to_parameters(request.body)
    except ValueError as e:
        return JsonResponse({"status": 400, "message": "Bad request", "reason": e})
    lines = _extract_lines_from_info(images_info, point_info)
    return JsonResponse(lines)

def _extract_lines_from_info(images_info, point_info):
    print("[LINES] finding...")
    lines_finder = KalmykovaLinesFinder(images_info)
    lines = lines_finder.find_lines(point_info)
    lines["status"], lines["message"] = 200, "OK"
    print("[LINES] found")
    return lines
