import numpy as np

from .util import calc_rotational_matrix, rotate_points


class XRayInfo:
    def __init__(self):
        self.acquisition_params = {
            'sid': 0,
            'sod': 0,
            'alpha': 0,
            'beta': 0,
            'spacing_r': 0,
            'spacing_c': 0
        }
   
        self.width = 0
        self.height = 0
        self.filename = ""
        self.image = []

    def source(self):
        alpha, beta = self.__angles_rad()
        sod = self.acquisition_params['sod']

        m = calc_rotational_matrix(alpha, beta)
        f = np.array([0, 0, -sod, 1], dtype=np.float32)
        return (m @ f.T)[:-1]

    def __angles_rad(self):
        return np.deg2rad(self.acquisition_params['alpha']), np.deg2rad(self.acquisition_params['beta'])

    def shadow(self, img_points=None):
        alpha, beta = self.__angles_rad()
        sid = self.acquisition_params['sid']
        sod = self.acquisition_params['sod']
        image_size = np.array((self.width, self.height))
        pixel_spacing = self.acquisition_params['spacing_c'], self.acquisition_params['spacing_r']
        if img_points is None:
            img_points = np.transpose(np.nonzero(self.image))

        shadow_points = np.array(img_points, dtype=np.float32)

        # translate image to the center (correct x,y coordinates) if image size is given
        if image_size is not None:
            # x, y
            shadow_points -= image_size / 2

        # convert pixels to real dimensions (mm)
        if pixel_spacing is not None:
            shadow_points *= pixel_spacing

        # convert points to 3d
        # by adding one dimension (Z) with zeros
        shadow_points = np.hstack((shadow_points, np.zeros((shadow_points.shape[0], 1), dtype=shadow_points.dtype)))

        # convert to cartesian
        # by adding one dimension with ones
        shadow_points = np.hstack((shadow_points, np.ones((shadow_points.shape[0], 1), dtype=shadow_points.dtype)))

        # second view rotation
        shadow_points[:, 2] = sid - sod

        rotate_points(shadow_points, alpha, beta)
        return shadow_points[:, :-1]

    def projection_rect(self):
        return self.shadow(
            np.array(
                [
                    [0, 0],
                    [self.width, 0],
                    [0, self.height], 
                    [self.width, self.height]
                ]
            )
        )