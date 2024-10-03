import numpy as np
import cv_algorithms


def construct_cube(radius, dimension=100):
    x = np.linspace(-radius, radius, dimension)
    y = np.linspace(-radius, radius, dimension)
    z = np.linspace(-radius, radius, dimension)    
    X, Y, Z = np.meshgrid(x, y, z, indexing='ij')
    cube = np.column_stack((X.ravel(), Y.ravel(), Z.ravel()))
    return cube


def skeletonize(img):
    skel = cv_algorithms.guo_hall(img)
    return skel


def calc_rotational_matrix(alpha=0, beta=0):
    """
     Calculates rotational matrix M with given angles
     :param alpha: alpha (LAO[+180] - RAO[-180]) angle in radians
     :param beta: beta (CRA[+90] - CAU[-90]) angle in radians
     :return: rotational matrix M
    """
    import math as m

    rotational_matrix = np.array([[m.cos(beta), 0, m.sin(beta), 0],
                                  [m.sin(alpha) * m.sin(beta), m.cos(alpha), -m.sin(alpha) * m.cos(beta), 0],
                                  [-m.cos(alpha) * m.sin(beta), m.sin(alpha), m.cos(alpha) * m.cos(beta), 0],
                                  [0, 0, 0, 1]])
    return rotational_matrix


def rotate_points(points_array, alpha, beta):
    """
    Rotates given points by alpha and beta angle
    :param points_array: array that contains xyz1 coordinates of a points to rotate
    :param alpha: alpha (LAO[+180] - RAO[-180]) angle in radians
    :param beta: beta (CRA[+90] - CAU[-90]) angle in radians
    :return: array that contains xyz1 coordinates of rotated points
    """

    m = calc_rotational_matrix(alpha, beta)
    for point_num in range(points_array.shape[0]):
        points_array[point_num, :] = np.matmul(m, points_array[point_num, :].T)
    return points_array