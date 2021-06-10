#!/bin/bash


# Nos ubicamos en el directorio frontend para eliminar el directorio dist
cd ..
cd frontend
# REmovemos el directorio.
rm -rf dist

# Nos ubicamos en el config del frontend
cd src
cd app
cd config
# Lo editamos.
sed -i "s%http://localhost:3000%https://transgas.codev.site%g" "env.config.ts"


sed -i "s%https://transgas.codev.site%http://localhost:3000%g" "env.config.ts"

echo "OK Deploy."