import { Module } from '@nestjs/common';
import { ChromeService } from './chrome.service';
import { ChromeController } from './chrome.controller';

@Module({
  controllers: [ChromeController],
  providers: [ChromeService],
})
export class ChromeModule {}
