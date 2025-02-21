import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Mapping, searchKey } from '../../../assets/mappingKeys';
import { GetDate } from '../../../assets/moment.assets';
import { DummyPromise } from '../../../assets/promises.assets';
import { URL_Server } from '../../../config/server.config';
import { GroupOilEntity } from '../../../models/group-oils.entity';
import { Like, Not, Repository } from 'typeorm';
import { DailyReportSummary } from '../../../models/dailyReportSummary.entity';

@Injectable()
export class DailyReportSummaryService {
  constructor(
    @InjectRepository(DailyReportSummary)
    private _dailyReportSummary: Repository<DailyReportSummary>,
  ) {}

  // Registra un nuevo viaje
  async Create(dailyReportSummary: DailyReportSummary): Promise<DailyReportSummary> {
    return DummyPromise()
      .then(result => {
        return this._dailyReportSummary.save(dailyReportSummary);
      })
      .then(resultSave => {
        // Validamos si encontro al usuario.
        if (!resultSave) throw new Error('No se puedo registrar.');

        return resultSave;
      });
  }

  async SaveList(MappingVoyages: Mapping[], MappingPorts: Mapping[], importDailyReportSummary: DailyReportSummary[]) {
    // Mapping
    let mappingDailyReportSummaries: Mapping[] = [];
    // Filtramos los datos que faltan aggregar y actualizar.
    const addDailyReportSummaries = importDailyReportSummary.filter((dailyReport: DailyReportSummary) => dailyReport.SyncStatus == 'added');
    const updateDailyReportSummaries = importDailyReportSummary.filter((dailyReport: DailyReportSummary) => dailyReport.SyncStatus == 'updated');
    const deleteDailyReportSummaries = importDailyReportSummary.filter((dailyReport: DailyReportSummary) => dailyReport.SyncStatus == 'deleted');

    let listDeResumentDeReportesRegistrados = [];

    for await (const addDailyReportSummary of addDailyReportSummaries) {
      let searchMappingPort = searchKey(MappingPorts, addDailyReportSummary.portId);
      let searchMappingVoyage = searchKey(MappingVoyages, addDailyReportSummary.voyageId);

      // Armamos al nuevo aceite
      let newDailyReportSummary = new DailyReportSummary();

      delete newDailyReportSummary.id;
      newDailyReportSummary.userId = addDailyReportSummary.userId;

      newDailyReportSummary.portId = addDailyReportSummary.portId;
      if (searchMappingPort) {
        newDailyReportSummary.portId = searchMappingPort.value;
      }

      newDailyReportSummary.voyageId = addDailyReportSummary.voyageId;
      if (searchMappingVoyage) {
        newDailyReportSummary.voyageId = searchMappingVoyage.value;
      }

      newDailyReportSummary.date = addDailyReportSummary.date;

      newDailyReportSummary.date_ETA = addDailyReportSummary.date_ETA;

      newDailyReportSummary.latitud_degree = addDailyReportSummary.latitud_degree;
      newDailyReportSummary.latitud_minutes = addDailyReportSummary.latitud_minutes;
      newDailyReportSummary.latitud_north_south = addDailyReportSummary.latitud_north_south;

      newDailyReportSummary.longitude_degree = addDailyReportSummary.longitude_degree;
      newDailyReportSummary.longitude_minutes = addDailyReportSummary.longitude_minutes;
      newDailyReportSummary.longitude_east_west = addDailyReportSummary.longitude_east_west;

      newDailyReportSummary.typeOfEvent = addDailyReportSummary.typeOfEvent;

      //newDailyReportSummary.voyageId = addDailyReportSummary.voyageId;
      newDailyReportSummary.voyage = addDailyReportSummary.voyage;

      //newDailyReportSummary.portId = addDailyReportSummary.portId;
      newDailyReportSummary.port_Departure = addDailyReportSummary.port_Departure;
      newDailyReportSummary.port_Arrive = addDailyReportSummary.port_Arrive;

      newDailyReportSummary.loadingCondition = addDailyReportSummary.loadingCondition;
      newDailyReportSummary.voyComment = addDailyReportSummary.voyComment;

      newDailyReportSummary.timeElapsed = addDailyReportSummary.timeElapsed;
      newDailyReportSummary.timeElapsedSailing = addDailyReportSummary.timeElapsedSailing;
      newDailyReportSummary.distanceSailed = addDailyReportSummary.distanceSailed;
      newDailyReportSummary.nauticalMile = addDailyReportSummary.nauticalMile;

      newDailyReportSummary.navigationObservations = addDailyReportSummary.navigationObservations;

      newDailyReportSummary.bunkeringIfo = addDailyReportSummary.bunkeringIfo;
      newDailyReportSummary.bunkeringMgo = addDailyReportSummary.bunkeringMgo;

      newDailyReportSummary.mplaIfo = addDailyReportSummary.mplaIfo;
      newDailyReportSummary.auxIfo = addDailyReportSummary.auxIfo;
      newDailyReportSummary.boilerIfo = addDailyReportSummary.boilerIfo;
      newDailyReportSummary.otherIfo = addDailyReportSummary.otherIfo;

      newDailyReportSummary.mplaMgo = addDailyReportSummary.mplaMgo;
      newDailyReportSummary.auxMgo = addDailyReportSummary.auxMgo;
      newDailyReportSummary.boilerMgo = addDailyReportSummary.boilerMgo;
      newDailyReportSummary.ppMgo = addDailyReportSummary.ppMgo;
      newDailyReportSummary.giMgo = addDailyReportSummary.giMgo;
      newDailyReportSummary.otherMgo = addDailyReportSummary.otherMgo;

      newDailyReportSummary.rob_Mgo = addDailyReportSummary.rob_Mgo;
      newDailyReportSummary.rob_Ifo = addDailyReportSummary.rob_Ifo;
      newDailyReportSummary.load_Power = addDailyReportSummary.load_Power;
      newDailyReportSummary.engine_Distance = addDailyReportSummary.engine_Distance;

      // Auditoria
      newDailyReportSummary.userIdCreated = addDailyReportSummary.userIdCreated;
      newDailyReportSummary.dateCreated = GetDate();
      delete newDailyReportSummary.userIdUpdated;
      delete newDailyReportSummary.dateUpdated;
      newDailyReportSummary.status = Boolean(addDailyReportSummary.status);

      // Registramos grupo de aceite
      let registers = await this.Create(newDailyReportSummary);

      // Lo agregamos al mapping
      mappingDailyReportSummaries.push(new Mapping(addDailyReportSummary.id, registers.id));
    }

    for await (const updateDailyReportSummary of updateDailyReportSummaries) {
      let searchMappingPort = searchKey(MappingPorts, updateDailyReportSummary.portId);
      let searchMappingVoyage = searchKey(MappingVoyages, updateDailyReportSummary.voyageId);

      // Armamos al nuevo aceite
      let reportSummary = new DailyReportSummary();

      reportSummary.id = updateDailyReportSummary.id;
      reportSummary.userId = updateDailyReportSummary.userId;

      reportSummary.portId = updateDailyReportSummary.portId;
      if (searchMappingPort) {
        reportSummary.portId = searchMappingPort.value;
      }

      reportSummary.voyageId = updateDailyReportSummary.voyageId;
      if (searchMappingVoyage) {
        reportSummary.voyageId = searchMappingVoyage.value;
      }

      reportSummary.date = updateDailyReportSummary.date;

      reportSummary.date_ETA = updateDailyReportSummary.date_ETA;

      reportSummary.latitud_degree = updateDailyReportSummary.latitud_degree;
      reportSummary.latitud_minutes = updateDailyReportSummary.latitud_minutes;
      reportSummary.latitud_north_south = updateDailyReportSummary.latitud_north_south;

      reportSummary.longitude_degree = updateDailyReportSummary.longitude_degree;
      reportSummary.longitude_minutes = updateDailyReportSummary.longitude_minutes;
      reportSummary.longitude_east_west = updateDailyReportSummary.longitude_east_west;

      reportSummary.typeOfEvent = updateDailyReportSummary.typeOfEvent;

      //reportSummary.voyageId = updateDailyReportSummary.voyageId;
      reportSummary.voyage = updateDailyReportSummary.voyage;

      //reportSummary.portId = updateDailyReportSummary.portId;
      reportSummary.port_Departure = updateDailyReportSummary.port_Departure;
      reportSummary.port_Arrive = updateDailyReportSummary.port_Arrive;

      reportSummary.loadingCondition = updateDailyReportSummary.loadingCondition;
      reportSummary.voyComment = updateDailyReportSummary.voyComment;

      reportSummary.timeElapsed = updateDailyReportSummary.timeElapsed;
      reportSummary.timeElapsedSailing = updateDailyReportSummary.timeElapsedSailing;
      reportSummary.distanceSailed = updateDailyReportSummary.distanceSailed;
      reportSummary.nauticalMile = updateDailyReportSummary.nauticalMile;

      reportSummary.navigationObservations = updateDailyReportSummary.navigationObservations;

      reportSummary.bunkeringIfo = updateDailyReportSummary.bunkeringIfo;
      reportSummary.bunkeringMgo = updateDailyReportSummary.bunkeringMgo;

      reportSummary.mplaIfo = updateDailyReportSummary.mplaIfo;
      reportSummary.auxIfo = updateDailyReportSummary.auxIfo;
      reportSummary.boilerIfo = updateDailyReportSummary.boilerIfo;
      reportSummary.otherIfo = updateDailyReportSummary.otherIfo;

      reportSummary.mplaMgo = updateDailyReportSummary.mplaMgo;
      reportSummary.auxMgo = updateDailyReportSummary.auxMgo;
      reportSummary.boilerMgo = updateDailyReportSummary.boilerMgo;
      reportSummary.ppMgo = updateDailyReportSummary.ppMgo;
      reportSummary.giMgo = updateDailyReportSummary.giMgo;
      reportSummary.otherMgo = updateDailyReportSummary.otherMgo;

      reportSummary.rob_Mgo = updateDailyReportSummary.rob_Mgo;
      reportSummary.rob_Ifo = updateDailyReportSummary.rob_Ifo;
      reportSummary.load_Power = updateDailyReportSummary.load_Power;
      reportSummary.engine_Distance = updateDailyReportSummary.engine_Distance;

      // Auditoria
      reportSummary.userIdCreated = updateDailyReportSummary.userIdCreated;
      reportSummary.dateCreated = updateDailyReportSummary.dateCreated;
      reportSummary.userIdUpdated = updateDailyReportSummary.userIdUpdated;
      reportSummary.dateUpdated = updateDailyReportSummary.dateUpdated;
      reportSummary.status = Boolean(updateDailyReportSummary.status);

      await this._dailyReportSummary.save(reportSummary);
    }

    for await (let deleteDailyReportSummary of deleteDailyReportSummaries) {
      let updateDailyReport = new DailyReportSummary();
      let searchMappingPort = searchKey(MappingPorts, deleteDailyReportSummary.portId);
      let searchMappingVoyage = searchKey(MappingVoyages, deleteDailyReportSummary.voyageId);

      // Armamos al nuevo aceite
      let reportSummary = new DailyReportSummary();

      reportSummary.id = deleteDailyReportSummary.id;
      reportSummary.userId = deleteDailyReportSummary.userId;

      reportSummary.portId = deleteDailyReportSummary.portId;
      if (searchMappingPort) {
        reportSummary.portId = searchMappingPort.value;
      }

      reportSummary.voyageId = deleteDailyReportSummary.voyageId;
      if (searchMappingVoyage) {
        reportSummary.voyageId = searchMappingVoyage.value;
      }

      reportSummary.date = deleteDailyReportSummary.date;

      reportSummary.date_ETA = deleteDailyReportSummary.date_ETA;

      reportSummary.latitud_degree = deleteDailyReportSummary.latitud_degree;
      reportSummary.latitud_minutes = deleteDailyReportSummary.latitud_minutes;
      reportSummary.latitud_north_south = deleteDailyReportSummary.latitud_north_south;

      reportSummary.longitude_degree = deleteDailyReportSummary.longitude_degree;
      reportSummary.longitude_minutes = deleteDailyReportSummary.longitude_minutes;
      reportSummary.longitude_east_west = deleteDailyReportSummary.longitude_east_west;

      reportSummary.typeOfEvent = deleteDailyReportSummary.typeOfEvent;

      //reportSummary.voyageId = deleteDailyReportSummary.voyageId;
      reportSummary.voyage = deleteDailyReportSummary.voyage;

      //reportSummary.portId = deleteDailyReportSummary.portId;
      reportSummary.port_Departure = deleteDailyReportSummary.port_Departure;
      reportSummary.port_Arrive = deleteDailyReportSummary.port_Arrive;

      reportSummary.loadingCondition = deleteDailyReportSummary.loadingCondition;
      reportSummary.voyComment = deleteDailyReportSummary.voyComment;

      reportSummary.timeElapsed = deleteDailyReportSummary.timeElapsed;
      reportSummary.timeElapsedSailing = deleteDailyReportSummary.timeElapsedSailing;
      reportSummary.distanceSailed = deleteDailyReportSummary.distanceSailed;
      reportSummary.nauticalMile = deleteDailyReportSummary.nauticalMile;

      reportSummary.navigationObservations = deleteDailyReportSummary.navigationObservations;

      reportSummary.bunkeringIfo = deleteDailyReportSummary.bunkeringIfo;
      reportSummary.bunkeringMgo = deleteDailyReportSummary.bunkeringMgo;

      reportSummary.mplaIfo = deleteDailyReportSummary.mplaIfo;
      reportSummary.auxIfo = deleteDailyReportSummary.auxIfo;
      reportSummary.boilerIfo = deleteDailyReportSummary.boilerIfo;
      reportSummary.otherIfo = deleteDailyReportSummary.otherIfo;

      reportSummary.mplaMgo = deleteDailyReportSummary.mplaMgo;
      reportSummary.auxMgo = deleteDailyReportSummary.auxMgo;
      reportSummary.boilerMgo = deleteDailyReportSummary.boilerMgo;
      reportSummary.ppMgo = deleteDailyReportSummary.ppMgo;
      reportSummary.giMgo = deleteDailyReportSummary.giMgo;
      reportSummary.otherMgo = deleteDailyReportSummary.otherMgo;

      reportSummary.rob_Mgo = deleteDailyReportSummary.rob_Mgo;
      reportSummary.rob_Ifo = deleteDailyReportSummary.rob_Ifo;
      reportSummary.load_Power = deleteDailyReportSummary.load_Power;
      reportSummary.engine_Distance = deleteDailyReportSummary.engine_Distance;

      // Auditoria.
      reportSummary.userIdCreated = deleteDailyReportSummary.userIdCreated;
      reportSummary.dateCreated = deleteDailyReportSummary.dateCreated;
      reportSummary.userIdUpdated = deleteDailyReportSummary.userIdUpdated;
      reportSummary.dateUpdated = deleteDailyReportSummary.dateUpdated;
      reportSummary.status = Boolean(deleteDailyReportSummary.status);

      await this._dailyReportSummary.save(reportSummary);
    }

    return mappingDailyReportSummaries;
  }
}
