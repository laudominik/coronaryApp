import './Description.css'

export default function Description() {
    // TODO: add description on how to use our app and what it is
    return (
        <main class='description'>
            <h2>3D X-ray angiography</h2>
            <p>
                The goal of this web-app is to present a heart point cloud reconstruction method for coronary angiography.
                The app comes in form of two modules: <b>Reconstruction</b> and <b>Generation</b>
            </p>
            <h3>Reconstruction</h3>
            <p>
                Automatic reconstruction of heart point-cloud from images. User can specify multiple
                images which to take into account in the reconstruction algorithm. 
                {/* TODO: add image */}
            </p>
            <h3>Generation</h3>
            <p>
                Generation of projections from random-generated model. User can generate multiple 
                images at once, specifying acquisition parameters for each x-ray.
                {/* TODO: add image */}
            </p>
            <h3></h3>
        </main>
    )
}