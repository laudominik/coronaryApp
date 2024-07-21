from xray_angio_3d.manual.point.bifurcation_point_info import BifurcationPointInfo


class JsonPointInformationExtractor:

    _necessary_params = ['x', 'y', 'image_index']

    def extract_info_from_point(self, point):
        are_all_parameters_provided, missing_param = self.__check_if_all_parameters_are_provided(point)
        if not are_all_parameters_provided:
            raise ValueError(f"Incorrect request parameters, missing param {missing_param}")
        return self.__get_necessary_parameters(point)

    def __check_if_all_parameters_are_provided(self, point_params):
        if point_params is None:
            return False, "point_params"
        for param in self._necessary_params:
            if param not in point_params:
                return False, param
        return True, None

    def __get_necessary_parameters(self, point_params):
        x = float(point_params['x'])
        y = float(point_params['y'])
        image_index = point_params['image_index']
        return BifurcationPointInfo(x, y, image_index)
