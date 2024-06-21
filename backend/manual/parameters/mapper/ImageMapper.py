import base64
import io

import numpy as np

from PIL import Image


class ImageMapper:
    def map_b64_image_to_numpy(self, b64_image):
        _, img_str = b64_image.split(';base64,')
        image = base64.b64decode(img_str)
        image = Image.open(io.BytesIO(image))
        image = np.array(image)
        return image
