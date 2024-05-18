import json
import base64
import io
import numpy as np

from PIL import Image

from reconstruction.algos.XRayInfo import XRayInfo


GENERIC_MSG = "issue with reconstruction input"
IMAGE_WRONG_SIZE_MSG = "one of the images has wrong size (should be grayscale)"
IMAGE_MISSING_MSG = "one of the images missing"


def parse(body):
    bdy = json.loads(body)

    xinfs = []
    for xray in bdy:
        xinfo = XRayInfo()
        if not 'acquisition_params' in xray:
            return _fail()
        acq = xray['acquisition_params']

        if not 'sid' in acq:
            return _fail()
        xinfo.sid = acq['sid']

        if not 'sod' in acq:
            return _fail()
        xinfo.sod = acq['sod']

        if not 'alpha' in acq:
            return _fail()
        xinfo.alpha = acq['alpha']

        if not 'beta' in acq:
            return _fail()
        xinfo.beta = acq['beta']

        if not 'spacing_r' in acq:
            return _fail()
        xinfo.spacing_r = acq['spacing_r']

        if not 'spacing_c' in acq:
            return _fail()
        xinfo.spacing_c = acq['spacing_c']

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


def _b64_to_numpy(b64):
    format, imgstr = b64.split(';base64,')
    image = base64.b64decode(imgstr)     
    image = Image.open(io.BytesIO(image))
    image = np.array(image)
    return image


def _fail(msg=GENERIC_MSG):
    return None, msg