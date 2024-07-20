import numpy as np

from manual.point.bifurcation_point_info import BifurcationPointInfo
from manual.projector.projector import Projector
from manual.provider.origin_provider import OriginProvider
from xray_angio_3d import XRayInfo


class KalmykovaLinesFinder:
    def __init__(self, images_info):
        self._images_info = images_info
        self._origin_provider = OriginProvider()
        self._projector = Projector()
        self._number_of_mapped_points = 200

    def find_lines(self, point_info: BifurcationPointInfo):
        lines = []
        image_with_point : XRayInfo = self._images_info[point_info.image_index]
        origin = self._origin_provider.provide_origin(image_with_point)
        bifurcation_point = (point_info.y, point_info.x)
        bifurcation_point_3d = image_with_point.shadow([bifurcation_point])[0]
        line_in_3d = self._extract_line_between_points(bifurcation_point_3d, origin)
        line_in_3d = np.array(line_in_3d)
        for idx, info in enumerate(self._images_info):
            if idx == point_info.image_index:
                continue
            projected_points = self._projector.project_points(line_in_3d, info)
            projected_points = np.array([projected_points[:, 1], projected_points[:, 0]]).T
            lines.append(projected_points)
        return lines

    def _extract_line_between_points(self, bifurcation_point, origin):
        line_multiplier = (bifurcation_point - origin) / self._number_of_mapped_points
        line = [origin + i * line_multiplier for i in range(self._number_of_mapped_points)]
        return line