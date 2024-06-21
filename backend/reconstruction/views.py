import numpy as np
import base64
import json

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt  # Allow request without csrf_token set
from rest_framework.decorators import api_view
from PIL import Image
from io import BytesIO

from manual.parameters.parser.manual_parameters_parser import ManualParametersParser
from xray_angio_3d import reconstruction
from reconstruction.parser import parse_reconstruction_params, parse_generation_params
from vessel_tree_generator.module import *


@api_view(['POST'])
def reconstruction_worker(request):
    if request.method != 'POST':
        return JsonResponse({"status": fail, "reason": "wrong method"})

    # TODO: get reconstruction params and validate them
    xrays, msg = parse_reconstruction_params(request.body)
    # print(request.body)
    if not xrays:
        return JsonResponse({"status": 1, "msg": msg})

    print("[RECONSTRUCTION] pending...")
    pts = reconstruction(xrays)

    def flatten(pts):
        flattened = []
        for pt in pts:
            flattened.append(pt[0])
            flattened.append(pt[1])
            flattened.append(pt[2])
        return flattened

    print("[RECONSTRUCTION] done")

    pts["status"] = 0

    return JsonResponse(pts)

    # return JsonResponse({
    #     "status": 0, 
    #     "vessel": flatten(pts['vessel']),
    #     "centerlines": flatten(pts['centerlines']),
    #     "bifurcations": flatten(pts['bifurcations']),
    #     "sources": flatten(pts['sources']),
    #     "shadows": [flatten(pt) for pt in pts['shadows']] 
    #     })


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
        "status": 0,
        "xrays": [json.dumps(xray.__dict__) for xray in xrays]
    })
