import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GetLastPortAndTotalConsump } from 'src/app/models/port';
import { User } from 'src/app/models/user';
import { LanguageService } from 'src/app/services/language.service';
import { LoadingService } from 'src/app/services/loading.service';
import { PortService } from 'src/app/services/port.service';
import { UserService } from 'src/app/services/user.service';
import { mathRound } from 'src/assets/math/math.assets';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  // Esta variable nos ayudara a saber si nos encontramos con conexion al servidor.
  public isOnline: boolean = true;

  // Variables de traduccion
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'consumptionAnalysis';

  // Rol del usuario logeado.
  public roleUser: string = '';

  // DATA consultas server.
  // Todos los usuarios obtenidos por el getUsers.
  public getUsers: User[] = [];
  public getLastPortAndTotalConsump: GetLastPortAndTotalConsump[] = [];

  public cantDecimal = 2;


  public name: string = '';
  public image: string = 'http://localhost:3000/ALBANE-ce510.jpg';
  public isConsumptionIFO: string = 'IFO';
  public isConsumptionVLSFO: string = 'VLSFO';
  public startDate: string = '10/20/222 08 00';
  public startIFO: number = 200;
  public startMGO: number = 90;
  public distance: number = 10;
  public endIFO: number = 10;
  public endMGO: number = 10;
  public lastDate: string = '10/20/222 08 00';
  public departurePort: string = 'Lima';
  public arrivalPort: string = 'Lima';


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private loadingService: LoadingService,
    private portService: PortService,
  ) { }

  ngOnInit(): void {

    // Activamos el loading.
    this.loadingService.Open();

    // Si tenemos internet se ejecuta lo siguiente.
    Promise.resolve(true).then(
      result => {

        // Instanciamos el obj que usaremos en la consulta de registro de viajes
        let user: User = new User();

        // Rol del usurio logeado.
        this.roleUser = this.userService.GetIdentity().role;

        // Si no eres un admin solo puedes registrar viajes con el userId logeado.
        if (this.roleUser === 'BUQUE') {
          user.id = this.userService.GetIdentity().id;
          user.name = this.userService.GetIdentity().name;
          user.nick = this.userService.GetIdentity().nick;
        }
        // Traigo a todos los User y lo instancio en el obj.
        return this.GetUsers(user).pipe().toPromise();
      }
    ).then(
      result => {
        if (!result) throw 'Connection error COD200';

        return this.ObtenerElresumenDelPuertoPorListaUsuarios()
      }).then(
        result => {

          this.loadingService.Close();
        }
      ).catch(
        err => {
          // Manejo el error
          let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, err || 'ERROR_ON_LOAD'));

          console.error(msg);
          console.dir(err);

          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
          // Deshabilito el spinner de loading
          this.loadingService.Close();
        });
  }



  // GetUsers: Cargo todos los Users para el listado de Users.
  private GetUsers(user: User): Observable<boolean> {
    // Test
    console.log('GetUsers(user: User)');

    // Obtenemos todos los usuarios
    return this.userService.GetUsers(user).pipe(map(
      (resultUser: User[]) => {

        // Filtramos para que solos los busques se visualizen
        this.getUsers = resultUser.filter((userItem: User) => {
          if (userItem.role === 'BUQUE') {
            userItem.lastPortAndTotalConsump = new GetLastPortAndTotalConsump();
            return true;
          }
          return false;
        });

        // Segun el resultado retornamos la respuesta.
        return (resultUser !== null);
      }
    ));

  }



  private async ObtenerElresumenDelPuertoPorListaUsuarios(): Promise<boolean> {


    for (let index = 0; index < this.getUsers.length; index++) {
      const element = this.getUsers[index];
      let result = await this.GetLastPortAndTotalConsump(element.id).toPromise();

      this.getUsers[index].lastPortAndTotalConsump = result;
    }




    return true;
  }

  // GetUsers: Cargo todos los Users para el listado de Users.
  private GetLastPortAndTotalConsump(userId: number): Observable<GetLastPortAndTotalConsump> {
    // Test
    console.log('GetUsers(user: User)');

    // Obtenemos todos los usuarios
    return this.portService.GetTotalByActivityFilterByUserIdAndDateAndType(userId).pipe(map(
      (result: GetLastPortAndTotalConsump) => {

        result = result || new GetLastPortAndTotalConsump();
        // Segun el resultado retornamos la respuesta.
        return result;
      }
    ));

  }





  // Total del consumo IFO
  public TotalIFO(dailyReport: GetLastPortAndTotalConsump): number {
    // Total del consumo MGO
    let total = 0;

    // sumamos el consumo

    total = dailyReport.mplaIfo + dailyReport.auxIfo + dailyReport.boilerIfo + dailyReport.otherIfo;

    return total;
  }

  // Total del consumo MGO
  public TotalMGO(dailyReport: GetLastPortAndTotalConsump): number {
    // Total del consumo MGO
    let total = 0;

    // sumamos el consumo
    total = dailyReport.mplaMgo + dailyReport.auxMgo + dailyReport.boilerMgo + dailyReport.ppMgo + dailyReport.giMgo + dailyReport.otherMgo;

    return total;

    // Retornamos el total de cosumo

  }

  public MathRoundOneDecimal(valor, cantDecimales: number) {
    if (!valor) { return 0; }

    let result = mathRound(valor, cantDecimales)
    return result;
  }
}
