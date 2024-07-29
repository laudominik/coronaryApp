#!/usr/bin/env python
import os
from setuptools import setup, find_packages

def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()

setup(
    name = "xray-angio-3d",
    version = "0.0.1",
    author = "Dominik Lau, Sławomir Adamowicz",
    description = ("Reconstruction of coronary arteries based on planary images"),
    packages = ['xray_angio_3d'],
    package_dir={'' : 'backend'},
    long_description=read('README.md'),
    install_requires=['matplotlib', 'cv_algorithms', 'scipy', 'numpy'],
)