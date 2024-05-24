import random
import time

from .XRayInfo import XRayInfo


def reconstruction(xrays: [XRayInfo]):
    '''
    :param xrays: x ray images to run reconstruction on
    '''

    # TODO: replace with the method when its done
    vessel = []
    sources = []
    shadows = []
    centerlines = []

    for i in range(10000):
        vessel.append([random.uniform(-1, 1), random.uniform(-1, 1), random.uniform(-1, 1)])
    for i in range(10000):
        sources.append([random.uniform(-2000, 2000), random.uniform(-2000, 2000), random.uniform(-2000, 2000)])
    for i in range(10000):
        shadows.append([random.uniform(-2000, 2000), random.uniform(-2000, 2000), random.uniform(-2000, 2000)])
    for i in range(10000):
        centerlines.append([random.uniform(-2000, 2000), random.uniform(-2000, 2000), random.uniform(-2000, 2000)])

    return {
        'vessel': vessel,
        'sources': sources,
        'shadows': shadows,
        'centerlines': centerlines
    }


