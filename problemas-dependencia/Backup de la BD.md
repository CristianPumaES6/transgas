# Clonar BD del servidor al escritorio local.

```javascript
// Tenemos que saber cual es la ubicacion del directorio y donde esta la BD, Local.
scp root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/dbTransgas.sqlite3 ./
```



# Actualizar datos del servidor


```javascript
// Tenemos que saber cual es la ubicacion del directorio y donde esta la BD, Local.
scp dbTransgas.sqlite3 root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/


// actualizar la data del servidor occard
scp dbTransgas.sqlite3 root@159.203.92.206:/var/www/nodejs/transgas/backend/

```
