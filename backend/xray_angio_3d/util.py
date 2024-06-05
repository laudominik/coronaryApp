import numpy as np
import cv_algorithms


def construct_cube(radius, dimension=100):
    x = np.linspace(-radius, radius, dimension)
    y = np.linspace(-radius, radius, dimension)
    z = np.linspace(-radius, radius, dimension)    
    X, Y, Z = np.meshgrid(x, y, z, indexing='ij')
    cube = np.column_stack((X.ravel(), Y.ravel(), Z.ravel()))
    return cube


def skeletonize(img):
    skel = cv_algorithms.guo_hall(img) 
    #s, _, _ = pcv.morphology.prune(skel_img=skel, size=15)
    return skel