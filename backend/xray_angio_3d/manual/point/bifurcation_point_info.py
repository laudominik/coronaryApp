import numpy as np

from xray_angio_3d import XRayInfo, util


class BifurcationPointInfo:
    def __init__(self, x, y, image_index, z=None):
        self.x = x
        self.y = y
        self.z = z
        self.image_index = image_index
