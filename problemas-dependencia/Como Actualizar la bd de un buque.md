EL SERVICIO QUE TIENE LA IMPORTACION ES importVoyages

1 Apagamos el servidor.(Todo funcionara en Offline)
Entrmos desde Putty, pm2 status, pm2 stop [Number]


2 Deberiamos descargar la ultima BD
Nos ubicamos en un directorio y ejecutamos lo siguiente:
scp root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/dbTransgas.sqlite3 ./



3 Desde local levantar el aplicativo usando esa BD.

4 Pegamos las columnas con los nombres de nuestra Entidad(Tabla BD).

5 Copiamos el header mas los reportes, Lo pegamos en la siguiente URL https://www.convertcsv.com/csv-to-json.htm

6 Copiamos el resultado y lo pegamos en el Postman, apuntando al Servicio
{{url}}/voyages/importVoyages

7 Copiamos la BD y lo pegamos en el servidor.
Nos ubicamos en el directorio desde Consola y pegamos esto.
scp dbTransgas.sqlite3 root@165.232.153.20:/var/www/transgas.codev.site/transgas/backend/

8 Levantamos el servidor, y verificamos si esta OK.
pm2 status
pm2 start [Number]






Existe un manual por correo se le envio a alex.

una vez que se tenga el excel

userId	year	voyageNumber	portNumber	departurePort	arrivalPort	VIAJE	date	hour	steamingTime	activityPerformed	observation	distance	TIEMPO_DE_NAVEGACION	VELOCIDAD	beaufour	RPM	mplaIfo	auxIfo	boilerIfo	TOTAL 	bunkeringIfo	ROB 	mplaMgo	auxMgo	boilerMgo	ppMgo	giMgo	TOTAL	bunkeringMgo	ROB


se le cambia los nombres de las columnas

se le pega en el 
https://www.convertcsv.com/csv-to-json.htm

el json lo ponemos en el aplicativo postman y subimos la data.


CONSULTAS SQLITE
UPDATE HORA CON 4 digitos.

// Consultamos si hay algun registro de hora con 4 caracteres.
SELECT hour FROM daily_report
WHERE LENGTH(hour) = 4

SELECT ("0"||daily_report.hour ) AS 'Modi' FROM daily_report
WHERE LENGTH(hour) = 4

UPDATE daily_report
SET hour = "0"||daily_report.hour
WHERE LENGTH(hour) = 4


// Actualizamos la hora en donde se registro el dato.

