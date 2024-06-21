from manual.parameters.extractor.JsonImageInformationExtractor import JsonImageInformationExtractor


class ManualParametersParser:

    _information_extractor = JsonImageInformationExtractor()

    def parse_request_body_to_parameters(self, request_body):
        images, selected_point = request_body["images"], request_body["selected_point"]
        images_info = [self._extract_info_from_image(image) for image in images]
        point_info = self._map_selected_point_to_required_information(selected_point, images)
        return images_info, point_info

    def _extract_info_from_image(self, image):
        return self._information_extractor.extract_info_from_image(image)

    def _map_selected_point_to_required_information(self, selected_point, images):
        raise NotImplementedError
