import json
import base64
import io
import numpy as np

from PIL import Image

from xray_angio_3d import XRayInfo


GENERIC_MSG = "issue with reconstruction input"
IMAGE_WRONG_SIZE_MSG = "one of the images has wrong size (should be grayscale)"
IMAGE_MISSING_MSG = "one of the images missing"
EMPTY_LIST = "empty xrays list"

def parse_reconstruction_params(body):
    return _parse(json.loads(body))

def _parse(xrays, requires_image=True):
    if xrays is None:
        return _fail(EMPTY_LIST)

    xinfs = []
    for xray in xrays:
        xinfo = XRayInfo()
        if not 'acquisition_params' in xray:
            return _fail()
        acq = xray['acquisition_params']

        if not 'sid' in acq:
            return _fail()
        xinfo.sid = float(acq['sid'])

        if not 'sod' in acq:
            return _fail()
        xinfo.sod = float(acq['sod'])

        if not 'alpha' in acq:
            return _fail()
        xinfo.alpha = float(acq['alpha'])

        if not 'beta' in acq:
            return _fail()
        xinfo.beta = float(acq['beta'])

        if not 'spacing_r' in acq:
            return _fail()
        xinfo.spacing_r = float(acq['spacing_r'])

        if not 'spacing_c' in acq:
            return _fail()
        xinfo.spacing_c = float(acq['spacing_c'])

        if not requires_image:
            xinfs.append(xinfo)
            continue

        if not 'image' in xray:
            return _fail(IMAGE_MISSING_MSG)

        imgb64 = xray['image']
        if imgb64 is None:
            return _fail(IMAGE_MISSING_MSG)
        xinfo.image = _b64_to_numpy(imgb64)
        #TODO: check if shapes are OK
        xinfo.height = xinfo.image.shape[0]
        xinfo.width = xinfo.image.shape[1]
        print(xinfo.image.shape)
        xinfs.append(xinfo)
    return xinfs, None


def parse_generation_params(body):
    bdy = json.loads(body)
    xrays, msg =  _parse(bdy["xrays"], requires_image=False)
    print(bdy["xrays"])
    return bdy['seed'], xrays, msg

def _b64_to_numpy(b64):
    format, imgstr = b64.split(';base64,')
    image = base64.b64decode(imgstr)     
    image = Image.open(io.BytesIO(image))
    image = np.array(image)
    return image


def _fail(msg=GENERIC_MSG):
    return None, msg