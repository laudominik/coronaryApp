# 3D X-ray angiography
A web-app for reconstructing 3D point cloud
of heart arteries from a series of planary x-ray images with known angles. 

# Running
```
docker-compose up
```

# Development environment
Either run 
```
docker-compose -f compose-dev.yml up
```
or just simply run it locally.
# Package installation
The reconstruction logic part (i.e. only the algorithm) comes in form of a package
that can be installed via pip. In root dir run
```
pip install .
```
This will install the backend/xray_angio_3d package

# Research repositories
For research part of the thesis, we've set up two other repositories where we've tested other metods
[coronary3D](https://github.com/Roagen7/coronary3D) and
[coronaryNet](https://github.com/Roagen7/CoronaryNet)