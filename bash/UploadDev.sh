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

nano env.config.ts

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


cd ..
cd backend

# REmovemos el directorio.
rm -rf dist

cd src
cd config
sed -i "s%http://localhost:3000%https://transgas.codev.site%g" "server.config.ts"
sed -i "s%http://localhost:3001%https://transgas.web.app%g" "server.config.ts"

nano server.config.ts

cd ..
cd ..
nest build


cd src
cd config
sed -i "s%https://transgas.codev.site%http://localhost:3000%g" "server.config.ts"
sed -i "s%https://transgas.web.app%http://localhost:3001%g" "server.config.ts"


echo " Los pasos que faltan es",
echo " Copiar el directorio dist del backend"
echo " Descartar los cambios "
echo " Cambiar de branch al de production "
echo " Pegamos el directorio dist del backend. "
echo " Subimos los cambios. "
echo " Nos Conectarmos al servidor"
echo " Detenemos pm2"
echo " jalamos los cambios"
echo " Ejecutamos pm2"


echo "OK Deploy."