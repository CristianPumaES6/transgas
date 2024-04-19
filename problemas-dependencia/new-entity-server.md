# Manual para crear una nueva entidad en la BD.

nest g module components/users
nest g service components/oils/EquipmentOilCompatibility
nest g controller components/oils/EquipmentOilCompatibility
nest g class models/EquipmentOilCompatibility.entity


1) Agregar los atributos al modelo de entidad.
2) Modificamos las dependencias TypeORM al modulo.
3) Modificamos el servicio del modulo.
4) Modificamos el controllador.