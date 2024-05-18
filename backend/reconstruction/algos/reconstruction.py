import random
import time

from reconstruction.algos.XRayInfo import XRayInfo


def reconstruction(xrays: [XRayInfo]):
    '''
    :param xrays: x ray images to run reconstruction on
    '''

    # TODO: replace with the method when its done
    pts = []

    for i in range(30000):
        pts.append([random.uniform(-2000, 2000), random.uniform(-2000, 2000), random.uniform(-2000, 2000)])
    return pts


