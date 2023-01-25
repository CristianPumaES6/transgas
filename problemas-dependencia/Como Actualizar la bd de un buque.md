# ACTUALIZAR DATA DE UN BUQUE  🚢

Este documento tiene informacion de como subir una data masiva desde un archivo excel.
La finalidad de este documento es agilizar la subida de datos.

## Comenzando 🚀

* 1 Debemos apagar el servidor. 
    - Putty
    - pm2 status
    - pm2 stop [Number]


* 2 Deberiamos descargar la ultima BD. 
    - Nos ubicamos en un directorio y abrimos el cmd
    - scp root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/dbTransgas.sqlite3 ./


* 3 Desde local levantar el aplicativo usando esa BD.

* 4 Comenzamos a llenar el Excel **FormatDocument v4.**
    Si tenemos ya datos registrados, descargamos el documento report data buque
    - Editamos el documento en excel, tomar en cuenta que si hay un id sera para editar, si no hay id es para hacer un nuevo registro.

* 5 Una vez terminado, copiamos y pegamos el contenido del excel a convertcsv
    - https://www.convertcsv.com/csv-to-json.htm

* 6 Copiamos el JSON generado y lo pegamos en el Postman, apuntando al Servicio
    - {{url}}/voyages/importVoyages

* 7 Verificamos el total de consumo debe ser el mismo que el del excel.

* 8 Verificamos el formato de fecha y hora.

* 9 Actualizamos la zona horaria que debe tener el registro. // solo si no queremos que se registre en horario UTC.

* 7 Copiamos la BD y lo pegamos en el servidor.
    - Nos ubicamos en el directorio donde esta nuestra BD.
    - scp dbTransgas.sqlite3 root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/

* 8 Levantamos el servidor, y verificamos si esta OK.
    - pm2 status
    - pm2 start [Number]

* 9 Verificamos el total de consumo debe ser el mismo que el del excel.
