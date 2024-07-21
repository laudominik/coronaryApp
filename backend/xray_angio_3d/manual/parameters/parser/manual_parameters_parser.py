from xray_angio_3d.manual.parameters.extractor.json_image_information_extractor import JsonImageInformationExtractor
from xray_angio_3d.manual.parameters.extractor.json_point_information_extractor import JsonPointInformationExtractor


class ManualParametersParser:

    _image_information_extractor = JsonImageInformationExtractor()

    _point_information_extractor = JsonPointInformationExtractor()

    def parse_lines_request(self, request_body):
        images, selected_point = self.__extract_image_and_point_from_body(request_body)
        if images is None or selected_point is None:
            raise ValueError("Incorrect request body, missing images or point")
        images_info = [self.__extract_info_from_image(image) for image in images]
        point_info = self.__map_selected_point_to_required_information(selected_point)
        return images_info, point_info

    def __extract_image_and_point_from_body(self, request_body):
        images, selected_point = None, None
        try:
            images, selected_point = request_body["images"], request_body["selected_point"]
        except Exception as e:
            pass
        return images, selected_point

    def __extract_info_from_image(self, image):
        return self._image_information_extractor.extract_info_from_image(image)

    def __map_selected_point_to_required_information(self, selected_point):
        return self._point_information_extractor.extract_info_from_point(selected_point)
