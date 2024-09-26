import { Injectable } from '@nestjs/common';

import { AppGateway } from './app.gateway';
import { GetDate } from './assets/moment.assets';
import { LoggedUser } from './models/loggedUser';
import { SocketEmitModel } from './models/socketEmit';
import { ConsumptionEquipmentService, getOilConsumptionPerMonth, QueryViewFileAnalysisOil } from './components/oils/consumption-equipment/consumption-equipment.service';
import { DummyPromise } from './assets/promises.assets';
import { UsersService } from './components/users/users.service';
import { UserEntity } from './models/user.entity';
@Injectable()
export class AppService {

  constructor(
   private gateway: AppGateway, // Por mientras que este desactivado.
   private readonly _ConsumptionEquipmentService: ConsumptionEquipmentService,
   private readonly _UsersService: UsersService,
  ) {
  }


  // Cuando hay una nueva conexion verficamos todos los que esten conectados,
  public EmitConnect() : boolean{


    let socketEmitModel: SocketEmitModel = new SocketEmitModel();
    socketEmitModel.action='WHO_ARE_CONNECTED';

    // Emitimos una señal para recibir conexion de los usuario.
    this.gateway.wss.emit('EmitConnect', socketEmitModel); // Que este desactivado.
    return true;
  }

  public ListConsumptionLubricantPerMonth( userid:number, startDate:string, endDate:string ){

    return DummyPromise().then(
      result => {
        return this._UsersService.Gets(<UserEntity>{id:userid,role:'BUQUE'});
      }
    ).then(
      result => {
        // No lo validamos por que puede llegar vacio.
        return this.ConsumptionLubricantPerMonthPerListUsers( result, startDate, endDate );
      }
    );
  
  }

  public GetOilAnalysis( buqueId:number, ETM_OilAnalysis_Oid:string){

    return DummyPromise().then(
      result => {
  
       return  this._ConsumptionEquipmentService.QueryGetTask( buqueId, ETM_OilAnalysis_Oid ); 
         
      }
    ).then(
      result => {
        return result;
      }
    ).catch(
      result => {
        return [];
      }
    );
  
  }


  
  public ViewFileAnalysisOil( buqueId:number, ETM_OilAnalysis_Oid:string){

    return DummyPromise().then(
      result => {
  
       return  this._ConsumptionEquipmentService.ViewFileAnalysisOil( buqueId, ETM_OilAnalysis_Oid ); 
         
      }
    ).then(
     ( result:QueryViewFileAnalysisOil[] )=> {
        return result;
      }
    ).catch(
      result => {
        return [];
      }
    );
  
  }

  public consultEquipmentConsumptionByMonthUser(userId : number, entityEquipmentId: number, DateYEAR_MONTH:string) {

    return DummyPromise().then(
      result => {
        return   this._ConsumptionEquipmentService.consultEquipmentConsumptionByMonthUser(userId,entityEquipmentId,DateYEAR_MONTH);
        }
      ).then(
        result => {
          return result;
        }
      ).catch(
        result => {
          return [];
        }
      );

  }

  public GetShips() {

    return DummyPromise().then(
      result => {
        return   this._ConsumptionEquipmentService.GetShips();
        }
      ).then(
        result => {
          return result;
        }
      ).catch(
        result => {
          return [];
        }
      );

  }

  // guarda una lista de aceite.
  public async ConsumptionLubricantPerMonthPerListUsers(users: UserEntity[], startDate:string, endDate:string) {

      let returnDashboardLubricant:ListUserConsumptionLubricantPerMonth[] =[] ;
    
      for await (const itemUser of users) {
        let DashboardListMonthLubricant:ListUserConsumptionLubricantPerMonth= <ListUserConsumptionLubricantPerMonth>{};
           
        DashboardListMonthLubricant.userId = itemUser.id;
        DashboardListMonthLubricant.userName = itemUser.name;
        DashboardListMonthLubricant.filename = itemUser.filename;
        DashboardListMonthLubricant.role = itemUser.role;
        // Registramos grupo de aceite
        DashboardListMonthLubricant.getOilConsumptionPerMonth = await  this._ConsumptionEquipmentService.getOilConsumptionPerMonth( itemUser.id, startDate, endDate );
         
        returnDashboardLubricant.push(DashboardListMonthLubricant);
      }
 
      return returnDashboardLubricant;
  }


}

export interface ListUserConsumptionLubricantPerMonth {
  userId: number;
  userName: string;
  filename: string;
  role: string;
  getOilConsumptionPerMonth: getOilConsumptionPerMonth[];

}