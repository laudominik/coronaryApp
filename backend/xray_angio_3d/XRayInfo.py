class XRayInfo:
    def __init__(self):
        self.acquisition_params = {
            'sid': 0,
            'sod': 0,
            'alpha': 0,
            'beta': 0,
            'spacing_r': 0,
            'spacing_c': 0
        }
   
        self.width = 0
        self.height = 0
        self.filename = ""
        self.image = []
