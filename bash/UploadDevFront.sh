#!/bin/bash

echo "Inicio de la actualizacion del servidor."
# Nos ubicamos en el directorio frontend para eliminar el directorio dist
cd ..
cd frontend
echo "Nos ubicamos en la carpeta frontend.."


echo "Eliminamos el directorio dist.."
# REmovemos el directorio frontend.
rm -rf dist


echo "URL Local a transgas == OK"
# Nos ubicamos en el config del frontend
cd src
cd app
cd config
# Lo editamos.
sed -i "s%http://localhost:3000%https://transgas.codev.site%g" "env.config.ts"

# nano env.config.ts

echo "ng build"
# generamos el build
ng build --prod
sed -i "s%https://transgas.codev.site%http://localhost:3000%g" "env.config.ts"
echo "Firebase deploy"


cd ..
cd ..
cd ..
sed -i 's%"transgas"%"transgas-dev"%g' "firebase.json"

# Hacemos el deploy
firebase deploy --only hosting:transgas-dev
