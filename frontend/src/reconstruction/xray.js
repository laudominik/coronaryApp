export default class XRay {
    constructor() {
        this.acquisition_params = {
            'sid': 0,
            'sod': 0,
            'alpha': 0,
            'beta': 0,
            'spacing_r': 0,
            'spacing_c': 0
        }

        this.image = null
        this.filename = ""
        this.id = crypto.randomUUID()
    }
}