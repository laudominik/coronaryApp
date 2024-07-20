import json
import cv2

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

    path = r'D:\Projekty\coronary3D\data\kalmyk\images\kalmyk\image0010c.png'
    image = cv2.imread(path)
    for point in lines[0]:
        cv2.circle(image, (int(point[0]), int(point[1])), 5, (255, 255, 0), 1)

    cv2.imshow("image", image)
    while True:
        if cv2.waitKey(0) == ord('x'): break
    lines_response = _map_lines_to_response(lines)
    return lines_response


def _extract_lines_from_info(images_info, point_info):
    print("[LINES] finding...")
    lines_finder = KalmykovaLinesFinder(images_info)
    lines = lines_finder.find_lines(point_info)
    print("[LINES] found")
    return lines


def _map_lines_to_response(lines):
    lines_json = {
        "lines": [line.tolist() for line in lines],
        "status": 200,
        "message": "OK"
    }
    return JsonResponse(lines_json)
