# ACTUALIZAR BACKED FRONTEND  🚢

Este documento tiene informacion de como actualizar los proyectos en el server con la ultima version de subida y bajada.

## Comenzando 🚀

* 1 Debemos actualizar los dist del front y back. 
    - Front : ng build --prod      ng build --configuration production --aot
    - Backend : nest start


* 2 Clonamos el branch production y solo pegamos los elelemntos que queremos que vallan al servidor. dist static

* 3 Debemos detener el pm2 para poder clonar la ultima version del proyecto. 
    - pm2 status
    - pm2 stop 0
    - git pull
    - npm install
    - pm2 restart 0


* Copiamos la BD

generamos el directorio dist.

Cambiamos el archivo 
server.config.ts

nest start

entramos al branch production
Pegramos el directorio.


copiamos el dist 


/


