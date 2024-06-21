from manual.parameters.mapper.ImageMapper import ImageMapper
from xray_angio_3d import XRayInfo


class JsonImageInformationExtractor:

    _necessary_params = ['sid', 'sod', 'alpha', 'beta', 'spacing_r', 'spacing_c']

    _image_params = ['image']

    _image_mapper = ImageMapper()

    def extract_info_from_image_with_image_details(self, image):
        acq_params = image['acquisition_params']
        are_all_parameters_provided, missing_param =\
            self._check_if_all_parameters_are_provided(self._necessary_params + self._image_params, acq_params)
        if not are_all_parameters_provided:
            raise ValueError(f"Incorrect request parameters, missing param {missing_param}")
        necessary_info = self._get_necessary_parameters(acq_params)
        return self._get_image_parameters(image['image'], necessary_info)

    def extract_info_from_image(self, image):
        acq_params = image['acquisition_params']
        are_all_parameters_provided, missing_param = self._check_if_all_parameters_are_provided(self._necessary_params,
                                                                                                acq_params)
        if not are_all_parameters_provided:
            raise ValueError(f"Incorrect request parameters, missing param {missing_param}")
        return self._get_necessary_parameters(acq_params)

    def _check_if_all_parameters_are_provided(self, required_params, acq_params):
        if acq_params is None:
            return False
        for param in required_params:
            if param not in acq_params:
                return False, param
        return True

    def _get_necessary_parameters(self, acq_params, img_parameters=XRayInfo()):
        img_parameters.acquisition_params["sid"] = float(acq_params['sid'])
        img_parameters.acquisition_params["sod"] = float(acq_params['sod'])
        img_parameters.acquisition_params["alpha"] = float(acq_params['alpha'])
        img_parameters.acquisition_params["beta"] = float(acq_params['beta'])
        img_parameters.acquisition_params["spacing_r"] = float(acq_params['spacing_r'])
        img_parameters.acquisition_params["spacing_c"] = float(acq_params['spacing_c'])
        return img_parameters

    def _get_image_parameters(self, image, img_parameters=XRayInfo()):
        image = self._image_mapper.map_b64_image_to_numpy(image)
        img_parameters.image = image
        img_parameters.height = image.shape[0]
        img_parameters.width = image.shape[1]
        return img_parameters
