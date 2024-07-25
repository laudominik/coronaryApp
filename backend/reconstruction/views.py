import numpy as np
import base64
import json

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt  # Allow request without csrf_token set
from rest_framework.decorators import api_view
from PIL import Image
from io import BytesIO

from xray_angio_3d import reconstruction
from reconstruction.parser import parse_reconstruction_params, parse_generation_params
from vessel_tree_generator.module import *
from xray_angio_3d.manual.parameters.parser.manual_parameters_parser import ManualParametersParser
from xray_angio_3d.manual.service import kalmykova_service


@api_view(['POST'])
def auto_reconstruction_worker(request):
    if request.method != 'POST':
        return JsonResponse({"status": 400, "message": "Bad request", "reason": "Wrong method"})

    # TODO: get reconstruction params and validate them
    xrays, msg = parse_reconstruction_params(request.body)
    if not xrays:
        return JsonResponse({"status": 400, "message": msg})

    print("[RECONSTRUCTION] pending...")
    pts = reconstruction(xrays)
    print("[RECONSTRUCTION] done")

    pts["status"] = 200
    return JsonResponse(pts)


@api_view(['POST'])
def manual_reconstruction_worker(request):
    if request.method != 'POST':
        return JsonResponse({"status": 400, "message": "Bad request", "reason": "Wrong method"})
    try:
        parameters_parser = ManualParametersParser()
        request_body = json.loads(request.body)
        images_info, points_info = parameters_parser.parse_reconstruction_request(request_body)
    except Exception as e:
        return JsonResponse({"status": 400, "message": "Bad request", "reason": str(e)})
    point = __extract_point_from_info(images_info, points_info)
    reconstruction_response = __map_point_to_response(point)
    return reconstruction_response


def __extract_point_from_info(images_info, points_info):
    print("[POINT] finding...")
    point = kalmykova_service.find_point(points_info, images_info)
    print("[POINT] found")
    return point


def __map_point_to_response(point):
    response = {
        "x": point.x,
        "y": point.y,
        "z": point.z,
        "status": 200,
        "message": "OK"
    }
    return JsonResponse(response)


# TODO: remove this method to another file, and refactor this
@api_view(['POST'])
def generator_worker(request):
    seed, xrays, msg = parse_generation_params(request.body)

    if not xrays:
        return JsonResponse({"status": 1, "msg": msg})

    tree_path = "./vessel_tree_generator/RCA_branch_control_points/moderate"
    vessel_type = "RCA"
    ImagerPixelSpacing = 0.35 / 1000
    print("seed", seed)
    rng = np.random.default_rng(seed=seed)

    # vessel can be None due to invalid subsampling
    vessel = None
    while vessel is None:
        vessel, _, _ = generate_vessel_3d(rng, vessel_type, tree_path, True, False)

    images = []
    for i, xray in enumerate(xrays):
        acq = xray.acquisition_params
        print(acq["sod"], acq["sid"])

        image = make_projection(vessel, acq["alpha"], acq["beta"], acq["sod"], acq["sid"],
                                (ImagerPixelSpacing, ImagerPixelSpacing))
        image = Image.fromarray(image)
        buf = BytesIO()
        image.save(buf, format='PNG')
        img_str = base64.b64encode(buf.getvalue()).decode("utf-8")
        xrays[i].image = f'data:image/png;base64,{img_str}'
        xrays[i].acquisition_params["spacing_r"] = ImagerPixelSpacing
        xrays[i].acquisition_params["spacing_c"] = ImagerPixelSpacing
        xrays[i].filename = f"generated_{acq['alpha']}_{acq['beta']}"
        xrays[i].generated = True

    # return the generated images
    return JsonResponse({
        "status": 200,
        "xrays": [json.dumps(xray.__dict__) for xray in xrays]
    })
