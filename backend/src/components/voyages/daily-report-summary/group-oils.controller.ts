import { Controller, Get, Headers, HttpException, HttpStatus, Query } from '@nestjs/common';
import { JwtDecode } from '../../../assets/jwtDecode.assets';
import { DummyPromise } from '../../../assets/promises.assets';
import { GroupOilEntity } from '../../../models/group-oils.entity';
import { UserEntity } from '../../../models/user.entity';
import { DailyReportSummary } from 'src/models/dailyReportSummary.entity';

@Controller('dailyReportSummary')
export class DailyReportSummaryController {
  constructor(private readonly _DailyReportSummary: DailyReportSummary) {}

  @Get()
  Gets(@Headers() headers, @Query() dailyReportSummary: DailyReportSummary): Promise<any> {
    // Le asigno el valor al token desde la cabecera.
    // Lo decodifico con otra libreria por problemas jwt-module.
    let headerToken: UserEntity = JwtDecode(headers.authorization);

    // Inicio una promesa Dummy.
    return DummyPromise()
      .then((resultDummy: Boolean) => {
        // Retornamos una Respuesta exitosa.
        return {
          status: HttpStatus.OK,
          message: 'OK',
          data: '',
        };
      })
      .catch(err => {
        // Obtengo mensajes de error
        const clientMsg: string = typeof err === 'string' ? err : 'CANNOT_PROCESS_REQUEST';
        const errorMsg: string = typeof err === 'string' ? err : err.message || err.description || 'ERROR_EXEC_REQUEST';

        // Caso contrario retornamos un error
        throw new HttpException(
          {
            status: HttpStatus.ACCEPTED,
            error: clientMsg,
            message: errorMsg,
          },
          HttpStatus.ACCEPTED,
        );
      });
  }
}
