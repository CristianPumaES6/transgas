#!/bin/bash


# Nos ubicamos en el directorio frontend para eliminar el directorio dist
cd ..
cd frontend

rm -rf dist
# generamos el build
ng build --prod

firebase deploy