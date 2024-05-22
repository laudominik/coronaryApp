import numpy as np

from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt # Allow request without csrf_token set
from rest_framework.decorators import api_view

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

    return JsonResponse({
        "status": 0, 
        "vessel": flatten(pts['vessel']),
        "centerlines": flatten(pts['centerlines']),
        "shadows": flatten(pts['shadows']),
        "sources": flatten(pts['sources'])
        })


@api_view(['POST'])
def generator_worker(request):
    #random.seed(seed)

    # TODO: parse request
    seed, xrays, msg = parse_generation_params(request.body)

    if not xrays:
        return JsonResponse({"status": 1, "msg": msg})

    tree_path = "./vessel_tree_generator/RCA_branch_control_points/moderate"
    vessel_type = "RCA"
    ImagerPixelSpacing = 0.35 / 1000

    if seed is not None:
        np.random.seed(seed)
    rng = np.random.default_rng()

    # vessel can be None due to invalid subsampling
    vessel = None
    while vessel is None:
        vessel, _, _ = generate_vessel_3d(rng, vessel_type, tree_path, True, False)
    import matplotlib.pyplot as plt
    for xray in xrays:
        image = make_projection(vessel, xray.alpha, xray.beta, xray.sod, xray.sid, (ImagerPixelSpacing, ImagerPixelSpacing))
    
    # return the generated images
    return JsonResponse({
        "status": 0
        })