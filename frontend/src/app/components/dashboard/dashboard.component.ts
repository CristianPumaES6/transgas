// Dependencias de angular
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { MatDialog } from '@angular/material/dialog';


// RXJS
import { forkJoin, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';


// Model
import { User } from '../../models/user';
import { Voyage, VoyageFilterByYears } from '../../models/voyage';
import { Port } from '../../models/port';
import { DailyReport, Speed } from '../../models/daily-report';
// Modelo genericos, modelos que se usan.
import { ActivityPerformed, ConsumptionMachineMGO, ConsumptionMachineIFO } from '../../models/dashboard';


// Service 
import { UserService } from '../../services/user.service';
import { VoyageService } from '../../services/voyage.service';
import { PortService } from '../../services/port.service';
import { DailyReportService } from '../../services/daily-report.service';
// Servicios Import 
import { ASideService } from '../../services/a-side.service';
import { LanguageService } from '../../services/language.service';
import { LoadingService } from '../../services/loading.service';
// Servicio para exportar la estructura de excel.
import { ExcelService } from '../../services/excel.service';


// Assets
import { mathRound } from '../../../assets/math/math.assets';
import { FormatDate, GetMonthYearFromDate, ComparePreviousDates, CompareAfterDates, TextMonthYearFormatYYYYMMDD, DiffDates, IsPrevious1Date, IsAfter1Date, FisrtOldDayFromDate, validateDate, GetDate, FormatYYYYMMDD, TextMonthDayYearFormatYYYYMMDD } from '../../../assets/moment/moment.assets';


// Componentes
import { IDialogListReport, DialogListReportComponent } from '../../shared/dialog/dialog-list-report/dialog-list-report.component';


import * as Chart from 'chart.js';
import PerfectScrollbar from 'perfect-scrollbar';
import { jsPDF } from 'jspdf'
import * as Html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // Variables de traduccion
  public userLanguage: string = this.languageService.GetCurrentLanguage();
  public translateCategory: string = 'dashboard';

  // rol del usuario logeado.
  public roleUser: string = '';


  // Permite saber si el filtro se debe mostrar o no. 
  // Recordemos que el filtro solo se muestra en pantallas pequeñas.
  public isViewFilter: boolean = true;


  // Años que tiene el usuario.
  public yearsOfUsers: number[] = [];
  // Combo del select year.
  public frmSelectedYear = new FormControl();


  // Variable que controla el combo ActivityPerformed
  public frmCActivityPerformed = new FormControl();
  // Lista de actividades
  public activityPerformedList: string[] = ['LOADING', 'DOWNLOADING', 'SAILING_IN_BALLAST', 'SAILING_WITH_LADEN', 'ECONOMICAL_NAVIGATION', 'ANCHORED', 'MANEUVER', 'OTHER_ACT'];


  // Variable del ng-model del combo SummaryBy
  // nos ayuda a saber que tipo de resumen queremos mostrar.
  public selectSummaryBy: string = 'VOYAGES';
  public typeSummaryVoyageList: string[] = ['VOYAGES', 'PORTS', 'MONTHS', 'DAYS'];



  // Usuarios.
  // Todos los usuarios obtenidos por el getUsers.
  public getUsers: User[] = [];
  // UserId seleccionado.
  public selectUserId: number = 0; // esta variable podria desaparecer esta de mas, por que el id del usuario ya lo tenemos en la variable selectUser
  // Usuario seleccionado.
  public selectUser: User = new User();

  // Filtro por fecha inicio y fin
  public startDate: Date;
  public endDate: Date;
  // Esta variable nos ayudara a saber si es un filtro po fecha.
  public isSetDateFilter: Boolean = false;

  // El viaje generado suma total.
  public generateVoyages: Voyage[] = [];

  // Viajes
  public getVoyages: Voyage[] = [];
  // Viaje id seleccionado
  public selectVoyageId: number = 0;
  // Viaje seleccionado.
  public selectVoyage: Voyage = new Voyage();

  // Texto del reporte, punto por punto.
  public xLabelReport: any[] = [];

  // Configuracion del chartIFO
  public configLineaIFO: Chart.ChartConfiguration; // Configuracion del elemento
  public chartLineIFO: Chart; // LINEA
  public dataIFO: Chart.ChartPoint[] = []; // Data de los puntos de chartjs.

  // Configuracion del chartMGO
  public configLineaMGO: any; // configuracion del elemento
  public chartLineMGO: Chart; // LINEA
  public dataMGO: Chart.ChartPoint[] = []; // Data


  // Configuracion del SPEED
  public configLineaSPEED: any; // configuracion del elemento
  public chartLineSPEED: Chart; // LINEA
  public dataSPEED: Chart.ChartPoint[] = []; // Data


  // Consumo IFO POR ACTIVIDAD
  public totalTimePerActivityIFO: ActivityPerformed = new ActivityPerformed();
  public totalDistanceMilesByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

  public averageSpeedByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
  public averageSpeedCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

  public voyageConsumptionByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
  public dayliConsumptionByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

  public dayliConsumptionCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
  public timePerNavigationCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
  public voyageConsumptionCharterByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

  public balanceConsumptionByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();
  public balanceTimeByActivityPerformedIFO: ActivityPerformed = new ActivityPerformed();

  // CONSUMER MGO por actividad
  public totalTimePerActivityMGO: ActivityPerformed = new ActivityPerformed();
  public totalDistanceMilesByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();

  public averageSpeedByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();
  public averageSpeedCharterByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();

  public voyageConsumptionByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();
  public dayliConsumptionByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();

  public dayliConsumptionCharterByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();
  public timePerNavigationCharterByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();
  public voyageConsumptionCharterByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();

  public balanceConsumptionByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();
  public balanceTimeByActivityPerformedMGO: ActivityPerformed = new ActivityPerformed();


  // CONSUMER MGO POR MAQUINA
  public consumptionTotalMGO = new ConsumptionMachineMGO();
  public consumptionDaysRealMGO = new ConsumptionMachineMGO();
  public consumptionDaysByContractMGO = new ConsumptionMachineMGO();
  public consumptionDailyBalanceMGO = new ConsumptionMachineMGO();

  // CONSUMER MGO POR MAQUINA
  public consumptionTotalIFO: ConsumptionMachineIFO = new ConsumptionMachineIFO();
  public consumptionDaysRealIFO: ConsumptionMachineIFO = new ConsumptionMachineIFO();
  public consumptionDaysByContractIFO: ConsumptionMachineIFO = new ConsumptionMachineIFO();
  public consumptionDailyBalanceIFO: ConsumptionMachineIFO = new ConsumptionMachineIFO();

  // Constructor
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private voyageService: VoyageService,
    private loadingService: LoadingService,
    private languageService: LanguageService,
    private notificationsService: NotificationsService,
    private aSideService: ASideService,
    public dialog: MatDialog,
    private excelService: ExcelService
  ) { }

  // Esta funcion se inicializa primero, es parte de angular.
  ngOnInit(): void {
    // ngOnInit()
    console.log('ngOnInit()');

    // Activamos el loading.
    this.loadingService.Open();

    // Revisar <= esto cada cuadro se deberia de agregar el Scrool solo si ese user permite visualizar
    // hacer pruebas que pasa si no tiene el componente display.
    // podria ir despues ?
    // Porque no va despues.
    // PerfectScrooll Se agregan los Scrool
    setTimeout(() => {
      new PerfectScrollbar('.body-full-container', {
        suppressScrollX: true
      });

      // PerfectScrollbar, para el elemento div az-contact-info-body del html.
      new PerfectScrollbar('.PerfectScrollbar-table-data-MGO', {
        suppressScrollY: true,
        minScrollbarLength: 60
      });

      new PerfectScrollbar('.PerfectScrollbar-table-data-LSFO', {
        suppressScrollY: true,
        minScrollbarLength: 20
      });

      // PerfectScrollbar, para el elemento div az-contact-info-body del html.
      new PerfectScrollbar('.PerfectScrollbar-table-data-activity-lsfo', {
        suppressScrollY: true,
        minScrollbarLength: 20
      });

      // PerfectScrollbar, para el elemento div az-contact-info-body del html.
      new PerfectScrollbar('.PerfectScrollbar-table-data-activity-mgo', {
        suppressScrollY: true,
        minScrollbarLength: 20
      });

    }, 500)


    // Inicializamos la promesa.
    // El modulo de dashboard funciona solo con internet.

    // Si tenemos internet se ejecuta lo siguiente.
    Promise.resolve(true).then(
      result => {
        // Agregamos el plugin de la linea del Chart.
        this.PluginChartLine();

        // Generamos las lineas en el canvas, luego las actualizaremos con data real.
        this.GenetareLineIFO();
        this.GenetareLineMGO();
        this.GenetareLineSPEED();

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
      (result) => {
        if (!result) throw 'ERROR_GET_USERS';

        // Seleccionaremos el primer buque del arreglo.
        let firstUser: User = this.getUsers.find(user => user.role === 'BUQUE');

        return this.SelectUser(firstUser.id);
      }
    ).then(
      result => {

        if (!result) throw 'ERROR_SELECT_USER';

        // Activamos el loading.
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
            return true;
          }
          return false;
        });

        // Segun el resultado retornamos la respuesta.
        return (resultUser !== null);
      }
    ));

  }

  // GetDailyReports: Cargo todos los registros de viaje, util para el dashboard.
  private GetVoyagesByYears(filter: VoyageFilterByYears): Observable<boolean> {

    // Consulto el servicio
    return this.voyageService.GetsVoyageByYears(filter).pipe(map(
      (resultVoyages: Voyage[]) => {

        // Verificamos que nos retorne los viajes.
        if (resultVoyages) {
          resultVoyages.forEach(
            voyage => {

              // Ordenamos los puertos. de menor a mayor.
              voyage.ports.sort(function (aPort, bPort) {
                if (aPort.id > bPort.id) {
                  return 1;
                }
                if (aPort.id < bPort.id) {
                  return -1;
                }
                // a must be equal to b
                return 0;
              });

              // Recorremos los puertos.
              voyage.ports.forEach(
                port => {

                  // Ordenamos lor reportes diarios.
                  port.dailyReports.sort(function (aReport, bReport) {
                    if (aReport.id > bReport.id) {
                      return 1;
                    }
                    if (aReport.id < bReport.id) {
                      return -1;
                    }
                    // a must be equal to b
                    return 0;
                  });
                }
              )
            }
          )
        }

        // Guardamos el valor en nuestra variable global.
        this.getVoyages = resultVoyages || this.getVoyages;

        // Segun el resultado retornamos la respuesta.
        return (resultVoyages !== null);
      }
    ));

  }


  // SelectComboYear: Invoca una busqueda al servidor.
  public SelectComboYears() {

    console.log('SelectComboYears()');

    // Promise
    Promise.resolve(true).then(
      result => {

        // Habilitamos el loading service.
        this.loadingService.Open();

        // Deseleccionamos el filtro por viajes.
        this.selectVoyageId = null;

        // Armamos el filtro para obtener los viajes por años.
        let filter: VoyageFilterByYears = new VoyageFilterByYears();
        filter.userId = this.selectUserId;

        // Verificamos si se a seleccionado algun año del frmSelectedYear
        if (this.frmSelectedYear.value && this.frmSelectedYear.value.length > 0) {
          // si es asi lo recorremos y se lo agregamos al filtro.
          this.frmSelectedYear.value.forEach(year => {
            filter.years.push(year);
          });
        };

        // Traigo a todos los User y lo instancio en el obj.
        // GeyVoyage obtiene todos los puertos.
        return this.GetVoyagesByYears(filter).pipe().toPromise();
      }
    ).then(
      resultGetVoyagesByYears => {
        // Verificamos el resultado.
        if (!resultGetVoyagesByYears) throw 'ERROR_GET_VOYAGES';

        // Cambiamos el SumaryBy por viajes.
        this.selectSummaryBy = 'VOYAGES';

        // Generamos la data por filtro
        return this.GenerateDataByFilter(this.getVoyages);
      }
    ).then(
      result => {
        // si hay un problema al generar la data segun el filtro.
        // Mostramos el siguiente error.
        if (!result) throw 'ERROR_GENERATE_DATA_BY_FILTER()'

        // Generamos el dashboard por tipo de resumen.
        return this.GenerateDashboardBySumary(true);
      }
    ).then(
      resultGenerateDashboard => {
        // Validamos el resultado del generate Dashboard.
        if (!resultGenerateDashboard) throw 'ERROR_GENERATE_DASHBOARD';

        // Loading cerrar.
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

  // SelectComboBuque: Selecciona un buque
  public SelectComboBuque(userId: number) {
    console.log('SelectComboBuque(userId)');

    Promise.resolve(true).then(
      result => {
        // Activamos el loading.
        this.loadingService.Open();

        // Invocamos nuestra funcion SelectUser.
        return this.SelectUser(this.selectUserId);
      }).then(
        result => {

          // Verificamos que todo este OK.
          if (!result) throw 'ERROR_COMBO_BUQUE';
          // Cerramos el loading.
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

    console.log('FIN SelectComboBuque()');
  }

  // Selecciona al usuario, 
  // Selecciona su ultimo año,
  // Obtiene todos los datos del reporte.
  // Y lo muestra en los cuadros.
  private async SelectUser(userId: number): Promise<boolean> {

    return await Promise.resolve(true).then(
      result => {

        // Seleccionamos al usuairo segun el selectUserId
        return this.getUsers.find(user => user.id === userId);
      }
    ).then(
      resultUser => {
        // Verificamos que exista el usuario.
        if (!resultUser) { throw 'NO_BUQUE_REGISTER'; }

        // Seleccionamos el usuario.
        this.selectUserId = userId;
        this.selectUser = resultUser;

        // Obtenemos todos los años del buque seleccionado.
        let years = this.selectUser.years;

        // Ultimo año del buque.
        let OldYearUser: number;

        // Verificamos que tenga almenos un registro, de año.
        if (years && years.length > 0) {
          // Asignamos todos los años a la variable.
          this.yearsOfUsers = years;
          // Seleccionamos el ultimo año.
          OldYearUser = this.yearsOfUsers[years.length - 1];
          // Agregamos ese valor al combo del selectYear.
          this.frmSelectedYear.setValue([OldYearUser]);
        } else {
          // Años del usuario esta vacio.
          this.yearsOfUsers = [];
          // SetValues vacio.
          this.frmSelectedYear.setValue([]);

          // Revisar aqui deberia notificar que este buque no tiene años, registrados.
          // Al no tener años registrados no deberia poder permitir registrar reportes ni generar viajes.
          // ni ingresar al modulo voyage.
          throw 'NO_YEARS_REGISTER'; // No existen años registrados.
        };

        // Armamos el modelo para hacer la consulta.
        let filter: VoyageFilterByYears = new VoyageFilterByYears();
        filter.userId = userId;
        filter.years = [OldYearUser];

        // Traigo a todos los User y lo instancio en el obj.
        // GeyVoyage obtiene todos los puertos.
        return this.GetVoyagesByYears(filter).pipe().toPromise();
      }
    ).then(
      resultGetVoyageByYears => {

        if (!resultGetVoyageByYears) throw 'ERROR_GET_VOYAGES';

        // Generamos la data por filtro
        return this.GenerateDataByFilter(this.getVoyages);
      }
    ).then(
      result => {
        // Revisamos que se halla generado correctamente el filtro.
        if (!result) throw 'ERROR_GENERATE_DATA_BY_FILTER()'


        // Generamos el dashboard por tipo de resumen.
        return this.GenerateDashboardBySumary(true);
      }
    ).then(
      resultGenerateDashboard => {
        // Validamos el resultado del generate Dashboard.
        if (!resultGenerateDashboard) throw 'ERROR_GENERATE_DASHBOARD';

        return true;
      }
    )
  }

  // ClickSummaryBy : aqui se selecciona un tipo de resumen.
  public ClickSummaryBy() {
    console.log(' ClickSummaryBy():');

    // Abrimos el loading
    this.loadingService.Open();

    // Hacemos un setTimeOut para 
    setTimeout(
      () => {
        // Inicializamos la promesa.
        Promise.resolve(true)
          .then(
            () => {
              // Generamos el dashboard por tipo de resumen.
              return this.GenerateDashboardBySumary(true);
            }
          ).then(
            resultGenerateDashboard => {
              // Validamos el resultado del generate Dashboard.
              if (!resultGenerateDashboard) throw 'ERROR_GENERATE_DASHBOARD';

              // Loading cerrar.
              this.loadingService.Close();
            }
          )
      },
      100
    );

  }

  // SelectComboVoyage(index): Filtramos la data de los viajes por el viaje seleccionado. 
  public SelectComboVoyage(index?: number) {
    console.log('SelectComboVoyage()');

    // Abrimos el loading.
    this.loadingService.Open();


    setTimeout(
      () => {



        Promise.resolve(true).then(
          result => {

            // Creamos nueva variable que nos permitira hacer el filtro por viaje sin dañar a nuestra variable temporal.
            let newVoyages = [];

            if (index == null) {
              // Si no selecciono ningun viaje le mandamos todo el getVoyage.
              newVoyages = this.getVoyages;

              this.selectSummaryBy = 'VOYAGES';
            } else {
              // Si selecciono un viaje.
              // El resumen se vera por dia.
              this.selectSummaryBy = 'DAYS';
              // solo agregamos el viaje que se selecciono.
              newVoyages.push(this.getVoyages[index]);
            }

            // Le mandamos nuetra variable para que genere la data por filtros de actividades.
            return this.GenerateDataByFilter(newVoyages);
          }
        ).then(
          result => {
            // Revisamos que se halla generado correctamente el filtro.
            if (!result) throw 'ERROR_GENERATE_DATA_BY_FILTER()'

            // Generamos el dashboard por tipo de resumen.
            return this.GenerateDashboardBySumary(true);
          }
        ).then(
          resultGenerateDashboard => {
            // Validamos el resultado del generate Dashboard.
            if (!resultGenerateDashboard) throw 'ERROR_GENERATE_DASHBOARD';

            // Loading cerrar.
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
    )
  }

  public ClickFilterWithDate() {

    console.log('ClickFilterWithDate()');

    this.isSetDateFilter = true;

    this.GenerateReporteByDate();
  }

  //GenerateReporteByDate():  Generar reportes por filtro de fecha.
  private GenerateReporteByDate(): boolean {
    console.log('GenerateReporteByDate()');

    this.loadingService.Open();

    setTimeout(() => {



      // Iniciamos las promesas.
      Promise.resolve(true).then(
        result => {
          // revisar que la fecha sean correctas.
          this.selectVoyageId = null;

          // Validamos las fechas.
          // Si no es valida enviamos error.
          if (!validateDate(this.startDate)) throw 'NULL_START_DATE';
          if (!validateDate(this.endDate)) throw 'NULL_END_DATE';
          // Verificamos que la fecha inicio sea antes que la fecha fin.
          if (IsAfter1Date(this.startDate, this.endDate)) throw 'ERROR_START_DATE';

          return true;
        }
      ).then(
        result => {

          // Revisar esto por que podriamos validar si se esta generando correctamente la databyfilter
          // Podria ser un return.

          // Le mandamos nuetra variable para que genere la data por filtros de actividades.
          return this.GenerateDataByFilter(this.getVoyages, true);
        }
      ).then(
        result => {
          if (!result) throw 'ERROR_GENERATE_DATA_BY_FILTER()'


          // Generamos el dashboard por tipo de resumen.
          return this.GenerateDashboardBySumary(true);
        }
      ).then(
        resultGenerateDashboard => {
          // Validamos el resultado del generate Dashboard.
          if (!resultGenerateDashboard) throw 'ERROR_GENERATE_DASHBOARD';

          // Loading cerrar.
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
        }
      );


    }, 100)

    console.log('FIN GenerateReporteByDate2');

    return false;
  }

  // revisar estp bien, tengo un duda que pasaria si la fecha se cambia cada ves que selecciono una actividad.
  // Estpo podria perjudicar mi data.
  // Mostrandome cada ves menos ya que la data real se va ir recortando por la fecha.
  // Genera reportes segun filtro las actividades seleccionadas.
  public SelectFilterByActivities() {
    console.log('FilterByActivities()');

    // variable que obtendra todos los viajes.
    let voyages: Voyage[] = [];

    // ESTA VARIABLE EXACTAMENTE NO NOS DICE SI ES POR FECHA YA QUE DEFRNETE EN LA SEGUNDA OBCION DETECTA LA FECHA.
    // esta variable nos dira si el filtro es por fecha.
    let isFilterWithDate: boolean = false;

    // Abrimos el loading.
    this.loadingService.Open();

    // Pongo este setTineOut como truco por que el loading no esta cargando.
    // SI LLEGAN A SABER POR QUE, ESCRIBANLO.
    // La unica pista que tengo, puede ser por un tema del asincrono y sincrono.
    setTimeout(
      () => {

        // Iniciamos la promesa
        Promise.resolve(true).then(
          () => {
            // Verificamos si existe un viaje seleccionado.
            if (this.selectVoyageId) {

              // filtramos el viaje segun el id del viaje seleccionado.
              let voyageSelect = this.getVoyages.find(voyage => voyage.id == this.selectVoyageId);

              // Verificamos que se halla encontrado el viaje.
              if (!voyageSelect) throw 'VOYAGE_NOT_FOUND';

              // lo agregamos 
              voyages.push(voyageSelect);


            }
            // Si no existe un viaje, verificamos si el filtro es por fecha.
            // EXACTAMENTE ESTO, NO NOS INDICA QUE EL FILTRO A SIDO POR FECHA
            else if (this.startDate || this.endDate) {

              // Deseleccionamos el voyageId
              this.selectVoyageId = null;

              // Validamos las fechas.
              // Si no es valida enviamos error.
              if (!validateDate(this.startDate)) throw 'NULL_START_DATE';
              if (!validateDate(this.endDate)) throw 'NULL_END_DATE';
              // Verificamos que la fecha inicio sea antes que la fecha fin.
              if (IsAfter1Date(this.startDate, this.endDate)) throw 'ERROR_START_DATE';
              // activamos que el filtro sea por fecha.
              isFilterWithDate = true;
              // ya que el filtro se hara con la fecha le enviaremos toda la data de viaje.
              voyages = this.getVoyages;

            } else {

              // Caso contrario el filtro se hara con todos los viajes.
              // Ya que no existe ningun rango de fecha
              // ni viaje seleccionado.
              voyages = this.getVoyages;

              // Si el sumary es DAYS lo convertimos a viajes.
              if (this.selectSummaryBy == 'DAYS') {
                this.selectSummaryBy = 'VOYAGES';
              }

            }

            return true;
          }
        ).then(
          result => {
            if (!result) throw 'NOT_OK'
            // Revisar esto por que podriamos validar si se esta generando correctamente la databyfilter
            // Podria ser un return.
            return this.GenerateDataByFilter(voyages, isFilterWithDate);
          }
        ).then(
          result => {
            // Revisamos que la data del filtro se halla generado correctamente.
            if (!result) throw 'ERROR_GENERATE_DATA_BY_FILTER()'

            // Generamos el dashboard por tipo de resumen.
            return this.GenerateDashboardBySumary(true);
          }
        ).then(
          resultGenerateDashboard => {
            // Validamos el resultado del generate Dashboard.
            if (!resultGenerateDashboard) throw 'ERROR_GENERATE_DASHBOARD';

            // Loading cerrar.
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

          }
        );

      }, 100);

    console.log('FilterByActivities()');
  }

  //  ClearFilter(): 
  public ClearFilter() {

    // Iniciamos la promesa
    Promise.resolve(true).then(
      result => {
        // Activamos el loading.
        this.loadingService.Open();

        // RESET Las variables de filtro.
        this.startDate = null;
        this.endDate = null;
        this.selectVoyageId = 0;
        this.selectVoyage = new Voyage();
        this.selectSummaryBy = 'VOYAGES';

        // Verificamos si el filtro de actividades esta activo, para resetearlo.
        if (this.frmCActivityPerformed && this.frmCActivityPerformed.value && this.frmCActivityPerformed.value) {
          // Reset filtro.
          this.frmCActivityPerformed = new FormControl();
        }

        // Revisar esto por que podriamos validar si se esta generando correctamente la databyfilter
        // Podria ser un return.
        return this.GenerateDataByFilter(this.getVoyages);
      }
    ).then(
      result => {
        // Revisamos que la data del filtro se halla generado correctamente.
        if (!result) throw 'ERROR_GENERATE_DATA_BY_FILTER()'

        // Generamos el dashboard por tipo de resumen.
        return this.GenerateDashboardBySumary(true);
      }
    ).then(
      resultGenerateDashboard => {
        // Validamos el resultado del generate Dashboard.
        if (!resultGenerateDashboard) throw 'ERROR_GENERATE_DASHBOARD';

        // Validamos el resultado del generate Dashboard.
        if (!resultGenerateDashboard) throw 'ERROR_GENERATE_DASHBOARD';

        // Loading cerrar.
        this.loadingService.Close();
      }).catch(
        err => {

          // Manejo el error
          let msg: string = this.languageService.GetMessage(this.translateCategory, this.languageService.GetMessage(this.translateCategory, err || 'ERROR_ON_LOAD'));

          console.error(msg);
          console.dir(err);

          this.notificationsService.error(this.languageService.GetMessage(this.translateCategory, 'ERROR'), msg);
          // Deshabilito el spinner de loading
          this.loadingService.Close();
        }
      );

  }

  // ViewFilter() : Esta funcion abre y cierra el filtro, el filtro movil solo funciona
  // En pantallas chiquitas.
  public ViewFilter(isView: boolean) {
    console.log('viewFilter(isView: boolean)');
    // se si queres ver o no el filtro.
    this.isViewFilter = isView;
  }

  // ClickExportExcel() : Esta funcion genera el exxcel
  public ClickExportExcel() {

    // Iniciamos las promesas.
    Promise.resolve(true).then(
      result => {
        // Abrimos el loading.
        this.loadingService.Open();


        // Generatamos el report daily.
        return this.excelService.ExportReportDaily(this.generateVoyages);

      }
    ).then(
      resultGenerateDashboard => {
        // Verificamos que se halla exportado correctamente.
        if (!resultGenerateDashboard) throw 'ERROR_EXPORT_REPORT_DAILY';

        // Loading cerrar.
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
      }
    );


  }

  // ClickExportPDF() : Funcion que se ejecuta al dar click a exportar pdf, esto invoca a la funcion que genera el pdf.
  public ClickExportPDF() {

    // Iniciamos las promesas.
    Promise.resolve(true).then(
      result => {
        // Abrimos el loading.
        this.loadingService.Open();


        // Generatamos el report daily.
        return this.ExportPDF();

      }
    ).then(
      resultGenerateDashboard => {
        // Verificamos que se halla exportado correctamente.
        if (!resultGenerateDashboard) throw 'ERROR_EXPORT_REPORT_DAILY';

        // Loading cerrar.
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
      }
    );


  }

  // ExportPDF() : Esta opcion exporta el pdf.
  // AQUI UNA MEJORA.
  // HAY MEJORA esto toma por defecto el generateVOyages, hay que revisar que deberia tomar.
  private async ExportPDF(): Promise<boolean> {

    // El tamaño de un documento es 210 y 297
    // width 210
    // Heigth 297

    // recorremos los viajes 
    for await (const voyage of this.generateVoyages) {

      // Recorremos los puertos.
      for await (const port of voyage.ports) {
        // Armamos el objeto de JSPDF
        const doc = new jsPDF();
        // tamaño de pdf.
        var widthPDF = doc.internal.pageSize.getWidth();


        // Nos ubicamos a una altura.
        let height = 38;
        // ubicamos la imagen con un tamaño de 50 x 50
        doc.addImage("./assets/icons/logotransgas.png", "JPEG", (widthPDF - 50) / 2, height, 50, 50)
        // le sumamos la altura.
        height += 55;

        // le sumamos la altura.
        height += 10;
        doc.setFontSize(35);
        doc.setTextColor(22, 33, 77);
        doc.setFont('Helvetica', 'bold');
        doc.text('Vessel Performance Report', widthPDF / 2, height, { align: 'center' })

        // le sumamos la altura.
        height += 10;
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFont('Helvetica', 'bold');
        doc.text('Prepared For:', widthPDF / 2, height, { align: 'center' })

        // le sumamos la altura.
        height += 12;
        doc.setFontSize(30);
        doc.setTextColor(22, 33, 77);
        doc.setFont('Helvetica', 'bold');
        doc.text(this.selectUser.name, widthPDF / 2, height, { align: 'center' })

        // le sumamos la altura.
        height += 20;
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFont('Helvetica', 'bold');
        doc.text('N° Port: ' + port.portNumber, widthPDF / 2, height, { align: 'center' })

        // le sumamos la altura.
        height += 12;
        doc.setFontSize(30);
        doc.setTextColor(22, 33, 77);
        doc.setFont('Helvetica', 'bold');
        doc.text(port.departurePort + " to " + port.arrivalPort, widthPDF / 2, height, { align: 'center' })

        // le sumamos la altura.
        height += 10;
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFont('Helvetica', 'bold');
        doc.text("ATD: " + FormatDate(port.dailyReports[0].date) + " " + port.dailyReports[0].hour, widthPDF / 2, height, { align: 'center' })

        // le sumamos la altura.
        height += 10;
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.setFont('Helvetica', 'bold');
        doc.text("Date: " + TextMonthDayYearFormatYYYYMMDD(FormatDate(GetDate())), widthPDF / 2, height, { align: 'center' }) // REVISAR ESTO. el formato de la fecha no es correcto.

        // Le sumamos la altura.
        // Dibujaremos los cuadrados.
        height += 20;
        // Filled red square with black borders
        doc.setDrawColor(0);
        doc.setFillColor(255, 255, 255);
        doc.rect(10, height, 210 - (10 * 2), 50, "FD");

        // Cuadro chiquito donde esta el titulo.
        height -= 5;
        doc.setDrawColor(0);
        doc.setFillColor(22, 33, 77);
        doc.rect(30, height, 210 - (56 * 2), 8, "FD");
        // Texto
        doc.setFontSize(10);
        doc.setTextColor("ffffff");
        doc.setFont('Helvetica', 'bold');
        doc.text("Report Summary - Normal Speed Conditions (Laden)", 35, height + 5, { align: 'left' })

        // Posicion normal dentro del cuadro.
        height += 5;
        height += 10;

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('Helvetica', 'bold');
        doc.text("Original Warranted Values ", 75, height, { align: 'left' })
        doc.text("Calculation Results", 140, height, { align: 'left' })

        height += 10;
        doc.setTextColor(0, 0, 0);
        doc.text("Speed", 15, height, { align: 'left' })
        doc.setTextColor(22, 33, 77);
        doc.text("about " + this.selectUser.contractSpeedSailingLadenMGO + " Knots", 75, height, { align: 'left' })
        doc.setTextColor("960e0e");
        doc.text("---- Hours Lost", 140, height, { align: 'left' })

        height += 10;
        doc.setTextColor(0, 0, 0);
        doc.text("Fuel Consumption", 15, height, { align: 'left' })
        doc.setTextColor(22, 33, 77);
        doc.text("about " + this.selectUser.contractSpeedSailingLadenIFO + " MT/Day", 75, height, { align: 'left' })
        doc.setTextColor(0, 0, 0);
        doc.text("Within Guaranteed Limits", 140, height, { align: 'left' })

        height += 10;
        doc.setTextColor(0, 0, 0);
        doc.text("Diesel Consumption", 15, height, { align: 'left' })
        doc.setTextColor(22, 33, 77);
        doc.text("about " + this.selectUser.contractSpeedSailingLadenMGO + " MT/Day", 75, height, { align: 'left' })
        doc.setTextColor("960e0e");
        doc.text("---- MT - OverConsumed", 140, height, { align: 'left' })



        doc.save(this.selectUser.name + "_V" + voyage.voyageNumber + "_P" + port.portNumber + "-" + port.departurePort + "-" + port.arrivalPort + ".pdf")
      }

    }
    return true;
  }

  // Genera la data del viaje con filtro y resumen.
  // Ademas lo volvimos sincrono.
  private async GenerateDataByFilter(aRvoyages: Voyage[], isFilterWithDate?: boolean): Promise<boolean> {
    console.log('GenerateDataByFilter()');

    // Rango de fecha de inicio y fin 
    // Esta variable nos ayudara saber cuando si nicio el reporte y cuando termino.
    let generalStartDate: String;
    let generalEndDate: String;

    // Retornaremos lo que nos revuelva la promesa.
    // Aárte le agregamos un await para que espere, la respuesta.
    return await Promise.resolve(true)
      .then(
        result => {

          // Creamos un nuevo arreglo para no afectar al originar.
          this.generateVoyages = JSON.parse(JSON.stringify(aRvoyages));


          // RESET VALORES.
          // Consumo IFO POR ACTIVIDAD
          this.totalTimePerActivityIFO = new ActivityPerformed();
          this.totalDistanceMilesByActivityPerformedIFO = new ActivityPerformed();

          this.averageSpeedByActivityPerformedIFO = new ActivityPerformed();
          this.averageSpeedCharterByActivityPerformedIFO = new ActivityPerformed(); // (0, 0, 12.5, 12, 12, 0, 0, 0)

          this.voyageConsumptionByActivityPerformedIFO = new ActivityPerformed();
          this.dayliConsumptionByActivityPerformedIFO = new ActivityPerformed();

          this.dayliConsumptionCharterByActivityPerformedIFO = new ActivityPerformed();  // (4.5, 4.5, 30.5, 30.5, 30.5, 4.5, 4.5, 4.5)
          this.timePerNavigationCharterByActivityPerformedIFO = new ActivityPerformed();
          this.voyageConsumptionCharterByActivityPerformedIFO = new ActivityPerformed();

          this.balanceConsumptionByActivityPerformedIFO = new ActivityPerformed();
          this.balanceTimeByActivityPerformedIFO = new ActivityPerformed();


          // CONSUMER MGO por actividad.
          this.totalTimePerActivityMGO = new ActivityPerformed();
          this.totalDistanceMilesByActivityPerformedMGO = new ActivityPerformed();

          this.averageSpeedByActivityPerformedMGO = new ActivityPerformed();
          this.averageSpeedCharterByActivityPerformedMGO = new ActivityPerformed(); // (0, 0, 12.5, 12, 12, 0, 0, 0)

          this.voyageConsumptionByActivityPerformedMGO = new ActivityPerformed();
          this.dayliConsumptionByActivityPerformedMGO = new ActivityPerformed();

          this.dayliConsumptionCharterByActivityPerformedMGO = new ActivityPerformed();  // (4.5, 4.5, 30.5, 30.5, 30.5, 4.5, 4.5, 4.5)
          this.timePerNavigationCharterByActivityPerformedMGO = new ActivityPerformed();
          this.voyageConsumptionCharterByActivityPerformedMGO = new ActivityPerformed();

          this.balanceConsumptionByActivityPerformedMGO = new ActivityPerformed();
          this.balanceTimeByActivityPerformedMGO = new ActivityPerformed();


          // CONSUMER MGO POR MAUQINA
          this.consumptionTotalMGO = new ConsumptionMachineMGO();
          this.consumptionDaysRealMGO = new ConsumptionMachineMGO();
          this.consumptionDaysByContractMGO = new ConsumptionMachineMGO();
          this.consumptionDailyBalanceMGO = new ConsumptionMachineMGO();

          // CONSUMER MGO POR MAQUINA
          this.consumptionTotalIFO = new ConsumptionMachineIFO();
          this.consumptionDaysRealIFO = new ConsumptionMachineIFO();
          this.consumptionDaysByContractIFO = new ConsumptionMachineIFO(0, 0, 0, 0, 0);
          this.consumptionDailyBalanceIFO = new ConsumptionMachineIFO();


          return true;
        }
      ).then(
        result => {
          // Revisamos el resultado.
          if (!result) throw 'NOT_OK';

          // AQUI ASIGNAMOS LOS VALORES POR ACTIVIDAD
          // TOTAL TIME PER ACTIVITY - this.totalTimePerActivityIFO
          // TOTAL DISTANCE - this.totalDistanceMilesByActivityPerformedIFO
          // DAILY CONSUMPTION - this.voyageConsumptionByActivityPerformedIFO

          // ASIGNAMOS EL FILTRO POR ACTIVIDAD para la suma del consum total y el consumo por maquina.
          // Filtro ṕor actividad 
          // Verificamos si se tiene aplicado alguna actividad seleccionada.
          // O si no se a seleccionado nada todos los datos se suman.
          // TOTAL CONSUMPTION - this.consumptionTotalMGO
          // Hacemos un filtro al viaje generado.
          this.generateVoyages = this.generateVoyages.filter(
            (voyage: Voyage, indexV: number, voyages: any[]) => {

              // total de consumo por viaje.
              let totalConsumptionByVoyageIFO = 0;
              let totalConsumptionByVoyageMGO = 0;
              // total de puertos registrados en el viaje.
              let totalPortByVoyage = 0;
              // total de reportes registrados en el viaje.
              let totalReportByVoyage = 0;
              // total de distancia y tiempo del viaje.
              let totalSpeedByVoyage: Speed = new Speed();

              // Fecha donde se inicio el registro.
              let dayStartByVoyage: String;
              // fecha donde termino el registro.
              let dayEndByVoyage: String;

              // Recorremos y hacemos un filtro a todos los puertos
              voyage.ports = voyage.ports.filter(
                (port: Port, index, ports) => {

                  // Total de consumo por puerto.
                  let totalConsumptionByPortIFO = 0;
                  let totalConsumptionByPortMGO = 0;
                  // Total de reporte por puerto.
                  let totalReportByPort = 0;
                  // Total de distancia y tiempo del puerto.
                  let totalSpeedByPort: Speed = new Speed();
                  // Fecha donde se inicio y finaliza el puerto.
                  let dayStartByPort: String;
                  let dayEndByPort: String;

                  // Verificamos que el puerto este activo.
                  if (port.status) {

                    // Recorremos y filtramos los reportes.
                    port.dailyReports = port.dailyReports.filter(
                      (report, index, reports) => {

                        // Verificamos que el reporte este activo.
                        if (report.status) {

                          // Verificamos si es un filtro con fecha.
                          // Verificamos que la fecha de inicio y fin sean los correctos.
                          // ademas de ver si la fecha de inicio esta antes de la fecha fin.
                          if (isFilterWithDate && this.startDate && this.endDate && (!IsAfter1Date(report.date, this.startDate) || !IsPrevious1Date(report.date, this.endDate))) {
                            return false;
                          }

                          // Total de consumo por reporte IFO y MGO.
                          let totalConsumptionByReportIFO = this.SumaIfo(report);
                          let totalConsumptionByReportMGO = this.SumaMgo(report);

                          // Verificamos si el nuevo dia es anterior al que tenemos actualmente.
                          dayStartByPort = ComparePreviousDates(dayStartByPort, report.date);
                          // Verificamos si ell nuevo dia es posterior al que tenemos actualmente.
                          dayEndByPort = CompareAfterDates(dayEndByPort, report.date);


                          // FILTRO POR ACTIVIDAD
                          // TOTAL TIME PER ACTIVITY - this.totalTimePerActivityIFO
                          // TOTAL DISTANCE - this.totalDistanceMilesByActivityPerformedIFO
                          // DAILY CONSUMPTION - this.voyageConsumptionByActivityPerformedIFO
                          if (report.activityPerformed === 'LOADING') {

                            this.totalTimePerActivityIFO.loading += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedIFO.loading += report.distance;
                            this.voyageConsumptionByActivityPerformedIFO.loading += totalConsumptionByReportIFO;


                            this.totalTimePerActivityMGO.loading += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedMGO.loading += report.distance;
                            this.voyageConsumptionByActivityPerformedMGO.loading += totalConsumptionByReportMGO;

                          } else if (report.activityPerformed === 'DOWNLOADING') {

                            this.totalTimePerActivityIFO.discharge += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedIFO.discharge += report.distance;
                            this.voyageConsumptionByActivityPerformedIFO.discharge += totalConsumptionByReportIFO;


                            this.totalTimePerActivityMGO.discharge += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedMGO.discharge += report.distance;
                            this.voyageConsumptionByActivityPerformedMGO.discharge += totalConsumptionByReportMGO;

                          } else if (report.activityPerformed === 'SAILING_IN_BALLAST') {

                            this.totalTimePerActivityIFO.ballast += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedIFO.ballast += report.distance;
                            this.voyageConsumptionByActivityPerformedIFO.ballast += totalConsumptionByReportIFO;

                            this.totalTimePerActivityMGO.ballast += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedMGO.ballast += report.distance;
                            this.voyageConsumptionByActivityPerformedMGO.ballast += totalConsumptionByReportMGO;

                          } else if (report.activityPerformed === 'SAILING_WITH_LADEN') {

                            this.totalTimePerActivityIFO.laden += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedIFO.laden += report.distance;
                            this.voyageConsumptionByActivityPerformedIFO.laden += totalConsumptionByReportIFO;


                            this.totalTimePerActivityMGO.laden += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedMGO.laden += report.distance;
                            this.voyageConsumptionByActivityPerformedMGO.laden += totalConsumptionByReportMGO;

                          } else if (report.activityPerformed === 'ECONOMICAL_NAVIGATION') {

                            this.totalTimePerActivityIFO.economical += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedIFO.economical += report.distance;
                            this.voyageConsumptionByActivityPerformedIFO.economical += totalConsumptionByReportIFO;


                            this.totalTimePerActivityMGO.economical += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedMGO.economical += report.distance;
                            this.voyageConsumptionByActivityPerformedMGO.economical += totalConsumptionByReportMGO;

                          } else if (report.activityPerformed === 'ANCHORED') {

                            this.totalTimePerActivityIFO.anchor += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedIFO.anchor += report.distance;
                            this.voyageConsumptionByActivityPerformedIFO.anchor += totalConsumptionByReportIFO;


                            this.totalTimePerActivityMGO.anchor += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedMGO.anchor += report.distance;
                            this.voyageConsumptionByActivityPerformedMGO.anchor += totalConsumptionByReportMGO;

                          } else if (report.activityPerformed === 'MANEUVER') {

                            this.totalTimePerActivityIFO.maneuver += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedIFO.maneuver += report.distance;
                            this.voyageConsumptionByActivityPerformedIFO.maneuver += totalConsumptionByReportIFO;


                            this.totalTimePerActivityMGO.maneuver += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedMGO.maneuver += report.distance;
                            this.voyageConsumptionByActivityPerformedMGO.maneuver += totalConsumptionByReportMGO;

                          } else if (report.activityPerformed === 'OTHER_ACT') {

                            this.totalTimePerActivityIFO.otherActivity += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedIFO.otherActivity += report.distance;
                            this.voyageConsumptionByActivityPerformedIFO.otherActivity += totalConsumptionByReportIFO;

                            this.totalTimePerActivityMGO.otherActivity += report.steamingTime; // revisar
                            this.totalDistanceMilesByActivityPerformedMGO.otherActivity += report.distance;
                            this.voyageConsumptionByActivityPerformedMGO.otherActivity += totalConsumptionByReportMGO;

                          }


                          // Filtro ṕor actividad
                          // Este filtro por actividad se ve reflejado en los 
                          // CUADROS POR CONSUMO
                          // CUADROS POR MAQUINA
                          // Verificamos si se tiene aplicado alguna actividad seleccionada.
                          // O si no se a seleccionado nada todos los datos se suman.
                          if (
                            (!this.frmCActivityPerformed.value || this.frmCActivityPerformed.value.length === 0) ||
                            this.frmCActivityPerformed.value.find(activity => activity === report.activityPerformed)
                          ) {

                            // Sumamos el consumo.
                            totalConsumptionByPortIFO = totalConsumptionByPortIFO + totalConsumptionByReportIFO;
                            totalConsumptionByPortMGO = totalConsumptionByPortMGO + totalConsumptionByReportMGO;
                            // Agregamos los datos de distancia y tiempo 
                            totalSpeedByPort.add(report.distance, report.steamingTime);

                            // Sumamos el consumo MGO
                            this.consumptionTotalMGO.mpal += report.mplaMgo;
                            this.consumptionTotalMGO.aux += report.auxMgo;
                            this.consumptionTotalMGO.boiler += report.boilerMgo;
                            this.consumptionTotalMGO.pp += report.ppMgo;
                            this.consumptionTotalMGO.gi += report.giMgo;
                            this.consumptionTotalMGO.other += report.otherMgo;
                            // FIN Consumo MGO

                            // Sumamos el consumo IFO
                            this.consumptionTotalIFO.mpal += report.mplaIfo;
                            this.consumptionTotalIFO.aux += report.auxIfo;
                            this.consumptionTotalIFO.boiler += report.boilerIfo;
                            this.consumptionTotalIFO.other += report.otherIfo;
                            // FIN Consumo IFO

                            totalReportByPort += 1

                          } else {
                            // Esto se ejecuta cuando seleccionas una actividad y esta actividad no es el reporte actual.
                            return false;
                          }

                          // Si todo anda bien retornamos ok.
                          return true;
                        } else {
                          // retornamos false para no agregar un reporte 
                          // que tiene el estado desactivado.
                          return false;
                        }

                      }
                    )

                    // Si no hay registro de reporte,
                    //  que no se agrege el puerto
                    // retornamos false al filtro.
                    if (!port.dailyReports.length) return false;


                    // Asignamos los consumos por puertos.
                    port.robIfo = totalConsumptionByPortIFO;
                    port.robMgo = totalConsumptionByPortMGO;
                    port.speed = totalSpeedByPort;

                    // total de reportes registrado en el viaje.
                    port.totalReport = totalReportByPort;

                    // Agregamos el dia donde inicia y finaliza el registro de los reportes en puerto
                    port.dayStart = dayStartByPort;
                    port.dayEnd = dayEndByPort;

                    // Sumamos un puerto al total de puertos.
                    totalPortByVoyage = totalPortByVoyage + 1;
                    totalReportByVoyage = totalReportByVoyage + port.totalReport;
                    // Comparamos si el dia es antes o despues para agregarlo.
                    dayStartByVoyage = ComparePreviousDates(dayStartByVoyage, dayStartByPort);
                    dayEndByVoyage = CompareAfterDates(dayEndByVoyage, dayEndByPort);

                    // Asignamos los datos de ocn
                    totalConsumptionByVoyageIFO = totalConsumptionByVoyageIFO + totalConsumptionByPortIFO;
                    totalConsumptionByVoyageMGO = totalConsumptionByVoyageMGO + totalConsumptionByPortMGO;
                    totalSpeedByVoyage.add(totalSpeedByPort.distance, totalSpeedByPort.steamingTime);

                    return true;

                  } else {

                    // Si su estado del puerto esta desactivado
                    // No lo agrego al filtro.
                    return false;
                  }

                }
              );

              // si no existen puertos en el viaje, que no se agrege el viaje.
              if (!voyage.ports.length) return false;

              // Asignamos el total a sus respectivos atributos.
              voyage.totalMGO = totalConsumptionByVoyageMGO;
              voyage.totalIFO = totalConsumptionByVoyageIFO;

              // Asignamos el total al viaje
              voyage.totalSpeed = totalSpeedByVoyage;
              voyage.totalPort = totalPortByVoyage;
              voyage.totalReport = totalReportByVoyage;
              voyage.dayStart = dayStartByVoyage;
              voyage.dayEnd = dayEndByVoyage;

              // Comparamos que sea la primera y ultima fecha.
              generalStartDate = ComparePreviousDates(generalStartDate, voyage.dayStart);
              generalEndDate = CompareAfterDates(generalEndDate, voyage.dayEnd);
              return true;
            });

          // Retornamos true para continuar.
          return true;
        }
      ).then(
        result => {

          // FULL FORMULAS IFO

          // FORMULA CONSUMO POR EQUIPO IFO
          // Consumo Diario por  maquina.
          this.consumptionDaysRealIFO.mpal = this.consumptionTotalIFO.mpal * 24 / ((this.totalTimePerActivityIFO.discharge + this.totalTimePerActivityIFO.otherActivity) || 1);
          this.consumptionDaysRealIFO.aux = this.consumptionTotalIFO.aux * 24 / ((this.totalTimePerActivityIFO.discharge + this.totalTimePerActivityIFO.otherActivity) || 1);
          this.consumptionDaysRealIFO.boiler = this.consumptionTotalIFO.boiler * 24 / ((this.totalTimePerActivityIFO.discharge + this.totalTimePerActivityIFO.otherActivity) || 1);
          this.consumptionDaysRealIFO.other = this.consumptionTotalIFO.other * 24 / ((this.totalTimePerActivityIFO.discharge + this.totalTimePerActivityIFO.otherActivity) || 1);
          // Asignamos el contrato.
          this.consumptionDaysByContractIFO.mpal = this.selectUser.consumptionEquipmentME_IFO;
          this.consumptionDaysByContractIFO.aux = this.selectUser.consumptionEquipmentAE_IFO;
          this.consumptionDaysByContractIFO.boiler = this.selectUser.consumptionEquipmentBOILER_IFO;
          this.consumptionDaysByContractIFO.other = this.selectUser.consumptionEquipmentOther_IFO;
          // hacemos un balance.
          this.consumptionDailyBalanceIFO.mpal = this.consumptionDaysByContractIFO.mpal ? this.consumptionDaysRealIFO.mpal - this.consumptionDaysByContractIFO.mpal : 0;
          this.consumptionDailyBalanceIFO.aux = this.consumptionDaysByContractIFO.aux ? this.consumptionDaysRealIFO.aux - this.consumptionDaysByContractIFO.aux : 0;
          this.consumptionDailyBalanceIFO.boiler = this.consumptionDaysByContractIFO.boiler ? this.consumptionDaysRealIFO.boiler - this.consumptionDaysByContractIFO.boiler : 0;
          this.consumptionDailyBalanceIFO.other = this.consumptionDaysByContractIFO.other ? this.consumptionDaysRealIFO.other - this.consumptionDaysByContractIFO.other : 0;

          // FORMULA CONSUMO POR EQUIPO MGO
          // Consumo Diario por  maquina.
          this.consumptionDaysRealMGO.mpal = this.consumptionTotalMGO.mpal * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
          this.consumptionDaysRealMGO.aux = this.consumptionTotalMGO.aux * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
          this.consumptionDaysRealMGO.boiler = this.consumptionTotalMGO.boiler * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
          this.consumptionDaysRealMGO.pp = this.consumptionTotalMGO.pp * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
          this.consumptionDaysRealMGO.gi = this.consumptionTotalMGO.gi * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
          this.consumptionDaysRealMGO.other = this.consumptionTotalMGO.other * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
          // Asignamos el contrato.
          this.consumptionDaysByContractMGO.mpal = this.selectUser.consumptionEquipmentME_MGO;
          this.consumptionDaysByContractMGO.aux = this.selectUser.consumptionEquipmentAE_MGO;
          this.consumptionDaysByContractMGO.boiler = this.selectUser.consumptionEquipmentBOILER_MGO;
          this.consumptionDaysByContractMGO.pp = this.selectUser.consumptionEquipmentPP_MGO;
          this.consumptionDaysByContractMGO.gi = this.selectUser.consumptionEquipmentIG_MGO;
          this.consumptionDaysByContractMGO.other = this.selectUser.consumptionEquipmentOther_MGO;
          // hacemos un balance.
          this.consumptionDailyBalanceMGO.mpal = this.consumptionDaysByContractMGO.mpal ? this.consumptionDaysRealMGO.mpal - this.consumptionDaysByContractMGO.mpal : 0;
          this.consumptionDailyBalanceMGO.aux = this.consumptionDaysByContractMGO.aux ? this.consumptionDaysRealMGO.aux - this.consumptionDaysByContractMGO.aux : 0;
          this.consumptionDailyBalanceMGO.boiler = this.consumptionDaysByContractMGO.boiler ? this.consumptionDaysRealMGO.boiler - this.consumptionDaysByContractMGO.boiler : 0;
          this.consumptionDailyBalanceMGO.pp = this.consumptionDaysByContractMGO.pp ? this.consumptionDaysRealMGO.pp - this.consumptionDaysByContractMGO.pp : 0;
          this.consumptionDailyBalanceMGO.gi = this.consumptionDaysByContractMGO.gi ? this.consumptionDaysRealMGO.gi - this.consumptionDaysByContractMGO.gi : 0;
          this.consumptionDailyBalanceMGO.other = this.consumptionDaysByContractMGO.other ? this.consumptionDaysRealMGO.other - this.consumptionDaysByContractMGO.other : 0;


          // FORMULA CONSUMO POR ACTIVIDAD IFO
          // calculo de speed
          this.averageSpeedByActivityPerformedIFO.loading = this.totalDistanceMilesByActivityPerformedIFO.loading / (this.totalTimePerActivityIFO.loading || 1);
          this.averageSpeedByActivityPerformedIFO.discharge = this.totalDistanceMilesByActivityPerformedIFO.discharge / (this.totalTimePerActivityIFO.discharge || 1);
          this.averageSpeedByActivityPerformedIFO.ballast = this.totalDistanceMilesByActivityPerformedIFO.ballast / (this.totalTimePerActivityIFO.ballast || 1);
          this.averageSpeedByActivityPerformedIFO.laden = this.totalDistanceMilesByActivityPerformedIFO.laden / (this.totalTimePerActivityIFO.laden || 1);
          this.averageSpeedByActivityPerformedIFO.economical = this.totalDistanceMilesByActivityPerformedIFO.economical / (this.totalTimePerActivityIFO.economical || 1);
          this.averageSpeedByActivityPerformedIFO.anchor = this.totalDistanceMilesByActivityPerformedIFO.anchor / (this.totalTimePerActivityIFO.anchor || 1);
          this.averageSpeedByActivityPerformedIFO.maneuver = this.totalDistanceMilesByActivityPerformedIFO.maneuver / (this.totalTimePerActivityIFO.maneuver || 1);
          this.averageSpeedByActivityPerformedIFO.otherActivity = this.totalDistanceMilesByActivityPerformedIFO.otherActivity / (this.totalTimePerActivityIFO.otherActivity || 1);

          // Velocidad de contrato IFO
          this.averageSpeedCharterByActivityPerformedIFO.loading = 0;
          this.averageSpeedCharterByActivityPerformedIFO.discharge = 0;
          this.averageSpeedCharterByActivityPerformedIFO.ballast = this.selectUser.contractSpeedSailingBallastIFO;
          this.averageSpeedCharterByActivityPerformedIFO.laden = this.selectUser.contractSpeedSailingLadenIFO;
          this.averageSpeedCharterByActivityPerformedIFO.economical = this.selectUser.contractSpeedSailingEconomicalIFO;
          this.averageSpeedCharterByActivityPerformedIFO.anchor = 0;
          this.averageSpeedCharterByActivityPerformedIFO.maneuver = 0;
          this.averageSpeedCharterByActivityPerformedIFO.otherActivity = 0;

          // Calculamos el consumo diario por actividad IFO.
          this.dayliConsumptionByActivityPerformedIFO.loading = (this.voyageConsumptionByActivityPerformedIFO.loading * 24) / (this.totalTimePerActivityIFO.loading || 1);
          this.dayliConsumptionByActivityPerformedIFO.discharge = (this.voyageConsumptionByActivityPerformedIFO.discharge * 24) / (this.totalTimePerActivityIFO.discharge || 1);
          this.dayliConsumptionByActivityPerformedIFO.ballast = (this.voyageConsumptionByActivityPerformedIFO.ballast * 24) / (this.totalTimePerActivityIFO.ballast || 1);
          this.dayliConsumptionByActivityPerformedIFO.laden = (this.voyageConsumptionByActivityPerformedIFO.laden * 24) / (this.totalTimePerActivityIFO.laden || 1);
          this.dayliConsumptionByActivityPerformedIFO.economical = (this.voyageConsumptionByActivityPerformedIFO.economical * 24) / (this.totalTimePerActivityIFO.economical || 1);
          this.dayliConsumptionByActivityPerformedIFO.anchor = (this.voyageConsumptionByActivityPerformedIFO.anchor * 24) / (this.totalTimePerActivityIFO.anchor || 1);
          this.dayliConsumptionByActivityPerformedIFO.maneuver = (this.voyageConsumptionByActivityPerformedIFO.maneuver * 24) / (this.totalTimePerActivityIFO.maneuver || 1);
          this.dayliConsumptionByActivityPerformedIFO.otherActivity = (this.voyageConsumptionByActivityPerformedIFO.otherActivity * 24) / (this.totalTimePerActivityIFO.otherActivity || 1);

          // Consumo segun contrato.
          this.dayliConsumptionCharterByActivityPerformedIFO.loading = this.selectUser.loadingConsumptionIFO;
          this.dayliConsumptionCharterByActivityPerformedIFO.discharge = this.selectUser.dischargeConsumptionIFO
          this.dayliConsumptionCharterByActivityPerformedIFO.ballast = this.selectUser.sailingBallastConsumptionIFO;
          this.dayliConsumptionCharterByActivityPerformedIFO.laden = this.selectUser.sailingLoadConsumptionIFO;
          this.dayliConsumptionCharterByActivityPerformedIFO.economical = this.selectUser.sailingEconomicConsumptionIFO;
          this.dayliConsumptionCharterByActivityPerformedIFO.anchor = this.selectUser.anchoredConsumptionIFO;
          this.dayliConsumptionCharterByActivityPerformedIFO.maneuver = this.selectUser.maneuverConsumptionIFO;
          this.dayliConsumptionCharterByActivityPerformedIFO.otherActivity = this.selectUser.otherConsumptionIFO;

          // Tiempo de navegacion segun la velocidad de contrato.
          this.timePerNavigationCharterByActivityPerformedIFO.loading = this.averageSpeedCharterByActivityPerformedIFO.loading ? this.totalDistanceMilesByActivityPerformedIFO.loading / this.averageSpeedCharterByActivityPerformedIFO.loading : 0;
          this.timePerNavigationCharterByActivityPerformedIFO.discharge = this.averageSpeedCharterByActivityPerformedIFO.discharge ? this.totalDistanceMilesByActivityPerformedIFO.discharge / this.averageSpeedCharterByActivityPerformedIFO.discharge : 0;
          this.timePerNavigationCharterByActivityPerformedIFO.ballast = this.averageSpeedCharterByActivityPerformedIFO.ballast ? this.totalDistanceMilesByActivityPerformedIFO.ballast / this.averageSpeedCharterByActivityPerformedIFO.ballast : 0;
          this.timePerNavigationCharterByActivityPerformedIFO.laden = this.averageSpeedCharterByActivityPerformedIFO.laden ? this.totalDistanceMilesByActivityPerformedIFO.laden / this.averageSpeedCharterByActivityPerformedIFO.laden : 0;
          this.timePerNavigationCharterByActivityPerformedIFO.economical = this.averageSpeedCharterByActivityPerformedIFO.economical ? this.totalDistanceMilesByActivityPerformedIFO.economical / this.averageSpeedCharterByActivityPerformedIFO.economical : 0;
          this.timePerNavigationCharterByActivityPerformedIFO.anchor = this.averageSpeedCharterByActivityPerformedIFO.anchor ? this.totalDistanceMilesByActivityPerformedIFO.anchor / this.averageSpeedCharterByActivityPerformedIFO.anchor : 0;
          this.timePerNavigationCharterByActivityPerformedIFO.maneuver = this.averageSpeedCharterByActivityPerformedIFO.maneuver ? this.totalDistanceMilesByActivityPerformedIFO.maneuver / this.averageSpeedCharterByActivityPerformedIFO.maneuver : 0;
          this.timePerNavigationCharterByActivityPerformedIFO.otherActivity = this.averageSpeedCharterByActivityPerformedIFO.otherActivity ? this.totalDistanceMilesByActivityPerformedIFO.otherActivity / this.averageSpeedCharterByActivityPerformedIFO.otherActivity : 0;

          // El consumo calculado por el contrato y la distancia recorrida.
          this.voyageConsumptionCharterByActivityPerformedIFO.loading = (this.dayliConsumptionCharterByActivityPerformedIFO.loading * (this.timePerNavigationCharterByActivityPerformedIFO.loading ? this.timePerNavigationCharterByActivityPerformedIFO.loading : this.totalTimePerActivityIFO.loading)) / 24;
          this.voyageConsumptionCharterByActivityPerformedIFO.discharge = (this.dayliConsumptionCharterByActivityPerformedIFO.discharge * (this.timePerNavigationCharterByActivityPerformedIFO.discharge ? this.timePerNavigationCharterByActivityPerformedIFO.discharge : this.totalTimePerActivityIFO.discharge)) / 24;
          this.voyageConsumptionCharterByActivityPerformedIFO.ballast = (this.dayliConsumptionCharterByActivityPerformedIFO.ballast * (this.timePerNavigationCharterByActivityPerformedIFO.ballast ? this.timePerNavigationCharterByActivityPerformedIFO.ballast : this.totalTimePerActivityIFO.ballast)) / 24;
          this.voyageConsumptionCharterByActivityPerformedIFO.laden = (this.dayliConsumptionCharterByActivityPerformedIFO.laden * (this.timePerNavigationCharterByActivityPerformedIFO.laden ? this.timePerNavigationCharterByActivityPerformedIFO.laden : this.totalTimePerActivityIFO.laden)) / 24;
          this.voyageConsumptionCharterByActivityPerformedIFO.economical = (this.dayliConsumptionCharterByActivityPerformedIFO.economical * (this.timePerNavigationCharterByActivityPerformedIFO.economical ? this.timePerNavigationCharterByActivityPerformedIFO.economical : this.totalTimePerActivityIFO.economical)) / 24;
          this.voyageConsumptionCharterByActivityPerformedIFO.anchor = (this.dayliConsumptionCharterByActivityPerformedIFO.anchor * (this.timePerNavigationCharterByActivityPerformedIFO.anchor ? this.timePerNavigationCharterByActivityPerformedIFO.anchor : this.totalTimePerActivityIFO.anchor)) / 24;
          this.voyageConsumptionCharterByActivityPerformedIFO.maneuver = (this.dayliConsumptionCharterByActivityPerformedIFO.maneuver * (this.timePerNavigationCharterByActivityPerformedIFO.maneuver ? this.timePerNavigationCharterByActivityPerformedIFO.maneuver : this.totalTimePerActivityIFO.maneuver)) / 24;
          this.voyageConsumptionCharterByActivityPerformedIFO.otherActivity = (this.dayliConsumptionCharterByActivityPerformedIFO.otherActivity * (this.timePerNavigationCharterByActivityPerformedIFO.otherActivity ? this.timePerNavigationCharterByActivityPerformedIFO.otherActivity : this.totalTimePerActivityIFO.otherActivity)) / 24;

          // Hacemos un balance de consumo 
          this.balanceConsumptionByActivityPerformedIFO.loading = this.voyageConsumptionCharterByActivityPerformedIFO.loading ? this.voyageConsumptionByActivityPerformedIFO.loading - this.voyageConsumptionCharterByActivityPerformedIFO.loading : 0;
          this.balanceConsumptionByActivityPerformedIFO.discharge = this.voyageConsumptionCharterByActivityPerformedIFO.discharge ? this.voyageConsumptionByActivityPerformedIFO.discharge - this.voyageConsumptionCharterByActivityPerformedIFO.discharge : 0;
          this.balanceConsumptionByActivityPerformedIFO.ballast = this.voyageConsumptionCharterByActivityPerformedIFO.ballast ? this.voyageConsumptionByActivityPerformedIFO.ballast - this.voyageConsumptionCharterByActivityPerformedIFO.ballast : 0;
          this.balanceConsumptionByActivityPerformedIFO.laden = this.voyageConsumptionCharterByActivityPerformedIFO.laden ? this.voyageConsumptionByActivityPerformedIFO.laden - this.voyageConsumptionCharterByActivityPerformedIFO.laden : 0;
          this.balanceConsumptionByActivityPerformedIFO.economical = this.voyageConsumptionCharterByActivityPerformedIFO.economical ? this.voyageConsumptionByActivityPerformedIFO.economical - this.voyageConsumptionCharterByActivityPerformedIFO.economical : 0;
          this.balanceConsumptionByActivityPerformedIFO.anchor = this.voyageConsumptionCharterByActivityPerformedIFO.anchor ? this.voyageConsumptionByActivityPerformedIFO.anchor - this.voyageConsumptionCharterByActivityPerformedIFO.anchor : 0;
          this.balanceConsumptionByActivityPerformedIFO.maneuver = this.voyageConsumptionCharterByActivityPerformedIFO.maneuver ? this.voyageConsumptionByActivityPerformedIFO.maneuver - this.voyageConsumptionCharterByActivityPerformedIFO.maneuver : 0;
          this.balanceConsumptionByActivityPerformedIFO.otherActivity = this.voyageConsumptionCharterByActivityPerformedIFO.otherActivity ? this.voyageConsumptionByActivityPerformedIFO.otherActivity - this.voyageConsumptionCharterByActivityPerformedIFO.otherActivity : 0;

          // Balance de datos.
          this.balanceTimeByActivityPerformedIFO.loading = this.timePerNavigationCharterByActivityPerformedIFO.loading ? this.totalTimePerActivityIFO.loading - this.timePerNavigationCharterByActivityPerformedIFO.loading : 0;
          this.balanceTimeByActivityPerformedIFO.discharge = this.timePerNavigationCharterByActivityPerformedIFO.discharge ? this.totalTimePerActivityIFO.discharge - this.timePerNavigationCharterByActivityPerformedIFO.discharge : 0;
          this.balanceTimeByActivityPerformedIFO.ballast = this.timePerNavigationCharterByActivityPerformedIFO.ballast ? this.totalTimePerActivityIFO.ballast - this.timePerNavigationCharterByActivityPerformedIFO.ballast : 0;
          this.balanceTimeByActivityPerformedIFO.laden = this.timePerNavigationCharterByActivityPerformedIFO.laden ? this.totalTimePerActivityIFO.laden - this.timePerNavigationCharterByActivityPerformedIFO.laden : 0;
          this.balanceTimeByActivityPerformedIFO.economical = this.timePerNavigationCharterByActivityPerformedIFO.economical ? this.totalTimePerActivityIFO.economical - this.timePerNavigationCharterByActivityPerformedIFO.economical : 0;
          this.balanceTimeByActivityPerformedIFO.anchor = this.timePerNavigationCharterByActivityPerformedIFO.anchor ? this.totalTimePerActivityIFO.anchor - this.timePerNavigationCharterByActivityPerformedIFO.anchor : 0;
          this.balanceTimeByActivityPerformedIFO.maneuver = this.timePerNavigationCharterByActivityPerformedIFO.maneuver ? this.totalTimePerActivityIFO.maneuver - this.timePerNavigationCharterByActivityPerformedIFO.maneuver : 0;
          this.balanceTimeByActivityPerformedIFO.otherActivity = this.timePerNavigationCharterByActivityPerformedIFO.otherActivity ? this.totalTimePerActivityIFO.otherActivity - this.timePerNavigationCharterByActivityPerformedIFO.otherActivity : 0;

          // retornamos true para validar.
          return true;
        }
      ).then(
        result => {

          // FULL FORMULAS MGO

          // ActivityPerformance MGO
          // calculo de speed
          this.averageSpeedByActivityPerformedMGO.loading = this.totalDistanceMilesByActivityPerformedMGO.loading / (this.totalTimePerActivityMGO.loading || 1);
          this.averageSpeedByActivityPerformedMGO.discharge = this.totalDistanceMilesByActivityPerformedMGO.discharge / (this.totalTimePerActivityMGO.discharge || 1);
          this.averageSpeedByActivityPerformedMGO.ballast = this.totalDistanceMilesByActivityPerformedMGO.ballast / (this.totalTimePerActivityMGO.ballast || 1);
          this.averageSpeedByActivityPerformedMGO.laden = this.totalDistanceMilesByActivityPerformedMGO.laden / (this.totalTimePerActivityMGO.laden || 1);
          this.averageSpeedByActivityPerformedMGO.economical = this.totalDistanceMilesByActivityPerformedMGO.economical / (this.totalTimePerActivityMGO.economical || 1);
          this.averageSpeedByActivityPerformedMGO.anchor = this.totalDistanceMilesByActivityPerformedMGO.anchor / (this.totalTimePerActivityMGO.anchor || 1);
          this.averageSpeedByActivityPerformedMGO.maneuver = this.totalDistanceMilesByActivityPerformedMGO.maneuver / (this.totalTimePerActivityMGO.maneuver || 1);
          this.averageSpeedByActivityPerformedMGO.otherActivity = this.totalDistanceMilesByActivityPerformedMGO.otherActivity / (this.totalTimePerActivityMGO.otherActivity || 1);

          // Velocidad de contrato MGO
          this.averageSpeedCharterByActivityPerformedMGO.loading = 0;
          this.averageSpeedCharterByActivityPerformedMGO.discharge = 0;
          this.averageSpeedCharterByActivityPerformedMGO.ballast = this.selectUser.contractSpeedSailingBallastMGO;
          this.averageSpeedCharterByActivityPerformedMGO.laden = this.selectUser.contractSpeedSailingLadenMGO;
          this.averageSpeedCharterByActivityPerformedMGO.economical = this.selectUser.contractSpeedSailingEconomicalMGO;
          this.averageSpeedCharterByActivityPerformedMGO.anchor = 0;
          this.averageSpeedCharterByActivityPerformedMGO.maneuver = 0;
          this.averageSpeedCharterByActivityPerformedMGO.otherActivity = 0;

          // Calculamos el consumo diario por actividad IFO.
          this.dayliConsumptionByActivityPerformedMGO.loading = (this.voyageConsumptionByActivityPerformedMGO.loading * 24) / (this.totalTimePerActivityMGO.loading || 1);
          this.dayliConsumptionByActivityPerformedMGO.discharge = (this.voyageConsumptionByActivityPerformedMGO.discharge * 24) / (this.totalTimePerActivityMGO.discharge || 1);
          this.dayliConsumptionByActivityPerformedMGO.ballast = (this.voyageConsumptionByActivityPerformedMGO.ballast * 24) / (this.totalTimePerActivityMGO.ballast || 1);
          this.dayliConsumptionByActivityPerformedMGO.laden = (this.voyageConsumptionByActivityPerformedMGO.laden * 24) / (this.totalTimePerActivityMGO.laden || 1);
          this.dayliConsumptionByActivityPerformedMGO.economical = (this.voyageConsumptionByActivityPerformedMGO.economical * 24) / (this.totalTimePerActivityMGO.economical || 1);
          this.dayliConsumptionByActivityPerformedMGO.anchor = (this.voyageConsumptionByActivityPerformedMGO.anchor * 24) / (this.totalTimePerActivityMGO.anchor || 1);
          this.dayliConsumptionByActivityPerformedMGO.maneuver = (this.voyageConsumptionByActivityPerformedMGO.maneuver * 24) / (this.totalTimePerActivityMGO.maneuver || 1);
          this.dayliConsumptionByActivityPerformedMGO.otherActivity = (this.voyageConsumptionByActivityPerformedMGO.otherActivity * 24) / (this.totalTimePerActivityMGO.otherActivity || 1);

          // Consumo segun contrato.
          this.dayliConsumptionCharterByActivityPerformedMGO.loading = this.selectUser.loadingConsumptionMGO;
          this.dayliConsumptionCharterByActivityPerformedMGO.discharge = this.selectUser.dischargeConsumptionMGO
          this.dayliConsumptionCharterByActivityPerformedMGO.ballast = this.selectUser.sailingBallastConsumptionMGO;
          this.dayliConsumptionCharterByActivityPerformedMGO.laden = this.selectUser.sailingLoadConsumptionMGO;
          this.dayliConsumptionCharterByActivityPerformedMGO.economical = this.selectUser.sailingEconomicConsumptionMGO;
          this.dayliConsumptionCharterByActivityPerformedMGO.anchor = this.selectUser.anchoredConsumptionMGO;
          this.dayliConsumptionCharterByActivityPerformedMGO.maneuver = this.selectUser.maneuverConsumptionMGO;
          this.dayliConsumptionCharterByActivityPerformedMGO.otherActivity = this.selectUser.otherConsumptionMGO;

          // Tiempo de navegacion segun la velocidad de contrato.
          this.timePerNavigationCharterByActivityPerformedMGO.loading = this.averageSpeedCharterByActivityPerformedMGO.anchor ? this.totalDistanceMilesByActivityPerformedMGO.loading / this.averageSpeedCharterByActivityPerformedMGO.loading : 0;
          this.timePerNavigationCharterByActivityPerformedMGO.discharge = this.averageSpeedCharterByActivityPerformedMGO.discharge ? this.totalDistanceMilesByActivityPerformedMGO.discharge / this.averageSpeedCharterByActivityPerformedMGO.discharge : 0;
          this.timePerNavigationCharterByActivityPerformedMGO.ballast = this.averageSpeedCharterByActivityPerformedMGO.ballast ? this.totalDistanceMilesByActivityPerformedMGO.ballast / this.averageSpeedCharterByActivityPerformedMGO.ballast : 0;
          this.timePerNavigationCharterByActivityPerformedMGO.laden = this.averageSpeedCharterByActivityPerformedMGO.laden ? this.totalDistanceMilesByActivityPerformedMGO.laden / this.averageSpeedCharterByActivityPerformedMGO.laden : 0;
          this.timePerNavigationCharterByActivityPerformedMGO.economical = this.averageSpeedCharterByActivityPerformedMGO.economical ? this.totalDistanceMilesByActivityPerformedMGO.economical / this.averageSpeedCharterByActivityPerformedMGO.economical : 0;
          this.timePerNavigationCharterByActivityPerformedMGO.anchor = this.averageSpeedCharterByActivityPerformedMGO.anchor ? this.totalDistanceMilesByActivityPerformedMGO.anchor / this.averageSpeedCharterByActivityPerformedMGO.anchor : 0;
          this.timePerNavigationCharterByActivityPerformedMGO.maneuver = this.averageSpeedCharterByActivityPerformedMGO.maneuver ? this.totalDistanceMilesByActivityPerformedMGO.maneuver / this.averageSpeedCharterByActivityPerformedMGO.maneuver : 0;
          this.timePerNavigationCharterByActivityPerformedMGO.otherActivity = this.averageSpeedCharterByActivityPerformedMGO.otherActivity ? this.totalDistanceMilesByActivityPerformedMGO.otherActivity / this.averageSpeedCharterByActivityPerformedMGO.otherActivity : 0;

          // El consumo calculado por el contrato y la distancia recorrida.
          this.voyageConsumptionCharterByActivityPerformedMGO.loading = (this.dayliConsumptionCharterByActivityPerformedMGO.loading * (this.timePerNavigationCharterByActivityPerformedMGO.loading ? this.timePerNavigationCharterByActivityPerformedMGO.loading : this.totalTimePerActivityMGO.loading)) / 24;
          this.voyageConsumptionCharterByActivityPerformedMGO.discharge = (this.dayliConsumptionCharterByActivityPerformedMGO.discharge * (this.timePerNavigationCharterByActivityPerformedMGO.discharge ? this.timePerNavigationCharterByActivityPerformedMGO.discharge : this.totalTimePerActivityMGO.discharge)) / 24;
          this.voyageConsumptionCharterByActivityPerformedMGO.ballast = (this.dayliConsumptionCharterByActivityPerformedMGO.ballast * (this.timePerNavigationCharterByActivityPerformedMGO.ballast ? this.timePerNavigationCharterByActivityPerformedMGO.ballast : this.totalTimePerActivityMGO.ballast)) / 24;
          this.voyageConsumptionCharterByActivityPerformedMGO.laden = (this.dayliConsumptionCharterByActivityPerformedMGO.laden * (this.timePerNavigationCharterByActivityPerformedMGO.laden ? this.timePerNavigationCharterByActivityPerformedMGO.laden : this.totalTimePerActivityMGO.laden)) / 24;
          this.voyageConsumptionCharterByActivityPerformedMGO.economical = (this.dayliConsumptionCharterByActivityPerformedMGO.economical * (this.timePerNavigationCharterByActivityPerformedMGO.economical ? this.timePerNavigationCharterByActivityPerformedMGO.economical : this.totalTimePerActivityMGO.economical)) / 24;
          this.voyageConsumptionCharterByActivityPerformedMGO.anchor = (this.dayliConsumptionCharterByActivityPerformedMGO.anchor * (this.timePerNavigationCharterByActivityPerformedMGO.anchor ? this.timePerNavigationCharterByActivityPerformedMGO.anchor : this.totalTimePerActivityMGO.anchor)) / 24;
          this.voyageConsumptionCharterByActivityPerformedMGO.maneuver = (this.dayliConsumptionCharterByActivityPerformedMGO.maneuver * (this.timePerNavigationCharterByActivityPerformedMGO.maneuver ? this.timePerNavigationCharterByActivityPerformedMGO.maneuver : this.totalTimePerActivityMGO.maneuver)) / 24;
          this.voyageConsumptionCharterByActivityPerformedMGO.otherActivity = (this.dayliConsumptionCharterByActivityPerformedMGO.otherActivity * (this.timePerNavigationCharterByActivityPerformedMGO.otherActivity ? this.timePerNavigationCharterByActivityPerformedMGO.otherActivity : this.totalTimePerActivityMGO.otherActivity)) / 24;

          // Hacemos un balance de consumo 
          this.balanceConsumptionByActivityPerformedMGO.loading = this.voyageConsumptionCharterByActivityPerformedMGO.loading ? this.voyageConsumptionByActivityPerformedMGO.loading - this.voyageConsumptionCharterByActivityPerformedMGO.loading : 0;
          this.balanceConsumptionByActivityPerformedMGO.discharge = this.voyageConsumptionCharterByActivityPerformedMGO.discharge ? this.voyageConsumptionByActivityPerformedMGO.discharge - this.voyageConsumptionCharterByActivityPerformedMGO.discharge : 0;
          this.balanceConsumptionByActivityPerformedMGO.ballast = this.voyageConsumptionCharterByActivityPerformedMGO.ballast ? this.voyageConsumptionByActivityPerformedMGO.ballast - this.voyageConsumptionCharterByActivityPerformedMGO.ballast : 0;
          this.balanceConsumptionByActivityPerformedMGO.laden = this.voyageConsumptionCharterByActivityPerformedMGO.laden ? this.voyageConsumptionByActivityPerformedMGO.laden - this.voyageConsumptionCharterByActivityPerformedMGO.laden : 0;
          this.balanceConsumptionByActivityPerformedMGO.economical = this.voyageConsumptionCharterByActivityPerformedMGO.economical ? this.voyageConsumptionByActivityPerformedMGO.economical - this.voyageConsumptionCharterByActivityPerformedMGO.economical : 0;
          this.balanceConsumptionByActivityPerformedMGO.anchor = this.voyageConsumptionCharterByActivityPerformedMGO.anchor ? this.voyageConsumptionByActivityPerformedMGO.anchor - this.voyageConsumptionCharterByActivityPerformedMGO.anchor : 0;
          this.balanceConsumptionByActivityPerformedMGO.maneuver = this.voyageConsumptionCharterByActivityPerformedMGO.maneuver ? this.voyageConsumptionByActivityPerformedMGO.maneuver - this.voyageConsumptionCharterByActivityPerformedMGO.maneuver : 0;
          this.balanceConsumptionByActivityPerformedMGO.otherActivity = this.voyageConsumptionCharterByActivityPerformedMGO.otherActivity ? this.voyageConsumptionByActivityPerformedMGO.otherActivity - this.voyageConsumptionCharterByActivityPerformedMGO.otherActivity : 0;

          // Balance de datos.
          this.balanceTimeByActivityPerformedMGO.loading = this.timePerNavigationCharterByActivityPerformedMGO.loading ? this.totalTimePerActivityMGO.loading - this.timePerNavigationCharterByActivityPerformedMGO.loading : 0;
          this.balanceTimeByActivityPerformedMGO.discharge = this.timePerNavigationCharterByActivityPerformedMGO.discharge ? this.totalTimePerActivityMGO.discharge - this.timePerNavigationCharterByActivityPerformedMGO.discharge : 0;
          this.balanceTimeByActivityPerformedMGO.ballast = this.timePerNavigationCharterByActivityPerformedMGO.ballast ? this.totalTimePerActivityMGO.ballast - this.timePerNavigationCharterByActivityPerformedMGO.ballast : 0;
          this.balanceTimeByActivityPerformedMGO.laden = this.timePerNavigationCharterByActivityPerformedMGO.laden ? this.totalTimePerActivityMGO.laden - this.timePerNavigationCharterByActivityPerformedMGO.laden : 0;
          this.balanceTimeByActivityPerformedMGO.economical = this.timePerNavigationCharterByActivityPerformedMGO.economical ? this.totalTimePerActivityMGO.economical - this.timePerNavigationCharterByActivityPerformedMGO.economical : 0;
          this.balanceTimeByActivityPerformedMGO.anchor = this.timePerNavigationCharterByActivityPerformedMGO.anchor ? this.totalTimePerActivityMGO.anchor - this.timePerNavigationCharterByActivityPerformedMGO.anchor : 0;
          this.balanceTimeByActivityPerformedMGO.maneuver = this.timePerNavigationCharterByActivityPerformedMGO.maneuver ? this.totalTimePerActivityMGO.maneuver - this.timePerNavigationCharterByActivityPerformedMGO.maneuver : 0;
          this.balanceTimeByActivityPerformedMGO.otherActivity = this.timePerNavigationCharterByActivityPerformedMGO.otherActivity ? this.totalTimePerActivityMGO.otherActivity - this.timePerNavigationCharterByActivityPerformedMGO.otherActivity : 0;

          console.log(' FIN GenerateDataByFilter()');
          return true;
        }
      );



  }

  // Configuracaion Axes si son menos de 60 registro que muestre los dias caso contrario que muestre los meses
  // esta configuracion depente del selectSummary
  private ConfigScales(dataReport: Date[], isSpeed?: boolean, lineaMax?: number) {

    // Variable que retornara la configuracion
    let config: any = {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontColor: '#b8d1ff',
          max: lineaMax,
        },
        gridLines: {
          display: true,
          color: '#b8d1ff'
        },
      }],
      xAxes: [{
        type: '',// ES SE MODIFICA ABAJO // 'category' or 'time'
        //  time: {} // Se modificara abajo.
        ticks: {
          beginAtZero: true,
          fontColor: '#b8d1ff',
        },
        position: 'bottom', // NO QUE HACE ESTO
        gridLines: {
          display: true,
          color: '#b8d1ff'
        },
      }]
    };


    if (this.selectSummaryBy === 'VOYAGES' || this.selectSummaryBy === 'PORT') {

      config.xAxes[0].type = 'category';

    } else if (this.selectSummaryBy === 'MONTHS') {

      config.xAxes[0].type = 'time';
      config.xAxes[0].time = {

        displayFormats: {
          day: 'MM/YY'
        },
        tooltipFormat: 'MM/DD/YY',
        unit: 'month',

      }

    } else if (this.selectSummaryBy === 'DAYS') {

      config.xAxes[0].type = 'time';
      config.xAxes[0].time = {

        displayFormats: {
          day: 'MM/DD'
        },
        tooltipFormat: 'MM/DD/YY',
        unit: 'day',

      }

    }

    return config;
  }

  // Genera los datos del Dashboard por Summary
  private async GenerateDashboardBySumary(setDate: boolean): Promise<boolean> {
    console.log('GenerateDashboardBySumary()');
    
    // retornamoremos el resultado de la promesa.
    return await Promise.resolve(true).then(
      result => {

        this.GenerateDataForChart(setDate);

        // return true.
        return true;
      }
    ).then(
      result => {
        // Validamos el resultado.
        if (!result) throw 'NOT_OK';

        // UPDATE CHART.
        this.UpdateLineIFO();
        this.UpdateLineMGO();
        this.UpdateLineSPEED();

        // Console logear.
        console.log('GenerateDashboardBySumary() FIN');
        return true;
      }
    )
  }

  // GenerateDataForChart(): genera data para los chart.
  // Dependiendo del tipo de resumen, puede ser viaje, puertos, meses, dias
  private GenerateDataForChart(setDate: boolean) {
    // Texto x de los reportes.
    this.xLabelReport = [];

    // Data de los chart.
    this.dataIFO = [];
    // Configuracion de la linea maxima.
    this.configLineaIFO.lineaMax = 0;

    // Data de los chart.
    this.dataMGO = [];
    // Configuracion de la linea maxima.
    this.configLineaMGO.lineaMax = 0;

    // Data de los chart.
    this.dataSPEED = [];
    // Configuracion de la linea maxima.
    this.configLineaSPEED.lineaMax = 0;

    // Fecha inicio y fin de la data.
    let startDate;
    let endDate;


    // Creamos esta variable para que nos avise cuando hay un nuevo registro
    // esta variable solo se usa en los filtro Sumary por mes y dia.
    let isAddNewVoyage: boolean = false;

    // Generar Viajes.
    this.generateVoyages.forEach(
      (voyage, iV) => {

        // Generamos el texto para los labels del Chart
        let txtLabelChart: string = '';

        // Verificamos si el sumary es por años
        if (this.selectSummaryBy === 'VOYAGES') {

          // Armamos el texto de label para viajes.
          txtLabelChart = 'V' + voyage.voyageNumber + ' Y' + ('' + voyage.year).slice(-2);

          // Lo agregamos al arreglo.
          this.xLabelReport.push(txtLabelChart);

          // El total de consumo debe de ser mayor para poder pintarlo.
          if (voyage.totalIFO > 0) {

            // Formular para el consumo diario.
            let consumptionDailyIFO = voyage.totalSpeed.steamingTime ? (voyage.totalIFO * 24) / voyage.totalSpeed.steamingTime : 0;

            // Se lo agregaoms a la data IFO
            this.dataIFO.push(
              { x: txtLabelChart, y: consumptionDailyIFO, ubication: [iV] }
            );
            // Verificamos si la linea maxima es menor para actualizarlo.
            if (consumptionDailyIFO > this.configLineaIFO.lineaMax) {
              this.configLineaIFO.lineaMax = consumptionDailyIFO;
            }
          }

          // El total de consumo debe de ser mayor para poder pintarlo.
          if (voyage.totalMGO > 0) {

            // Formular para el consumo diario.
            let consumptionDailyMGO = voyage.totalSpeed.steamingTime ? (voyage.totalMGO * 24) / voyage.totalSpeed.steamingTime : 0;

            // Se lo agregaoms a la data MGO
            this.dataMGO.push(
              { x: txtLabelChart, y: consumptionDailyMGO, ubication: [iV] }
            );

            // Verificamos si la linea maxima es menor para actualizarlo.
            if (consumptionDailyMGO > this.configLineaMGO.lineaMax) {
              this.configLineaMGO.lineaMax = consumptionDailyMGO;
            }
          }

          // El total de velocidad debe de ser mayor para poder pintarlo.
          let speed = mathRound(voyage.totalSpeed.distance / (voyage.totalSpeed.steamingTime || 1), 2);
          // Solo si el valor de velocidad es mayor a cero lo pintaremos en el dashboard.
          if (speed > 0) {
            this.dataSPEED.push(
              { x: txtLabelChart, y: speed, ubication: [iV] }
            );
          }
          if (speed > this.configLineaSPEED.lineaMax) {
            this.configLineaSPEED.lineaMax = speed;
          }

          // deseamos setear la fecha de inicio y fin?
          if (setDate) {
            // Comparamos si la data actual es la de inicio o fin.
            startDate = ComparePreviousDates(startDate, voyage.dayStart)
            endDate = CompareAfterDates(endDate, voyage.dayEnd)
          }
        }
        // Verificamos si el sumary es por Puerto Mes o dias
        else if (this.selectSummaryBy === 'PORTS' || this.selectSummaryBy === 'MONTHS' || this.selectSummaryBy === 'DAYS') {

          // Activamos, para saber que es nuevo viaje.
          isAddNewVoyage = true;

          // Creamos esta variable para que nos avise cuando hay un nuevo registro
          let isAddNewPort: boolean = false;

          // Recorremos los puertos.
          voyage.ports.forEach(
            (port, iP) => {

              if (this.selectSummaryBy === 'PORTS') {

                // Armamos el texto de label para lista de puertos.
                txtLabelChart = 'V' + voyage.voyageNumber + ' ' + 'P' + port.portNumber + ' Y' + ('' + voyage.year).slice(-2);

                // Lo agregamos al arreglo.
                this.xLabelReport.push(txtLabelChart);

                // El total de consumo debe de ser mayor para poder pintarlo.
                if (port.robIfo > 0) {

                  // Formular para el consumo diario.
                  let consumptionDailyIFO = port.speed.steamingTime ? (port.robIfo * 24) / port.speed.steamingTime : 0;

                  // Informacion para la dataIFO
                  this.dataIFO.push(
                    { x: txtLabelChart, y: consumptionDailyIFO, ubication: [iV, iP] }
                  );

                  // Verificamos si la linea maxima es menor para actualizarlo.
                  if (consumptionDailyIFO > this.configLineaIFO.lineaMax) {
                    this.configLineaIFO.lineaMax = consumptionDailyIFO;
                  }

                }
                // El total de consumo debe de ser mayor para poder pintarlo.
                if (port.robMgo > 0) {

                  // Formular para el consumo diario.
                  let consumptionDailyMGO = port.speed.steamingTime ? (port.robMgo * 24) / port.speed.steamingTime : 0;

                  // Informacion para la dataIFO
                  this.dataMGO.push(
                    { x: txtLabelChart, y: consumptionDailyMGO, ubication: [iV, iP] }
                  );

                  // Verificamos si la linea maxima es menor para actualizarlo.
                  if (consumptionDailyMGO > this.configLineaMGO.lineaMax) {
                    this.configLineaMGO.lineaMax = consumptionDailyMGO;
                  }
                }

                // El total de velocidad debe de ser mayor para poder pintarlo.
                let speed = mathRound(port.speed.distance / (port.speed.steamingTime || 1), 2);
                if (speed > 0) {
                  this.dataSPEED.push(
                    { x: txtLabelChart, y: speed, ubication: [iV, iP] }
                  );
                }

                if (speed > this.configLineaSPEED.lineaMax) {
                  this.configLineaSPEED.lineaMax = speed;
                }

                // deseamos setear la fecha de inicio y fin?
                if (setDate) {
                  // Comparamos si la data actual es la de inicio o fin.
                  startDate = ComparePreviousDates(startDate, port.dayStart)
                  endDate = CompareAfterDates(endDate, port.dayEnd)
                }
              } else if (this.selectSummaryBy === 'MONTHS' || this.selectSummaryBy === 'DAYS') {

                // Activamos, para saber que es nuevo puerto.
                isAddNewPort = true;
                // Recorremos todos los reportes
                port.dailyReports.forEach(
                  (report, iR) => {

                    // obtenemos la fecha del reporte.
                    let day = report.date;

                    // Si el resumen del filtro es por mes.
                    if (this.selectSummaryBy === 'MONTHS') {

                      // Buscamos si el mes ya se encuantra registrado.
                      let resultSearch = this.xLabelReport.find(
                        (xDay, iL) => {

                          // Verificamos el mes ya se encuentra registrado.
                          if (GetMonthYearFromDate(day) === GetMonthYearFromDate(xDay)) {

                            // Obtenemos los datos de velocidad.
                            let speedI: Speed = this.dataSPEED[iL].speed;

                            // Agregamos la distancia y velocidad.
                            speedI.add(report.distance, report.steamingTime);
                            // calculamos la velocidad.
                            let ySpeed = mathRound(speedI.distance / speedI.steamingTime, 2);
                            // Actualizamos el calculo de la velocidad.
                            this.dataSPEED[iL].y = ySpeed;

                            // ACTUALIZMAOS EL VALOR POR POSICION.
                            // Actualizamos los datos de la velocidad
                            this.dataSPEED[iL].speed = speedI;
                            this.dataIFO[iL].speed = speedI;
                            this.dataMGO[iL].speed = speedI;

                            // Es para agregar un nuevo viaje?
                            if (isAddNewVoyage) {
                              // Lo desactivamos para que vuelva a entrar.
                              isAddNewVoyage = false;
                              this.dataIFO[iL].totalVoyage = this.dataIFO[iL].totalVoyage + 1;
                              this.dataMGO[iL].totalVoyage = this.dataMGO[iL].totalVoyage + 1;
                              this.dataSPEED[iL].totalVoyage = this.dataSPEED[iL].totalVoyage + 1;
                            }
                            // Es para agregar un nuevo puerto
                            if (isAddNewPort) {
                              // Lo desactivamos para que vuelva a entrar.
                              isAddNewPort = false;
                              this.dataIFO[iL].totalPort = this.dataIFO[iL].totalPort + 1;
                              this.dataMGO[iL].totalPort = this.dataMGO[iL].totalPort + 1;
                              this.dataSPEED[iL].totalPort = this.dataSPEED[iL].totalPort + 1;
                            }

                            // Le sumamos el total de reporte
                            this.dataIFO[iL].totalReport = this.dataIFO[iL].totalReport + 1;
                            this.dataMGO[iL].totalReport = this.dataMGO[iL].totalReport + 1;
                            this.dataSPEED[iL].totalReport = this.dataSPEED[iL].totalReport + 1;


                            // IFO
                            let totalConsumptionIFO = this.dataIFO[iL].totalConsumptionIFO + this.SumaIfo(report);
                            // Formula DayliConsumption
                            let dayliConsumptionIFO = speedI.steamingTime ? (totalConsumptionIFO * 24) / speedI.steamingTime : 0;
                            // Actualizamos los datos al dataIfo Chart.
                            this.dataIFO[iL].totalConsumptionIFO = totalConsumptionIFO;
                            this.dataIFO[iL].y = dayliConsumptionIFO;

                            // MGO
                            let totalConsumptionMGO = this.dataIFO[iL].totalConsumptionMGO + this.SumaMgo(report);
                            // Formula DayliConsumption
                            let dayliConsumptionMGO = speedI.steamingTime ? (totalConsumptionMGO * 24) / speedI.steamingTime : 0;
                            // Actualizamos los datos al dataMGO Chart.
                            this.dataMGO[iL].totalConsumptionMGO = totalConsumptionMGO;
                            this.dataMGO[iL].y = dayliConsumptionMGO;


                            // Verificamos que la linea maxima sea mayor al valor del chart-
                            if (dayliConsumptionIFO > this.configLineaIFO.lineaMax) {
                              this.configLineaIFO.lineaMax = dayliConsumptionIFO;
                            }
                            if (dayliConsumptionMGO > this.configLineaMGO.lineaMax) {
                              this.configLineaMGO.lineaMax = dayliConsumptionMGO;
                            }
                            if (ySpeed > this.configLineaSPEED.lineaMax) {
                              this.configLineaSPEED.lineaMax = ySpeed;
                            }

                            // retornamos tru para agregarlo al filtro
                            return true;
                          }
                          // Caso contrario retornamos false, para que no lo agrege al filtro.
                          return false;
                        }

                      );

                      // Verificamos si se encontro un resultado ese mes.
                      if (!resultSearch) {

                        // todos los meses almenos tendran un viaje
                        // asi que si o si lo agregams.
                        isAddNewVoyage = false;
                        isAddNewPort = false;

                        // agregamos la fecha a nuestro arreglo.
                        this.xLabelReport.push(day);

                        // Le agregamos los datos de velocidad.
                        let newSpeed = new Speed(report.distance, report.steamingTime);
                        // Agregamos los datos de velocidad.
                        let ySpeed = mathRound(newSpeed.distance / newSpeed.steamingTime, 2);
                        this.dataSPEED.push(
                          { x: day, y: ySpeed, speed: newSpeed, ubication: [iV, iP, iR] }
                        );

                        // DATOS IFO
                        // Calculamos el total de consumo ifo
                        let totalConsumptionIFO = this.SumaIfo(report);
                        // Formula DayliConsumption
                        let dayliConsumptionIFO = newSpeed.steamingTime ? (totalConsumptionIFO * 24) / newSpeed.steamingTime : 0;
                        // Agregamos los datos IFO
                        this.dataIFO.push(
                          { x: day, y: dayliConsumptionIFO, totalConsumptionIFO: totalConsumptionIFO, totalVoyage: 1, totalPort: 1, totalReport: 1, speed: newSpeed, ubication: [iV, iP, iR] }
                        );

                        // DATOS MGO
                        // Calculamos el total de consumo ifo
                        let totalConsumptionMGO = this.SumaMgo(report);
                        // Formula DayliConsumption
                        let dayliConsumptionMGO = newSpeed.steamingTime ? (totalConsumptionMGO * 24) / newSpeed.steamingTime : 0;
                        // Agregamos los datos MGO
                        this.dataMGO.push(
                          { x: day, y: dayliConsumptionMGO, totalConsumptionMGO: totalConsumptionMGO, totalVoyage: 1, totalPort: 1, totalReport: 1, speed: newSpeed, ubication: [iV, iP, iR] }
                        );



                        // Verificamos que la ocnfiguracion de la linea maxima se  mayor al valor del chart.
                        if (dayliConsumptionIFO > this.configLineaIFO.lineaMax) {
                          this.configLineaIFO.lineaMax = dayliConsumptionIFO;
                        }
                        if (dayliConsumptionMGO > this.configLineaMGO.lineaMax) {
                          this.configLineaMGO.lineaMax = dayliConsumptionMGO;
                        }
                        if (ySpeed > this.configLineaSPEED.lineaMax) {
                          this.configLineaSPEED.lineaMax = ySpeed;
                        }

                      }
                    }
                    // Si el resumen del filtro es por dias.
                    else if (this.selectSummaryBy === 'DAYS') {

                      // Buscamos si el dia ya se encuantra registrado.
                      let resultSearch = this.xLabelReport.find(
                        (xDay, iL) => {

                          // Verificamos si el dia ya se encuentra registrado.
                          if (FormatDate(day) === FormatDate(xDay)) {

                            // Obtenemos los datos de velocidad.
                            let speedI: Speed = this.dataSPEED[iL].speed;

                            // Agregamos la distancia y velocidad.
                            speedI.add(report.distance, report.steamingTime);
                            // Actualizamos el vlaor por la posicion.
                            let ySpeed = mathRound(speedI.distance / speedI.steamingTime, 2)
                            this.dataSPEED[iL].y = ySpeed;

                            // ACTUALIZMAOS EL VALOR POR POSICION
                            // Actualizamos los datos de la velocidad
                            this.dataSPEED[iL].speed = speedI;
                            this.dataIFO[iL].speed = speedI;
                            this.dataMGO[iL].speed = speedI;


                            // consultamos
                            // Es para agregar un nuevo viaje?
                            if (isAddNewVoyage) {
                              // Lo desactivamos para que vuelva a entrar.
                              isAddNewVoyage = false;
                              this.dataIFO[iL].totalVoyage = this.dataIFO[iL].totalVoyage + 1;
                              this.dataMGO[iL].totalVoyage = this.dataMGO[iL].totalVoyage + 1;
                              this.dataSPEED[iL].totalVoyage = this.dataSPEED[iL].totalVoyage + 1;
                            }
                            // Es para agregar un nuevo puerto
                            if (isAddNewPort) {
                              // Lo desactivamos para que vuelva a entrar.
                              isAddNewPort = false;
                              this.dataIFO[iL].totalPort = this.dataIFO[iL].totalPort + 1;
                              this.dataMGO[iL].totalPort = this.dataMGO[iL].totalPort + 1;
                              this.dataSPEED[iL].totalPort = this.dataSPEED[iL].totalPort + 1;
                            }

                            // Le sumamos el total de reporte
                            this.dataIFO[iL].totalReport = this.dataIFO[iL].totalReport + 1;
                            this.dataMGO[iL].totalReport = this.dataMGO[iL].totalReport + 1;
                            this.dataSPEED[iL].totalReport = this.dataSPEED[iL].totalReport + 1;


                            // IFO
                            let totalConsumptionIFO = this.dataIFO[iL].totalConsumptionIFO + this.SumaIfo(report);
                            // Formula DayliConsumption
                            let dayliConsumptionIFO = speedI.steamingTime ? (totalConsumptionIFO * 24) / speedI.steamingTime : 0;
                            // Actualizamos los datos al dataIfo Chart.
                            this.dataIFO[iL].totalConsumptionIFO = totalConsumptionIFO;
                            this.dataIFO[iL].y = dayliConsumptionIFO;

                            // MGO
                            let totalConsumptionMGO = this.dataMGO[iL].totalConsumptionMGO + this.SumaMgo(report);
                            // Formula DayliConsumption
                            let dayliConsumptionMGO = speedI.steamingTime ? (totalConsumptionMGO * 24) / speedI.steamingTime : 0;
                            // Actualizamos los datos al dataMGO Chart.
                            this.dataMGO[iL].totalConsumptionMGO = totalConsumptionMGO;
                            this.dataMGO[iL].y = dayliConsumptionMGO;


                            // REVISAR ESTO ; DATA EXTRA CREO QUE DEBERIA MOS ELIMINARLO.
                            // Creamos la data extra.
                            // La data extra es la misma para los 3 chart.
                            let dataExtra = this.dataIFO[iL].dataExtra;
                            // le hacemos push a la data extra.
                            dataExtra.push(report);
                            // Agregamos la data extra a la data del chart.
                            this.dataIFO[iL].dataExtra = dataExtra;
                            this.dataMGO[iL].dataExtra = dataExtra;
                            this.dataSPEED[iL].dataExtra = dataExtra;


                            // Verificamos que la linea maxima sea mayor al valor del chart-
                            if (dayliConsumptionIFO > this.configLineaIFO.lineaMax) {
                              this.configLineaIFO.lineaMax = dayliConsumptionIFO;
                            }
                            if (dayliConsumptionMGO > this.configLineaMGO.lineaMax) {
                              this.configLineaMGO.lineaMax = dayliConsumptionMGO;
                            }
                            if (ySpeed > this.configLineaSPEED.lineaMax) {
                              this.configLineaSPEED.lineaMax = ySpeed;
                            }


                            // retornamos tru para agregarlo al filtro
                            return true;
                          }
                          // Caso contrario retornamos false, para que no lo agrege al filtro.
                          return false;
                        }
                      );

                      // Verificamos si se encontro un resultado ese mes.
                      if (!resultSearch) {

                        // todos los meses almenos tenfras un viaje
                        // asi que si o si lo agregams.
                        isAddNewVoyage = false;
                        isAddNewPort = false;

                        // agregamos la fecha a nuestro arreglo.
                        this.xLabelReport.push(day);

                        let dataExtra = []; // Revisar esto deberiamos tener una propiedad con las actividades registradas.
                        // y los ocmentarios registrados.
                        dataExtra.push(report)

                        // Le agregamos los datos de velocidad.
                        let newSpeed = new Speed(report.distance, report.steamingTime);
                        // Agregamos los datos de velocidad.
                        let ySpeed = mathRound(newSpeed.distance / newSpeed.steamingTime, 2);
                        this.dataSPEED.push(
                          { x: day, y: ySpeed, totalVoyage: 1, totalPort: 1, totalReport: 1, speed: newSpeed, ubication: [iV, iP, iR], dataExtra: dataExtra, identified: [voyage.id, port.id, report.id] }
                        );

                        // DATOS IFO
                        // Calculamos el total de consumo ifo
                        let totalConsumptionIFO = this.SumaIfo(report);
                        // Formula DayliConsumption
                        let dayliConsumptionIFO = newSpeed.steamingTime ? (totalConsumptionIFO * 24) / newSpeed.steamingTime : 0;
                        // Agregamos los datos IFO
                        this.dataIFO.push(
                          { x: day, y: dayliConsumptionIFO, totalConsumptionIFO: totalConsumptionIFO, totalVoyage: 1, totalPort: 1, totalReport: 1, speed: newSpeed, ubication: [iV, iP, iR], dataExtra: dataExtra, identified: [voyage.id, port.id, report.id] }
                        );


                        // DATOS MGO
                        // Calculamos el total de consumo ifo
                        let totalConsumptionMGO = this.SumaMgo(report);
                        // Formula DayliConsumption
                        let dayliConsumptionMGO = newSpeed.steamingTime ? (totalConsumptionMGO * 24) / newSpeed.steamingTime : 0;
                        // Agregamos los datos MGO
                        this.dataMGO.push(
                          { x: day, y: dayliConsumptionMGO, totalConsumptionMGO: totalConsumptionMGO, totalVoyage: 1, totalPort: 1, totalReport: 1, speed: newSpeed, ubication: [iV, iP, iR], dataExtra: dataExtra, identified: [voyage.id, port.id, report.id] }
                        );


                        // Verificamos que la configuracion de la linea maxima se  mayor al valor del chart.
                        if (dayliConsumptionIFO > this.configLineaIFO.lineaMax) {
                          this.configLineaIFO.lineaMax = dayliConsumptionIFO;
                        }
                        if (dayliConsumptionMGO > this.configLineaMGO.lineaMax) {
                          this.configLineaMGO.lineaMax = dayliConsumptionMGO;
                        }
                        if (ySpeed > this.configLineaSPEED.lineaMax) {
                          this.configLineaSPEED.lineaMax = ySpeed;
                        }

                      }

                    }

                  }
                );

              }

            })

        }

      }
    );


    // Si la configuracion es para setar fecha lo seteamos.
    if (setDate) {
      this.startDate = startDate;
      this.endDate = endDate;
    }

  }


  // GenetareLineIFO(): Generar linea en los canvas.
  private GenetareLineIFO(): boolean {
    console.log('GenetareLineIFO()');

    // Agregamos la configuracion del chartIFO.
    this.configLineaIFO = {
      type: 'line',
      data: {
        labels: [], // Lo pongo vacio por que en el update se colocara el valor.
        datasets: [{
          label: '', // Lo pongo vacio por que en el update se colocara el valor.
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: [], // Lo pongo vacio por que en el update se colocara el valor.
          fill: false,
        }]
      },
      options: { // Otras opciones dentro del Chart
        onClick: (event, activeElement) => { // REVISAR ESTO, Aqui se ejecuta la data que se muestra al dar click a los puntos dentro del chart.
          // Verifico que al click que le demos exista un Item.
          if (activeElement && activeElement.length) {

            // Obtenemos la posicion 0 del activeElement
            let actEle: any = activeElement[0];

            // Obtenemos la ubicacion.
            let index = actEle._index;

            // Filtro por tipo de resument.
            if (this.selectSummaryBy === 'VOYAGES') {

              // obtenemos la ubicacion que estaba en el dashboard.
              let ubication = this.dataIFO[index].ubication;

              // Seleccionamos el viaje,
              let voyage = this.generateVoyages[ubication[0]]

              // obtenemos el id del viaje seleccionado.
              this.selectVoyageId = voyage.id;

              // Creamos un nuevo  viaje.
              let newVoyage = [];
              newVoyage.push(voyage);

              // Asignamos el nuevo viaje.
              this.generateVoyages = newVoyage;
              // seleccionamos el filtro por puertos.
              this.selectSummaryBy = 'PORTS';

              // Generamos la data segun el filtro.
              this.GenerateDataByFilter(newVoyage);

              // Generamos el dashboard segun el tipo de resument.
              // Ademas le decimos que es para setear la fecha.
              this.GenerateDashboardBySumary(true);

            } else if (this.selectSummaryBy === 'PORTS') {

              // Encapsulamos las ubicaciones.
              let ubication = this.dataIFO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]
              let port = this.generateVoyages[ubication[0]].ports[ubication[1]]

              // Creamos un nuevo viaje.
              let newVoyage = [voyage];
              // Le asignamos el puerto.  
              newVoyage[0].ports = [port];

              // Generamos un nuevo viaje.
              this.generateVoyages = newVoyage;
              // cambiamos el tipo de filtro por dia.
              this.selectSummaryBy = 'DAYS';


              // Generamos la data segun el filtro.
              this.GenerateDataByFilter(newVoyage);
              // Generamos el dashboard segun el tipo de resument.
              // Ademas le decimos que es para setear la fecha.
              this.GenerateDashboardBySumary(true);
            } else if (this.selectSummaryBy === 'MONTHS') {

              // Encapsulamos las ubicaciones.
              let ubication = this.dataIFO[index].x;

              // retorna el primero y ultimo dia del mes de la fecha enviada.
              let result = FisrtOldDayFromDate(ubication);
              // Seteamos el inicio y fin de la fecha.
              this.startDate = new Date(result.start);
              this.endDate = new Date(result.end);

              // Tipo de resumen por dia.
              this.selectSummaryBy = 'DAYS';
              // Generar reporte por fecha.
              this.GenerateReporteByDate();

            } else if (this.selectSummaryBy === 'DAYS') {

              // Obtenemos los id de los datos.
              let identified = this.dataMGO[index].identified;

              // Buscamos el viaje id
              let voyage = this.getVoyages.find(voyage => voyage.id === identified[0]);

              // Encapsulamos los id de puerto.
              let portId = identified[1];
              // Encapsulamos los id de report.
              let reportId = identified[2];

              // Abrimos el ReportDialog.
              this.OpenDialogReport(voyage, portId, reportId, 'IFO');
            }
          }

        },
        legend: { // La leyenda es el texto que esta arriva del cuadro.
          display: true,
          onClick: (event, legendItem) => {
            console.log('onClick:' + legendItem.text);
          },
          labels: {
            fontColor: 'rgb(255,255,255)', // Color de la leyenda.
            fontStyle: 'bold', // Tipo de texto de la leyenda.
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {}, // Lo pongo vacio por que en// Lo pongo vacio por que en el update se colocara el valor.
        scales: {},// Lo pongo vacio por que en el update se colocara el valor.
        hover: {
          onHover: function (e: MouseEvent) {
            // puntos GetElementAtaEvent
            var point = this.getElementAtEvent(e);

            // event targer.
            let eventTarget = e.target as HTMLCanvasElement;
            ///home/kali/.vscode/extensions/ms-vscode.vscode-typescript-next-4.3.20210505/node_modules/typescript/lib/lib.dom.d.ts
            if (point.length) {
              eventTarget.style.cursor = 'pointer';// Aqui se esta modificando el TypeScript.
            } else {
              eventTarget.style.cursor = 'default';
            }
          }
        }
      },
      lineaMax: 0 // Lo pongo cero por que en el update se colocara el valor.
    };

    // Encapculamos el elemento del dom.
    let canvaLineIFO: any = document.getElementById('lineIFO');
    // Convertimos el canvaLineIfo en 2d
    let ctxLineIFO = canvaLineIFO.getContext('2d');

    this.chartLineIFO = new Chart(ctxLineIFO, this.configLineaIFO);

    return false;
  }

  // GenetareLineMGO(): Generar linea en los canvas.
  private GenetareLineMGO(): boolean {
    console.log('GenetareLineMGO()');


    // Agregamos la configuracion del chartMGO
    this.configLineaMGO = {
      type: 'line',
      data: {
        labels: [], // Lo pongo vacio por que en el update se colocara el valor.
        datasets: [{
          label: this.languageService.GetMessage(this.translateCategory, 'TITLE_COMSUMPTION_MGO'), // aqui esto no se actualizara en el updateLineaChart
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: [], // Lo pongo vacio por que en el update se colocara el valor.
          fill: false,
        }]
      },
      options: { // Otras opciones dentro del Chart
        onClick: (event, activeElement) => { // REVISAR ESTO, Aqui se ejecuta la data que se muestra al dar click a los puntos dentro del chart.
          // Verifico que al click que le demos exista un Item.
          if (activeElement && activeElement.length) {

            // Obtenemos la posicion 0 del activeElement
            let actEle: any = activeElement[0];

            // Obtenemos la ubicacion.
            let index = actEle._index;

            // Filtro por tipo de resument.
            if (this.selectSummaryBy === 'VOYAGES') {

              // Obtenemos la ubicacion que tenia ese registro en el dashboard.
              let ubication = this.dataMGO[index].ubication;
              // Seleccionamos el viaje,
              let voyage = this.generateVoyages[ubication[0]]

              // obtenemos el id del viaje seleccionado.
              this.selectVoyageId = voyage.id;

              // Creamos un nuevo  viaje.
              let newVoyage = [];
              newVoyage.push(voyage);

              // Asignamos el nuevo viaje.
              this.generateVoyages = newVoyage;
              // seleccionamos el filtro por puertos.
              this.selectSummaryBy = 'PORTS';

              // Generamos la data segun el filtro.
              this.GenerateDataByFilter(newVoyage);

              // Generamos el dashboard segun el tipo de resument.
              // Ademas le decimos que es para setear la fecha.
              this.GenerateDashboardBySumary(true);
            } else if (this.selectSummaryBy === 'PORTS') {

              // Encapsulamos las ubicaciones.
              let ubication = this.dataMGO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]
              let port = this.generateVoyages[ubication[0]].ports[ubication[1]]

              // Creamos un nuevo viaje.
              let newVoyage = [voyage];
              // Le asignamos el puerto.  
              newVoyage[0].ports = [port];

              this.generateVoyages = newVoyage;
              // cambiamos el tipo de filtro por dia.
              this.selectSummaryBy = 'DAYS'

              // Generamos la data segun el filtro.
              this.GenerateDataByFilter(newVoyage);
              // Generamos el dashboard segun el tipo de resument.
              // Ademas le decimos que es para setear la fecha.
              this.GenerateDashboardBySumary(true)
            } else if (this.selectSummaryBy === 'MONTHS') {

              // Encapsulamos las ubicaciones.
              let date = this.dataMGO[index].x;

              // retorna el primero y ultimo dia del mes de la fecha enviada.
              let result = FisrtOldDayFromDate(date);
              // Seteamos el inicio y fin de la fecha.
              this.startDate = new Date(result.start);
              this.endDate = new Date(result.end);

              // Tipo de resumen por dia.
              this.selectSummaryBy = 'DAYS';
              // Generar reporte por fecha.
              this.GenerateReporteByDate();

            } else if (this.selectSummaryBy === 'DAYS') {

              // Obtenemos los id de los datos.
              let identified = this.dataMGO[index].identified;

              // Buscamos el viaje id
              let voyage = this.getVoyages.find(voyage => voyage.id === identified[0]);

              // Encapsulamos los id de puerto.
              let portId = identified[1];
              // Encapsulamos los id de report.
              let reportId = identified[2];

              this.OpenDialogReport(voyage, portId, reportId, 'MGO');
            }
          }
        },
        legend: { // La leyenda es el texto que esta arriva del cuadro.
          display: true,
          onClick: (event, legendItem) => {
            console.log('onClick:' + legendItem.text);
          },
          labels: {
            fontColor: 'rgb(255,255,255)',
            fontStyle: 'bold',
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {}, // Lo pongo vacio por que en// Lo pongo vacio por que en el update se colocara el valor.
        scales: {},// Lo pongo vacio por que en el update se colocara el valor.
        hover: {
          onHover: function (e: MouseEvent) {
            // puntos GetElementAtaEvent
            var point = this.getElementAtEvent(e);

            // event targer.
            let eventTarget = e.target as HTMLCanvasElement;
            ///home/kali/.vscode/extensions/ms-vscode.vscode-typescript-next-4.3.20210505/node_modules/typescript/lib/lib.dom.d.ts
            if (point.length) {
              eventTarget.style.cursor = 'pointer';// Aqui se esta modificando el TypeScript.
            } else {
              eventTarget.style.cursor = 'default';
            }
          }
        }
      },
      lineaMax: 0
    };

    let canvaLineMGO: any = document.getElementById('lineMGO');
    let ctxLineMGO = canvaLineMGO.getContext('2d');

    this.chartLineMGO = new Chart(ctxLineMGO, this.configLineaMGO);


    return false;
  }

  private GenetareLineSPEED(): boolean {
    // Test
    console.log('GenetareLineSPEED()');

    // Agregamos la configuracion del ChartSpeed.
    this.configLineaSPEED = {
      type: 'line',
      data: {
        labels: [], // Lo pongo vacio por que en el update se colocara el valor.
        datasets: [{
          label: 'AVERAGE SPEED',
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: [], // Lo pongo vacio por que en el update se colocara el valor.
          fill: false,
        }]
      },
      options: { // Otras opciones dentro del Chart
        onClick: (event, activeElement) => { // REVISAR ESTO, Aqui se ejecuta la data que se muestra al dar click a los puntos dentro del chart.

          // Verifico que al click que le demos exista un Item.
          if (activeElement && activeElement.length) {

            // Obtenemos la posicion 0 del activeElement
            let actEle: any = activeElement[0];

            // Obtenemos la ubicacion.
            let index = actEle._index;

            // Filtro por tipo de resument.
            if (this.selectSummaryBy === 'VOYAGES') {

              // obtenemos la ubicacion que estaba en el dashboard.
              let ubication = this.dataSPEED[index].ubication;

              // Seleccionamos el viaje,
              let voyage = this.generateVoyages[ubication[0]]

              // obtenemos el id del viaje seleccionado.
              this.selectVoyageId = voyage.id;

              // Creamos un nuevo  viaje.
              let newVoyage = [];
              newVoyage.push(voyage);

              // Asignamos el nuevo viaje.
              this.generateVoyages = newVoyage;
              // seleccionamos el filtro por puertos.
              this.selectSummaryBy = 'PORTS'

              // Generamos la data segun el filtro.
              this.GenerateDataByFilter(newVoyage);

              // Generamos el dashboard segun el tipo de resument.
              // Ademas le decimos que es para setear la fecha.
              this.GenerateDashboardBySumary(true)
            } else if (this.selectSummaryBy === 'PORTS') {

              // Encapsulamos las ubicaciones.
              let ubication = this.dataMGO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]
              let port = this.generateVoyages[ubication[0]].ports[ubication[1]]

              // Creamos un nuevo viaje.
              let newVoyage = [voyage];
              // Le asignamos el puerto.  
              newVoyage[0].ports = [port];

              // Generamos un nuevo viaje.
              this.generateVoyages = newVoyage;
              // seleccionamos el filtro por puertos.
              this.selectSummaryBy = 'PORTS'

              // Generamos la data segun el filtro.
              this.GenerateDataByFilter(newVoyage);

              // Generamos el dashboard segun el tipo de resument.
              // Ademas le decimos que es para setear la fecha.
              this.GenerateDashboardBySumary(true)
            } else if (this.selectSummaryBy === 'MONTHS') {


              // Encapsulamos las ubicaciones.
              let ubication = this.dataSPEED[index].x;

              // retorna el primero y ultimo dia del mes de la fecha enviada.
              let result = FisrtOldDayFromDate(ubication);

              // Seteamos el inicio y fin de la fecha.
              this.startDate = new Date(result.start);
              this.endDate = new Date(result.end);

              // Tipo de resumen por dia.
              this.selectSummaryBy = 'DAYS';
              // Generar reporte por fecha.
              this.GenerateReporteByDate();

            } else if (this.selectSummaryBy === 'DAYS') {

              // Obtenemos los id de los datos.
              let identified = this.dataMGO[index].identified;

              // Buscamos el viaje id
              let voyage = this.getVoyages.find(voyage => voyage.id === identified[0]);

              // Encapsulamos los id de puerto.
              let portId = identified[1];
              // Encapsulamos los id de report.
              let reportId = identified[2];

              // Abrimos el ReportDialog.
              this.OpenDialogReport(voyage, portId, reportId, 'SPEED');
            }
          }
        },
        legend: { // La leyenda es el texto que esta arriva del cuadro.
          display: true,
          onClick: (event, legendItem) => {
            console.log('onClick:' + legendItem.text);
          },
          labels: {
            fontColor: 'rgb(255,255,255)', // Color de la leyenda.
            fontStyle: 'bold', // Tipo de texto de la leyenda.
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {}, // Lo pongo vacio por que en// Lo pongo vacio por que en el update se colocara el valor.
        scales: {},// Lo pongo vacio por que en el update se colocara el valor.
        hover: {
          onHover: function (e: MouseEvent) {
            // puntos GetElementAtaEvent
            var point = this.getElementAtEvent(e);

            // event targer.
            let eventTarget = e.target as HTMLCanvasElement;
            ///home/kali/.vscode/extensions/ms-vscode.vscode-typescript-next-4.3.20210505/node_modules/typescript/lib/lib.dom.d.ts
            if (point.length) {
              eventTarget.style.cursor = 'pointer';// Aqui se esta modificando el TypeScript.
            } else {
              eventTarget.style.cursor = 'default';
            }
          }
        }
      },
      lineaMax: 0 // Lo pongo cero por que en el update se colocara el valor.
    };

    // Encapculamos el elemento del dom.
    let canvaLineSPEED: any = document.getElementById('lineSPEED');
    // Convertimos el canvaLineIfo en 2d
    let ctxLineSPEED: any = canvaLineSPEED.getContext('2d');

    this.chartLineSPEED = new Chart(ctxLineSPEED, this.configLineaSPEED);

    return false;
  }

  // UpdateLineIFO() : Actualiza el chart de IFO.
  private UpdateLineIFO(): boolean {
    console.log('UpdateLineIFO');


    // Actualizamos los labels
    this.configLineaIFO.data.labels = this.xLabelReport;

    // Actualizamos el titulo
    this.configLineaIFO.data.datasets[0].label = this.languageService.GetMessage(this.translateCategory, (this.selectUser.isConsumptionLSFO ? 'TITLE_COMSUMPTION_LSFO' : this.selectUser.isConsumptionIFO ? 'TITLE_COMSUMPTION_IFO' : this.selectUser.isConsumptionVLSFO ? 'TITLE_COMSUMPTION_VLSFO' : 'TITLE_COMSUMPTION_LSFO'));

    // Actualizamos la dataIFO
    this.configLineaIFO.data.datasets[0].data = this.dataIFO;

    // Vaciamos la configuracion de las lines IFO
    // La linea es el campo que agregamos en el plugin.
    this.configLineaIFO.options.lines = [];

    // Verificamos que exista una confifuracion para LSFO
    if (this.selectUser.isConsumptionIFO || this.selectUser.isConsumptionLSFO || this.selectUser.isConsumptionVLSFO) {

      // Si el consumo maximo es mayor a 0 lo pintamos si no, no hace falta.
      if (this.selectUser.maxIFOConsumption > 0) {
        this.configLineaIFO.options.lines.push({
          type: 'horizontal',
          y: this.selectUser.maxIFOConsumption,
          color: 'red',
          label: ''
        });
      };

      if (this.selectUser.minIFOConsumption > 0) {
        this.configLineaIFO.options.lines.push({
          type: 'horizontal',
          y: this.selectUser.minIFOConsumption,
          color: '#39FF14',
          label: ''
        });
      }

      // Configuracion Tooltips
      this.configLineaIFO.options.tooltips = { // Revisar la configuracion del Tooltip, podriamos hacerlo mas pequeño.

        // Establece qué elementos aparecen en la información sobre herramientas.
        mode: 'nearest',
        // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
        intersect: false,
        callbacks: {
          title: (tooltipItem: Chart.ChartTooltipItem[], data: Chart.ChartData) => {

            // Obtenemos la posicion del item.
            let index = tooltipItem[0].index;

            // Resultado que se mostrara en el titulo.
            let result = '';

            // DataSets.
            let dataSets: Chart.ChartDataSets = data.datasets[0];
            let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];
            let ubication = chartPoint.ubication;

            // Verificamos como esta el filtro actualmente.
            // Si es por Viajes, Puertos, Meses o dias.
            if (this.selectSummaryBy === 'VOYAGES') {
              // Viajes.
              let viaje = this.generateVoyages[ubication[0]];
              result = 'V' + viaje.voyageNumber + ' Y' + ('' + viaje.year).slice(-2);

            } else if (this.selectSummaryBy === 'PORTS') {

              // Obtenemos el viaje.
              let viaje = this.generateVoyages[ubication[0]];
              // Obtenemos el puerto.
              let port = viaje.ports[ubication[1]];
              // Result
              result = 'V' + viaje.voyageNumber + ' P' + port.portNumber + ' Y' + ('' + viaje.year).slice(-2);

            } else if (this.selectSummaryBy === 'MONTHS') {

              // Obtenemos el viaje.
              let viaje = this.generateVoyages[ubication[0]];
              // Obtenemos el puerto.
              let port = viaje.ports[ubication[1]];

              // No existe la ubicacion en month y day
              let dailyReport = port.dailyReports[ubication[2]];

              // dos veces estamos aplicando el formato.
              result = TextMonthYearFormatYYYYMMDD(dailyReport.date);
            } else if (this.selectSummaryBy === 'DAYS') {

              // Obtenemos el viaje.
              let viaje = this.generateVoyages[ubication[0]];
              // Obtenemos el puerto.
              let port = viaje.ports[ubication[1]];

              // No existe la ubicacion en month y day
              let dailyReport = port.dailyReports[ubication[2]];

              // dos veces estamos aplicando el formato.
              result = TextMonthDayYearFormatYYYYMMDD(dailyReport.date);
            }

            return result;

          },
          label: (tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData) => {
            // Resultado que se mostrara en el titulo.
            let result = 'Dayli consumption ' + mathRound(Number(tooltipItem.value), 2);
            return result;
          },
          footer: (tooltipItem: Chart.ChartTooltipItem[], data: Chart.ChartData) => {
            // Obtenemos la posicion del item.
            let index = tooltipItem[0].index;

            // Resultado que se mostrara en el titulo.
            let result = [];

            // DataSets.
            let dataSets: Chart.ChartDataSets = data.datasets[0];
            let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];
            let ubication = chartPoint.ubication;

            // Voyage.
            if (this.selectSummaryBy === 'VOYAGES') {

              let voyage = this.generateVoyages[ubication[0]];

              result = [
                'T. Ports : ' + voyage.totalPort,
                'T. Reports : ' + voyage.totalReport,
                'T. Distance : ' + mathRound(voyage.totalSpeed.distance, 2),
                'T. Consumption : ' + mathRound(voyage.totalIFO, 2),
                'T. Time : ' + mathRound(voyage.totalSpeed.steamingTime, 2),
                'Speed : ' + mathRound(voyage.totalSpeed.distance / voyage.totalSpeed.steamingTime, 2),
              ];
            } else if (this.selectSummaryBy === 'PORTS') {

              let voyage = this.generateVoyages[ubication[0]];
              let port = voyage.ports[ubication[1]];

              result = [
                'Departure : ' + port.departurePort,
                'Arrival : ' + port.arrivalPort,
                'T. Reports : ' + voyage.totalReport,
                'T. Distance : ' + mathRound(port.speed.distance, 2),
                'T. Consumption : ' + mathRound(port.robIfo, 2),
                'T. Time : ' + mathRound(port.speed.steamingTime, 2),
                'Speed : ' + mathRound(port.speed.distance / port.speed.steamingTime, 2),
              ];
            } else if (this.selectSummaryBy === 'MONTHS') {

              result = [
                'T. Ports : ' + chartPoint.totalPort,
                'T. Reports : ' + chartPoint.totalReport,
                'T. Distance : ' + mathRound(chartPoint.speed.distance, 2),
                'T. Consumption : ' + mathRound(chartPoint.totalConsumptionIFO, 2),
                'T. Time : ' + mathRound(chartPoint.speed.steamingTime, 2),
                'Speed : ' + mathRound(chartPoint.speed.distance / chartPoint.speed.steamingTime, 2),
              ];
            } else if (this.selectSummaryBy === 'DAYS') {

              // Revisar esto lo podriamos desaparecer si se lo agregamos al
              // GenerateDataChart, los datos de la actividad y observaciones podrian estar en un atributo.
              let dataExtra = chartPoint.dataExtra;

              let speed = new Speed();
              let activities = '';
              let observations = '';
              let totalReport = 0;

              dataExtra.forEach((report: DailyReport) => {
                activities = activities + ', ' + this.languageService.GetMessage(this.translateCategory, report.activityPerformed);
                observations = observations + ', ' + report.observation;
                speed.add(report.distance, report.steamingTime);
                totalReport = totalReport + 1;
              });


              result = [
                'T. Ports : ' + chartPoint.totalPort,
                'T. Reports : ' + chartPoint.totalReport,
                'T. Distance : ' + mathRound(chartPoint.speed.distance, 2),
                'T. Consumption : ' + mathRound(chartPoint.totalConsumptionIFO, 2),
                'T. Time : ' + mathRound(chartPoint.speed.steamingTime, 2),
                'Speed : ' + mathRound(chartPoint.speed.distance / chartPoint.speed.steamingTime, 2),
                'Activities : ' + activities, // revisar // agregar las actividades
                'Observations : ' + observations// revisar agregar las observaciones
              ];
            }


            return result;

          },
        }
      } // Revisar para mejorar el tooltips viaje, puerto, mes, dias.

    }

    if (this.configLineaIFO.lineaMax < this.selectUser.maxIFOConsumption) {
      this.configLineaIFO.lineaMax = this.selectUser.maxIFOConsumption;
    }

    // Agregamos la configuracion de las escalas.
    this.configLineaIFO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaIFO.lineaMax, 0) + 2);
    //
    this.chartLineIFO.update();
    //
    return false;

  }

  // UpdateLineMGO() : Actualiza el chart de IFO.
  private UpdateLineMGO(): boolean {
    console.log('UpdateLineMGO');

    // Actualizamos los labels
    this.configLineaMGO.data.labels = this.xLabelReport;

    // Actualizamos el titulo
    this.configLineaMGO.data.datasets[0].data = this.dataMGO;

    // Vaciamos la configuracion de las lines MGO
    // La linea es el campo que agregamos en el plugin.
    this.configLineaMGO.options.lines = [];


    // Verificamos que exista una confifuracion para LSFO
    if (this.selectUser.isConsumptionMGO) {

      // Si el consumo maximo es mayor a 0 lo pintamos si no, no hace falta.
      if (this.selectUser.maxMGOConsumption > 0) {
        this.configLineaMGO.options.lines.push({
          type: 'horizontal',
          y: this.selectUser.maxMGOConsumption,
          color: 'red',
          label: ''
        });
      };

      if (this.selectUser.minMGOConsumption > 0) {
        this.configLineaMGO.options.lines.push({
          type: 'horizontal',
          y: this.selectUser.minMGOConsumption,
          color: '#39FF14',
          label: ''
        });
      }

      // Configuracion Tooltips
      this.configLineaMGO.options.tooltips = { // Revisar la configuracion del Tooltip, podriamos hacerlo mas pequeño.

        // Establece qué elementos aparecen en la información sobre herramientas.
        mode: 'nearest',
        // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
        intersect: false,
        callbacks: {
          title: (tooltipItem: Chart.ChartTooltipItem[], data: Chart.ChartData) => {

            // Obtenemos la posicion del item.
            let index = tooltipItem[0].index;

            // Resultado que se mostrara en el titulo.
            let result = '';

            // DataSets.
            let dataSets: Chart.ChartDataSets = data.datasets[0];
            let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];
            let ubication = chartPoint.ubication;

            // Verificamos como esta el filtro actualmente.
            // Si es por Viajes, Puertos, Meses o dias.
            if (this.selectSummaryBy === 'VOYAGES') {
              // Viajes.
              let viaje = this.generateVoyages[ubication[0]];
              result = 'V' + viaje.voyageNumber + ' Y' + ('' + viaje.year).slice(-2);

            } else if (this.selectSummaryBy === 'PORTS') {

              // Obtenemos el viaje.
              let viaje = this.generateVoyages[ubication[0]];
              // Obtenemos el puerto.
              let port = viaje.ports[ubication[1]];
              // Result
              result = 'V' + viaje.voyageNumber + ' P' + port.portNumber + ' Y' + ('' + viaje.year).slice(-2);

            } else if (this.selectSummaryBy === 'MONTHS') {

              // Obtenemos el viaje.
              let viaje = this.generateVoyages[ubication[0]];
              // Obtenemos el puerto.
              let port = viaje.ports[ubication[1]];

              // No existe la ubicacion en month y day
              let dailyReport = port.dailyReports[ubication[2]];

              // dos veces estamos aplicando el formato.
              result = TextMonthYearFormatYYYYMMDD(dailyReport.date);
            } else if (this.selectSummaryBy === 'DAYS') {

              // Obtenemos el viaje.
              let viaje = this.generateVoyages[ubication[0]];
              // Obtenemos el puerto.
              let port = viaje.ports[ubication[1]];

              // No existe la ubicacion en month y day
              let dailyReport = port.dailyReports[ubication[2]];

              // dos veces estamos aplicando el formato.
              result = TextMonthDayYearFormatYYYYMMDD(dailyReport.date);
            }

            return result;

          },
          label: (tooltipItem: Chart.ChartTooltipItem, data: Chart.ChartData) => {

            // Resultado que se mostrara en el titulo.
            let result = 'Dayli consumption ' + mathRound(Number(tooltipItem.value), 2);
            return result;
          },
          footer: (tooltipItem: Chart.ChartTooltipItem[], data: Chart.ChartData) => {
            // Obtenemos la posicion del item.
            let index = tooltipItem[0].index;

            // Resultado que se mostrara en el titulo.
            let result = [];

            // DataSets.
            let dataSets: Chart.ChartDataSets = data.datasets[0];
            let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];
            let ubication = chartPoint.ubication;

            // Voyage.
            if (this.selectSummaryBy === 'VOYAGES') {

              let voyage = this.generateVoyages[ubication[0]];

              result = [
                'T. Ports : ' + voyage.totalPort,
                'T. Reports : ' + voyage.totalReport,
                'T. Distance : ' + mathRound(voyage.totalSpeed.distance, 2),
                'T. Consumption : ' + mathRound(voyage.totalMGO, 2),
                'T. Time : ' + mathRound(voyage.totalSpeed.steamingTime, 2),
                'Speed : ' + mathRound(voyage.totalSpeed.distance / voyage.totalSpeed.steamingTime, 2),
              ];
            } else if (this.selectSummaryBy === 'PORTS') {

              let voyage = this.generateVoyages[ubication[0]];
              let port = voyage.ports[ubication[1]];

              result = [
                'Departure : ' + port.departurePort,
                'Arrival : ' + port.arrivalPort,
                'T. Reports : ' + voyage.totalReport,
                'T. Distance : ' + mathRound(port.speed.distance, 2),
                'T. Consumption : ' + mathRound(port.robMgo, 2),
                'T. Time : ' + mathRound(port.speed.steamingTime, 2),
                'Speed : ' + mathRound(port.speed.distance / port.speed.steamingTime, 2),
              ];
            } else if (this.selectSummaryBy === 'MONTHS') {

              result = [
                'T. Ports : ' + chartPoint.totalPort,
                'T. Reports : ' + chartPoint.totalReport,
                'T. Distance : ' + mathRound(chartPoint.speed.distance, 2),
                'T. Consumption : ' + mathRound(chartPoint.totalConsumptionMGO, 2),
                'T. Time : ' + mathRound(chartPoint.speed.steamingTime, 2),
                'Speed : ' + mathRound(chartPoint.speed.distance / chartPoint.speed.steamingTime, 2),
              ];
            } else if (this.selectSummaryBy === 'DAYS') {


              // Revisar esto lo podriamos desaparecer si se lo agregamos al
              // GenerateDataChart, los datos de la actividad y observaciones podrian estar en un atributo.
              let dataExtra = chartPoint.dataExtra;

              let speed = new Speed();
              let activities = '';
              let observations = '';
              let totalReport = 0;

              dataExtra.forEach((report: DailyReport) => {
                activities = activities + ', ' + this.languageService.GetMessage(this.translateCategory, report.activityPerformed);
                observations = observations + ', ' + report.observation;
                speed.add(report.distance, report.steamingTime);
                totalReport = totalReport + 1;
              });

              result = [
                'T. Ports : ' + chartPoint.totalPort,
                'T. Reports : ' + chartPoint.totalReport,
                'T. Distance : ' + mathRound(chartPoint.speed.distance, 2),
                'T. Consumption : ' + mathRound(chartPoint.totalConsumptionMGO, 2),
                'T. Time : ' + mathRound(chartPoint.speed.steamingTime, 2),
                'Speed : ' + mathRound(chartPoint.speed.distance / chartPoint.speed.steamingTime, 2),
                'Activities : ' + activities, // revisar // agregar las actividades
                'Observations : ' + observations // revisar agregar las observaciones
              ];
            }


            return result;

          },
        }
      } // Revisar para mejorar el tooltips viaje, puerto, mes, dias.

    }
    // Si el consumo maximo es mayor a 0 lo pintamos si no, no hace falta.
    if (this.configLineaMGO.lineaMax < this.selectUser.maxMGOConsumption) {
      this.configLineaMGO.lineaMax = this.selectUser.maxMGOConsumption;
    }


    // Agregamos la configuracion de las escalas.
    this.configLineaMGO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaMGO.lineaMax, 0) + 2);

    this.chartLineMGO.update();

    return false;
  }

  private UpdateLineSPEED(): boolean {
    console.log('UpdateLineSPEED()');


    // Actualizamos los labels
    this.configLineaSPEED.data.labels = this.xLabelReport;

    // Actualizamos la dataSPEED
    this.configLineaSPEED.data.datasets[0].data = this.dataSPEED;

    // Vaciamos la configuracion de las lines SPEED
    // La linea es el campo que agregamos en el plugin.
    this.configLineaSPEED.options.lines = [];

    // Configuracion Tooltips
    this.configLineaSPEED.options.tooltips = { // Revisar la configuracion del Tooltip, podriamos hacerlo mas pequeño.

      // Establece qué elementos aparecen en la información sobre herramientas.
      mode: 'nearest',
      // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
      intersect: false,
      callbacks: {
        title: (tooltipItem, data) => {

          // Obtenemos la posicion del item.
          let index = tooltipItem[0].index;

          // Resultado que se mostrara en el titulo.
          let result = "";

          // DataSets.
          let dataSets: Chart.ChartDataSets = data.datasets[0];
          let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];
          let ubication = chartPoint.ubication;

          // Verificamos como esta el filtro actualmente.
          // Si es por Viajes, Puertos, Meses o dias.
          if (this.selectSummaryBy === 'VOYAGES') {
            // Viajes.
            let viaje = this.generateVoyages[ubication[0]];
            result = 'V' + viaje.voyageNumber + ' Y' + ('' + viaje.year).slice(-2);

          } else if (this.selectSummaryBy === 'PORTS') {

            // Obtenemos el viaje.
            let viaje = this.generateVoyages[ubication[0]];
            // Obtenemos el puerto.
            let port = viaje.ports[ubication[1]];
            // Result
            result = 'V' + viaje.voyageNumber + ' P' + port.portNumber + ' Y' + ('' + viaje.year).slice(-2);

          } else if (this.selectSummaryBy === 'MONTHS') {

            // Obtenemos el viaje.
            let viaje = this.generateVoyages[ubication[0]];
            // Obtenemos el puerto.
            let port = viaje.ports[ubication[1]];

            // No existe la ubicacion en month y day
            let dailyReport = port.dailyReports[ubication[2]];

            // dos veces estamos aplicando el formato.
            result = TextMonthYearFormatYYYYMMDD(dailyReport.date);
          } else if (this.selectSummaryBy === 'DAYS') {

            // Obtenemos el viaje.
            let viaje = this.generateVoyages[ubication[0]];
            // Obtenemos el puerto.
            let port = viaje.ports[ubication[1]];

            // No existe la ubicacion en month y day
            let dailyReport = port.dailyReports[ubication[2]];

            // dos veces estamos aplicando el formato.
            result = TextMonthDayYearFormatYYYYMMDD(dailyReport.date);
          }

          return result;
        },
        label: (tooltipItem, data) => {

          // Resultado que se mostrara en el titulo.
          let result = 'Average Speed : ' + mathRound(tooltipItem.value, 2);
          return result;
        },
        footer: (tooltipItem, data) => {
          // Obtenemos la posicion del item.
          let index = tooltipItem[0].index;

          // Resultado que se mostrara en el titulo.
          let result = [];

          // DataSets.
          let dataSets: Chart.ChartDataSets = data.datasets[0];
          let chartPoint: Chart.ChartPoint = <Chart.ChartPoint>dataSets.data[index];
          let ubication = chartPoint.ubication;

          if (this.selectSummaryBy === 'VOYAGES') {

            let voyage = this.generateVoyages[ubication[0]];

            result = [
              'T. Ports : ' + voyage.totalPort,
              'T. Reports : ' + voyage.totalReport,
              'T. Distance : ' + mathRound(voyage.totalSpeed.distance, 2),
              'T. Time : ' + mathRound(voyage.totalSpeed.steamingTime, 2),
            ];
          } else if (this.selectSummaryBy === 'PORTS') {
            let voyage = this.generateVoyages[ubication[0]];
            let port = voyage.ports[ubication[1]];

            result = [
              'Departure : ' + port.departurePort,
              'Arrival : ' + port.arrivalPort,
              'T. Reports : ' + voyage.totalReport,
              'T. Distance : ' + mathRound(port.speed.distance, 2),
              'T. Time : ' + mathRound(port.speed.steamingTime, 2),
            ];
          } else if (this.selectSummaryBy === 'MONTHS') {


            result = [
              'T. Ports : ' + chartPoint.totalPort,
              'T. Reports : ' + chartPoint.totalReport,
              'T. Distance : ' + mathRound(chartPoint.speed.distance, 2),
              'T. Time : ' + mathRound(chartPoint.speed.steamingTime, 2),
            ];
          }
          else if (this.selectSummaryBy === 'DAYS') {

            // Revisar esto lo podriamos desaparecer si se lo agregamos al
            // GenerateDataChart, los datos de la actividad y observaciones podrian estar en un atributo.
            let dataExtra = chartPoint.dataExtra;

            let speed = new Speed();
            let activities = '';
            let observations = '';
            let totalReport = 0;

            dataExtra.forEach((report: DailyReport) => {
              activities = activities + ', ' + this.languageService.GetMessage(this.translateCategory, report.activityPerformed);
              observations = observations + ', ' + report.observation;
              speed.add(report.distance, report.steamingTime);
              totalReport = totalReport + 1;
            });

            result = [
              'T. Ports : ' + chartPoint.totalPort,
              'T. Reports : ' + chartPoint.totalReport,
              'T. Distance : ' + mathRound(chartPoint.speed.distance, 2),
              'T. Time : ' + mathRound(chartPoint.speed.steamingTime, 2),
              'Activities : ' + activities, // revisar // agregar las actividades
              'Observations : ' + observations // revisar agregar las observaciones
            ];
          }


          return result;

        },
      },
    }

    if (this.configLineaSPEED.lineaMax < this.selectUser.maxSpeed) {
      this.configLineaSPEED.lineaMax = this.selectUser.maxSpeed;
    }

    // Agregamos la configuracion de las escalas.
    this.configLineaSPEED.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaSPEED.lineaMax, 0) + 2);

    this.chartLineSPEED.update();

    return false;
  }
  // FIN DE VER DESPUES



  // Suma los campos ifo()
  private SumaIfo(report: DailyReport): number {
    let ifo = report.mplaIfo + report.auxIfo + report.boilerIfo + report.otherIfo;
    return ifo;
  }

  private SumaMgo(report: DailyReport): number {
    let mgo = report.mplaMgo + report.auxMgo + report.boilerMgo + report.ppMgo + report.giMgo + report.otherMgo;
    return mgo;
  }

  public MathRoundOneDecimal(valor, cantDecimales: number) {
    if (!valor) { return 0; }

    let result = mathRound(valor, 2)
    return result;
  }

  public Testt() {
    alert("DI O CLICK");
  }

  private PluginChartLine() {

    // Agregamos un plugin para saver los niveles.
    const chartPluginLineaHorizontal = {
      afterDraw: (chartobj: any) => {
        if (chartobj.options.lines) {
          let ctx = chartobj.chart.ctx;

          // tslint:disable-next-line: prefer-for-of
          for (let idx = 0; idx < chartobj.options.lines.length; idx++) {

            let line = chartobj.options.lines[idx];
            line.iniCoord = [0, 0];
            line.endCoord = [0, 0];
            line.color = line.color ? line.color : 'red';
            line.label = line.label ? line.label : '';

            if (line.type === 'horizontal' && line.y) {
              line.iniCoord[1] = line.endCoord[1] = chartobj.scales['y-axis-0'].getPixelForValue(line.y);
              line.endCoord[0] = chartobj.chart.width;
            } else if (line.type === 'vertical' && line.x) {
              line.iniCoord[0] = line.endCoord[0] = chartobj.scales['x-axis-0'].getPixelForValue(line.x);
              line.endCoord[1] = chartobj.chart.height;
            }

            ctx.beginPath();
            ctx.moveTo(line.iniCoord[0], line.iniCoord[1]);
            ctx.lineTo(line.endCoord[0], line.endCoord[1]);
            ctx.strokeStyle = line.color;
            ctx.stroke();
            ctx.fillStyle = line.color;
            ctx.fillText(line.label, line.iniCoord[0] + 3, line.iniCoord[1] + 3);
          }
        }
      }
    };

    Chart.pluginService.register(chartPluginLineaHorizontal);

  }

  private OpenDialogReport(voyage: Voyage, selectPortId: number, reportId: number, isIFO_MGO_SPEED: string) {

    let dialogListReport: IDialogListReport = {
      voyage: JSON.parse(JSON.stringify(voyage)),
      selectPortId: selectPortId,
      reportId: reportId,
      isIFO_MGO_SPEED: isIFO_MGO_SPEED,
      selectUser: this.selectUser,
      typeFilter_Day: true,
      filterActivities: this.frmCActivityPerformed.value || []
    };


    const dialogRef = this.dialog.open(DialogListReportComponent, {
      data: dialogListReport
    });


    dialogRef.afterClosed().subscribe(
      (result: Boolean) => {

        if (result) {

          alert('OKK');
        }
      });


  }

}
