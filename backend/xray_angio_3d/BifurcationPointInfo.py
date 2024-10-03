import numpy as np

from xray_angio_3d import XRayInfo, util


class BifurcationPointInfo:
    """
    class representing bifurcation point on a selected image

    :param x:
    :param y:
    :param z:
    :param image_index: selected image
    """
    def __init__(self, x, y, image_index, z=None):
        self.x = x
        self.y = y
        self.z = z
        self.image_index = image_index
