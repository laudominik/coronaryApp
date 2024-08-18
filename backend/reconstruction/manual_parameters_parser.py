from reconstruction.extractors.json_image_information_extractor import JsonImageInformationExtractor
from reconstruction.extractors.json_point_information_extractor import JsonPointInformationExtractor



# TODO: this should use parser.py convention 
class ManualParametersParser:

    _image_information_extractor = JsonImageInformationExtractor()

    _point_information_extractor = JsonPointInformationExtractor()

    def parse_lines_request(self, request_body):
        images, selected_point = self.__extract_image_and_point_from_body(request_body)
        if images is None or selected_point is None:
            raise ValueError("Incorrect request body, missing images or point")
        images_info = [self.__extract_info_from_image_with_details(image) for image in images]
        point_info = self.__map_selected_point_to_required_information(selected_point)
        return images_info, point_info

    def parse_reconstruction_request(self, request_body):
        images, points = self.__extract_image_and_point_from_body(request_body, pts_label="points")
        if images is None or points is None:
            raise ValueError("Incorrect request body, missing images or points")
        if len(images) != 2 or len(points) != 2:
            raise ValueError("Incorrect number of points or images")
        images_info = [self.__extract_info_from_image_with_details(image) for image in images]
        points_info = [self.__map_selected_point_to_required_information(point) for point in points]
        return images_info, points_info

    def __extract_image_and_point_from_body(self, request_body, img_label="images", pts_label="point"):
        images, selected_point = None, None
        try:
            images, selected_point = request_body[img_label], request_body[pts_label]
        except Exception as e:
            pass
        return images, selected_point

    def __extract_info_from_image(self, image):
        return self._image_information_extractor.extract_info_from_image(image)

    def __extract_info_from_image_with_details(self, image):
        return self._image_information_extractor.extract_info_from_image_with_image_details(image)

    def __map_selected_point_to_required_information(self, selected_point):
        return self._point_information_extractor.extract_info_from_point(selected_point)
