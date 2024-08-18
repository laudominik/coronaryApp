import numpy as np

from xray_angio_3d.BifurcationPointInfo import BifurcationPointInfo
from xray_angio_3d import XRayInfo, projection


def find_lines(point_info: BifurcationPointInfo, images_info: [XRayInfo]):
    """
    the function finds bounding line for a given point and a set of images

    :param point_info: characteristic point location on a given image
    :param images_info: other images
    :return: list of line params representing the bounding line
    """

    lines = []
    image_with_point: XRayInfo = images_info[point_info.image_index]
    origin = image_with_point.source()
    bifurcation_point = (point_info.y, point_info.x)
    bifurcation_point_3d = image_with_point.shadow([bifurcation_point])[0]
    line_in_3d = __extract_line_between_points(bifurcation_point_3d, origin)
    line_in_3d = np.array(line_in_3d)
    for idx, info in enumerate(images_info):
        if idx == point_info.image_index:
            continue
        projected_points = projection.project(line_in_3d, info)
        projected_points = np.array([projected_points[:, 1], projected_points[:, 0]]).T
        line = __extract_function_parameters(projected_points[99], projected_points[100])
        lines.append(line)
    return lines


def find_point(points_info, images_info: [XRayInfo]):
    """
    the function reconstructs 3D position of a point given a pair of
    matching points

    :param points_info: pair of points
    :param images_info: pair of images corresponding to the points
    :return: point reconstructed in 3D
    """
    
    first_point, second_point = points_info[0], points_info[1]
    first_image, second_image = __assign_images_to_labels_by_point(first_point, images_info)
    first_source, second_source = first_image.source(), second_image.source()
    first_point_3d = first_image.shadow(np.array([(first_point.y, first_point.x)]))[0]
    second_point_3d = second_image.shadow(np.array([(second_point.y, second_point.x)]))[0]
    return __find_point_in_3d(first_source, second_source, first_point_3d, second_point_3d)


def __extract_function_parameters(point_a, point_b):
    x_a, x_b = point_a[0], point_b[0]
    y_a, y_b = point_a[1], point_b[1]
    a = (y_a - y_b) / (x_a - x_b)
    b = y_a - a * x_a
    return a, b


def __extract_line_between_points(bifurcation_point, origin):
    number_of_mapped_points = 400
    line_multiplier = (bifurcation_point - origin) / number_of_mapped_points
    line = [origin + i * line_multiplier for i in range(number_of_mapped_points)]
    return line


def __assign_images_to_labels_by_point(point_info, images_info):
    if point_info.image_index == 0:
        return images_info[0], images_info[1]
    else:
        return images_info[1], images_info[0]


def __find_point_in_3d(F1, F2, P1, P2):
    """ Function which solves linear equations
        L1 and L2 to calculate point P
        :param F1: 3D projection of X-ray source from base view
        :param F2: 3D projection of X-ray source from second view
        :param P1: 3D projection of a 2D point from base view
        :param P2: 3D projection of a 2D point from second view
        :return P: 3D position of 2D point
    """
    # vertexes
    eta = np.subtract(P1, F1)
    tau = np.subtract(P2, F2)

    # determinant
    eta_eta = float(np.matmul(eta, eta.transpose()))
    tau_tau = float(-np.matmul(tau, tau.transpose()))
    eta_tau1 = float(np.matmul(eta, tau.transpose()))
    eta_tau2 = float(-np.matmul(eta, tau.transpose()))

    F2_F1 = np.subtract(F2, F1)
    eta_F = float(np.matmul(eta, F2_F1.transpose()))
    tau_F = float(np.matmul(tau, F2_F1.transpose()))

    deter = (eta_eta * tau_tau) - (eta_tau1 * eta_tau2)

    # parameters s and t
    s = ((eta_F * tau_tau) - (eta_tau2 * tau_F)) / deter
    t = ((eta_eta * tau_F) - (eta_F * eta_tau1)) / deter

    # calculating points L1s nad L2t
    L1s = F1 + (s * eta)
    L2t = F2 + (t * tau)

    # Point P
    P = (L1s + L2t) / 2
    return BifurcationPointInfo(x=P[0], y=P[1], z=P[2], image_index=None)
