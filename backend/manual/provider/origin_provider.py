import numpy as np

from xray_angio_3d import XRayInfo
from xray_angio_3d.util import calc_rotational_matrix


class OriginProvider:
    def provide_origin(self, image: XRayInfo):
        alpha = image.acquisition_params.get("alpha")
        beta = image.acquisition_params.get("beta")
        sod = image.acquisition_params.get("sod")
        m = calc_rotational_matrix(alpha, beta)
        f = np.array([0, 0, -sod, 1], dtype=np.float32)
        return np.matmul(m, f.T)[:-1]
