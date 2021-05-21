## Primero empezaremos en el backend
en el backend primero exponeremos nuestro servicio dandole seguridad.

como usamos nestjs es mas facil solo nos tenemos que ir a un controller.
para agregar nuestro servicio.

Ejemplo daily-report.controller.ts

creamos la funcion 

@Get('get-rob/:userId')

// Probamos nuestro servicio en postman que este entrando y este funcionando.
// luego nos vamos a la capa de servicio.

Ejemplo daily-report.service.ts
Creamos la funcion que deseamos 

# Ejemplo 

    async GetROBByUser(userId: number): Promise<GetROBByUser> {

// Como enviaremos datos unicos, tendremos que crear una clase con su estructura.

Ejemplo daily-report.entity.ts

GetROBByUser



AHORA MODIFICAMOS EL FRONT END,
 
1.- Ponemos el modelo que deceamos recibir, previamente en servicio ya debemos saber la estructura.
ejemplo : daily-report.ts
            GetROBByUser
2.- Service
Ejemplo : daily-report.service.ts
            GetROBByUser

3.- Ponerlo en ella funcion que deseamos que consulte.
        dashboard.component.ts