import random
import time
import matplotlib.pyplot as plt
import numpy as np

from .XRayInfo import XRayInfo
from .filters import filt, filt_closest
from .util import construct_cube, skeletonize


def reconstruction(xrays: [XRayInfo]):
    '''
    :param xrays: x ray images to run reconstruction on
    '''

    sod_max = max(xray.acquisition_params['sod'] for xray in xrays)
    sid_min = min(xray.acquisition_params['sid'] for xray in xrays)
    spacing_max = max(max(xray.acquisition_params['spacing_r'], xray.acquisition_params['spacing_c']) for xray in xrays)
    wh_max = max(max(xray.width, xray.height) for xray in xrays)
    radius = sod_max * spacing_max * wh_max / 2 / sid_min

    vessel = __get_vessel(radius, xrays)
    centerlines = __get_centerlines(vessel, xrays)

    # TODO: replace with the method when its done
    sources = []
    shadows = []
    bifurcations = []
    for i in range(10000):
        sources.append([random.uniform(-2000, 2000), random.uniform(-2000, 2000), random.uniform(-2000, 2000)])
    for i in range(10000):
        shadows.append([random.uniform(-2000, 2000), random.uniform(-2000, 2000), random.uniform(-2000, 2000)])
    for i in range(10000):
        bifurcations.append([random.uniform(-2000, 2000), random.uniform(-2000, 2000), random.uniform(-2000, 2000)])
    
    # TODO: subsample from it so that we do not send too much points to frontend
    return {
        'vessel': vessel,
        'bifurcations': bifurcations,
        'centerlines': centerlines,
        'sources': sources,
        'shadows': shadows
    }


def __get_vessel(radius, xrays):
    vessel = construct_cube(radius, dimension=100)
    for xray in xrays:
        image = xray.image
        proj = np.transpose(np.nonzero(image))
        vessel = filt(vessel, proj, xray)
    return vessel


def __get_centerlines(vessel, xrays):
    centerlines = vessel
    for xray in xrays:
        skel =  skeletonize(xray.image.astype(np.uint8))
        proj = np.transpose(np.nonzero(skel))
        centerlines = filt_closest(centerlines, proj, xray)
    return centerlines
