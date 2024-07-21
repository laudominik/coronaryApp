import base64
import io

import numpy as np
from PIL.Image import Image

from xray_angio_3d import XRayInfo


class JsonImageInformationExtractor:

    _necessary_params = ['sid', 'sod', 'alpha', 'beta', 'spacing_r', 'spacing_c']

    _image_params = ['image']

    def extract_info_from_image_with_image_details(self, image):
        acq_params = image['acquisition_params']
        are_all_parameters_provided, missing_param =\
            self.__check_if_all_parameters_are_provided(self._necessary_params + self._image_params, acq_params)
        if not are_all_parameters_provided:
            raise ValueError(f"Incorrect request parameters, missing param {missing_param}")
        necessary_info = self.__get_necessary_parameters(acq_params, XRayInfo())
        return self.__get_image_parameters(image['image'], necessary_info)

    def extract_info_from_image(self, image):
        acq_params = image['acquisition_params']
        are_all_parameters_provided, missing_param = self.__check_if_all_parameters_are_provided(self._necessary_params,
                                                                                                acq_params)
        if not are_all_parameters_provided:
            raise ValueError(f"Incorrect request parameters, missing param {missing_param}")
        return self.__get_necessary_parameters(acq_params, XRayInfo())

    def __check_if_all_parameters_are_provided(self, required_params, acq_params):
        if acq_params is None:
            return False, "acq_params"
        for param in required_params:
            if param not in acq_params:
                return False, param
        return True, None

    def __get_necessary_parameters(self, acq_params, img_parameters):
        img_parameters.acquisition_params.update({param: float(acq_params[param]) for param in self._necessary_params})
        return img_parameters

    def __get_image_parameters(self, image, img_parameters=XRayInfo()):
        image = self.__map_b64_image_to_numpy(image)
        img_parameters.image = image
        img_parameters.height = image.shape[0]
        img_parameters.width = image.shape[1]
        return img_parameters

    def __map_b64_image_to_numpy(self, b64_image):
        _, img_str = b64_image.split(';base64,')
        image = base64.b64decode(img_str)
        image = Image.open(io.BytesIO(image))
        image = np.array(image)
        return image
