Existe un manual por correo se le envio a alex.

una vez que se tenga el excel

userId	year	voyageNumber	portNumber	departurePort	arrivalPort	VIAJE	date	hour	steamingTime	activityPerformed	observation	distance	TIEMPO_DE_NAVEGACION	VELOCIDAD	beaufour	RPM	mplaIfo	auxIfo	boilerIfo	TOTAL 	bunkeringIfo	ROB 	mplaMgo	auxMgo	boilerMgo	ppMgo	giMgo	TOTAL	bunkeringMgo	ROB


se le cambia los nombres de las columnas

se le pega en el 
https://www.convertcsv.com/csv-to-json.htm

el json lo ponemos en el aplicativo postman y subimos la data.


CONSULTAS SQLITE
UPDATE HORA CON 4 digitos.

SELECT hour FROM daily_report
WHERE LENGTH(hour) = 4

SELECT ("0"||daily_report.hour ) AS 'Modi' FROM daily_report
WHERE LENGTH(hour) = 4

UPDATE daily_report
SET hour = "0"||daily_report.hour
WHERE LENGTH(hour) = 4


