import random
import time
import matplotlib.pyplot as plt
import numpy as np

from .XRayInfo import XRayInfo
from .filters import filt, filt_closest
from .util import construct_cube, skeletonize
from .bifurcations import remove_duplicates_and_round_points, generate_clique_graph, minimum_spanning_tree, extract_possible_idxs_from_mst, filter_bifurcation_points

MAX_RETURN_PTS = 30000

def reconstruction(xrays: [XRayInfo]):
    """
    the function performs automatic reconstruction using voxel hull based algorithm
    for a given set of xrays

    :param xrays: x ray images to run reconstruction on
    :return: A dictionary containing various reconstructed components of the vessel, including:
        - **vessel** (*list*): A list representing the reconstructed 3D vessel point cloud data.
        - **bifurcations** (*list*): A list representing the bifurcation points within the vessel.
        - **centerlines** (*list*): A list representing the centerlines of the vessel structure.
        - **sources** (*list*): A list of source points derived from the X-ray data.
        - **shadows** (*list*): A list of shadow points derived from the X-ray data.
        - **rects** (*list*): A list of projection rectangles calculated

    """

    sod_max = max(xray.acquisition_params['sod'] for xray in xrays)
    sid_min = min(xray.acquisition_params['sid'] for xray in xrays)
    spacing_max = max(max(xray.acquisition_params['spacing_r'], xray.acquisition_params['spacing_c']) for xray in xrays)
    wh_max = max(max(xray.width, xray.height) for xray in xrays)
    radius = sod_max * spacing_max * wh_max / 2 / sid_min

    vessel = __get_vessel(radius, xrays)
    centerlines = __get_centerlines(vessel, xrays)
    bifurcations = __get_bifurcations(centerlines)
    sources = __get_sources(xrays)
    shadows = __get_shadows(xrays)
    rects = __get_projection_rects(xrays)

    return {
        'vessel': vessel.tolist(),
        'bifurcations': bifurcations.tolist(),
        'centerlines': centerlines.tolist(),
        'sources':  [s.tolist() for s in sources],
        'shadows':  [s.tolist() for s in shadows],
        'rects': [s.tolist() for s in rects]
    }


def __subsample(pts):
    """
    sample from array arr to make it equal to the size of target_length
    """
    if pts.shape[0] < MAX_RETURN_PTS: return pts
    ixes = sorted(np.random.choice(pts.shape[0], MAX_RETURN_PTS, replace=False))
    return pts[ixes, :]


def __get_vessel(radius, xrays):
    vessel = construct_cube(radius, dimension=100)
    for xray in xrays:
        image = xray.image
        proj = np.transpose(np.nonzero(image))
        vessel = filt(vessel, proj, xray)
    return __subsample(vessel)


def __get_centerlines(vessel, xrays):
    centerlines = vessel
    for xray in xrays:
        skel =  skeletonize(xray.image.astype(np.uint8))
        proj = np.transpose(np.nonzero(skel))
        centerlines = filt_closest(centerlines, proj, xray)
    return __subsample(centerlines)


def __get_bifurcations(centerlines):
    centerlines = remove_duplicates_and_round_points(centerlines)
    clique = generate_clique_graph(centerlines)
    mst = minimum_spanning_tree(clique).toarray()
    bifurcation_idxs = extract_possible_idxs_from_mst(mst)
    bifurcation_idxs = filter_bifurcation_points(mst, bifurcation_idxs)
    return __subsample(centerlines[bifurcation_idxs])


def __get_sources(xrays):
    return [xray.source() for xray in xrays]


def __get_shadows(xrays):
    return [xray.shadow().astype(np.float64) for xray in xrays]


def __get_projection_rects(xrays):
    return [xray.projection_rect().astype(np.float64) for xray in xrays]        
