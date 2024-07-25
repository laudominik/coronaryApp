import numpy as np

from xray_angio_3d.manual.point.bifurcation_point_info import BifurcationPointInfo
from xray_angio_3d import XRayInfo, projection


def find_lines(point_info: BifurcationPointInfo, images_info: [XRayInfo]):
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


def __extract_function_parameters(point_a, point_b):
    x_a, x_b = point_a[0], point_b[0]
    y_a, y_b = point_a[1], point_b[1]
    a = (y_a - y_b) / (x_a - x_b)
    b = y_a - a * x_a
    return a, b

def __extract_line_between_points(bifurcation_point, origin):
    number_of_mapped_points = 200
    line_multiplier = (bifurcation_point - origin) / number_of_mapped_points
    line = [origin + i * line_multiplier for i in range(number_of_mapped_points)]
    return line
