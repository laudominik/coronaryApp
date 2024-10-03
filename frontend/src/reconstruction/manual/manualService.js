import config from "../../config.json"

async function sendLinesRequest(xrays, point) {
    const url = config["LINES_ENDPOINT"]
    const images = await createImagesRequestParameter(xrays)

    const responseAsync = fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            "images": images,
            point: scaledPoint(point)
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    }) 
    return await responseAsync
}

async function sendPointRequest(xrays, points) {
    const url = config["MANUAL_RECONSTRUCTION_ENDPOINT"]
    const images = await createImagesRequestParameter(xrays)

    const responseAsync = fetch(url, {
        method: 'POST',
        body: JSON.stringify({
            "images": images,
            points: points.map(point => scaledPoint(point))
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    }) 
    return await responseAsync
}

async function createImagesRequestParameter(xrays) {
    return await Promise.all(xrays.map(async (xray) => {
        const dimensions = await getImageDimensions(xray.image)
        return {
            [`acquisition_params`]: {
                sid: parseFloat(xray.acquisition_params.sid),
                sod: parseFloat(xray.acquisition_params.sod),
                alpha: parseFloat(xray.acquisition_params.alpha),
                beta: parseFloat(xray.acquisition_params.beta),
                spacing_c: parseFloat(xray.acquisition_params.spacing_c),
                spacing_r: parseFloat(xray.acquisition_params.spacing_r),
            },
            [`image`]: {
                width: dimensions.width,
                height: dimensions.height
            }
        }
    }))
}

async function getImageDimensions(src) {
    return new Promise (function (resolved, _) {
      let image = new Image()
      image.onload = () => {
        resolved({width: image.width, height: image.height})
      };
      image.src = src
    })
  }

function scaledPoint(point) {
    return {
        x: point.x * point.x_scale,
        y: point.y * point.y_scale,
        image_index: point.image_index
    }
}

export {sendLinesRequest, sendPointRequest}