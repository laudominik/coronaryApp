from scipy.spatial import cKDTree

from .projection import project


def filt(pts3d, image_pts, xinfo, threshold=1):
    im = project(pts3d, xinfo)
    tree = cKDTree(image_pts)
    distances, indices = tree.query(im, k=1)
    filtered_pts = im[distances < threshold]
    return pts3d[distances < threshold]


def filt_closest(pts3d, image_pts, xinfo):
    im = project(pts3d, xinfo)
    tree = cKDTree(im)
    distances, indices = tree.query(image_pts, k=1)
    return pts3d[indices]
