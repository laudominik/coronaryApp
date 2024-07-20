from xray_angio_3d import XRayInfo
from xray_angio_3d.projection import project


class Projector:
    def project_points(self, points, image: XRayInfo):
        return project(points, image)
