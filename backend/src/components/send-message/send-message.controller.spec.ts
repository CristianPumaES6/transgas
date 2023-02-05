import { Test, TestingModule } from '@nestjs/testing';
import { SendMessageController } from './send-message.controller';

describe('SendMessageController', () => {
  let controller: SendMessageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SendMessageController],
    }).compile();

    controller = module.get<SendMessageController>(SendMessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
