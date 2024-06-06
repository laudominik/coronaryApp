import numpy as np
import math
import random

from .XRayInfo import XRayInfo


def project(pts, xinfo: XRayInfo, w=512, h=512):
    alpha = xinfo.acquisition_params['alpha']
    beta = xinfo.acquisition_params['beta']
    sid = xinfo.acquisition_params['sid']
    sod = xinfo.acquisition_params['sod']
    spacing_r = xinfo.acquisition_params['spacing_r']
    spacing_c = xinfo.acquisition_params['spacing_c']

    reconstructed = np.zeros((pts.shape[0], 2))

    t, p = np.deg2rad(-alpha), np.deg2rad(-beta)
    rot_X = np.array([
                      [1, 0, 0],
                      [0, math.cos(t), -math.sin(t)],
                      [0, math.sin(t), math.cos(t)]])
    rot_Y = np.array([
                      [math.cos(p), 0, math.sin(p)],
                      [0, 1, 0],
                      [-math.sin(p), 0, math.cos(p)]])

    rotate_matrix = rot_Y @ rot_X
    pts_rotated = pts @ rotate_matrix.T

    coeff = (sid)/(sod+ pts_rotated[:, 2])
    reconstructed[:, 0] = xinfo.width / 2 + pts_rotated[:, 0] * coeff / spacing_c
    reconstructed[:, 1] = xinfo.height / 2 + pts_rotated[:, 1] * coeff / spacing_r
    return reconstructed
