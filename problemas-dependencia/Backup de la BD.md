# Clonar BD del servidor al escritorio local.

```javascript
// Tenemos que saber cual es la ubicacion del directorio y donde esta la BD, Local.
//BD del servidor de transgas real
scp dbTransgas.sqlite3 root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/.




//BD DE OCCARD
scp root@161.35.239.148:/root/transgas/backend/dbTransgas.sqlite3 ./
scp dbTransgas.sqlite3 root@161.35.239.148:/root/transgas/backend/.



//BD DE esteesleCLUB transgas2
scp root@161.35.239.148:/root/transgas2/transgas/backend/dbTransgas.sqlite3 ./


// DB TRANSGA

scp root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/dbTransgas.sqlite3 ./

scp dbTransgas.sqlite3 root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/.


//BD DE esteesleCLUB transgas
scp root@161.35.239.148:/root/transgas/backend/dbTransgas.sqlite3 ./
```
Consultar a la nave, diferencias en consumos diarios con cierre de mes.


# Actualizar datos del servidor

/transgas2 
scp dbTransgas.sqlite3 root@161.35.239.148:/root/transgas2/transgas/backend/.

```javascript
// Tenemos que saber cual es la ubicacion del directorio y donde esta la BD, Local.
scp dbTransgas.sqlite3 root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/
scp root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/dbTransgas.sqlite3 ./
scp dbTransgas.sqlite3 root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/.
// actualizar la data del servidor occard
scp dbTransgas.sqlite3 root@161.35.239.148:/root/transgas/backend
```
