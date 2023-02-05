import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageService } from './send-message.service';

describe('SendMessageService', () => {
  let service: SendMessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SendMessageService],
    }).compile();

    service = module.get<SendMessageService>(SendMessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
