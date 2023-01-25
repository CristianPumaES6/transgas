import { Test, TestingModule } from '@nestjs/testing';
import { FormatExcelLastVoyageService } from './format-excel-last-voyage.service';

describe('FormatExcelLastVoyageService', () => {
  let service: FormatExcelLastVoyageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FormatExcelLastVoyageService],
    }).compile();

    service = module.get<FormatExcelLastVoyageService>(FormatExcelLastVoyageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
