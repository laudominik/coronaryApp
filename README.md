# 3D X-ray angiography
A web-app for reconstructing 3D point cloud
of heart arteries from a series of planary x-ray images with known angles. 

# Running
```
docker-compose up
```

# Package installation
The reconstruction logic part (i.e. only the algorithm) comes in form of a package
that can be installed via pip. In root dir run
```
pip install .
```
This will install the backend/xray_angio_3d package