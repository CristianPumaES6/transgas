import { Injectable } from '@nestjs/common';
import { DummyPromise } from 'src/assets/promises.assets';

import { CellFormulaValue, TableProperties, Workbook, Worksheet } from 'exceljs';
import { GetReportVoyagePortDaily, InfoFuelStartEndForDate } from 'src/models/daily-report.entity';

import * as fs from 'fs';

import * as fileSaver from 'file-saver';
import { UserEntity } from 'src/models/user.entity';
import { Voyage } from 'src/models/voyage.entity';
import { Port } from 'src/models/port.entity';
import { ConvertDateUTC_To_FORMAT_UTC, ObtenerHoraDeDosStringUTC } from 'src/assets/moment.assets';
import moment from 'moment';


@Injectable()
export class FormatExcelLastVoyageService {


    // Actualiza un Voyage
    async GenerateExcel(listGetReportVoyagePortDaily: GetReportVoyagePortDaily[], getInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate, selectUser: UserEntity): Promise<any> {

        // Hacemos una busqueda por id
        return await DummyPromise().then(
            result => {
                return this.FormatGeneric(listGetReportVoyagePortDaily, getInfoFuelStartEndByFilterDate, selectUser);
            }
        )
    }

    async FormatGeneric(listGetReportVoyagePortDaily: GetReportVoyagePortDaily[], getInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate, selectUser: UserEntity): Promise<any> {

        return await DummyPromise().then(
            result => {

                // Creamos una nueva hoja de trabajo
                let workbook = new Workbook();
                workbook.creator = 'transgas.web.app';

                let worksheet = workbook.addWorksheet('Data Report');

                // Generamos la hoja de data report
                this.GenerarHojaDataReport(worksheet, listGetReportVoyagePortDaily, getInfoFuelStartEndByFilterDate, selectUser);


                // Colores
                let black = '000000'
                let white = 'ffffff';
                let redMedium = 'ffa4a4';
                let redLow = 'ffd6d6';
                let blueHard1 = '375f9a'

                // Tipo de combustible.
                let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';

                // HOJA DE PUERTO
                let worksheetPuerto: Worksheet;
                let puertoActual: Port = new Port();

                // posicion de fila
                let positionRow = 4;
                let colum = 0;
                let positionRows = [positionRow, positionRow];
                let positionColumns = [colum, colum + 2];
                // Numero del puerto
                let numeroDePuerto = 0;
                // existe un valor antes?
                let itemReportBefore: GetReportVoyagePortDaily;
                let existeUnValorAnterior = false;
                let contadorDeItemPorPuerto = 0;
                // recorremos todos los reportes.
                listGetReportVoyagePortDaily.forEach(
                    (itemReport, indexItem) => {

                        //Es el primer puerto 
                        let primerNuevoPuerto = puertoActual.id != itemReport.portId;

                        // el id es diferentes?
                        if (primerNuevoPuerto) {
                            // si existe un puerto anterior coloco esto
                            // Ultimo registro.
                            if (indexItem == (listGetReportVoyagePortDaily.length - 1)) {


                                contadorDeItemPorPuerto++;

                                // RESUMEN TOTAL
                                positionRow += 1;
                                colum = 0;
                                positionRows = [positionRow, positionRow];
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'TOTAL', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');

                                // siguiente columna
                                colum += 2;
                                positionColumns = [colum, colum + 1];


                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns,
                                    { formula: 'SUM(' + this.PositByCell(colum) + (positionRow - 1) + ' : ' + this.PositByCell(colum) + (positionRow - contadorDeItemPorPuerto) + ')' }
                                    , 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');

                                // siguiente columna
                                colum += 2;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns,
                                    { formula: 'SUM(' + this.PositByCell(colum) + (positionRow - 1) + ' : ' + this.PositByCell(colum) + (positionRow - contadorDeItemPorPuerto) + ')' }
                                    , 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');

                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns,
                                    { formula: this.PositByCell(colum - 1) + positionRow + '/' + this.PositByCell(colum - 3) + positionRow }
                                    , 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                //---------------------------------------------------------------------------
                                positionRow += 1;
                                colum = 0;
                                positionRows = [positionRow, positionRow];
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'DIAS NAV:', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns,
                                    { formula: this.PositByCell(colum + 2) + (positionRow - 1) }
                                    , 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, textIFOorVLSFOorLSFO, 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'MDO/MGO', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'LUBRICANTES / OIL', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');



                            }


                            // Contabilizamos el numero de puerto
                            numeroDePuerto++;
                            // puerto actual
                            puertoActual.id = itemReport.portId;
                            // Reset position
                            positionRow = 1;
                            colum = 0;
                            // posicion del titulo.
                            positionRows = [positionRow, positionRow];
                            positionColumns = [colum, colum + 2];

                            // Agregamos los datos del puerto actual
                            puertoActual.departurePort = itemReport.departurePort;
                            puertoActual.arrivalPort = itemReport.arrivalPort;
                            // reset al contador
                            contadorDeItemPorPuerto = 0;
                            // creamos y guardamos nuestro hoja del puerto
                            worksheetPuerto = workbook.addWorksheet("Port N°" + numeroDePuerto + " " + puertoActual.departurePort + ' - ' + puertoActual.arrivalPort);

                            // le damos un reset al tamaño de la columna
                            this.ResetColumn(worksheetPuerto);

                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'DATOS DE NAVEGACION “' + selectUser.name + '”', 20, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');

                            // Titulo del viaje
                            positionRow += 1;
                            positionRows = [positionRow, positionRow];
                            positionColumns = [colum, colum + 3];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'REPORTE DE VIAJE', 22, black, white, '');
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // Numero de viaje y año
                            colum += 4;
                            positionColumns = [colum, colum + 2];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'VOY ' + itemReport.voyageNumber + '-' + itemReport.year, 22, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');


                            // Salto de linea PARA REPORTES DEL VIAJE SOLO ACTIVIDADES DE NAVEGACION --- Navegando de:
                            positionRow += 1;
                            colum = 0;
                            positionRows = [positionRow, positionRow];
                            positionColumns = [colum, colum];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'NAVEGANDO DE :', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // Siguiente columna
                            colum += 1;
                            positionColumns = [colum, colum];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, itemReport.departurePort, 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // Cuadro vacio con salto de 3 linea
                            colum += 1;
                            positionColumns = [colum, colum + 1];
                            positionRows = [positionRow, positionRow + 1];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '', 11, black, white, '')
                            // Cuadro fecha con salto de 1 linea
                            colum += 2;
                            positionColumns = [colum, colum];
                            positionRows = [positionRow, positionRow];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'FECHA :', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // Cuadro fecha
                            colum += 1;
                            positionColumns = [colum, colum + 1];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, ConvertDateUTC_To_FORMAT_UTC(itemReport.date) + " GMT", 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');


                            // Salto de linea ARRIVO
                            positionRow += 1;
                            colum = 0;
                            positionRows = [positionRow, positionRow];
                            positionColumns = [colum, colum];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'ARRIBO A :', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // siguiente columna
                            colum += 1;
                            positionColumns = [colum, colum];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, itemReport.departurePort, 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // FECHA ARRIVO
                            colum += 3;
                            positionColumns = [colum, colum];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'FECHA :', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // cuadro fecha REVISAR ESTA FECHA SIEMPRE SE DEBE ACTUALIZAR hasta que se registre la actividad
                            colum += 1;
                            positionColumns = [colum, colum + 1];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, " -- CAMBIAR VALOR 1 --", 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');

                            // --------------  TITULO DE LOS REGISTROS ----------------
                            positionRow += 1;
                            colum = 0;
                            positionRows = [positionRow, positionRow];
                            positionColumns = [colum, colum];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'FECHA :', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // siguiente columna
                            colum += 1;
                            positionColumns = [colum, colum];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'POSICION', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // siguiente columna
                            colum += 1;
                            positionColumns = [colum, colum + 1];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'HORAS\nNAVEGADAS', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // siguiente columna
                            colum += 2;
                            positionColumns = [colum, colum];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'DISTANCIA\nOBSERVADAS', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // siguiente columna
                            colum += 1;
                            positionColumns = [colum, colum];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'VELOCIDAD', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                            // siguiente columna
                            colum += 1;
                            positionColumns = [colum, colum];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'FUERZA\nVIENTO Y MAR', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');

                        }

                        //----------------------------------------------------------------------------
                        positionRow += 1;
                        colum = 0;
                        positionRows = [positionRow, positionRow];
                        positionColumns = [colum, colum];
                        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, ConvertDateUTC_To_FORMAT_UTC(itemReport.date), 11, black, white, '')
                        this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                        // siguiente columna
                        colum += 1;
                        positionColumns = [colum, colum];
                        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, itemReport.north_degree + 'º' + itemReport.north_minutes + "'" + itemReport.north_north_south + "/" + itemReport.east_degree + 'º' + itemReport.east_minutes + "'" + itemReport.east_east_west, 11, black, white, '')
                        this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                        // siguiente columna
                        colum += 1;
                        positionColumns = [colum, colum + 1];
                        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, itemReport.steamingTime, 11, black, white, '')
                        this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                        // siguiente columna
                        colum += 2;
                        positionColumns = [colum, colum];
                        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, itemReport.distance, 11, black, white, '')
                        this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                        // siguiente columna
                        colum += 1;
                        positionColumns = [colum, colum];
                        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '--REVISAR FORMULA2--', 11, black, white, '')
                        this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                        // siguiente columna
                        colum += 1;
                        positionColumns = [colum, colum];
                        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, itemReport.beaufour, 11, black, white, '')
                        this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');

                        colum += 1;
                        positionColumns = [colum, colum];
                        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, itemReport.activityPerformed, 11, black, white, '')
                        this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');

                        colum += 1;
                        positionColumns = [colum, colum];
                        this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, itemReport.observation, 11, black, white, '')
                        this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');


                        // Ultimo registro.
                        if (indexItem == (listGetReportVoyagePortDaily.length - 1)) {

                            // RESUMEN TOTAL
                            positionRow += 1;
                            colum = 0;
                            positionRows = [positionRow, positionRow];
                            positionColumns = [colum, colum + 1];
                            this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'TOTAL', 11, black, white, '')
                            this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                        }

                        // ALterminar actualizamos el antiguo reporte
                        itemReportBefore = itemReport;
                        // ni bien se tiene un valor lo registramos
                        // EMPEZAMOS guardando validamos si hay un item anterior.
                        existeUnValorAnterior = !itemReportBefore ? false : true;
                        // le sumamos uno al contador por que se registro la linea
                        contadorDeItemPorPuerto++;

                    }
                )



                /* 
                          
                
                
                
                                
                              
                            //---------------------------------------------------------------------------
                                positionRow += 1;
                                colum = 0;
                                positionRows = [positionRow, positionRow];
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'BUNKERS AL INICIO DEL VIAJE:', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 2;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '3333', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '44444', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '3888', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                //---------------------------------------------------------------------------
                                positionRow += 1;
                                colum = 0;
                                positionRows = [positionRow, positionRow];
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'BUNKERS AL TERMINO DEL VIAJE:', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 2;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '555', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '6666', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '7777', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                //---------------------------------------------------------------------------
                                positionRow += 1;
                                colum = 0;
                                positionRows = [positionRow, positionRow];
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'BUNKERS CONSUMIDOS EN EL VIAJE:', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 2;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '888', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '999', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '1000', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                //---------------------------------------------------------------------------
                                positionRow += 1;
                                colum = 0;
                                positionRows = [positionRow, positionRow];
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'CONSUMO PROMEDIO / DIA:', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 2;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '1111', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '222', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                                // siguiente columna
                                colum += 1;
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, '333', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, '');
                
                
                
                                //----------------------------- FIRAM DE SUPER INTENDENTE----------------------------------------------
                                positionRow += 5;
                
                                colum = 0;
                                positionRows = [positionRow, positionRow];
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'OFICIAL DE PUENTE 1', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, 'top');
                
                                // siguiente columna dejando un vacio
                                colum += 2;
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'SUPERINTENDENTE', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, 'top');
                
                                // siguiente columna
                                colum += 3;
                                positionColumns = [colum, colum];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'CAPITAN', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, 'top');
                
                
                                //----------------------------- FIRAM DE SUPER INTENDENTE----------------------------------------------
                                positionRow += 5;
                                colum = 4;
                                positionRows = [positionRow, positionRow];
                                positionColumns = [colum, colum + 1];
                                this.addStyleByColums(worksheetPuerto, positionRows, positionColumns, 'FORM GR.07/REV 02', 11, black, white, '')
                                this.addBorder(worksheetPuerto, positionRow, colum, 'thick', black, 'top');
                 */

                return workbook.xlsx.writeFile('export' + Math.random() + '.xlsx');
            }
        ).then(
            result => {

                return true;
            }
        );

    }

    private async ResetColumn(worksheet: Worksheet): Promise<boolean> {

        // Hasta la E las columnas son invisibles para guardar algo.
        // apartir de la F todas las columnas tienen el mismo tamanio
        worksheet.columns = [
            { width: 0 },
            { width: 0 },
            { width: 0 },
            { width: 0 },
            { width: 0 },
            // D
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },//K
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 6 },//P
            { width: 6 },//Q
            { width: 6 },//R
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
            { width: 4 },
        ];

        return true;
    }

    // Generamos la hoja de Data Report
    private async GenerarHojaDataReport(worksheet: Worksheet, listGetReportVoyagePortDaily: GetReportVoyagePortDaily[], getInfoFuelStartEndByFilterDate: InfoFuelStartEndForDate, selectUser: UserEntity): Promise<boolean> {

        // reset colum
        this.ResetColumn(worksheet);
        // la posicion inicioa en la fila 3
        let position = 3;

        // Colores amarillo
        let colorYellowTransgas = 'FFCD06';
        // Variables de colores-
        let blueHard = '001556'
        let blueMedium = '09155694'
        let blueLow = 'b6c2ff94';
        // Colores fuertes
        let blueHard1 = '375f9a'
        let blueHard2 = '0040d8'
        let blueHard3 = '001556'
        // Colores verdes
        let greenHard = '091556'
        let greenMedium = '09155694'
        let greenLow = 'b6c2ff94';
        // Color negro y blanco
        let black = '000000'
        let white = 'ffffff';
        // Variables de colores.
        let grisFuerte = 'd4d4d4'
        let grisMedio = 'ebe8e8'
        let grisSuave = 'f3f3f3';
        // Tonalidad del rojo.
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';

        let positionColumn = 7;
        let positionRow = position;

        // Esta funcion permite poner un cuadro de leyenda.
        this.StyleDashLegend(worksheet, positionRow, positionColumn);




        let infoVessel: InfoVessel = new InfoVessel();
        infoVessel.date_start = listGetReportVoyagePortDaily[0].date + '';
        infoVessel.date_end = listGetReportVoyagePortDaily[listGetReportVoyagePortDaily.length - 1].date + '';
        infoVessel.ifo_start = getInfoFuelStartEndByFilterDate.infoFuelStart.total_ifo;
        infoVessel.mgo_start = getInfoFuelStartEndByFilterDate.infoFuelStart.total_mgo;

        // Agregamos la informacion del buque.
        positionColumn = 25;
        let tamanioInfoVessel = this.StyleDashInfoVessel(worksheet, positionRow, positionColumn, selectUser, infoVessel);

        // a la posicion del row le sumamos el tamaño del cuadro.
        positionRow += tamanioInfoVessel;

        // Dos saltos de linea
        positionRow += 2;

        //
        positionColumn = 20;
        let tamanioCosumptionIFO = this.StyleDashCosumption(worksheet, positionRow, positionColumn, selectUser, 'IFO');
        //
        positionColumn = 60;
        let tamanioCosumptionMGO = this.StyleDashCosumption(worksheet, positionRow, positionColumn, selectUser, 'MGO');


        /// Filas aprox del cuadro de consumo.
        positionRow += tamanioCosumptionIFO + 1;

        // Dos saltos de linea
        positionRow += 2;

        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';

        worksheet.getCell('AR' + positionRow).value = textIFOorVLSFOorLSFO + " CONSUMPTION IN MT";
        worksheet.getCell('AR' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 20,
                bold: true,
                color: { argb: colorYellowTransgas },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'double', color: { argb: grisSuave } },
                left: { style: 'double', color: { argb: grisSuave } },
                bottom: { style: 'double', color: { argb: grisSuave } },
                right: { style: 'double', color: { argb: grisSuave } }
            }

        }
        worksheet.mergeCells('AR' + positionRow, 'BG' + positionRow);

        worksheet.getCell('BH' + positionRow).value = "MGO CONSUMPTION IN MT";
        worksheet.getCell('BH' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 20,
                bold: true,
                color: { argb: colorYellowTransgas },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'double', color: { argb: grisSuave } },
                left: { style: 'double', color: { argb: grisSuave } },
                bottom: { style: 'double', color: { argb: grisSuave } },
                right: { style: 'double', color: { argb: grisSuave } }
            }

        };
        worksheet.mergeCells('BH' + positionRow, 'CA' + positionRow);

        positionRow += 1;
        worksheet.getCell('AJ' + positionRow).value = "NAVIGATION DATA";
        worksheet.getCell('AJ' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 15,
                bold: true,
                color: { argb: colorYellowTransgas },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'double', color: { argb: grisSuave } },
                left: { style: 'double', color: { argb: grisSuave } },
                bottom: { style: 'double', color: { argb: grisSuave } },
                right: { style: 'double', color: { argb: grisSuave } }
            }

        }
        worksheet.mergeCells('AJ' + positionRow, 'AQ' + positionRow);

        worksheet.getCell('AR' + positionRow).value = "PREVIOUS VOYAGE";
        worksheet.getCell('AR' + positionRow).style = {
            alignment: {
                horizontal: 'right',
                vertical: 'middle'
            },
            font: {
                size: 10,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.mergeCells('AR' + positionRow, 'BD' + positionRow);

        worksheet.getCell('BE' + positionRow).value = <any>{ formula: 'AK7' };
        worksheet.getCell('BE' + positionRow).style = {
            alignment: {
                horizontal: 'right',
                vertical: 'middle'
            },
            font: {
                size: 18,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };

        worksheet.mergeCells('BE' + positionRow, 'BG' + positionRow);


        worksheet.getCell('BH' + positionRow).value = "PREVIOUS VOYAGE";
        worksheet.getCell('BH' + positionRow).style = {
            alignment: {
                horizontal: 'right',
                vertical: 'middle'
            },
            font: {
                size: 10,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.mergeCells('BH' + positionRow, 'BX' + positionRow);
        worksheet.getCell('BY' + positionRow).value = <any>{ formula: 'AM7' };
        worksheet.getCell('BY' + positionRow).style = {
            alignment: {
                horizontal: 'right',
                vertical: 'middle'
            },
            font: {
                size: 18,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.mergeCells('BY' + positionRow, 'CA' + positionRow);

        positionRow += 1;
        worksheet.addRow([
            'voyageId', 'portId', 'dailyReportId', '', '',//E


            'VOYAGE', '', //G
            'DEPARTURE', '', '', '', //G
            'ARRIVAL', '', '', '', //G
            'DATE UTC', '', '', //J
            'HOUR LOCAL', '',  //L
            'TIME', '', //N
            'ACTIVITY PERFORMED', '', '', '',//R
            'SPEED', '',
            'OBSERVATION', '', '', '', '', '', '',//V

            'DISTANCE', '',//X
            'TIME', '',//Z
            'SPEED', '',//AB
            'BEAUFORT', '',//AD

            'MPLA', '',//AF
            'AUX', '',//AH
            'BOILER', '',//AJ
            'OTHER', '',//AL
            'TOTAL', '',//AN
            'DAILY COSUMTION', '',
            'BUNKERING', '',//AP
            'ROB', '',//AR


            'MPLA', '',//AF
            'AUX', '',//AH
            'BOILER', '',//AJ
            'P.P', '',//AJ
            'G.I', '',//AJ
            'OTHER', '',//AL
            'TOTAL', '',//AN
            'DAILY COSUMTION', '',
            'BUNKERING', '',//AP
            'ROB', '',//AR },
        ]);
        worksheet.getCell('F' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };

        worksheet.getCell('H' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('L' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };

        worksheet.getCell('P' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('S' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('U' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('W' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AA' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AC' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AJ' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AL' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AN' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AP' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AR' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AT' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AV' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AX' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('AZ' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BB' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BD' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BF' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BH' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BJ' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BL' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BN' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BP' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BR' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BT' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BV' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BX' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard1
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };
        worksheet.getCell('BZ' + positionRow).style = {
            alignment: {
                horizontal: 'center',
                vertical: 'middle'
            },
            font: {
                size: 8,
                bold: true,
                color: { argb: white },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: blueHard2
                }
            },
            border: {
                top: { style: 'thin', color: { argb: grisSuave } },
                left: { style: 'thin', color: { argb: grisSuave } },
                bottom: { style: 'thin', color: { argb: grisSuave } },
                right: { style: 'thin', color: { argb: grisSuave } }
            }
        };

        this.mergeCellReport(worksheet, positionRow);


        listGetReportVoyagePortDaily.forEach(
            (getReportVoyagePortDaily, index) => {



                positionRow += 1;
                let dataRow = [
                    getReportVoyagePortDaily.voyageId,
                    getReportVoyagePortDaily.portId,
                    getReportVoyagePortDaily.dailyReportId,
                    '', { formula: 'AND( AI' + positionRow + ' <12, AI' + positionRow + ' > 0 )' },
                    'V' + getReportVoyagePortDaily.voyageNumber + '-' + getReportVoyagePortDaily.year, '',
                    getReportVoyagePortDaily.departurePort, '', '', '',
                    getReportVoyagePortDaily.arrivalPort, '', '', '',
                    ConvertDateUTC_To_FORMAT_UTC(getReportVoyagePortDaily.date), '', '',
                    getReportVoyagePortDaily.hour, '',
                    //{ formula: 'IF(P' + positionRow + '-P' + (positionRow - 1) + '=1,((S' + positionRow + '-S' + (positionRow - 1) + ')*24)+24,(S' + positionRow + '-S' + (positionRow - 1) + ')*24)' }, '',
                    { formula: '(P' + positionRow + ' - P' + (positionRow - 1) + ')*24' }, '',
                    this.translate(getReportVoyagePortDaily.activityPerformed), '', '', '',


                    getReportVoyagePortDaily.speedStraction, '',

                    getReportVoyagePortDaily.observation, '', '', '', '', '', '',

                    getReportVoyagePortDaily.distance, '',
                    // Solo si es de la actividad de navegacion deberia de agregarse.
                    { formula: '(P' + positionRow + ' - P' + (positionRow - 1) + ')*24' }, '',
                    // Velocidad formula.
                    { formula: 'IF(ISERROR(AJ' + positionRow + '/AL' + positionRow + '),0,AJ' + positionRow + '/AL' + positionRow + ')' }, '',
                    getReportVoyagePortDaily.beaufour, '',

                    //IFO
                    getReportVoyagePortDaily.mplaIfo, '',
                    getReportVoyagePortDaily.auxIfo, '',
                    getReportVoyagePortDaily.boilerIfo, '',
                    getReportVoyagePortDaily.otherIfo, '',
                    // Total
                    { formula: 'SUM(AR' + positionRow + ':AX' + positionRow + ')' }, '',
                    // dailyConsumption
                    { formula: 'IF(ISERROR(' + 'AZ' + positionRow + '*24/' + 'AL' + positionRow + '),0,' + 'AZ' + positionRow + '*24/' + 'AL' + positionRow + ')' }, '',
                    getReportVoyagePortDaily.bunkeringIfo, '',
                    // RobIFO
                    { formula: 'BF' + (positionRow - 1) + '-AZ' + positionRow + '+BD' + positionRow }, '',

                    getReportVoyagePortDaily.mplaMgo, '',
                    getReportVoyagePortDaily.auxMgo, '',
                    getReportVoyagePortDaily.boilerMgo, '',
                    getReportVoyagePortDaily.ppMgo, '',
                    getReportVoyagePortDaily.giMgo, '',
                    getReportVoyagePortDaily.otherMgo, '',

                    // Total
                    { formula: 'SUM(BH' + positionRow + ':BS' + positionRow + ')' }, '',

                    // dailyConsumption
                    { formula: 'IF(ISERROR(' + 'BT' + positionRow + '*24/' + 'AL' + positionRow + '),0,' + 'BT' + positionRow + '*24/' + 'AL' + positionRow + ')' }, '',
                    getReportVoyagePortDaily.bunkeringMgo, '',

                    // RobIFO
                    { formula: 'BZ' + (positionRow - 1) + '-BT' + positionRow + '+BX' + positionRow }, '',
                ];

                worksheet.addRow(dataRow);
                this.mergeCellReport(worksheet, positionRow);
                // Si es el primer registro se debe calcular con el rob del viaje anterior
                if (index == 0) {

                    // Revisar stimitime no debria estar aqui. deberia apuntar a la leyenda
                    worksheet.getCell('U' + positionRow).value = getReportVoyagePortDaily.steamingTime;
                    worksheet.getCell('AL' + positionRow).value = getReportVoyagePortDaily.steamingTime;



                    worksheet.getCell('BF' + positionRow).value = <any>{ formula: 'BE' + (positionRow - 2) + '-AZ' + positionRow + '+BD' + positionRow };
                    worksheet.getCell('BZ' + positionRow).value = <any>{ formula: 'BY' + (positionRow - 2) + '-BT' + positionRow + '+BX' + positionRow };

                    this.addFormatting(worksheet, positionRow)
                    // Agregamos el formadate
                } else {

                    this.addFormatting(worksheet, positionRow)
                }



            }

        );


        return true;
    }

    // Esta funcion permite poner un cuadro de leyenda.
    private StyleDashLegend(worksheet, posit, colum): number {

        let colorYellowTransgas = 'FFCD06';
        // Variables de colores-
        let blueHard = '001556'
        let blueMedium = '09155694'
        let blueLow = 'b6c2ff94';
        // Tonalidad Azul
        let blueHard1 = '375f9a'
        let blueHard2 = '0040d8'
        let blueHard3 = '001556'
        // Tonalidad Verde
        let greenHard = '091556'
        let greenMedium = ''
        let greenLow = 'b6c2ff94';
        // Blanco negro
        let black = '000'
        let white = 'ffffff';
        //  Tonalidad Gris
        let grisFuerte = 'd4d4d4'
        let grisMedio = 'ebe8e8'
        let grisSuave = 'f3f3f3';
        // Tonalidad Rojo
        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';

        //Agregamos la leyenda
        // segimos en la misma linea.
        let position = [posit, posit];
        // le sumo 7 celdas por que la logitud de la leyenda es 7celdas
        let positionColumn = [colum, colum + 11];
        let posititonRow = posit;
        this.addStyleByColums(worksheet, position, positionColumn, 'LEGEND', 10, colorYellowTransgas, blueHard3);
        this.addBorder(worksheet, posit, colum, 'thick', blueHard3, '');

        //ITEM
        // Le damos un salto vacio.
        posititonRow = posititonRow + 2;
        // Item de la leyenda
        position = [posititonRow, posititonRow];
        positionColumn = [colum + 1, colum + 1];
        this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, blueHard3)
        // texto.
        positionColumn = [colum + 3, colum + 10];
        this.addStyleByColums(worksheet, position, positionColumn, 'Data recorded by the captain', 8, black, white)

        //ITEM
        // bajamos
        posititonRow = posititonRow + 1;
        // Item de la leyenda
        position = [posititonRow, posititonRow];
        positionColumn = [colum + 1, colum + 1];
        this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, blueHard2)
        // texto.
        positionColumn = [colum + 3, colum + 10];
        this.addStyleByColums(worksheet, position, positionColumn, 'Value obtained by a formula.', 8, black, white)


        //ITEM
        // bajamos
        posititonRow = posititonRow + 1;
        // Item de la leyenda
        position = [posititonRow, posititonRow];
        positionColumn = [colum + 1, colum + 1];
        this.addStyleByColums(worksheet, position, positionColumn, 0, 10, grisSuave, null)
        // texto.
        positionColumn = [colum + 3, colum + 10];
        this.addStyleByColums(worksheet, position, positionColumn, 'Null value', 8, black, white)


        //ITEM
        // bajamos
        posititonRow = posititonRow + 1;
        // Item de la leyenda
        position = [posititonRow, posititonRow];
        positionColumn = [colum + 1, colum + 1];
        this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, greenLow)
        // texto.
        positionColumn = [colum + 3, colum + 10];
        this.addStyleByColums(worksheet, position, positionColumn, 'Positive value', 8, black, white)


        //ITEM
        // bajamos
        posititonRow = posititonRow + 1;
        // Item de la leyenda
        position = [posititonRow, posititonRow];
        positionColumn = [colum + 1, colum + 1];
        this.addStyleByColums(worksheet, position, positionColumn, '', 10, null, redLow)
        // texto.
        positionColumn = [colum + 3, colum + 10];
        this.addStyleByColums(worksheet, position, positionColumn, 'Negative value', 8, black, white)


        // disminuimos las filas registradas
        position = [posititonRow - 5, posititonRow = posititonRow + 1];
        positionColumn = [colum, colum + 11];
        this.addStyleBorder(worksheet, position, positionColumn, 'thick', blueHard3)


        let totaldeRow = 11;
        return totaldeRow;
    }
    private StyleDashInfoVessel(worksheet, posit, colum, selectUser: UserEntity, infoVessel: InfoVessel): number {

        let colorYellowTransgas = 'FFCD06';
        // Variables de colores-
        let blueHard = '001556'
        let blueMedium = '09155694'
        let blueLow = 'b6c2ff94';


        let blueHard1 = '375f9a'
        let blueHard2 = '0040d8'
        let blueHard3 = '001556'

        let greenHard = '091556'
        let greenMedium = ''
        let greenLow = 'b6c2ff94';

        let black = '000'
        let white = 'ffffff';

        // Variables de colores-
        let grisFuerte = 'd4d4d4'
        let grisMedio = 'ebe8e8'
        let grisSuave = 'f3f3f3';

        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';

        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';


        let positionRow = posit;

        let positionRows = [positionRow, positionRow];
        let positionColumns = [colum, colum + 53];

        this.addStyleByColums(worksheet, positionRows, positionColumns, 'INFO VESSEL', 20, colorYellowTransgas, blueHard3)
        this.addBorder(worksheet, positionRow, colum, 'thick', blueHard3, '');
        positionRow += 1;
        // disminuimos las filas registradas
        positionRows = [positionRow, positionRow + 11];
        this.addStyleBorder(worksheet, positionRows, positionColumns, 'thick', blueHard3)


        positionRow += 1;

        //Espacio de separacion
        positionRow += 1;

        positionRows = positionRow;
        let positionColumn = colum;
        let tamanioBuque = this.StyleDashBuque(worksheet, positionRows, positionColumn, selectUser, infoVessel);



        positionColumn = colum + 19;
        let tamanioSpeed = this.StyleDashSpeed(worksheet, positionRows, positionColumn, selectUser, 'IFO');

        positionColumn = colum + 26;
        let tamanioActivity = this.StyleDashActivity(worksheet, positionRows, positionColumn, selectUser, 'IFO');


        // ========== LInea 3


        positionColumn = colum + 39;
        let tamanioSpeedMGO = this.StyleDashSpeed(worksheet, positionRows, positionColumn, selectUser, 'MGO');


        positionColumn = colum + 46;
        let tamanioActivityMGO = this.StyleDashActivity(worksheet, positionRows, positionColumn, selectUser, 'MGO');

        positionRow = tamanioActivityMGO + 2;


        return positionRow - posit;
    }
    private StyleDashBuque(worksheet, posit, colum, selectUser: UserEntity, infoVessel: InfoVessel): number {
        let date_start = infoVessel.date_start;
        let hour_start = infoVessel.hour_start;
        let ifo_start = infoVessel.ifo_start;
        let mgo_start = infoVessel.mgo_start;
        let date_end = infoVessel.date_end;
        let hour_end = infoVessel.hour_end;
        let ifo_end = infoVessel.ifo_end;
        let mgo_end = infoVessel.mgo_end;
        let totalBunkeringIFO = 0;
        let totalBunkeringMGO = 0;

        let totalConsumptIFO = 0;
        let totalConsumptMGO = 0;



        let colorYellowTransgas = 'FFCD06';
        // Variables de colores-
        let blueHard = '001556'
        let blueMedium = '09155694'
        let blueLow = 'b6c2ff94';


        let blueHard1 = '375f9a'
        let blueHard2 = '0040d8'
        let blueHard3 = '001556'

        let greenHard = '091556'
        let greenMedium = ''
        let greenLow = 'b6c2ff94';

        let black = '000000'
        let white = 'ffffff';

        // Variables de colores-
        let grisFuerte = 'd4d4d4'
        let grisMedio = 'ebe8e8'
        let grisSuave = 'f3f3f3';

        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';

        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';


        //Agregamos la leyenda
        // segimos en la misma linea.
        let positionRows = [posit, posit];
        colum += 1;
        positionRows = [posit, posit];
        let positionColumns = [colum, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, selectUser.name, 15, blueHard3, white)
        this.addBorder(worksheet, posit, colum, 'thick', blueHard3, '');

        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, textIFOorVLSFOorLSFO, 8, white, blueHard3, '')

        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'MGO', 8, white, blueHard3, '')


        posit += 1;
        // Start date
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'START DATE', 8, black, white, '');
        // date start
        positionColumns = [colum + 5, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, date_start, 8, black, white, '');

        // IFO start
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, ifo_start, 8, black, white, '');
        //MGO Start
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns, mgo_start, 8, black, white, '');


        posit += 1;
        // Start date
        positionRows = [posit, posit];
        positionColumns = [colum + 6, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'Total Bunkering', 8, black, white, '');
        // IFO start
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns,
            { formula: 'SUM(BD34:BD4000)' },
            8, black, white, '');
        //MGO Start
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns,

            { formula: 'SUM(BX34:BX4000)' }
            , 8, black, white, '');


        posit += 1;
        // Start date
        positionRows = [posit, posit];
        positionColumns = [colum + 6, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'Total Consumption', 8, black, white, '');
        // IFO start
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns,
            { formula: 'SUM(AR34:AY4000)' },
            8, black, white, '');
        //MGO Start
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns,
            { formula: 'SUM(BH34:BS4000)' },
            8, black, white, '');


        posit += 1;
        // Start date
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'END DATE', 8, black, white, '');
        // date start
        positionColumns = [colum + 5, colum + 9];
        this.addStyleByColums(worksheet, positionRows, positionColumns, date_end, 8, black, white, '');
        // IFO start
        positionColumns = [colum + 10, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns,

            { formula: this.PositByCell(positionColumns[0]) + (posit - 3) + '-' + this.PositByCell(positionColumns[0]) + (posit - 1) + '+' + this.PositByCell(positionColumns[0]) + (posit - 2) },
            8, black, white, '');
        //MGO Start
        positionColumns = [colum + 12, colum + 13];
        this.addStyleByColums(worksheet, positionRows, positionColumns,
            { formula: this.PositByCell(positionColumns[0]) + (posit - 3) + '-' + this.PositByCell(positionColumns[0]) + (posit - 1) + '+' + this.PositByCell(positionColumns[0]) + (posit - 2) },
            8, black, white, '');


        positionColumns = [colum, colum + 13];
        // Lineas suabes internas
        positionRows = [posit - 3, posit - 3];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, false, true, true)

        positionRows = [posit - 2, posit - 2];
        positionColumns = [colum + 6, colum + 13];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, false, true, true)
        positionRows = [posit - 1, posit - 1];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, false, true, true)

        positionRows = [posit, posit];
        positionColumns = [colum, colum + 13];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, true, false, true, true)

        // BOrde alrededor.
        positionRows = [posit - 3, posit];
        positionColumns = [colum, colum + 13];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false)


        positionRows = [posit - 4, posit - 4];
        positionColumns = [colum + 10, colum + 13];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false)


        return posit;
    }
    private StyleDashSpeed(worksheet, posit, colum, selectUser: UserEntity, isIFOorMGO: string): number {
        let date_start = '22/22/22'
        let hour_start = '20:20'
        let ifo_start = 200;
        let mgo_start = 300;
        let date_end = '22/22/22'
        let hour_end = '22:21'
        let ifo_end = 222;
        let mgo_end = 440;
        let totalBunkeringIFO = 0;
        let totalBunkeringMGO = 0;

        let totalConsumptIFO = 0;
        let totalConsumptMGO = 0;



        let colorYellowTransgas = 'FFCD06';
        // Variables de colores-
        let blueHard = '001556'
        let blueMedium = '09155694'
        let blueLow = 'b6c2ff94';


        let blueHard1 = '375f9a'
        let blueHard2 = '0040d8'
        let blueHard3 = '001556'

        let greenHard = ''
        let greenMedium = 'b6c2ff94'
        let greenLow = 'b6c2ff94';

        let black = '000'
        let white = 'ffffff';

        // Variables de colores-
        let grisFuerte = 'd4d4d4'
        let grisMedio = 'ebe8e8'
        let grisSuave = 'f3f3f3';

        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';

        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';


        let positionRows = [posit, posit + 1];
        let positionColumns = [colum, colum + 1];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'SPEED', 10, colorYellowTransgas, blueHard3, '')

        positionRows = [posit, posit];
        positionColumns = [colum + 2, colum + 3];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'CHARTER', 8, white, blueHard3, '')

        positionColumns = [colum + 4, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'PERFORMEND', 5, white, blueHard2, '')

        posit += 1;
        positionRows = [posit, posit];

        // FULL Y ECO Charter SPEED
        positionColumns = [colum + 2, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'FULL', 8, white, blueHard3, '')
        positionColumns = [colum + 3, colum + 3];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'ECO', 8, white, blueHard3, '')

        // FULL Y ECO Performan SPEED
        positionColumns = [colum + 4, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'FULL', 8, white, blueHard2, '')
        positionColumns = [colum + 5, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'ECO', 8, white, blueHard2, '')


        posit += 1;
        positionRows = [posit, posit];


        // FULL Y ECO Charter SPEED IFO
        positionColumns = [colum, colum + 1];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('BALLAST'), 8, black, white, '');
        positionColumns = [colum + 2, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingBallastIFO : selectUser.contractSpeedSailingBallastMGO, 8, black, white, '');
        positionColumns = [colum + 3, colum + 3];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingEconomicalIFO : selectUser.contractSpeedSailingEconomicalMGO, 8, black, white, '');

        // FULL Y ECO Performan SPEED
        positionColumns = [colum + 4, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns,
            { formula: isIFOorMGO == 'IFO' ? 'AD23' : 'BR23' },
            8, black, white, '');
        // Agrega formato a Actividad
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(colum + 2) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ',' + this.PositByCell(positionColumns[0]) + positionRows[0] + '>0)'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(colum + 3) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ',' + this.PositByCell(positionColumns[0]) + positionRows[0] + '>0)'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });

        positionColumns = [colum + 5, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns,
            { formula: isIFOorMGO == 'IFO' ? 'AD25' : 'BR25' },
            8, black, white, '')

        // Agrega formato a Actividad
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(colum + 3) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ',' + this.PositByCell(positionColumns[0]) + positionRows[0] + '>0)'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(colum + 3) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ',' + this.PositByCell(positionColumns[0]) + positionRows[0] + '>0)'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });



        posit += 1;
        positionRows = [posit, posit];


        // FULL Y ECO Charter SPEED IFO
        positionColumns = [colum, colum + 1];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('LADEN'), 8, black, white, '');
        positionColumns = [colum + 2, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingLadenIFO : selectUser.contractSpeedSailingLadenMGO, 8, black, white, '');
        positionColumns = [colum + 3, colum + 3];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.sailingEconomicConsumptionIFO : selectUser.sailingEconomicConsumptionMGO, 8, black, white, '');

        // FULL Y ECO Performan SPEED
        positionColumns = [colum + 4, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns,
            { formula: isIFOorMGO == 'IFO' ? 'AD24' : 'BR24' },
            8, black, white, '');
        // Agrega formato a Actividad
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(colum + 4) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(colum + 2) + positionRows[0] + '>' + this.PositByCell(colum + 4) + positionRows[0] + ',' + this.PositByCell(colum + 4) + positionRows[0] + '>0)'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(colum + 2) + positionRows[0] + '<' + this.PositByCell(colum + 4) + positionRows[0] + ',' + this.PositByCell(colum + 4) + positionRows[0] + '>0)'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });

        positionColumns = [colum + 5, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns,
            { formula: isIFOorMGO == 'IFO' ? 'AD25' : 'BR25' },
            8, black, white, '')

        // Agrega formato a Actividad
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(colum + 3) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ',' + this.PositByCell(positionColumns[0]) + positionRows[0] + '>0)'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(colum + 3) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ',' + this.PositByCell(positionColumns[0]) + positionRows[0] + '>0)'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });











        // Linea abajo
        positionRows = [posit - 1, posit - 1];
        positionColumns = [colum, colum + 3];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, true)

        positionColumns = [colum + 4, colum + 5];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard2, false, false, true, true)

        positionRows = [posit, posit];
        positionColumns = [colum, colum + 3];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, true)
        positionColumns = [colum + 4, colum + 5];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard2, false, false, true, true)







        // BOrde final alrededor
        positionColumns = [colum, colum + 3];
        // Lineas suabes internas
        positionRows = [posit - 3, posit];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false)

        positionColumns = [colum + 4, colum + 5];
        // Lineas suabes internas
        positionRows = [posit - 3, posit];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard2, false, false, false, false)


        return posit;
    }
    private StyleDashActivity(worksheet, posit, colum, selectUser: UserEntity, isIFOorMGO: string): number {
        let date_start = '22/22/22'
        let hour_start = '20:20'
        let ifo_start = 200;
        let mgo_start = 300;
        let date_end = '22/22/22'
        let hour_end = '22:21'
        let ifo_end = 222;
        let mgo_end = 440;
        let totalBunkeringIFO = 0;
        let totalBunkeringMGO = 0;

        let totalConsumptIFO = 0;
        let totalConsumptMGO = 0;



        let colorYellowTransgas = 'FFCD06';
        // Variables de colores-
        let blueHard = '001556'
        let blueMedium = '09155694'
        let blueLow = 'b6c2ff94';


        let blueHard1 = '375f9a'
        let blueHard2 = '0040d8'
        let blueHard3 = '001556'

        let greenHard = '091556'
        let greenMedium = 'b6c2ff94'
        let greenLow = 'b6c2ff94';

        let black = '000'
        let white = 'ffffff';

        // Variables de colores-
        let grisFuerte = 'd4d4d4'
        let grisMedio = 'ebe8e8'
        let grisSuave = 'f3f3f3';

        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';

        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';


        let positionRows = [posit, posit];
        let positionColumns = [colum, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'DAILY CONSUMPTION', 10, colorYellowTransgas, blueHard3, '')


        // 51
        posit += 1;

        // Actividades. dailyconsumption
        positionRows = [posit, posit];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('LOADING'), 8, black, white, '')
        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.loadingConsumptionIFO : selectUser.loadingConsumptionMGO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'AM21' : 'CA21' }, 10, black, white, '')
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });


        posit += 1;
        positionRows = [posit, posit];

        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('DOWNLOADING'), 8, black, white, '')

        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.dischargeConsumptionIFO : selectUser.dischargeConsumptionMGO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'AM22' : 'CA22' }, 10, black, white, '')
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });


        posit += 1;
        positionRows = [posit, posit];

        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('BALLAST'), 8, black, white, '')

        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.sailingBallastConsumptionIFO : selectUser.sailingBallastConsumptionMGO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'AM23' : 'CA23' }, 10, black, white, '')
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });


        posit += 1;
        positionRows = [posit, posit];

        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('LADEN'), 8, black, white, '')

        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.sailingLoadConsumptionIFO : selectUser.sailingLoadConsumptionMGO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'AM24' : 'CA24' }, 10, black, white, '')
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });


        posit += 1;
        positionRows = [posit, posit];

        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('ECONOMICAL'), 8, black, white, '')

        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.sailingEconomicConsumptionIFO : selectUser.sailingEconomicConsumptionMGO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'AM25' : 'CA25' }, 10, black, white, '')
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });




        posit += 1;
        positionRows = [posit, posit];

        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('ANCHORED'), 8, black, white, '')

        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.anchoredConsumptionIFO : selectUser.anchoredConsumptionMGO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'AM26' : 'CA26' }, 10, black, white, '')
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });



        posit += 1;
        positionRows = [posit, posit];

        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('MANEUVER'), 8, black, white, '')

        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.maneuverConsumptionIFO : selectUser.maneuverConsumptionMGO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'AM27' : 'CA27' }, 10, black, white, '')
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });



        posit += 1;
        positionRows = [posit, posit];

        // Actividades. dailyconsumption
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('OTHER'), 8, black, white, '')

        positionColumns = [colum + 3, colum + 4];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.otherConsumptionIFO : selectUser.otherConsumptionMGO, 10, black, white, '')
        positionColumns = [colum + 5, colum + 6];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: isIFOorMGO == 'IFO' ? 'AM28' : 'CA28' }, 10, black, white, '')
        worksheet.addConditionalFormatting({
            ref: this.PositByCell(positionColumns[0]) + positionRows[0],
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '<' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                }, {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(' + this.PositByCell(positionColumns[0] - 2) + positionRows[0] + '>' + this.PositByCell(positionColumns[0]) + positionRows[0] + ')'],
                    style: {
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenMedium } },
                    },
                }, {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        font: { color: { argb: grisMedio } },
                    },
                },

            ],
        });



        // Lineas suabes internas
        positionRows = [posit - 8, posit];
        positionColumns = [colum, colum];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 3, colum + 3];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 5, colum + 5];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)


        // BOrde final alrededor
        positionColumns = [colum, colum + 6];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false)


        /* 
          let positionRows = [posit, posit + 1];
          let positionColumns = [colum, colum + 1];
          this.addStyleByColums(worksheet, positionRows, positionColumns, 'SPEED', 10, colorYellowTransgas, blueHard3, '') */

        /* 
            this.addBorder(worksheet, posit, colum, '', blueHard3, 'leftLowRorner');
            this.addBorder(worksheet, posit, colum + 13, '', blueHard3, 'righLowRorner')
            this.addBorder(worksheet, posit - 3, colum + 5, '', blueHard3, 'top')
            this.addBorder(worksheet, posit - 3, colum + 8, '', blueHard3, 'top')
         */
        return posit;
    }
    private StyleDashCosumption(worksheet, posit, colum, selectUser: UserEntity, isIFOorMGO: string): number {



        let colorYellowTransgas = 'FFCD06';

        let blueHard1 = '375f9a'
        let blueHard2 = '0040d8'
        let blueHard3 = '001556'
        let white = 'ffffff';



        let textIFOorVLSFOorLSFO = selectUser.isConsumptionIFO ? 'IFO' : selectUser.isConsumptionLSFO ? 'LSFO' : selectUser.isConsumptionVLSFO ? 'VLSFO' : 'LSFO';

        let positionRow = posit;

        // Primer titulo
        let positionRows = [positionRow, positionRow];
        let positionColumns = [colum, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'VESSEL PERFORMANCE ' + (isIFOorMGO == 'IFO' ? textIFOorVLSFOorLSFO : 'MGO'), 20, colorYellowTransgas, blueHard3, '')

        let startRowReport = positionRow + 16;

        //================AGREGAMOS LA CEBECERA=========
        // TItulo 
        positionRow += 1;
        positionRows = [positionRow, positionRow + 1];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'ACTIVITY\nPERFORMED', 8, white, blueHard1, '')
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL TIME\nPER ACTIVITY\n(HRS)', 6, white, blueHard1, '')
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL DISTANCE (MILES)', 8, white, blueHard1, '')
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'AVERAGE SPEED\n(MILES/HRS)', 8, white, blueHard2, '')
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'AVERAGE SPEED\n(MILES/HRS)\n(CHARTER)', 6, white, blueHard3, '')
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL CONSUMPTION\n(MT)', 7, white, blueHard1, '')
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'DAILY CONSUMPTION\n(MT)', 7, white, blueHard2, '')
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'DAILY CONSUMPTION\n(MT) (CHARTER)', 7, white, blueHard3, '')
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'SAILING TIME\n(HRS) (CHARTER)', 8, white, blueHard3, '')
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'TOTAL CONSUMPTION\n(MT) (CHARTER)', 6, white, blueHard3, '')
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'BALANCE CONSUMPTION\n(MT)', 7, white, blueHard2, '')
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 'BALANCE TIME\n(HRS)', 8, white, blueHard2, '')

        //================= Primera actividad Loading
        positionRow += 2;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('LOADING'), 10, blueHard3, white, '')
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME')
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED')
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000' : '$BT$' + startRowReport + ':$BT$10000') + ',$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION')
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION')
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.loadingConsumptionIFO : selectUser.loadingConsumptionMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + '),0,' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + + positionRow + '=0, ' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 24) + + positionRow + '/24)', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION')
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME')

        //================= Primera actividad Discharge
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('DOWNLOADING'), 10, blueHard3, white, '')
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME')
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED')
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000' : '$BT$' + startRowReport + ':$BT$10000') + ',$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION')
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION')
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.dischargeConsumptionIFO : selectUser.dischargeConsumptionMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + '),0,' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + + positionRow + '=0, ' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 24) + + positionRow + '/24)', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION')
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME')



        //================= Primera actividad Ballasst
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('BALLAST'), 10, blueHard3, white, '')
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME')
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED')
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingBallastIFO : selectUser.contractSpeedSailingBallastMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 15, colum + 17];
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION')
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000' : '$BT$' + startRowReport + ':$BT$10000') + ',$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION')
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.sailingBallastConsumptionIFO : selectUser.sailingBallastConsumptionMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + '),0,' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + + positionRow + '=0, ' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 24) + + positionRow + '/24)', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION')
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 3) + positionRow + '-' + this.PositByCell(colum + 24) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME')


        //================= Primera actividad Laden
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('LADEN'), 10, blueHard3, white, '')
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME')
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED')
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingLadenIFO : selectUser.contractSpeedSailingLadenMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000' : '$BT$' + startRowReport + ':$BT$10000') + ',$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION')
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION')
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.sailingLoadConsumptionIFO : selectUser.sailingLoadConsumptionMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + '),0,' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + + positionRow + '=0, ' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 24) + + positionRow + '/24)', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION')
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 3) + positionRow + '-' + this.PositByCell(colum + 24) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME')



        //================= Primera actividad ECO
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('ECONOMICAL'), 10, blueHard3, white, '')
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME')
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED')
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.contractSpeedSailingEconomicalIFO : selectUser.contractSpeedSailingEconomicalMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000' : '$BT$' + startRowReport + ':$BT$10000') + ',$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION')
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION')
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.sailingEconomicConsumptionIFO : selectUser.sailingEconomicConsumptionMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + '),0,' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + + positionRow + '=0, ' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 24) + + positionRow + '/24)', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION')
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 3) + positionRow + '-' + this.PositByCell(colum + 24) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME')


        //================= Primera actividad ANCHORED
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('ANCHORED'), 10, blueHard3, white, '')
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME')
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED')
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000' : '$BT$' + startRowReport + ':$BT$10000') + ',$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION')
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION')
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.anchoredConsumptionIFO : selectUser.anchoredConsumptionMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + '),0,' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + + positionRow + '=0, ' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 24) + + positionRow + '/24)', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION')
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME')

        //================= Primera actividad ANCHORED
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('MANEUVER'), 10, blueHard3, white, '')
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME')
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED')
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000' : '$BT$' + startRowReport + ':$BT$10000') + ',$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION')
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION')
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.maneuverConsumptionIFO : selectUser.maneuverConsumptionMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + '),0,' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + + positionRow + '=0, ' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 24) + + positionRow + '/24)', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION')
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME')

        //================= Primera actividad OTHER
        positionRow += 1;
        positionRows = [positionRow, positionRow];
        positionColumns = [colum, colum + 2];
        this.addStyleByColums(worksheet, positionRows, positionColumns, this.translate('OTHER_ACT'), 10, blueHard3, white, '')
        positionColumns = [colum + 3, colum + 5];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($U$' + startRowReport + ':$U$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_TIME')
        positionColumns = [colum + 6, colum + 8];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS($AJ$' + startRowReport + ':$AJ$10000,$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 9, colum + 11];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 6) + positionRow + '/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'AVERAGE_SPEED')
        positionColumns = [colum + 12, colum + 14];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
        positionColumns = [colum + 15, colum + 17];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'SUMIFS(' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000' : '$BT$' + startRowReport + ':$BT$10000') + ',$W$' + startRowReport + ':$W$10000,' + this.PositByCell(colum) + positionRow + ',' + (isIFOorMGO == 'IFO' ? '$AZ$' + startRowReport + ':$AZ$10000,">0"' : '$BT$' + startRowReport + ':$BT$10000,">0"') + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'TOTAL_CONSUMPTION')
        positionColumns = [colum + 18, colum + 20];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + '),0,' + this.PositByCell(colum + 15) + positionRow + '*24/' + this.PositByCell(colum + 3) + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'DAILY_CONSUMPTION')
        positionColumns = [colum + 21, colum + 23];
        this.addStyleByColums(worksheet, positionRows, positionColumns, isIFOorMGO == 'IFO' ? selectUser.otherConsumptionIFO : selectUser.otherConsumptionMGO, 8, blueHard3, white, '')
        positionColumns = [colum + 24, colum + 26];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(ISERROR(' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + '),0,' + this.PositByCell(colum + 6) + + positionRow + '/' + this.PositByCell(colum + 12) + + positionRow + ')', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 27, colum + 29];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: 'IF(' + this.PositByCell(colum + 24) + + positionRow + '=0, ' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 3) + positionRow + '/24,' + this.PositByCell(colum + 21) + + positionRow + '*' + this.PositByCell(colum + 24) + + positionRow + '/24)', result: 0.14 }, 8, blueHard3, white, '')
        positionColumns = [colum + 30, colum + 32];
        this.addStyleByColums(worksheet, positionRows, positionColumns, { formula: '' + this.PositByCell(colum + 15) + positionRow + '-' + this.PositByCell(colum + 27) + + positionRow, result: 0.14 }, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_CONSUMPTION')
        positionColumns = [colum + 33, colum + 35];
        this.addStyleByColums(worksheet, positionRows, positionColumns, 0, 8, blueHard3, white, '')
        this.MultipleFormateWorksheet(worksheet, positionRows[0], positionColumns[0], 'BALANCE_TIME')

        // Lineas suabes internas
        /*     positionRows = [posit - 8, posit];
            positionColumns = [colum, colum];
            this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
            positionColumns = [colum + 3, colum + 3];
            this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
            positionColumns = [colum + 5, colum + 5];
            this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        
         */
        // BOrde final alrededor

        positionRows = [posit + 2, posit + 10];
        positionColumns = [colum, colum + 2];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionRows = [posit + 2, posit + 10];
        positionColumns = [colum + 3, colum + 5];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionRows = [posit + 2, posit + 10];
        positionColumns = [colum + 6, colum + 8];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionRows = [posit + 2, posit + 10];
        positionColumns = [colum + 9, colum + 11];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionRows = [posit + 2, posit + 10];
        positionColumns = [colum + 12, colum + 14];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 15, colum + 18];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 19, colum + 21];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 22, colum + 24];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 25, colum + 27];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 28, colum + 30];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 31, colum + 33];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)
        positionColumns = [colum + 34, colum + 35];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thin', blueHard3, false, true, true, false)


        positionRows = [posit, positionRow];
        positionColumns = [colum, colum + 35];
        this.addStyleToBorders(worksheet, positionRows, positionColumns, 'thick', blueHard3, false, false, false, false)

        return positionRow - posit;
    }




    private MultipleFormateWorksheet(worksheet: Worksheet, positionRow: number, positionColum: number, typeFormat: string) {

        let greenLow = 'b6c2ff94';
        let redLow = 'ffd6d6';


        if (typeFormat === 'TOTAL_TIME') {
            worksheet.addConditionalFormatting({
                ref: this.PositByCell(positionColum) + positionRow,
                rules: [
                    // si la actividad es navegando deberia tener una distancia.    
                    {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '>' + this.PositByCell(positionColum + 21) + positionRow + ',' + this.PositByCell(positionColum + 21) + positionRow + '<>0' + ',' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redLow } },
                        },
                    }, {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '<' + this.PositByCell(positionColum + 21) + positionRow + ',' + this.PositByCell(positionColum + 21) + positionRow + '<>0' + ',' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenLow } },
                        },
                    }

                ],
            });

        } else if (typeFormat === 'AVERAGE_SPEED') {
            worksheet.addConditionalFormatting({
                ref: this.PositByCell(positionColum) + positionRow,
                rules: [
                    // si la actividad es navegando deberia tener una distancia.    
                    {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '<' + this.PositByCell(positionColum + 3) + positionRow + ',' + this.PositByCell(positionColum + 3) + positionRow + '<>0' + ',' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redLow } },
                        },
                    }, {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '>' + this.PositByCell(positionColum + 3) + positionRow + ',' + this.PositByCell(positionColum + 3) + positionRow + '<>0' + ',' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenLow } },
                        },
                    }

                ],
            });
        } else if (typeFormat === 'TOTAL_CONSUMPTION') {
            worksheet.addConditionalFormatting({
                ref: this.PositByCell(positionColum) + positionRow,
                rules: [
                    // si la actividad es navegando deberia tener una distancia.    
                    {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '>' + this.PositByCell(positionColum + 12) + positionRow + ',' + this.PositByCell(positionColum + 12) + positionRow + '<>0' + ',' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redLow } },
                        },
                    }, {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '<' + this.PositByCell(positionColum + 12) + positionRow + ',' + this.PositByCell(positionColum + 12) + positionRow + '<>0' + ',' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenLow } },
                        },
                    }

                ],
            });
        } else if (typeFormat === 'DAILY_CONSUMPTION') {
            worksheet.addConditionalFormatting({
                ref: this.PositByCell(positionColum) + positionRow,
                rules: [
                    // si la actividad es navegando deberia tener una distancia.    
                    {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '>' + this.PositByCell(positionColum + 3) + positionRow + ',' + this.PositByCell(positionColum + 3) + positionRow + '<>0' + ',' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redLow } },
                        },
                    }, {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '<' + this.PositByCell(positionColum + 3) + positionRow + ',' + this.PositByCell(positionColum + 3) + positionRow + '<>0' + ',' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenLow } },
                        },
                    }

                ],
            });
        } else if (typeFormat === 'BALANCE_CONSUMPTION') {
            worksheet.addConditionalFormatting({
                ref: this.PositByCell(positionColum) + positionRow,
                rules: [
                    // si la actividad es navegando deberia tener una distancia.    
                    {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '>0,' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redLow } },
                        },
                    }, {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '<0,' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenLow } },
                        },
                    }

                ],
            });
        } else if (typeFormat === 'BALANCE_TIME') {
            worksheet.addConditionalFormatting({
                ref: this.PositByCell(positionColum) + positionRow,
                rules: [
                    // si la actividad es navegando deberia tener una distancia.    
                    {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '>0,' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redLow } },
                        },
                    }, {
                        type: 'expression',
                        priority: 2,
                        formulae: ['AND(' + this.PositByCell(positionColum) + positionRow + '<0,' + this.PositByCell(positionColum) + positionRow + '<>0)'],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenLow } },
                        },
                    }

                ],
            });
        }


    }
    private addStyleByColums(worksheet: Worksheet, position: number[], column: number[], textorFormule: string | number | any, sizeFont: number, colortText: string, colorBackgraund: string, Eliminar?) {

        // SEparamos las posiciones.
        let positionDesde = position[0];
        let positionHasta = position[1];

        let columnDesde = column[0];
        let columnHasta = column[1];


        let style: any = {

            alignment: {
                horizontal: 'center',
                vertical: 'middle',
                wrapText: true
            },
            font: {
                size: sizeFont,
                bold: sizeFont <= 7 ? false : true,
                color: { argb: colortText },
            },
            fill: {
                type: 'pattern',
                pattern: 'solid',
                fgColor: {
                    argb: colorBackgraund
                }
            }

        };


        worksheet.getCell(this.PositByCell(columnDesde) + positionDesde).value = textorFormule;
        worksheet.getCell(this.PositByCell(columnDesde) + positionDesde).style = style;
        //  if(numFmt) {
        // worksheet.getCell(this.PositByCell(columnDesde) + positionDesde).numFmt = numFmt; 
        // }
        worksheet.mergeCells(this.PositByCell(columnDesde) + positionDesde, this.PositByCell(columnHasta) + positionHasta);
    }
    private addStyleBorder(worksheet: Worksheet, position: number[], column: number[], borderStyle, colorborder: string) {

        // SEparamos las posiciones.
        let positionDesde = position[0];
        let positionHasta = position[1];

        let columnDesde = column[0];
        let columnHasta = column[1];



        // nos ayudara a saber en que columna estamos.
        let positionColum = columnDesde;



        //recorremos las celdas del arrededor
        for (let index = positionDesde; index <= positionHasta; index++) {

            if (
                //index == positionDesde
                false
            ) {
                this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftUpperRorner');
                this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righUpperRorner');
            }
            // si es el ultimo para insertar
            else if (index == positionHasta) {
                this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftLowRorner');
                this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righLowRorner');
            } else {
                this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'left');
                this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'right');
            }
        }

        //recorremos las celdas del arrededor
        for (let index = columnDesde + 1; index <= columnHasta - 1; index++) {
            this.addBorder(worksheet, positionHasta, index, borderStyle, colorborder, 'bottom');
        }
    }
    private mergeCellReport(worksheet: Worksheet, position) {

        worksheet.mergeCells('F' + position, 'G' + position);
        worksheet.mergeCells('H' + position, 'K' + position);
        worksheet.mergeCells('L' + position, 'O' + position);
        worksheet.mergeCells('P' + position, 'R' + position);
        worksheet.mergeCells('S' + position, 'T' + position);
        worksheet.mergeCells('U' + position, 'V' + position);
        worksheet.mergeCells('W' + position, 'Z' + position);
        worksheet.mergeCells('AA' + position, 'AB' + position);
        worksheet.mergeCells('AC' + position, 'AI' + position);
        worksheet.mergeCells('AJ' + position, 'AK' + position);
        worksheet.mergeCells('AL' + position, 'AM' + position);
        worksheet.mergeCells('AN' + position, 'AO' + position);
        worksheet.mergeCells('AP' + position, 'AQ' + position);
        worksheet.mergeCells('AR' + position, 'AS' + position);
        worksheet.mergeCells('AT' + position, 'AU' + position);
        worksheet.mergeCells('AV' + position, 'AW' + position);
        worksheet.mergeCells('AX' + position, 'AY' + position);
        worksheet.mergeCells('AZ' + position, 'BA' + position);
        worksheet.mergeCells('BB' + position, 'BC' + position);
        worksheet.mergeCells('BD' + position, 'BE' + position);
        worksheet.mergeCells('BF' + position, 'BG' + position);
        worksheet.mergeCells('BH' + position, 'BI' + position);
        worksheet.mergeCells('BJ' + position, 'BK' + position);
        worksheet.mergeCells('BL' + position, 'BM' + position);
        worksheet.mergeCells('BN' + position, 'BO' + position);
        worksheet.mergeCells('BP' + position, 'BQ' + position);
        worksheet.mergeCells('BR' + position, 'BS' + position);
        worksheet.mergeCells('BT' + position, 'BU' + position);
        worksheet.mergeCells('BV' + position, 'BW' + position);
        worksheet.mergeCells('BX' + position, 'BY' + position);
        worksheet.mergeCells('BZ' + position, 'CA' + position);

    }


    private addFormatting(worksheet: Worksheet, position: number) {

        // Variables de colores-
        let grisFuerte = 'd4d4d4'
        let grisMedio = 'ebe8e8'
        let grisSuave = 'f3f3f3';

        let greenHard = '228e30';
        let greenMedium = '0eb924';
        let greenLow = 'c0fdc8';

        let redHard = '9a2929';
        let redMedium = 'ffa4a4';
        let redLow = 'ffd6d6';

        // Agregar formato a una fcelda
        worksheet.getCell('P' + position).numFmt = 'm/d/yyyy';

        // Agrega formato a Actividad
        worksheet.addConditionalFormatting({
            ref: 'W' + position + ':Z' + position,
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND( OR(EXACT(W' + position + ',"SAILING_WITH_LADEN"), EXACT(W' + position + ',"SAILING_IN_BALLAST"), EXACT(W' + position + ',"ECONOMICAL_NAVIGATION") ), (0=AJ' + position + ') )'],
                    style: {
                        border: {
                            top: { style: 'double', color: { argb: redHard } },
                            left: { style: 'double', color: { argb: redHard } },
                            bottom: { style: 'double', color: { argb: redHard } },
                            right: { style: 'double', color: { argb: redHard } }
                        }
                    },
                },

            ],
        });


        // Agrega formato a distancia
        worksheet.addConditionalFormatting({
            ref: 'AJ' + position + ':AK' + position,
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND( OR(EXACT(W' + position + ',"SAILING_WITH_LADEN"), EXACT(W' + position + ',"SAILING_IN_BALLAST"), EXACT(W' + position + ',"ECONOMICAL_NAVIGATION") ), (0=AJ' + position + ') )'],
                    style: {
                        border: {
                            top: { style: 'double', color: { argb: redHard } },
                            left: { style: 'double', color: { argb: redHard } },
                            bottom: { style: 'double', color: { argb: redHard } },
                            right: { style: 'double', color: { argb: redHard } }
                        }
                    },
                },

            ],
        });

        // Agrega el formato a speed
        worksheet.addConditionalFormatting({
            ref: 'AN' + position + ':AO' + position,
            rules: [

                {
                    type: 'cellIs',
                    priority: 1,
                    operator: 'equal',
                    formulae: [0],
                    style: {
                        border: {},
                        font: { color: { argb: grisMedio } },
                    },
                },
                // Menor que 
                {
                    type: 'expression',
                    priority: 1,
                    formulae: ['AND( AN' + position + ' <12, AN' + position + ' > 0 )'],
                    style: {
                        font: { color: { argb: redHard } },
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: redMedium } },
                    },
                },
                // Mayor que 
                {
                    type: 'expression',
                    priority: 1,
                    formulae: ['AN' + position + ' >=12'],
                    style: {
                        font: { color: { argb: greenHard } },
                        fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: greenLow } },
                    },
                },
                // si la actividad es navegando deberia tener una velocidad.       
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND( OR(EXACT(W' + position + ',"SAILING_WITH_LADEN"), EXACT(W' + position + ',"SAILING_IN_BALLAST"), EXACT(W' + position + ',"ECONOMICAL_NAVIGATION") ), (0=AN' + position + ') )'],
                    style: {
                        border: {
                            top: { style: 'double', color: { argb: redHard } },
                            left: { style: 'double', color: { argb: redHard } },
                            bottom: { style: 'double', color: { argb: redHard } },
                            right: { style: 'double', color: { argb: redHard } }
                        }
                    },
                },

            ],
        });

        // Agrega formato a Tiempo
        worksheet.addConditionalFormatting({
            ref: 'AL' + position + ':AM' + position,
            rules: [
                // si la actividad es navegando deberia tener una distancia.    
                {
                    type: 'expression',
                    priority: 2,
                    formulae: ['AND(  (0=AL' + position + ') )'],
                    style: {
                        border: {
                            top: { style: 'double', color: { argb: redHard } },
                            left: { style: 'double', color: { argb: redHard } },
                            bottom: { style: 'double', color: { argb: redHard } },
                            right: { style: 'double', color: { argb: redHard } }
                        }
                    },
                },

            ],
        });

        if (position % 2 === 0) {
            // Agrega formato a Actividad
            worksheet.addConditionalFormatting({
                ref: 'F' + position + ':CA' + position,
                rules: [
                    // si la actividad es navegando deberia tener una distancia.    
                    {
                        type: 'expression',
                        priority: 20,
                        formulae: [true],
                        style: {
                            fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: grisSuave } },

                        },
                    },

                ],
            });
        } else {

        }

    }

    // ingresas el numero y devuelve la letra
    public PositByCell(positionColum: number): string {
        let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
            'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',
            'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ'];

        return letras[positionColum];
    }
    // Agrega borde a una celda en expeciofica
    //righUpperRorner =
    private addBorder(worksheet: Worksheet, positionRow: number, positionColumn: number, borderStyle, colorborder: string, lugardelBorde: string) {

        borderStyle = borderStyle || 'solid';
        let border: any = worksheet.getCell(this.PositByCell(positionColumn) + positionRow).style.border;

        border = border || {};
        if (lugardelBorde == 'left') {
            border.left = { style: borderStyle, color: { argb: colorborder } };
        } else if (lugardelBorde == 'right') {
            border.right = { style: borderStyle, color: { argb: colorborder } };
        } else if (lugardelBorde == 'bottom') {
            border.bottom = { style: borderStyle, color: { argb: colorborder } };
        } else if (lugardelBorde == 'top') {
            border.top = { style: borderStyle, color: { argb: colorborder } };
        } else if (lugardelBorde == 'righUpperRorner') {
            border.top = { style: borderStyle, color: { argb: colorborder } };
            border.right = { style: borderStyle, color: { argb: colorborder } };
        } else if (lugardelBorde == 'righLowRorner') {
            border.bottom = { style: borderStyle, color: { argb: colorborder } };
            border.right = { style: borderStyle, color: { argb: colorborder } };
        }
        else if (lugardelBorde == 'leftUpperRorner') {
            border.top = { style: borderStyle, color: { argb: colorborder } };
            border.left = { style: borderStyle, color: { argb: colorborder } };
        }
        else if (lugardelBorde == 'leftLowRorner') {
            border.bottom = { style: borderStyle, color: { argb: colorborder } };
            border.left = { style: borderStyle, color: { argb: colorborder } };
        }
        else {

            border.top = { style: borderStyle, color: { argb: colorborder } };
            border.right = { style: borderStyle, color: { argb: colorborder } };
            border.bottom = { style: borderStyle, color: { argb: colorborder } };
            border.left = { style: borderStyle, color: { argb: colorborder } };

        }


        worksheet.getCell(this.PositByCell(positionColumn) + positionRow).border = border;


    }
    private addStyleToBorders(worksheet: Worksheet, position: number[], column: number[], borderStyle, colorborder: string, top: boolean, right: boolean, bottom: boolean, left: boolean) {

        // SEparamos las posiciones.
        let positionDesde = position[0];
        let positionHasta = position[1];

        let columnDesde = column[0];
        let columnHasta = column[1];



        // nos ayudara a saber en que columna estamos.
        let positionColum = columnDesde;



        //recorremos las celdas del arrededor
        for (let index = positionDesde; index <= positionHasta; index++) {


            if (top || right || bottom || left) {
                if (top) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'top');
                }
                if (right) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'right');
                }
                if (bottom) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'bottom');
                }
                if (left) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'left');
                }
            } else {

                if (
                    index == positionDesde
                ) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftUpperRorner');
                    this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righUpperRorner');
                }
                // si es el ultimo para insertar
                else if (index == positionHasta) {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'leftLowRorner');
                    this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'righLowRorner');
                } else {
                    this.addBorder(worksheet, index, positionColum, borderStyle, colorborder, 'left');
                    this.addBorder(worksheet, index, columnHasta, borderStyle, colorborder, 'right');
                }
            }
        }






        //recorremos las celdas del arrededor
        for (let index = columnDesde; index <= columnHasta; index++) {
            if (top || right || bottom || left) {
                if (top) {
                    this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'top');
                }
                if (right) {
                    this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'right');
                }
                if (bottom) {
                    this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'bottom');
                }
                if (left) {
                    this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'left');
                }
            } else {

                this.addBorder(worksheet, positionDesde, index, borderStyle, colorborder, 'top');
                this.addBorder(worksheet, positionHasta, index, borderStyle, colorborder, 'bottom');
            }
        }

    }
    // Busca la letra y devuelve el numero.
    public SearchPositByCell(letraColum: string): any {
        let letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ',
            'BA', 'BB', 'BC', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BK', 'BL', 'BM', 'BN', 'BO', 'BP', 'BQ', 'BR', 'BS', 'BT', 'BU', 'BV', 'BW', 'BX', 'BY', 'BZ',
            'CA', 'CB', 'CC', 'CD', 'CE', 'CF', 'CG', 'CH', 'CI', 'CJ', 'CK', 'CL', 'CM', 'CN', 'CO', 'CP', 'CQ', 'CR', 'CS', 'CT', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ'];


        letras.forEach(
            (letra, index) => {
                if (letra === letraColum) {
                    return index;
                }
            }
        );
    }


    private translate(text: string): string {

        switch (text) {
            case 'LOADING':
                return 'Loading'
                break;
            case 'DOWNLOADING':
                return 'Discharge'
                break;
            case 'BALLAST':
                return 'S. Ballast'
                break;
            case 'LADEN':
                return 'S. Laden'
                break;
            case 'ECONOMICAL':
                return 'S. Economical'
                break;
            case 'ANCHORED':
                return 'Anchored'
                break;
            case 'MANEUVER':
                return 'Maneuver'
                break;
            case 'OTHER':
                return 'Other Act'
                break;
            case 'OTHER_ACT':
                return 'Other Act'
                break;
            case 'SAILING_IN_BALLAST':
                return 'S. Ballast'
                break;
            case 'SAILING_WITH_LADEN':
                return 'S. Laden'
                break;
            case 'ECONOMICAL_NAVIGATION':
                return 'S. Economical'
                break;



            default:
                break;
        }
    }
}

export class InfoVessel {
    constructor(
        public date_start?: string,
        public hour_start?: string,
        public ifo_start?: number,
        public mgo_start?: number,
        public date_end?: string,
        public hour_end?: string,
        public ifo_end?: number,
        public mgo_end?: number,
        public totalBunkeringIFO?: number,
        public totalBunkeringMGO?: number,
        public totalConsumptIFO?: number,
        public totalConsumptMGO?: number,
    ) {
        this.date_start = date_start || '';
        this.hour_start = hour_start || '';
        this.ifo_start = ifo_start || 0;
        this.mgo_start = mgo_start || 0;

        this.date_end = date_end || '';
        this.hour_end = hour_end || '';
        this.ifo_end = ifo_end || 0;
        this.mgo_end = mgo_end || 0;

        this.totalBunkeringIFO = totalBunkeringIFO || 0;
        this.totalBunkeringMGO = totalBunkeringMGO || 0;
        this.totalConsumptIFO = totalConsumptIFO || 0;
        this.totalConsumptMGO = totalConsumptMGO || 0;
    }
}