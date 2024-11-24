import numpy as np
import  base64
import json

from vessel_tree_generator.module import *
from rest_framework.decorators import api_view
from django.http import JsonResponse, HttpResponse
from reconstruction.parser import parse_generation_params
from PIL import Image
from io import BytesIO


TREE_PATH="./vessel_tree_generator/RCA_branch_control_points/moderate"
VESSEL_TYPE="RCA"
PIXEL_SPACING = 0.35 / 1000

@api_view(['POST'])
def generation_worker(request):
    _, xrays, msg = parse_generation_params(request.body)
    if not xrays: return JsonResponse({"message": "Bad request", "reason": msg}, status=400)
    
    vessel =  __ensure_generate_vessel_3d()

    projected = map(lambda xray : __projection(xray, vessel), xrays)
    return JsonResponse({
        "xrays": [json.dumps(xray.__dict__) for xray in projected],
        "message": "OK"
    })

def __ensure_generate_vessel_3d():
    # vessel can be None due to invalid subsampling
    rng = np.random.default_rng()
    vessel = None
    while vessel is None: vessel, _, _ = generate_vessel_3d(rng, VESSEL_TYPE, TREE_PATH, True, False)
    return vessel

def __projection(xray, vessel):
    acq = xray.acquisition_params
    image = make_projection(vessel, acq["alpha"], acq["beta"], acq["sod"], acq["sid"],(PIXEL_SPACING, PIXEL_SPACING))
    image = Image.fromarray(image)
    buf = BytesIO()
    image.save(buf, format='PNG')
    img_str = base64.b64encode(buf.getvalue()).decode("utf-8")
    xray.image = f'data:image/png;base64,{img_str}'
    xray.image = f'data:image/png;base64,{img_str}'
    xray.acquisition_params["spacing_r"] = PIXEL_SPACING
    xray.acquisition_params["spacing_c"] = PIXEL_SPACING
    xray.filename = f"generated_{acq['alpha']}_{acq['beta']}"
    xray.generated = True
    return xray