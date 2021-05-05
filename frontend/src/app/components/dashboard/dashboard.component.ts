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
import { FormatDate, GetMonthYearFromDate, ComparePreviousDates, CompareAfterDates, TextMonthYear, TextMonthDayYear, DiffDates, IsPrevious1Date, IsAfter1Date, FisrtOldDayFromDate, validateDate, GetDate } from '../../../assets/moment/moment.assets';


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
  public configLineaIFO: any; // configuracion del elemento
  public chartLineIFO: any; // LINEA
  public dataIFO = []; // Data

  // Configuracion del chartMGO
  public configLineaMGO: any; // configuracion del elemento
  public chartLineMGO: any; // LINEA
  public dataMGO = []; // Data


  // Configuracion del SPEED
  public configLineaSPEED: any; // configuracion del elemento
  public chartLineSPEED: any; // LINEA
  public dataSPEED = []; // Data


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

        if (resultVoyages) {
          resultVoyages.forEach(
            voyage => {


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

              voyage.ports.forEach(
                port => {
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
        this.GenerateDataByFilter(this.getVoyages);
        // Generar dashboard por tipo de resumen.
        this.GenerateDashboardBySumary(true);

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

  public SelectComboBuque(userId): boolean {
    console.log('SelectComboBuque()');

    Promise.resolve(true).then(
      result => {
        // Activamos el loading.
        this.loadingService.Open();

        return this.SelectUser(this.selectUserId);
      }).then(
        result => {
          if (!result) throw 'ERROR_COMBO_BUQUE';
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

    console.log('FIN SelectComboBuque()');
    return false;
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


        // Generar data por filtro.
        this.GenerateDataByFilter(this.getVoyages);
        // Generar dashboard por tipo de resumen.
        this.GenerateDashboardBySumary(true)


        return true;
      });

  }

  public SelectComboVoyage(index?: number): boolean {

    console.log('SelectComboVoyage()');

    let newVoyages = [];
    this.selectSummaryBy = 'DAYS';
    if (index == null) {
      newVoyages = this.getVoyages;

      this.selectSummaryBy = 'VOYAGES';
    } else {
      newVoyages.push(this.getVoyages[index]);
    }

    this.GenerateDataByFilter(newVoyages);
    this.GenerateDashboardBySumary(true);

    return false;
  }

  public FilterByActivities() {
    let voyages: Voyage[] = [];

    // SI existe un viaje seleccionamos lo seleccionamos para reducir el arreglo
    if (this.selectVoyageId) {

      let voyageSelect = this.getVoyages.find(voyage => voyage.id == this.selectVoyageId);
      voyages.push(voyageSelect);

      this.GenerateDataByFilter(voyages);
      this.GenerateDashboardBySumary(true);

    } else if (validateDate(this.startDate) && validateDate(this.endDate)) {

      // Caso contrario el filtro se hara en todos los viajes.
      voyages = this.getVoyages;

      if (this.selectSummaryBy == 'DAYS') {

        let diffDay = DiffDates(this.startDate, this.endDate);

        if (diffDay >= 50) {
          this.selectSummaryBy = 'VOYAGES';
        }
      }

      this.GenerateDataByFilter(voyages, true);
      this.GenerateDashboardBySumary(false);

    } else {

      // Caso contrario el filtro se hara en todos los viajes.
      voyages = this.getVoyages;

      // Si el sumary es DAYS lo convertimos a viajes.
      if (this.selectSummaryBy == 'DAYS') {
        this.selectSummaryBy = 'VOYAGES';
      }

      this.GenerateDataByFilter(voyages);
      this.GenerateDashboardBySumary(true);

    }

    console.log('FilterByActivities()');

  }

  public ClickSummaryBy() {
    console.log(' ClickSummaryBy():');


    this.loadingService.Open();


    Promise.resolve(true).then(
      () => {

        setTimeout(() => {
          console.log('OKKK');

          console.log('INICA EL SUMARRY');

          this.GenerateDashboardBySumary(true);

          this.loadingService.Close();
        }, 100);


      }
    )

  }

  public ClearFilter(): boolean {

    this.startDate = null;
    this.endDate = null;

    if (this.frmCActivityPerformed && this.frmCActivityPerformed.value && this.frmCActivityPerformed.value) {
      // Reset filtro.
      this.frmCActivityPerformed = new FormControl();
    }

    this.selectVoyageId = 0;
    this.selectVoyage = new Voyage();


    this.selectSummaryBy = 'VOYAGES';

    this.GenerateDataByFilter(this.getVoyages);

    this.GenerateDashboardBySumary(true);
    return false;
  }

  public viewFilter(isView: boolean) {
    console.log('viewFilter(isView: boolean)');

    this.isViewFilter = isView;
  }


  public ExportExcel(): boolean {
    console.log('exportExcel();');


    this.excelService.ExportReportDaily(this.generateVoyages);

    return false;
  }

  public async ExportPDF(): Promise<boolean> {

    for await (const voyage of this.generateVoyages) {


      for await (const port of voyage.ports) {

        console.log('exportPdf()');
        const doc = new jsPDF();

        // width 210
        // Heigth 297
        let height = 38;
        doc.addImage("./assets/icons/logotransgas.png", "JPEG", (210 - 50) / 2, height, 50, 50)
        height += 55;

        height += 10;
        var width = doc.internal.pageSize.getWidth()
        doc.setFontSize(35);
        doc.setTextColor(22, 33, 77);
        doc.setFont('Helvetica', 'bold');
        doc.text('Vessel Performance Report', width / 2, height, { align: 'center' })


        height += 10;
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFont('Helvetica', 'bold');
        doc.text('Prepared For:', width / 2, height, { align: 'center' })

        height += 12;
        doc.setFontSize(30);
        doc.setTextColor(22, 33, 77);
        doc.setFont('Helvetica', 'bold');
        doc.text(this.selectUser.name, width / 2, height, { align: 'center' })

        height += 20;
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFont('Helvetica', 'bold');
        doc.text('N° Port: ' + port.portNumber, width / 2, height, { align: 'center' })


        height += 12;
        doc.setFontSize(30);
        doc.setTextColor(22, 33, 77);
        doc.setFont('Helvetica', 'bold');
        doc.text(port.departurePort + " to " + port.arrivalPort, width / 2, height, { align: 'center' })


        height += 10;
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.setFont('Helvetica', 'bold');
        doc.text("ATD: " + FormatDate(port.dailyReports[0].date) + " " + port.dailyReports[0].hour, width / 2, height, { align: 'center' })

        height += 10;
        doc.setFontSize(10);
        doc.setTextColor(40);
        doc.setFont('Helvetica', 'bold');
        doc.text("Date: " + TextMonthDayYear(FormatDate(GetDate())), width / 2, height, { align: 'center' })


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
    return false;
  }

  public GenerateReporteByDate(): boolean {
    console.log('GenerateReporteByDate()');

    this.loadingService.Open();


    Promise.resolve(true).then(
      () => {

        this.selectVoyageId = null;

        setTimeout(() => {
          this.GenerateDataByFilter(this.getVoyages, true);

          this.GenerateDashboardBySumary(false);


          this.loadingService.Close();
        }, 100);


      }
    )
    return false;
  }

  public SelectionmodalDisplayView(): boolean {
    console.log('SelectionmodalDisplayView()');

    return false;
  }

  // Genera la data del viaje con filtro y resumen.
  public GenerateDataByFilter(aRvoyages: Voyage[], isFilterWithDate?: boolean) {
    console.log('Generate()');


    this.generateVoyages = JSON.parse(JSON.stringify(aRvoyages));

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


    // CONSUMER MGO

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


    let generalStartDate: String;
    let generalEndDate: String;

    this.generateVoyages = this.generateVoyages.filter(
      (voyage: Voyage, indexV: number, voyages: any[]) => {

        let totalConsumoViajeIFO = 0;
        let totalConsumoViajeMGO = 0;
        let totalPuertos = 0;
        let dayStartByVoyage: String;
        let dayEndByVoyage: String;

        let totalSpeedViaje: Speed = new Speed();

        // Recorremos los puertos
        voyage.ports = voyage.ports.filter(
          (port: Port, index, ports) => {

            let totalConsumoByPortIFO = 0;
            let totalConsumoByPortMGO = 0;
            let totalSpeedByPort: Speed = new Speed();
            let dayStartByPort: String;
            let dayEndByPort: String;

            // Filtramos si el estado es true, ademas de filtros.
            if (port.status) {

              // Recorremos los reportes
              port.dailyReports = port.dailyReports.filter(
                (report, index, reports) => {

                  if (report.status) {

                    if (isFilterWithDate && this.startDate && this.endDate && (!IsAfter1Date(report.date, this.startDate) || !IsPrevious1Date(report.date, this.endDate))) {
                      return false;
                    }


                    let totalIFO = this.SumaIfo(report);
                    let totalMGO = this.SumaMgo(report);

                    dayStartByPort = ComparePreviousDates(dayStartByPort, report.date);
                    dayEndByPort = CompareAfterDates(dayEndByPort, report.date);

                    // FILTRO POR ACTIVIDAD
                    if (report.activityPerformed === 'LOADING') {

                      this.totalTimePerActivityIFO.loading += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.loading += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.loading += totalIFO;


                      this.totalTimePerActivityMGO.loading += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.loading += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.loading += totalMGO;

                    } else if (report.activityPerformed === 'DOWNLOADING') {

                      this.totalTimePerActivityIFO.discharge += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.discharge += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.discharge += totalIFO;


                      this.totalTimePerActivityMGO.discharge += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.discharge += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.discharge += totalMGO;

                    } else if (report.activityPerformed === 'SAILING_IN_BALLAST') {

                      this.totalTimePerActivityIFO.ballast += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.ballast += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.ballast += totalIFO;

                      this.totalTimePerActivityMGO.ballast += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.ballast += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.ballast += totalMGO;

                    } else if (report.activityPerformed === 'SAILING_WITH_LADEN') {

                      this.totalTimePerActivityIFO.laden += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.laden += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.laden += totalIFO;


                      this.totalTimePerActivityMGO.laden += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.laden += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.laden += totalMGO;

                    } else if (report.activityPerformed === 'ECONOMICAL_NAVIGATION') {

                      this.totalTimePerActivityIFO.economical += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.economical += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.economical += totalIFO;


                      this.totalTimePerActivityMGO.economical += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.economical += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.economical += totalMGO;

                    } else if (report.activityPerformed === 'ANCHORED') {

                      this.totalTimePerActivityIFO.anchor += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.anchor += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.anchor += totalIFO;


                      this.totalTimePerActivityMGO.anchor += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.anchor += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.anchor += totalMGO;

                    } else if (report.activityPerformed === 'MANEUVER') {

                      this.totalTimePerActivityIFO.maneuver += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.maneuver += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.maneuver += totalIFO;


                      this.totalTimePerActivityMGO.maneuver += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.maneuver += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.maneuver += totalMGO;

                    } else if (report.activityPerformed === 'OTHER_ACT') {

                      this.totalTimePerActivityIFO.otherActivity += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedIFO.otherActivity += report.distance;
                      this.voyageConsumptionByActivityPerformedIFO.otherActivity += totalIFO;

                      this.totalTimePerActivityMGO.otherActivity += report.steamingTime; // revisar
                      this.totalDistanceMilesByActivityPerformedMGO.otherActivity += report.distance;
                      this.voyageConsumptionByActivityPerformedMGO.otherActivity += totalMGO;

                    }

                    if (
                      (!this.frmCActivityPerformed.value || this.frmCActivityPerformed.value.length === 0) ||
                      this.frmCActivityPerformed.value.find(activity => activity === report.activityPerformed)
                    ) {


                      totalConsumoByPortIFO = totalConsumoByPortIFO + totalIFO;
                      totalConsumoByPortMGO = totalConsumoByPortMGO + totalMGO;
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


                    } else {

                      return false;
                    }


                    return true;
                  } else {
                    return false;
                  }

                }
              )

              if (!port.dailyReports.length) return false;

              totalPuertos = totalPuertos + 1;

              port.robIfo = totalConsumoByPortIFO;
              port.robMgo = totalConsumoByPortMGO
              port.speed = totalSpeedByPort;

              port.dayStart = dayStartByPort;
              port.dayEnd = dayEndByPort;

              dayStartByVoyage = ComparePreviousDates(dayStartByVoyage, dayStartByPort);
              dayEndByVoyage = CompareAfterDates(dayEndByVoyage, dayEndByPort);

              totalConsumoViajeIFO = totalConsumoViajeIFO + totalConsumoByPortIFO;
              totalConsumoViajeMGO = totalConsumoViajeMGO + totalConsumoByPortMGO;
              totalSpeedViaje.add(totalSpeedByPort.distance, totalSpeedByPort.steamingTime);

              return true;

            } else {
              return false;
            }

          }
        );

        if (!voyage.ports.length) return false;

        voyage.totalMGO = totalConsumoViajeMGO;
        voyage.totalIFO = totalConsumoViajeIFO;
        voyage.totalSpeed = totalSpeedViaje;
        voyage.totalPort = totalPuertos;
        voyage.dayStart = dayStartByVoyage;
        voyage.dayEnd = dayEndByVoyage;

        generalStartDate = ComparePreviousDates(generalStartDate, voyage.dayStart);
        generalEndDate = CompareAfterDates(generalEndDate, voyage.dayEnd);
        return true;
      });

    let numberDay = DiffDates(generalStartDate, generalEndDate);
    if (!numberDay) numberDay = 1;

    this.consumptionDaysRealMGO.mpal = this.consumptionTotalMGO.mpal * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
    this.consumptionDaysRealMGO.aux = this.consumptionTotalMGO.aux * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
    this.consumptionDaysRealMGO.boiler = this.consumptionTotalMGO.boiler * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
    this.consumptionDaysRealMGO.pp = this.consumptionTotalMGO.pp * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
    this.consumptionDaysRealMGO.gi = this.consumptionTotalMGO.gi * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);
    this.consumptionDaysRealMGO.other = this.consumptionTotalMGO.other * 24 / ((this.totalTimePerActivityMGO.discharge + this.totalTimePerActivityMGO.otherActivity) || 1);

    this.consumptionDaysByContractMGO.mpal = this.selectUser.consumptionEquipmentME_MGO;
    this.consumptionDaysByContractMGO.aux = this.selectUser.consumptionEquipmentAE_MGO;
    this.consumptionDaysByContractMGO.boiler = this.selectUser.consumptionEquipmentBOILER_MGO;
    this.consumptionDaysByContractMGO.pp = this.selectUser.consumptionEquipmentPP_MGO;
    this.consumptionDaysByContractMGO.gi = this.selectUser.consumptionEquipmentIG_MGO;
    this.consumptionDaysByContractMGO.other = this.selectUser.consumptionEquipmentOther_MGO;

    this.consumptionDailyBalanceMGO.mpal = this.consumptionDaysByContractMGO.mpal ? this.consumptionDaysRealMGO.mpal - this.consumptionDaysByContractMGO.mpal : 0;
    this.consumptionDailyBalanceMGO.aux = this.consumptionDaysByContractMGO.aux ? this.consumptionDaysRealMGO.aux - this.consumptionDaysByContractMGO.aux : 0;
    this.consumptionDailyBalanceMGO.boiler = this.consumptionDaysByContractMGO.boiler ? this.consumptionDaysRealMGO.boiler - this.consumptionDaysByContractMGO.boiler : 0;
    this.consumptionDailyBalanceMGO.pp = this.consumptionDaysByContractMGO.pp ? this.consumptionDaysRealMGO.pp - this.consumptionDaysByContractMGO.pp : 0;
    this.consumptionDailyBalanceMGO.gi = this.consumptionDaysByContractMGO.gi ? this.consumptionDaysRealMGO.gi - this.consumptionDaysByContractMGO.gi : 0;
    this.consumptionDailyBalanceMGO.other = this.consumptionDaysByContractMGO.other ? this.consumptionDaysRealMGO.other - this.consumptionDaysByContractMGO.other : 0;


    //IFO
    this.consumptionDaysRealIFO.mpal = this.consumptionTotalIFO.mpal * 24 / ((this.totalTimePerActivityIFO.discharge + this.totalTimePerActivityIFO.otherActivity) || 1);
    this.consumptionDaysRealIFO.aux = this.consumptionTotalIFO.aux * 24 / ((this.totalTimePerActivityIFO.discharge + this.totalTimePerActivityIFO.otherActivity) || 1);
    this.consumptionDaysRealIFO.boiler = this.consumptionTotalIFO.boiler * 24 / ((this.totalTimePerActivityIFO.discharge + this.totalTimePerActivityIFO.otherActivity) || 1);
    this.consumptionDaysRealIFO.other = this.consumptionTotalIFO.other * 24 / ((this.totalTimePerActivityIFO.discharge + this.totalTimePerActivityIFO.otherActivity) || 1);

    this.consumptionDaysByContractIFO.mpal = this.selectUser.consumptionEquipmentME_IFO;
    this.consumptionDaysByContractIFO.aux = this.selectUser.consumptionEquipmentAE_IFO;
    this.consumptionDaysByContractIFO.boiler = this.selectUser.consumptionEquipmentBOILER_IFO;
    this.consumptionDaysByContractIFO.other = this.selectUser.consumptionEquipmentOther_IFO;

    this.consumptionDailyBalanceIFO.mpal = this.consumptionDaysByContractIFO.mpal ? this.consumptionDaysRealIFO.mpal - this.consumptionDaysByContractIFO.mpal : 0;
    this.consumptionDailyBalanceIFO.aux = this.consumptionDaysByContractIFO.aux ? this.consumptionDaysRealIFO.aux - this.consumptionDaysByContractIFO.aux : 0;
    this.consumptionDailyBalanceIFO.boiler = this.consumptionDaysByContractIFO.boiler ? this.consumptionDaysRealIFO.boiler - this.consumptionDaysByContractIFO.boiler : 0;
    this.consumptionDailyBalanceIFO.other = this.consumptionDaysByContractIFO.other ? this.consumptionDaysRealIFO.other - this.consumptionDaysByContractIFO.other : 0;

    // ActivityPerformance IFO
    // calculo de speed
    this.averageSpeedByActivityPerformedIFO.loading = this.totalDistanceMilesByActivityPerformedIFO.loading / (this.totalTimePerActivityIFO.loading || 1);
    this.averageSpeedByActivityPerformedIFO.discharge = this.totalDistanceMilesByActivityPerformedIFO.discharge / (this.totalTimePerActivityIFO.discharge || 1);
    this.averageSpeedByActivityPerformedIFO.ballast = this.totalDistanceMilesByActivityPerformedIFO.ballast / (this.totalTimePerActivityIFO.ballast || 1);
    this.averageSpeedByActivityPerformedIFO.laden = this.totalDistanceMilesByActivityPerformedIFO.laden / (this.totalTimePerActivityIFO.laden || 1);
    this.averageSpeedByActivityPerformedIFO.economical = this.totalDistanceMilesByActivityPerformedIFO.economical / (this.totalTimePerActivityIFO.economical || 1);
    this.averageSpeedByActivityPerformedIFO.anchor = this.totalDistanceMilesByActivityPerformedIFO.anchor / (this.totalTimePerActivityIFO.anchor || 1);
    this.averageSpeedByActivityPerformedIFO.maneuver = this.totalDistanceMilesByActivityPerformedIFO.maneuver / (this.totalTimePerActivityIFO.maneuver || 1);
    this.averageSpeedByActivityPerformedIFO.otherActivity = this.totalDistanceMilesByActivityPerformedIFO.otherActivity / (this.totalTimePerActivityIFO.otherActivity || 1);

    // calculo de speed
    this.averageSpeedCharterByActivityPerformedIFO.loading = 0;
    this.averageSpeedCharterByActivityPerformedIFO.discharge = 0;
    this.averageSpeedCharterByActivityPerformedIFO.ballast = this.selectUser.contractSpeedSailingBallastIFO;
    this.averageSpeedCharterByActivityPerformedIFO.laden = this.selectUser.contractSpeedSailingLadenIFO;
    this.averageSpeedCharterByActivityPerformedIFO.economical = this.selectUser.contractSpeedSailingEconomicalIFO;
    this.averageSpeedCharterByActivityPerformedIFO.anchor = 0;
    this.averageSpeedCharterByActivityPerformedIFO.maneuver = 0;
    this.averageSpeedCharterByActivityPerformedIFO.otherActivity = 0;

    this.dayliConsumptionByActivityPerformedIFO.loading = (this.voyageConsumptionByActivityPerformedIFO.loading * 24) / (this.totalTimePerActivityIFO.loading || 1);
    this.dayliConsumptionByActivityPerformedIFO.discharge = (this.voyageConsumptionByActivityPerformedIFO.discharge * 24) / (this.totalTimePerActivityIFO.discharge || 1);
    this.dayliConsumptionByActivityPerformedIFO.ballast = (this.voyageConsumptionByActivityPerformedIFO.ballast * 24) / (this.totalTimePerActivityIFO.ballast || 1);
    this.dayliConsumptionByActivityPerformedIFO.laden = (this.voyageConsumptionByActivityPerformedIFO.laden * 24) / (this.totalTimePerActivityIFO.laden || 1);
    this.dayliConsumptionByActivityPerformedIFO.economical = (this.voyageConsumptionByActivityPerformedIFO.economical * 24) / (this.totalTimePerActivityIFO.economical || 1);
    this.dayliConsumptionByActivityPerformedIFO.anchor = (this.voyageConsumptionByActivityPerformedIFO.anchor * 24) / (this.totalTimePerActivityIFO.anchor || 1);
    this.dayliConsumptionByActivityPerformedIFO.maneuver = (this.voyageConsumptionByActivityPerformedIFO.maneuver * 24) / (this.totalTimePerActivityIFO.maneuver || 1);
    this.dayliConsumptionByActivityPerformedIFO.otherActivity = (this.voyageConsumptionByActivityPerformedIFO.otherActivity * 24) / (this.totalTimePerActivityIFO.otherActivity || 1);

    this.dayliConsumptionCharterByActivityPerformedIFO.loading = this.selectUser.loadingConsumptionIFO;
    this.dayliConsumptionCharterByActivityPerformedIFO.discharge = this.selectUser.dischargeConsumptionIFO
    this.dayliConsumptionCharterByActivityPerformedIFO.ballast = this.selectUser.sailingBallastConsumptionIFO;
    this.dayliConsumptionCharterByActivityPerformedIFO.laden = this.selectUser.sailingLoadConsumptionIFO;
    this.dayliConsumptionCharterByActivityPerformedIFO.economical = this.selectUser.sailingEconomicConsumptionIFO;
    this.dayliConsumptionCharterByActivityPerformedIFO.anchor = this.selectUser.anchoredConsumptionIFO;
    this.dayliConsumptionCharterByActivityPerformedIFO.maneuver = this.selectUser.maneuverConsumptionIFO;
    this.dayliConsumptionCharterByActivityPerformedIFO.otherActivity = this.selectUser.otherConsumptionIFO;

    this.timePerNavigationCharterByActivityPerformedIFO.loading = this.averageSpeedCharterByActivityPerformedIFO.loading ? this.totalDistanceMilesByActivityPerformedIFO.loading / this.averageSpeedCharterByActivityPerformedIFO.loading : 0;
    this.timePerNavigationCharterByActivityPerformedIFO.discharge = this.averageSpeedCharterByActivityPerformedIFO.discharge ? this.totalDistanceMilesByActivityPerformedIFO.discharge / this.averageSpeedCharterByActivityPerformedIFO.discharge : 0;
    this.timePerNavigationCharterByActivityPerformedIFO.ballast = this.averageSpeedCharterByActivityPerformedIFO.ballast ? this.totalDistanceMilesByActivityPerformedIFO.ballast / this.averageSpeedCharterByActivityPerformedIFO.ballast : 0;
    this.timePerNavigationCharterByActivityPerformedIFO.laden = this.averageSpeedCharterByActivityPerformedIFO.laden ? this.totalDistanceMilesByActivityPerformedIFO.laden / this.averageSpeedCharterByActivityPerformedIFO.laden : 0;
    this.timePerNavigationCharterByActivityPerformedIFO.economical = this.averageSpeedCharterByActivityPerformedIFO.economical ? this.totalDistanceMilesByActivityPerformedIFO.economical / this.averageSpeedCharterByActivityPerformedIFO.economical : 0;
    this.timePerNavigationCharterByActivityPerformedIFO.anchor = this.averageSpeedCharterByActivityPerformedIFO.anchor ? this.totalDistanceMilesByActivityPerformedIFO.anchor / this.averageSpeedCharterByActivityPerformedIFO.anchor : 0;
    this.timePerNavigationCharterByActivityPerformedIFO.maneuver = this.averageSpeedCharterByActivityPerformedIFO.maneuver ? this.totalDistanceMilesByActivityPerformedIFO.maneuver / this.averageSpeedCharterByActivityPerformedIFO.maneuver : 0;
    this.timePerNavigationCharterByActivityPerformedIFO.otherActivity = this.averageSpeedCharterByActivityPerformedIFO.otherActivity ? this.totalDistanceMilesByActivityPerformedIFO.otherActivity / this.averageSpeedCharterByActivityPerformedIFO.otherActivity : 0;

    this.voyageConsumptionCharterByActivityPerformedIFO.loading = (this.dayliConsumptionCharterByActivityPerformedIFO.loading * (this.timePerNavigationCharterByActivityPerformedIFO.loading ? this.timePerNavigationCharterByActivityPerformedIFO.loading : this.totalTimePerActivityIFO.loading)) / 24;
    this.voyageConsumptionCharterByActivityPerformedIFO.discharge = (this.dayliConsumptionCharterByActivityPerformedIFO.discharge * (this.timePerNavigationCharterByActivityPerformedIFO.discharge ? this.timePerNavigationCharterByActivityPerformedIFO.discharge : this.totalTimePerActivityIFO.discharge)) / 24;
    this.voyageConsumptionCharterByActivityPerformedIFO.ballast = (this.dayliConsumptionCharterByActivityPerformedIFO.ballast * (this.timePerNavigationCharterByActivityPerformedIFO.ballast ? this.timePerNavigationCharterByActivityPerformedIFO.ballast : this.totalTimePerActivityIFO.ballast)) / 24;
    this.voyageConsumptionCharterByActivityPerformedIFO.laden = (this.dayliConsumptionCharterByActivityPerformedIFO.laden * (this.timePerNavigationCharterByActivityPerformedIFO.laden ? this.timePerNavigationCharterByActivityPerformedIFO.laden : this.totalTimePerActivityIFO.laden)) / 24;
    this.voyageConsumptionCharterByActivityPerformedIFO.economical = (this.dayliConsumptionCharterByActivityPerformedIFO.economical * (this.timePerNavigationCharterByActivityPerformedIFO.economical ? this.timePerNavigationCharterByActivityPerformedIFO.economical : this.totalTimePerActivityIFO.economical)) / 24;
    this.voyageConsumptionCharterByActivityPerformedIFO.anchor = (this.dayliConsumptionCharterByActivityPerformedIFO.anchor * (this.timePerNavigationCharterByActivityPerformedIFO.anchor ? this.timePerNavigationCharterByActivityPerformedIFO.anchor : this.totalTimePerActivityIFO.anchor)) / 24;
    this.voyageConsumptionCharterByActivityPerformedIFO.maneuver = (this.dayliConsumptionCharterByActivityPerformedIFO.maneuver * (this.timePerNavigationCharterByActivityPerformedIFO.maneuver ? this.timePerNavigationCharterByActivityPerformedIFO.maneuver : this.totalTimePerActivityIFO.maneuver)) / 24;
    this.voyageConsumptionCharterByActivityPerformedIFO.otherActivity = (this.dayliConsumptionCharterByActivityPerformedIFO.otherActivity * (this.timePerNavigationCharterByActivityPerformedIFO.otherActivity ? this.timePerNavigationCharterByActivityPerformedIFO.otherActivity : this.totalTimePerActivityIFO.otherActivity)) / 24;

    this.balanceConsumptionByActivityPerformedIFO.loading = this.voyageConsumptionCharterByActivityPerformedIFO.loading ? this.voyageConsumptionByActivityPerformedIFO.loading - this.voyageConsumptionCharterByActivityPerformedIFO.loading : 0;
    this.balanceConsumptionByActivityPerformedIFO.discharge = this.voyageConsumptionCharterByActivityPerformedIFO.discharge ? this.voyageConsumptionByActivityPerformedIFO.discharge - this.voyageConsumptionCharterByActivityPerformedIFO.discharge : 0;
    this.balanceConsumptionByActivityPerformedIFO.ballast = this.voyageConsumptionCharterByActivityPerformedIFO.ballast ? this.voyageConsumptionByActivityPerformedIFO.ballast - this.voyageConsumptionCharterByActivityPerformedIFO.ballast : 0;
    this.balanceConsumptionByActivityPerformedIFO.laden = this.voyageConsumptionCharterByActivityPerformedIFO.laden ? this.voyageConsumptionByActivityPerformedIFO.laden - this.voyageConsumptionCharterByActivityPerformedIFO.laden : 0;
    this.balanceConsumptionByActivityPerformedIFO.economical = this.voyageConsumptionCharterByActivityPerformedIFO.economical ? this.voyageConsumptionByActivityPerformedIFO.economical - this.voyageConsumptionCharterByActivityPerformedIFO.economical : 0;
    this.balanceConsumptionByActivityPerformedIFO.anchor = this.voyageConsumptionCharterByActivityPerformedIFO.anchor ? this.voyageConsumptionByActivityPerformedIFO.anchor - this.voyageConsumptionCharterByActivityPerformedIFO.anchor : 0;
    this.balanceConsumptionByActivityPerformedIFO.maneuver = this.voyageConsumptionCharterByActivityPerformedIFO.maneuver ? this.voyageConsumptionByActivityPerformedIFO.maneuver - this.voyageConsumptionCharterByActivityPerformedIFO.maneuver : 0;
    this.balanceConsumptionByActivityPerformedIFO.otherActivity = this.voyageConsumptionCharterByActivityPerformedIFO.otherActivity ? this.voyageConsumptionByActivityPerformedIFO.otherActivity - this.voyageConsumptionCharterByActivityPerformedIFO.otherActivity : 0;

    this.balanceTimeByActivityPerformedIFO.loading = this.timePerNavigationCharterByActivityPerformedIFO.loading ? this.totalTimePerActivityIFO.loading - this.timePerNavigationCharterByActivityPerformedIFO.loading : 0;
    this.balanceTimeByActivityPerformedIFO.discharge = this.timePerNavigationCharterByActivityPerformedIFO.discharge ? this.totalTimePerActivityIFO.discharge - this.timePerNavigationCharterByActivityPerformedIFO.discharge : 0;
    this.balanceTimeByActivityPerformedIFO.ballast = this.timePerNavigationCharterByActivityPerformedIFO.ballast ? this.totalTimePerActivityIFO.ballast - this.timePerNavigationCharterByActivityPerformedIFO.ballast : 0;
    this.balanceTimeByActivityPerformedIFO.laden = this.timePerNavigationCharterByActivityPerformedIFO.laden ? this.totalTimePerActivityIFO.laden - this.timePerNavigationCharterByActivityPerformedIFO.laden : 0;
    this.balanceTimeByActivityPerformedIFO.economical = this.timePerNavigationCharterByActivityPerformedIFO.economical ? this.totalTimePerActivityIFO.economical - this.timePerNavigationCharterByActivityPerformedIFO.economical : 0;
    this.balanceTimeByActivityPerformedIFO.anchor = this.timePerNavigationCharterByActivityPerformedIFO.anchor ? this.totalTimePerActivityIFO.anchor - this.timePerNavigationCharterByActivityPerformedIFO.anchor : 0;
    this.balanceTimeByActivityPerformedIFO.maneuver = this.timePerNavigationCharterByActivityPerformedIFO.maneuver ? this.totalTimePerActivityIFO.maneuver - this.timePerNavigationCharterByActivityPerformedIFO.maneuver : 0;
    this.balanceTimeByActivityPerformedIFO.otherActivity = this.timePerNavigationCharterByActivityPerformedIFO.otherActivity ? this.totalTimePerActivityIFO.otherActivity - this.timePerNavigationCharterByActivityPerformedIFO.otherActivity : 0;



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

    // calculo de speed
    this.averageSpeedCharterByActivityPerformedMGO.loading = 0;
    this.averageSpeedCharterByActivityPerformedMGO.discharge = 0;
    this.averageSpeedCharterByActivityPerformedMGO.ballast = this.selectUser.contractSpeedSailingBallastMGO;
    this.averageSpeedCharterByActivityPerformedMGO.laden = this.selectUser.contractSpeedSailingLadenMGO;
    this.averageSpeedCharterByActivityPerformedMGO.economical = this.selectUser.contractSpeedSailingEconomicalMGO;
    this.averageSpeedCharterByActivityPerformedMGO.anchor = 0;
    this.averageSpeedCharterByActivityPerformedMGO.maneuver = 0;
    this.averageSpeedCharterByActivityPerformedMGO.otherActivity = 0;

    this.dayliConsumptionByActivityPerformedMGO.loading = (this.voyageConsumptionByActivityPerformedMGO.loading * 24) / (this.totalTimePerActivityMGO.loading || 1);
    this.dayliConsumptionByActivityPerformedMGO.discharge = (this.voyageConsumptionByActivityPerformedMGO.discharge * 24) / (this.totalTimePerActivityMGO.discharge || 1);
    this.dayliConsumptionByActivityPerformedMGO.ballast = (this.voyageConsumptionByActivityPerformedMGO.ballast * 24) / (this.totalTimePerActivityMGO.ballast || 1);
    this.dayliConsumptionByActivityPerformedMGO.laden = (this.voyageConsumptionByActivityPerformedMGO.laden * 24) / (this.totalTimePerActivityMGO.laden || 1);
    this.dayliConsumptionByActivityPerformedMGO.economical = (this.voyageConsumptionByActivityPerformedMGO.economical * 24) / (this.totalTimePerActivityMGO.economical || 1);
    this.dayliConsumptionByActivityPerformedMGO.anchor = (this.voyageConsumptionByActivityPerformedMGO.anchor * 24) / (this.totalTimePerActivityMGO.anchor || 1);
    this.dayliConsumptionByActivityPerformedMGO.maneuver = (this.voyageConsumptionByActivityPerformedMGO.maneuver * 24) / (this.totalTimePerActivityMGO.maneuver || 1);
    this.dayliConsumptionByActivityPerformedMGO.otherActivity = (this.voyageConsumptionByActivityPerformedMGO.otherActivity * 24) / (this.totalTimePerActivityMGO.otherActivity || 1);


    this.dayliConsumptionCharterByActivityPerformedMGO.loading = this.selectUser.loadingConsumptionMGO;
    this.dayliConsumptionCharterByActivityPerformedMGO.discharge = this.selectUser.dischargeConsumptionMGO
    this.dayliConsumptionCharterByActivityPerformedMGO.ballast = this.selectUser.sailingBallastConsumptionMGO;
    this.dayliConsumptionCharterByActivityPerformedMGO.laden = this.selectUser.sailingLoadConsumptionMGO;
    this.dayliConsumptionCharterByActivityPerformedMGO.economical = this.selectUser.sailingEconomicConsumptionMGO;
    this.dayliConsumptionCharterByActivityPerformedMGO.anchor = this.selectUser.anchoredConsumptionMGO;
    this.dayliConsumptionCharterByActivityPerformedMGO.maneuver = this.selectUser.maneuverConsumptionMGO;
    this.dayliConsumptionCharterByActivityPerformedMGO.otherActivity = this.selectUser.otherConsumptionMGO;

    this.timePerNavigationCharterByActivityPerformedMGO.loading = this.averageSpeedCharterByActivityPerformedMGO.anchor ? this.totalDistanceMilesByActivityPerformedMGO.loading / this.averageSpeedCharterByActivityPerformedMGO.loading : 0;
    this.timePerNavigationCharterByActivityPerformedMGO.discharge = this.averageSpeedCharterByActivityPerformedMGO.discharge ? this.totalDistanceMilesByActivityPerformedMGO.discharge / this.averageSpeedCharterByActivityPerformedMGO.discharge : 0;
    this.timePerNavigationCharterByActivityPerformedMGO.ballast = this.averageSpeedCharterByActivityPerformedMGO.ballast ? this.totalDistanceMilesByActivityPerformedMGO.ballast / this.averageSpeedCharterByActivityPerformedMGO.ballast : 0;
    this.timePerNavigationCharterByActivityPerformedMGO.laden = this.averageSpeedCharterByActivityPerformedMGO.laden ? this.totalDistanceMilesByActivityPerformedMGO.laden / this.averageSpeedCharterByActivityPerformedMGO.laden : 0;
    this.timePerNavigationCharterByActivityPerformedMGO.economical = this.averageSpeedCharterByActivityPerformedMGO.economical ? this.totalDistanceMilesByActivityPerformedMGO.economical / this.averageSpeedCharterByActivityPerformedMGO.economical : 0;
    this.timePerNavigationCharterByActivityPerformedMGO.anchor = this.averageSpeedCharterByActivityPerformedMGO.anchor ? this.totalDistanceMilesByActivityPerformedMGO.anchor / this.averageSpeedCharterByActivityPerformedMGO.anchor : 0;
    this.timePerNavigationCharterByActivityPerformedMGO.maneuver = this.averageSpeedCharterByActivityPerformedMGO.maneuver ? this.totalDistanceMilesByActivityPerformedMGO.maneuver / this.averageSpeedCharterByActivityPerformedMGO.maneuver : 0;
    this.timePerNavigationCharterByActivityPerformedMGO.otherActivity = this.averageSpeedCharterByActivityPerformedMGO.otherActivity ? this.totalDistanceMilesByActivityPerformedMGO.otherActivity / this.averageSpeedCharterByActivityPerformedMGO.otherActivity : 0;

    this.voyageConsumptionCharterByActivityPerformedMGO.loading = (this.dayliConsumptionCharterByActivityPerformedMGO.loading * (this.timePerNavigationCharterByActivityPerformedMGO.loading ? this.timePerNavigationCharterByActivityPerformedMGO.loading : this.totalTimePerActivityMGO.loading)) / 24;
    this.voyageConsumptionCharterByActivityPerformedMGO.discharge = (this.dayliConsumptionCharterByActivityPerformedMGO.discharge * (this.timePerNavigationCharterByActivityPerformedMGO.discharge ? this.timePerNavigationCharterByActivityPerformedMGO.discharge : this.totalTimePerActivityMGO.discharge)) / 24;
    this.voyageConsumptionCharterByActivityPerformedMGO.ballast = (this.dayliConsumptionCharterByActivityPerformedMGO.ballast * (this.timePerNavigationCharterByActivityPerformedMGO.ballast ? this.timePerNavigationCharterByActivityPerformedMGO.ballast : this.totalTimePerActivityMGO.ballast)) / 24;
    this.voyageConsumptionCharterByActivityPerformedMGO.laden = (this.dayliConsumptionCharterByActivityPerformedMGO.laden * (this.timePerNavigationCharterByActivityPerformedMGO.laden ? this.timePerNavigationCharterByActivityPerformedMGO.laden : this.totalTimePerActivityMGO.laden)) / 24;
    this.voyageConsumptionCharterByActivityPerformedMGO.economical = (this.dayliConsumptionCharterByActivityPerformedMGO.economical * (this.timePerNavigationCharterByActivityPerformedMGO.economical ? this.timePerNavigationCharterByActivityPerformedMGO.economical : this.totalTimePerActivityMGO.economical)) / 24;
    this.voyageConsumptionCharterByActivityPerformedMGO.anchor = (this.dayliConsumptionCharterByActivityPerformedMGO.anchor * (this.timePerNavigationCharterByActivityPerformedMGO.anchor ? this.timePerNavigationCharterByActivityPerformedMGO.anchor : this.totalTimePerActivityMGO.anchor)) / 24;
    this.voyageConsumptionCharterByActivityPerformedMGO.maneuver = (this.dayliConsumptionCharterByActivityPerformedMGO.maneuver * (this.timePerNavigationCharterByActivityPerformedMGO.maneuver ? this.timePerNavigationCharterByActivityPerformedMGO.maneuver : this.totalTimePerActivityMGO.maneuver)) / 24;
    this.voyageConsumptionCharterByActivityPerformedMGO.otherActivity = (this.dayliConsumptionCharterByActivityPerformedMGO.otherActivity * (this.timePerNavigationCharterByActivityPerformedMGO.otherActivity ? this.timePerNavigationCharterByActivityPerformedMGO.otherActivity : this.totalTimePerActivityMGO.otherActivity)) / 24;

    this.balanceConsumptionByActivityPerformedMGO.loading = this.voyageConsumptionCharterByActivityPerformedMGO.loading ? this.voyageConsumptionByActivityPerformedMGO.loading - this.voyageConsumptionCharterByActivityPerformedMGO.loading : 0;
    this.balanceConsumptionByActivityPerformedMGO.discharge = this.voyageConsumptionCharterByActivityPerformedMGO.discharge ? this.voyageConsumptionByActivityPerformedMGO.discharge - this.voyageConsumptionCharterByActivityPerformedMGO.discharge : 0;
    this.balanceConsumptionByActivityPerformedMGO.ballast = this.voyageConsumptionCharterByActivityPerformedMGO.ballast ? this.voyageConsumptionByActivityPerformedMGO.ballast - this.voyageConsumptionCharterByActivityPerformedMGO.ballast : 0;
    this.balanceConsumptionByActivityPerformedMGO.laden = this.voyageConsumptionCharterByActivityPerformedMGO.laden ? this.voyageConsumptionByActivityPerformedMGO.laden - this.voyageConsumptionCharterByActivityPerformedMGO.laden : 0;
    this.balanceConsumptionByActivityPerformedMGO.economical = this.voyageConsumptionCharterByActivityPerformedMGO.economical ? this.voyageConsumptionByActivityPerformedMGO.economical - this.voyageConsumptionCharterByActivityPerformedMGO.economical : 0;
    this.balanceConsumptionByActivityPerformedMGO.anchor = this.voyageConsumptionCharterByActivityPerformedMGO.anchor ? this.voyageConsumptionByActivityPerformedMGO.anchor - this.voyageConsumptionCharterByActivityPerformedMGO.anchor : 0;
    this.balanceConsumptionByActivityPerformedMGO.maneuver = this.voyageConsumptionCharterByActivityPerformedMGO.maneuver ? this.voyageConsumptionByActivityPerformedMGO.maneuver - this.voyageConsumptionCharterByActivityPerformedMGO.maneuver : 0;
    this.balanceConsumptionByActivityPerformedMGO.otherActivity = this.voyageConsumptionCharterByActivityPerformedMGO.otherActivity ? this.voyageConsumptionByActivityPerformedMGO.otherActivity - this.voyageConsumptionCharterByActivityPerformedMGO.otherActivity : 0;

    this.balanceTimeByActivityPerformedMGO.loading = this.timePerNavigationCharterByActivityPerformedMGO.loading ? this.totalTimePerActivityMGO.loading - this.timePerNavigationCharterByActivityPerformedMGO.loading : 0;
    this.balanceTimeByActivityPerformedMGO.discharge = this.timePerNavigationCharterByActivityPerformedMGO.discharge ? this.totalTimePerActivityMGO.discharge - this.timePerNavigationCharterByActivityPerformedMGO.discharge : 0;
    this.balanceTimeByActivityPerformedMGO.ballast = this.timePerNavigationCharterByActivityPerformedMGO.ballast ? this.totalTimePerActivityMGO.ballast - this.timePerNavigationCharterByActivityPerformedMGO.ballast : 0;
    this.balanceTimeByActivityPerformedMGO.laden = this.timePerNavigationCharterByActivityPerformedMGO.laden ? this.totalTimePerActivityMGO.laden - this.timePerNavigationCharterByActivityPerformedMGO.laden : 0;
    this.balanceTimeByActivityPerformedMGO.economical = this.timePerNavigationCharterByActivityPerformedMGO.economical ? this.totalTimePerActivityMGO.economical - this.timePerNavigationCharterByActivityPerformedMGO.economical : 0;
    this.balanceTimeByActivityPerformedMGO.anchor = this.timePerNavigationCharterByActivityPerformedMGO.anchor ? this.totalTimePerActivityMGO.anchor - this.timePerNavigationCharterByActivityPerformedMGO.anchor : 0;
    this.balanceTimeByActivityPerformedMGO.maneuver = this.timePerNavigationCharterByActivityPerformedMGO.maneuver ? this.totalTimePerActivityMGO.maneuver - this.timePerNavigationCharterByActivityPerformedMGO.maneuver : 0;
    this.balanceTimeByActivityPerformedMGO.otherActivity = this.timePerNavigationCharterByActivityPerformedMGO.otherActivity ? this.totalTimePerActivityMGO.otherActivity - this.timePerNavigationCharterByActivityPerformedMGO.otherActivity : 0;

    console.log(' FIN Generate()');

  }

  // Configuracaion Axes si son menos de 60 registro que muestre los dias caso contrario que muestre los meses
  // esta configuracion depente del selectSummary
  public ConfigScales(dataReport: Date[], isSpeed?: boolean, lineaMax?: number) {

    // Variable que retornara la configuracion
    let config: any = {};

    if (this.selectSummaryBy === 'VOYAGES') {

      config = {
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
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
          },
          type: 'category',
          position: 'bottom',
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }]
      };

    } else if (this.selectSummaryBy === 'PORTS') {

      config = {
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
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
          },
          type: 'category',
          position: 'bottom',
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }]
      };

    } else if (this.selectSummaryBy === 'MONTHS') {

      config = {
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
          type: 'time',
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
          },
          time: {
            displayFormats: {
              day: 'MM/YY'
            },
            tooltipFormat: 'MM/DD/YY',
            unit: 'month',
          },
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }]
      };

    } else if (this.selectSummaryBy === 'DAYS') {

      config = {
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
          type: 'time',
          ticks: {
            beginAtZero: true,
            fontColor: '#b8d1ff',
          },
          time:
          {
            displayFormats: {
              day: 'MM/DD'
            },
            tooltipFormat: 'MM/DD',
            unit: 'day',
          },
          gridLines: {
            display: true,
            color: '#b8d1ff'
          },
        }]
      };

    } else {

      /*   config = {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: '#b8d1ff',
            },
            gridLines: {
              display: true,
              color: '#b8d1ff'
            },
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              fontColor: '#b8d1ff',
            },
            type: 'time',
            position: 'bottom',
            time: {
              displayFormats: {
                day: 'MM/DD'
              },
              tooltipFormat: 'MM/DD',
              unit: 'day',
            },
            gridLines: {
              display: true,
              color: '#b8d1ff'
            },
          }]
        };
  
  
        if (isSpeed) {
  
          if (lineaMax > 0) {
            config.yAxes = [{
              ticks: {
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                max: lineaMax,
                fontColor: '#b8d1ff',
              },
              gridLines: {
                display: true,
                color: '#b8d1ff'
              },
            }];
  
          }
        }
  
        // Segun la cantidad de datos, estara personalizada.
        if (dataReport.length < 60) {
  
          config.xAxes[0].time = {
            displayFormats: {
              day: 'MM/DD'
            },
            tooltipFormat: 'MM/DD',
            unit: 'day',
          };
  
        } else {
  
          config.xAxes[0].time = {
            displayFormats: {
              day: 'MM/YY'
            },
            tooltipFormat: 'MM/DD/YY',
            unit: 'month',
          };
  
        } */

    }

    return config;
  }

  public GenerateDashboardBySumary(setDate: boolean) {
    console.log('GenerateDashboardBySumary()');

    let filter = this.selectSummaryBy;

    if (filter === 'VOYAGES') {
      this.GenerateDashBoardByVoyages(setDate);
    } else if (filter === 'PORTS') {
      this.GenerateDashBoardByPorts(setDate);
    } else if (filter === 'MONTHS') {
      this.GenerateDashBoardByMonths(setDate);
    } else if (filter === 'DAYS') {
      this.GenerateDashBoardByDays(setDate);
    }

    // Actualizamos los cuadros del dashboard.
    this.UpdateLineIFO();
    this.UpdateLineMGO();
    this.UpdateLineSPEED();

    console.log('GenerateDashboardBySumary() FINNNNNNNNNNN');

  }

  // Generar data para el dashboard desde el arreglo de reportes
  public GenerateDashBoardByVoyages(setDate: boolean) {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];

    this.configLineaIFO.lineaMax = 0;
    this.configLineaMGO.lineaMax = 0;
    this.configLineaSPEED.lineaMax = 0;

    let startDate;
    let endDate;
    this.generateVoyages.forEach(
      (voyage, iv) => {

        let txtX = 'V' + voyage.voyageNumber + ' Y' + ('' + voyage.year).slice(-2);
        this.xLabelReport.push(txtX);

        if (voyage.totalIFO > 0) {
          this.dataIFO.push(
            { x: txtX, y: voyage.totalIFO, ubication: [iv] }
          );
        }

        if (voyage.totalMGO > 0) {
          this.dataMGO.push(
            { x: txtX, y: voyage.totalMGO, ubication: [iv] }
          );
        }

        let speed = mathRound(voyage.totalSpeed.distance / (voyage.totalSpeed.steamingTime || 1), 2);
        if (speed > 0) {
          this.dataSPEED.push(
            { x: txtX, y: speed, ubication: [iv] }
          );
        }

        if (voyage.totalIFO > this.configLineaIFO.lineaMax) {
          this.configLineaIFO.lineaMax = voyage.totalIFO;
        }
        if (voyage.totalMGO > this.configLineaMGO.lineaMax) {
          this.configLineaMGO.lineaMax = voyage.totalMGO;
        }

        if (speed > this.configLineaSPEED.lineaMax) {
          this.configLineaSPEED.lineaMax = speed;
        }


        startDate = ComparePreviousDates(startDate, voyage.dayStart)
        endDate = CompareAfterDates(endDate, voyage.dayEnd)

      }

    );


    if (setDate) {
      this.startDate = startDate;
      this.endDate = endDate;
    }

  }
  // Generar data para el dashboard desde el arreglo de reportes
  public GenerateDashBoardByPorts(setDate: boolean) {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];

    let startDate;
    let endDate;


    this.configLineaIFO.lineaMax = 0;
    this.configLineaMGO.lineaMax = 0;
    this.configLineaSPEED.lineaMax = 0;

    this.generateVoyages.forEach(
      (voyage: Voyage, iV) => {

        voyage.ports.forEach(
          (port, iP) => {
            let txtX = 'V' + voyage.voyageNumber + ' ' + 'P' + port.portNumber + ' Y' + ('' + voyage.year).slice(-2);

            this.xLabelReport.push(txtX);

            if (port.robIfo > 0) {
              this.dataIFO.push(
                { x: txtX, y: port.robIfo, ubication: [iV, iP] }
              );
            }
            if (port.robMgo > 0) {
              this.dataMGO.push(
                { x: txtX, y: port.robMgo, ubication: [iV, iP] }
              );
            }

            let speed = mathRound(port.speed.distance / (port.speed.steamingTime || 1), 2);
            if (speed > 0) {
              this.dataSPEED.push(
                { x: txtX, y: speed, ubication: [iV, iP] }
              );
            }


            if (port.robIfo > this.configLineaIFO.lineaMax) {
              this.configLineaIFO.lineaMax = port.robIfo;
            }
            if (port.robMgo > this.configLineaMGO.lineaMax) {
              this.configLineaMGO.lineaMax = port.robMgo;
            }

            if (speed > this.configLineaSPEED.lineaMax) {
              this.configLineaSPEED.lineaMax = speed;
            }

            startDate = ComparePreviousDates(startDate, port.dayStart)
            endDate = CompareAfterDates(endDate, port.dayEnd)
          }
        )



      }

    );

    if (setDate) {
      this.startDate = startDate;
      this.endDate = endDate;
    }

  }

  public GenerateDashBoardByMonths(setDate: boolean) {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];


    this.configLineaIFO.lineaMax = 0;
    this.configLineaMGO.lineaMax = 0;
    this.configLineaSPEED.lineaMax = 0;

    let startDate;
    let endDate;

    this.generateVoyages.forEach(
      (voyage, iV) => {

        voyage.ports.forEach(
          (port, iP) => {

            port.dailyReports.forEach(
              (report, iR) => {

                let day = report.date;


                let resultSearch = this.xLabelReport.find(
                  (xDay, iL) => {

                    // Verificamos la fecha actual.

                    if (GetMonthYearFromDate(day) === GetMonthYearFromDate(xDay)) {
                      /* this.dataIFO[iL].x = day;
                      this.dataMGO[iL].x = day;
                      this.dataSPEED[iL].x = day;

 */
                      let speedI: Speed = this.dataSPEED[iL].speed;
                      speedI.add(report.distance, report.steamingTime);

                      this.dataIFO[iL].speed = speedI;
                      this.dataMGO[iL].speed = speedI;
                      this.dataSPEED[iL].speed = speedI;

                      // Actualizamos el vlaor por la posicion.
                      this.dataIFO[iL].y = this.dataIFO[iL].y + this.SumaIfo(report)
                      this.dataMGO[iL].y = this.dataMGO[iL].y + this.SumaMgo(report)

                      let ySpeed = mathRound(speedI.distance / speedI.steamingTime, 2)
                      this.dataSPEED[iL].y = ySpeed;



                      if (this.dataIFO[iL].y > this.configLineaIFO.lineaMax) {
                        this.configLineaIFO.lineaMax = this.dataIFO[iL].y;
                      }
                      if (this.dataMGO[iL].y > this.configLineaMGO.lineaMax) {
                        this.configLineaMGO.lineaMax = this.dataMGO[iL].y;
                      }
                      if (ySpeed > this.configLineaSPEED.lineaMax) {
                        this.configLineaSPEED.lineaMax = ySpeed;
                      }


                      startDate = ComparePreviousDates(startDate, report.date)
                      endDate = CompareAfterDates(endDate, report.date)


                      return true;
                    }

                    return false;
                  }

                );


                if (!resultSearch) {

                  // console.log('GenerateDataForDashboard()');

                  // agregamos la fecha a nuestro arreglo.
                  this.xLabelReport.push(day);

                  let newSpeed = new Speed(report.distance, report.steamingTime);
                  this.dataIFO.push(
                    { x: day, y: this.SumaIfo(report), speed: newSpeed }
                  );

                  this.dataMGO.push(
                    { x: day, y: this.SumaMgo(report), speed: newSpeed }
                  );

                  let ySpeed = mathRound(newSpeed.distance / newSpeed.steamingTime, 2)
                  this.dataSPEED.push(
                    { x: day, y: ySpeed, speed: newSpeed }
                  );



                  if (this.SumaIfo(report) > this.configLineaIFO.lineaMax) {
                    this.configLineaIFO.lineaMax = this.SumaIfo(report);
                  }
                  if (this.SumaMgo(report) > this.configLineaMGO.lineaMax) {
                    this.configLineaMGO.lineaMax = this.SumaMgo(report);
                  }

                  if (ySpeed > this.configLineaSPEED.lineaMax) {
                    this.configLineaSPEED.lineaMax = ySpeed;
                  }



                  startDate = ComparePreviousDates(startDate, report.date)
                  endDate = CompareAfterDates(endDate, report.date)

                }



              }
            );

          }
        )



      }

    );

    if (setDate) {

      this.startDate = startDate;
      this.endDate = endDate;
    }

  }

  public GenerateDashBoardByDays(setDate: boolean) {

    this.xLabelReport = [];
    this.dataIFO = [];
    this.dataMGO = [];
    this.dataSPEED = [];


    this.configLineaIFO.lineaMax = 0;
    this.configLineaMGO.lineaMax = 0;
    this.configLineaSPEED.lineaMax = 0;

    let startDate;
    let endDate;

    this.generateVoyages.forEach(
      (voyage, iV) => {

        voyage.ports.forEach(
          (port, iP) => {

            port.dailyReports.forEach(
              (report, iR) => {
                let day = report.date;


                let resultSearch = this.xLabelReport.find(
                  (xDay, iL) => {

                    // Verificamos la fecha actual.

                    if (FormatDate(day) === FormatDate(xDay)) {

                      let speedI: Speed = this.dataSPEED[iL].speed;
                      speedI.add(report.distance, report.steamingTime);

                      this.dataIFO[iL].speed = speedI;
                      this.dataMGO[iL].speed = speedI;
                      this.dataSPEED[iL].speed = speedI;

                      // Actualizamos el vlaor por la posicion.
                      this.dataIFO[iL].y = this.dataIFO[iL].y + this.SumaIfo(report)
                      this.dataMGO[iL].y = this.dataMGO[iL].y + this.SumaMgo(report)
                      let ySpeed = mathRound(speedI.distance / speedI.steamingTime, 2)
                      this.dataSPEED[iL].y = ySpeed;



                      let dataExtra = this.dataIFO[iL].dataExtra;
                      dataExtra.push(report);

                      this.dataIFO[iL].dataExtra = dataExtra;
                      this.dataMGO[iL].dataExtra = dataExtra;
                      this.dataSPEED[iL].dataExtra = dataExtra;

                      if (this.dataIFO[iL].y > this.configLineaIFO.lineaMax) {
                        this.configLineaIFO.lineaMax = this.dataIFO[iL].y;
                      }
                      if (this.dataMGO[iL].y > this.configLineaMGO.lineaMax) {
                        this.configLineaMGO.lineaMax = this.dataMGO[iL].y;
                      }
                      if (ySpeed > this.configLineaSPEED.lineaMax) {
                        this.configLineaSPEED.lineaMax = ySpeed;
                      }


                      startDate = ComparePreviousDates(startDate, report.date)
                      endDate = CompareAfterDates(endDate, report.date)


                      return true;
                    }

                    return false;
                  }

                );


                if (!resultSearch) {

                  // console.log('GenerateDataForDashboard()');

                  // agregamos la fecha a nuestro arreglo.
                  this.xLabelReport.push(day);

                  let newSpeed = new Speed(report.distance, report.steamingTime);
                  let dataExtra = [];

                  dataExtra.push(report)

                  this.dataIFO.push(
                    { x: day, y: this.SumaIfo(report), speed: newSpeed, dataExtra: dataExtra, ubication: [iV, iP, iR], identified: [voyage.id, port.id, report.id] }
                  );
                  this.dataMGO.push(
                    { x: day, y: this.SumaMgo(report), speed: newSpeed, dataExtra: dataExtra, ubication: [iV, iP, iR], identified: [voyage.id, port.id, report.id] }
                  );
                  let ySpeed = mathRound(newSpeed.distance / newSpeed.steamingTime, 2)
                  this.dataSPEED.push(
                    { x: day, y: ySpeed, speed: newSpeed, dataExtra: dataExtra, ubication: [iV, iP, iR], identified: [voyage.id, port.id, report.id] }
                  );

                  if (this.SumaIfo(report) > this.configLineaIFO.lineaMax) {
                    this.configLineaIFO.lineaMax = this.SumaIfo(report);
                  }
                  if (this.SumaMgo(report) > this.configLineaMGO.lineaMax) {
                    this.configLineaMGO.lineaMax = this.SumaMgo(report);
                  }
                  if (ySpeed > this.configLineaSPEED.lineaMax) {
                    this.configLineaSPEED.lineaMax = ySpeed;
                  }

                  startDate = ComparePreviousDates(startDate, report.date)
                  endDate = CompareAfterDates(endDate, report.date)

                }


              }
            );

          }
        )



      }

    );

    if (setDate) {
      this.startDate = startDate;
      this.endDate = endDate;
    }

  }


  // Generar linea en los canvas.
  public GenetareLineIFO(): boolean {
    // Test
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
        onClick: (event, legendItem) => { // REVISAR ESTO, Aqui se ejecuta la data que se muestra al dar click a los puntos dentro del chart.
          // Verifico que al click que le demos exista un Item.
          if (legendItem && legendItem.length) {

            // Obtenemos la ubicacion.
            let index = legendItem[0]._index;

            // Revisar esto. 
            if (this.selectSummaryBy === 'VOYAGES') {

              let ubication = this.dataIFO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]

              this.selectVoyageId = voyage.id;

              let newVoyage = [];
              newVoyage.push(voyage);

              this.generateVoyages = newVoyage;
              this.selectSummaryBy = 'DAYS'
              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary(true)
            } else if (this.selectSummaryBy === 'PORTS') {

              let ubication = this.dataIFO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]
              let port = this.generateVoyages[ubication[0]].ports[ubication[1]]

              let newVoyage = [voyage];
              newVoyage[0].ports = [port];

              this.generateVoyages = newVoyage;
              this.selectSummaryBy = 'DAYS';

              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary(true)
            } else if (this.selectSummaryBy === 'MONTHS') {

              let ubication = this.dataIFO[index].x;

              let result = FisrtOldDayFromDate(ubication);

              this.startDate = new Date(result.start);

              this.endDate = new Date(result.end);

              this.selectSummaryBy = 'DAYS';
              this.GenerateReporteByDate();

            } else if (this.selectSummaryBy === 'DAYS') {


              let identified = this.dataMGO[index].identified;


              let voyage = this.getVoyages.find(voyage => voyage.id === identified[0]);
              let portId = identified[1];
              let reportId = identified[2];


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
          onHover: function (e) {
            var point = this.getElementAtEvent(e);
            if (point.length) e.target.style.cursor = 'pointer';
            else e.target.style.cursor = 'default';
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

  public GenetareLineMGO(): boolean {
    console.log('GenetareLineMGO()');


    this.configLineaMGO = {
      type: 'line',
      data: {
        labels: this.xLabelReport,
        datasets: [{
          label: this.languageService.GetMessage(this.translateCategory, 'TITLE_COMSUMPTION_MGO'),
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: this.dataMGO,
          fill: false,
        }]
      },
      options: {
        onClick: (event, legendItem) => {

          if (legendItem && legendItem.length) {
            let index = legendItem[0]._index;

            if (this.selectSummaryBy === 'VOYAGES') {

              let ubication = this.dataMGO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]

              this.selectVoyageId = voyage.id;

              let newVoyage = [];
              newVoyage.push(voyage);

              this.generateVoyages = newVoyage;
              this.selectSummaryBy = 'DAYS'
              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary(true)
            } else if (this.selectSummaryBy === 'PORTS') {

              let ubication = this.dataMGO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]
              let port = this.generateVoyages[ubication[0]].ports[ubication[1]]

              let newVoyage = [voyage];
              newVoyage[0].ports = [port];

              this.generateVoyages = newVoyage;
              this.selectSummaryBy = 'DAYS'

              this.GenerateDataByFilter(newVoyage);
              this.GenerateDashboardBySumary(true)
            } else if (this.selectSummaryBy === 'MONTHS') {

              let date = this.dataMGO[index].x;

              let result = FisrtOldDayFromDate(date);

              this.startDate = new Date(result.start);

              this.endDate = new Date(result.end);

              this.selectSummaryBy = 'DAYS';
              this.GenerateReporteByDate();

            } else if (this.selectSummaryBy === 'DAYS') {

              let identified = this.dataMGO[index].identified;

              let voyage = this.getVoyages.find(voyage => voyage.id === identified[0]);

              let portId = identified[1];
              let reportId = identified[2];

              this.OpenDialogReport(voyage, portId, reportId, 'MGO');
            }
          }
        },
        lines: [
          /*  {
             type: 'horizontal',
             y: 13,
             color: 'red',
             label: 'max'
           },
           {
             type: 'horizontal',
             y: 11,
             color: '#343D46',
             label: 'min'
           } */
        ],
        legend: {
          display: true,
          labels: {
            fontColor: 'rgb(255,255,255)',
            fontStyle: 'bold',
          }
        },
        // Habilitamos la opcion para que sea responsive
        maintainAspectRatio: false,
        tooltips: {
          // Establece qué elementos aparecen en la información sobre herramientas.
          mode: 'nearest',
          // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
          intersect: false,
          callbacks: {
            title: (tooltipItem, data) => {
              console.log('---------------');
              console.log(tooltipItem);
              console.log(data);
              console.log('---------------');
              return tooltipItem[0].xLabel;
            },
            /*             labelColor: (tooltipItem, data) => {
                          return {
                            borderColor: 'red',
                            backgroundColor: 'blue',
                          };
                        }, */
            afterBody: (tooltipItem, data) => {
              let index = tooltipItem[0].index;

              let reportDetail: Voyage[] = data.datasets[0].reportDetail;

              return [];

            },
            footer: (tooltipItem, data) => {
              let index = tooltipItem[0].index;
              let reportDetail: Voyage[] = data.datasets[0].reportDetail;

              let resultado = '';


              return [
                'Voyage N° : ' + reportDetail[index].voyageNumber,
                'Consume :' + reportDetail[index].totalMGO,
              ];

            },
          }

        },
        scales: null,
        hover: {
          onHover: function (e) {
            var point = this.getElementAtEvent(e);
            if (point.length) e.target.style.cursor = 'pointer';
            else e.target.style.cursor = 'default';
          }
        }
      },
      lineaMax: 0
    };

    this.configLineaMGO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaMGO.lineaMax, 0) + 2);

    let canvaLineMGO: any = document.getElementById('lineMGO');
    let ctxLineMGO = canvaLineMGO.getContext('2d');

    this.chartLineMGO = new Chart(ctxLineMGO, this.configLineaMGO);


    return false;
  }

  public GenetareLineSPEED(): boolean {
    // Test
    console.log('GenetareLineSPEED()');

    this.configLineaSPEED = {
      type: 'line',
      data: {
        labels: this.xLabelReport,
        datasets: [{
          label: 'AVERAGE SPEED',
          backgroundColor: 'rgb(255,205,6)',
          borderColor: 'rgb(255,205,6)',
          data: this.dataSPEED,
          fill: false,
        }],
        moreData: [['ROBIFO', 'MPL']]
      },

      options: {
        onClick: (event, legendItem) => {

          if (legendItem && legendItem.length) {
            let index = legendItem[0]._index;

            if (this.selectSummaryBy === 'VOYAGES') {

              let ubication = this.dataSPEED[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]

              this.selectVoyageId = voyage.id;

              let newVoyage = [];
              newVoyage.push(voyage);

              this.generateVoyages = newVoyage;
              this.selectSummaryBy = 'DAYS'
              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary(true)
            } else if (this.selectSummaryBy === 'PORTS') {

              let ubication = this.dataMGO[index].ubication;
              let voyage = this.generateVoyages[ubication[0]]
              let port = this.generateVoyages[ubication[0]].ports[ubication[1]]

              let newVoyage = [voyage];
              newVoyage[0].ports = [port];

              this.generateVoyages = newVoyage;
              this.selectSummaryBy = 'DAYS'
              this.GenerateDataByFilter(newVoyage);

              this.GenerateDashboardBySumary(true)
            }
            else if (this.selectSummaryBy === 'MONTHS') {

              let ubication = this.dataSPEED[index].x;

              let result = FisrtOldDayFromDate(ubication);

              this.startDate = new Date(result.start);

              this.endDate = new Date(result.end);

              this.selectSummaryBy = 'DAYS';
              this.GenerateReporteByDate();

            } else if (this.selectSummaryBy === 'DAYS') {

              let identified = this.dataMGO[index].identified;

              let voyage = this.getVoyages.find(voyage => voyage.id === identified[0]);

              let portId = identified[1]
              let reportId = identified[2]


              this.OpenDialogReport(voyage, portId, reportId, 'SPEED');
            }
          }
        },
        lines: [
          /*     {
                type: 'horizontal',
                y: 8,
                color: 'green',
                label: 'avg'
              } */
        ],
        legend: {
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
        tooltips: {
          // Establece qué elementos aparecen en la información sobre herramientas.
          mode: 'nearest',
          // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
          intersect: false,


          callbacks: {
            title: (tooltipItem, data) => {
              console.log('---------------');
              console.log(tooltipItem);
              console.log(data);
              console.log('---------------');
              return tooltipItem[0].xLabel;
            },
            label: (tooltipItem, data) => {
              return '';
            },
            labelColor: (tooltipItem, data) => {
              return {
                borderColor: 'red',
                backgroundColor: 'blue',
              };
            },
            afterBody: (tooltipItem, data) => {
              let index = tooltipItem[0].index;

              let reportDetail: Voyage[] = data.datasets[0].reportDetail;

              let resultado = '';

              /*
              return [
                'Departure : ' + reportDetail[index].departurePort,
                'Time : ' + reportDetail[index].duration.numero,
                'Activity : ' + reportDetail[index].activityPerformed,
                'Comentario : ' + resultado,
              ]; */

              let voyage = reportDetail[index];
              return [
                'Speed: ' + mathRound(voyage.totalSpeed.distance / voyage.totalSpeed.steamingTime, 1),
                'Distance : ' + mathRound(voyage.totalSpeed.distance, 1),
                'Time : ' + mathRound(voyage.totalSpeed.steamingTime, 1)
              ];
            },
            footer: (tooltipItem, data) => {

              return [];

            },
          },

        },
        scales: null,
        hover: {
          onHover: function (e) {
            var point = this.getElementAtEvent(e);
            if (point.length) e.target.style.cursor = 'pointer';
            else e.target.style.cursor = 'default';
          }
        }
      },
      lineaMax: 0
    };
    this.configLineaSPEED.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaSPEED.lineaMax, 0) + 2);

    let canvaLineSPEED: any = document.getElementById('lineSPEED');
    let ctxLineSPEED: any = canvaLineSPEED.getContext('2d');

    this.chartLineSPEED = new Chart(ctxLineSPEED, this.configLineaSPEED);

    return false;
  }

  public UpdateLineMGO(): boolean {

    // Test
    console.log('UpdateLineMGO');

    // Actualizamos los labels
    this.configLineaMGO.data.labels = this.xLabelReport;
    this.configLineaMGO.data.datasets[0].data = this.dataMGO;

    // Vaciamos la configuracion de las lines MGO
    this.configLineaMGO.options.lines = [];

    if (this.selectSummaryBy === 'DAYS') {

      if (this.selectUser.isConsumptionMGO) {
        if (this.selectUser.maxMGOConsumption > 0) {
          this.configLineaMGO.options.lines.push({
            type: 'horizontal',
            y: this.selectUser.maxMGOConsumption,
            color: 'red',
            label: ''
          });
        }

        if (this.selectUser.minMGOConsumption > 0) {
          this.configLineaMGO.options.lines.push({
            type: 'horizontal',
            y: this.selectUser.minMGOConsumption,
            color: '#39FF14',
            label: ''
          });
        }
      }

    }


    this.configLineaMGO.options.tooltips = {

      // Establece qué elementos aparecen en la información sobre herramientas.
      mode: 'nearest',
      // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
      intersect: false,
      callbacks: {
        title: (tooltipItem, data) => {
          let index = tooltipItem[0].index;

          let result = "";

          if (this.selectSummaryBy === 'VOYAGES') {

            let ubication = data.datasets[0].data[index].ubication;
            let viaje = this.generateVoyages[ubication[0]]

            result = 'V' + viaje.voyageNumber + ' Y' + ('' + viaje.year).slice(-2);

          } else if (this.selectSummaryBy === 'PORTS') {

            let ubication = data.datasets[0].data[index].ubication;

            let viaje = this.generateVoyages[ubication[0]];
            let port = viaje.ports[ubication[1]];

            result = 'V' + viaje.voyageNumber + ' P' + port.portNumber + ' Y' + ('' + viaje.year).slice(-2);

          } else if (this.selectSummaryBy === 'MONTHS') {

            result = tooltipItem[0].xLabel;
            result = TextMonthYear(result);
          } else if (this.selectSummaryBy === 'DAYS') {

            result = tooltipItem[0].xLabel;
            result = TextMonthDayYear(result)
          }

          return result;
        },
        label: (tooltipItem, data) => {

          let typeConsumption = this.selectUser.isConsumptionMGO ? 'MGO' : 'MGO';

          let result = 'Consumption ' + typeConsumption + ' : ' + mathRound(tooltipItem.value, 2);

          return result;
        },
        footer: (tooltipItem, data) => {
          let index = tooltipItem[0].index;

          let result = [];
          if (this.selectSummaryBy === 'VOYAGES') {

            let ubication = data.datasets[0].data[index].ubication;

            let voyage = this.generateVoyages[ubication[0]];
            result = [
              'T. Ports : ' + voyage.totalPort,
              'Distance : ' + mathRound(voyage.totalSpeed.distance, 2),
              'Time : ' + mathRound(voyage.totalSpeed.steamingTime, 2),
              'Speed : ' + mathRound(voyage.totalSpeed.distance / voyage.totalSpeed.steamingTime, 2),
            ];
          } else if (this.selectSummaryBy === 'PORTS') {

            let ubication = data.datasets[0].data[index].ubication;

            let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
            result = [
              'Departure : ' + port.departurePort,
              'Arrival : ' + port.arrivalPort,
              'Distance : ' + mathRound(port.speed.distance, 2),
              'Time : ' + mathRound(port.speed.steamingTime, 2),
              'Speed : ' + mathRound(port.speed.distance / port.speed.steamingTime, 2),
            ];
          } else if (this.selectSummaryBy === 'MONTHS') {


            let speed = data.datasets[0].data[index].speed;

            //let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
            result = [
              'Distance : ' + mathRound(speed.distance, 2),
              'Time : ' + mathRound(speed.steamingTime, 2),
              'Speed : ' + mathRound(speed.distance / speed.steamingTime, 2),
            ];
          }
          else if (this.selectSummaryBy === 'DAYS') {


            let dataExtra = data.datasets[0].data[index].dataExtra;

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
              'Distance : ' + mathRound(speed.distance, 2),
              'Time : ' + mathRound(speed.steamingTime, 2),
              'Speed : ' + mathRound(speed.distance / speed.steamingTime, 2),
              'T. Reports : ' + totalReport,
              'Activities : ' + activities,
              'Observations : ' + observations
            ];

          }


          return result;

        },
      },
    }


    if (this.configLineaMGO.lineaMax < this.selectUser.maxMGOConsumption) {
      this.configLineaMGO.lineaMax = this.selectUser.maxMGOConsumption;
    }

    this.configLineaMGO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaMGO.lineaMax, 0) + 2);

    this.chartLineMGO.update();

    return false;
  }

  public UpdateLineIFO(): boolean {
    // Testing
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

      this.configLineaIFO.options.tooltips = { // Revisar la configuracion del Tooltip, podriamos hacerlo mas pequeño.

        // Establece qué elementos aparecen en la información sobre herramientas.
        mode: 'nearest',
        // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
        intersect: false,
        callbacks: {
          title: (tooltipItem, data) => {

            let index = tooltipItem[0].index;

            let result = "";

            if (this.selectSummaryBy === 'VOYAGES') {

              let ubication = data.datasets[0].data[index].ubication;
              let viaje = this.generateVoyages[ubication[0]]

              result = 'V' + viaje.voyageNumber + ' Y' + ('' + viaje.year).slice(-2);

            } else if (this.selectSummaryBy === 'PORTS') {

              let ubication = data.datasets[0].data[index].ubication;

              let viaje = this.generateVoyages[ubication[0]];
              let port = viaje.ports[ubication[1]];

              result = 'V' + viaje.voyageNumber + ' P' + port.portNumber + ' Y' + ('' + viaje.year).slice(-2);

            } else if (this.selectSummaryBy === 'MONTHS') {

              result = tooltipItem[0].xLabel;
              result = TextMonthYear(result);
            } else if (this.selectSummaryBy === 'DAYS') {

              result = tooltipItem[0].xLabel;
              result = TextMonthDayYear(result)
            }

            return result;
          },
          label: (tooltipItem, data) => {

            let typeConsumption = this.selectUser.isConsumptionIFO ? 'IFO' : this.selectUser.isConsumptionLSFO ? 'LSFO' : this.selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';
            return 'Consumption ' + typeConsumption + ' : ' + mathRound(tooltipItem.value, 2);
          },
          footer: (tooltipItem, data) => {
            let index = tooltipItem[0].index;

            let result = [];
            if (this.selectSummaryBy === 'VOYAGES') {

              let ubication = data.datasets[0].data[index].ubication;

              let voyage = this.generateVoyages[ubication[0]];
              result = [
                'T. Ports : ' + voyage.totalPort,
                'Distance : ' + mathRound(voyage.totalSpeed.distance, 2),
                'Time : ' + mathRound(voyage.totalSpeed.steamingTime, 2),
                'Speed : ' + mathRound(voyage.totalSpeed.distance / voyage.totalSpeed.steamingTime, 2),
              ];
            } else if (this.selectSummaryBy === 'PORTS') {

              let ubication = data.datasets[0].data[index].ubication;

              let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
              result = [
                'Departure : ' + port.departurePort,
                'Arrival : ' + port.arrivalPort,
                'Distance : ' + mathRound(port.speed.distance, 2),
                'Time : ' + mathRound(port.speed.steamingTime, 2),
                'Speed : ' + mathRound(port.speed.distance / port.speed.steamingTime, 2),
              ];
            } else if (this.selectSummaryBy === 'MONTHS') {

              let speed = data.datasets[0].data[index].speed;

              result = [
                'Distance : ' + mathRound(speed.distance, 2),
                'Time : ' + mathRound(speed.steamingTime, 2),
                'Speed : ' + mathRound(speed.distance / speed.steamingTime, 2),
              ];
            }
            else if (this.selectSummaryBy === 'DAYS') {

              let dataExtra = data.datasets[0].data[index].dataExtra;

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
                'Distance : ' + mathRound(speed.distance, 2),
                'Time : ' + mathRound(speed.steamingTime, 2),
                'Speed : ' + mathRound(speed.distance / speed.steamingTime, 2),
                'T. Reports : ' + totalReport,
                'Activities : ' + activities,
                'Observations : ' + observations
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


    this.configLineaIFO.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaIFO.lineaMax, 0) + 2);
    //
    this.chartLineIFO.update();
    //
    return false;

  }

  public UpdateLineSPEED(): boolean {

    // Testing
    console.log('UpdateLineSPEED()');

    // Actualizamos los labels    // Actualizamos los labels
    this.configLineaSPEED.data.labels = this.xLabelReport;
    this.configLineaSPEED.data.datasets[0].data = this.dataSPEED;
    this.configLineaSPEED.data.datasets[0].reportDetail = this.generateVoyages;

    // Vaciamos la configuracion de las lines MGO
    this.configLineaSPEED.options.lines = [];


    if (this.selectSummaryBy === 'DAYS') {
      // Si el consumo maximo es mayor a 0 lo pintamos si no no hace falta.
      if (this.selectUser.maxSpeed > 0) {
        this.configLineaSPEED.options.lines.push({
          type: 'horizontal',
          y: this.selectUser.maxSpeed,
          color: 'red',
          label: ''
        });
      }
      // Si el consumo maximo es mayor a 0 lo pintamos si no no hace falta.
      if (this.selectUser.minSpeed > 0) {
        this.configLineaSPEED.options.lines.push({
          type: 'horizontal',
          y: this.selectUser.minSpeed,
          color: '#39FF14',
          label: ''
        });
      }
    }


    this.configLineaSPEED.options.tooltips = {

      // Establece qué elementos aparecen en la información sobre herramientas.
      mode: 'nearest',
      // si es verdadero, el modo de desplazamiento solo se aplica cuando la posición del mouse se cruza con un elemento del gráfico.
      intersect: false,
      callbacks: {
        title: (tooltipItem, data) => {
          let index = tooltipItem[0].index;

          let result = "";

          if (this.selectSummaryBy === 'VOYAGES') {

            let ubication = data.datasets[0].data[index].ubication;
            let viaje = this.generateVoyages[ubication[0]]

            result = 'V' + viaje.voyageNumber + ' Y' + ('' + viaje.year).slice(-2);

          } else if (this.selectSummaryBy === 'PORTS') {

            let ubication = data.datasets[0].data[index].ubication;

            let viaje = this.generateVoyages[ubication[0]];
            let port = viaje.ports[ubication[1]];

            result = 'V' + viaje.voyageNumber + ' P' + port.portNumber + ' Y' + ('' + viaje.year).slice(-2);

          } else if (this.selectSummaryBy === 'MONTHS') {

            result = tooltipItem[0].xLabel;
            result = TextMonthYear(result);
          } else if (this.selectSummaryBy === 'DAYS') {

            result = tooltipItem[0].xLabel;
            result = TextMonthDayYear(result)
          }

          return result;
        },
        label: (tooltipItem, data) => {

          let typeConsumption = 'Speed : ' + mathRound(tooltipItem.value, 2);
          return typeConsumption;
        },
        footer: (tooltipItem, data) => {

          let index = tooltipItem[0].index;


          let result = [];
          if (this.selectSummaryBy === 'VOYAGES') {
            let ubication = data.datasets[0].data[index].ubication;
            let voyage = this.generateVoyages[ubication[0]];

            result = [
              'T. Ports : ' + voyage.totalPort,
              'Distance : ' + mathRound(voyage.totalSpeed.distance, 2),
              'Time : ' + mathRound(voyage.totalSpeed.steamingTime, 2),
            ];
          } else if (this.selectSummaryBy === 'PORTS') {

            let ubication = data.datasets[0].data[index].ubication;

            let port = this.generateVoyages[ubication[0]].ports[ubication[1]];
            result = [
              'Departure : ' + port.departurePort,
              'Arrival : ' + port.arrivalPort,
              'Distance : ' + port.speed.distance,
              'Time : ' + mathRound(port.speed.steamingTime, 2),
            ];
          } else if (this.selectSummaryBy === 'MONTHS') {

            let speed = data.datasets[0].data[index].speed;

            result = [
              'Distance : ' + mathRound(speed.distance, 2),
              'Time : ' + mathRound(speed.steamingTime, 2)
            ];
          }
          else if (this.selectSummaryBy === 'DAYS') {

            let dataExtra = data.datasets[0].data[index].dataExtra;

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
              'Distance : ' + mathRound(speed.distance, 2),
              'Time : ' + mathRound(speed.steamingTime, 2),
              'T. Reports : ' + totalReport,
              'Activities : ' + activities,
              'Observations : ' + observations
            ];
          }


          return result;

        },
      },
    }


    if (this.configLineaSPEED.lineaMax < this.selectUser.maxSpeed) {
      this.configLineaSPEED.lineaMax = this.selectUser.maxSpeed;
    }


    this.configLineaSPEED.options.scales = this.ConfigScales(this.xLabelReport, true, mathRound(this.configLineaSPEED.lineaMax, 0) + 2);

    this.chartLineSPEED.update();

    return false;
  }

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

  public PluginChartLine() {

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
