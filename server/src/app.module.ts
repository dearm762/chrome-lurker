import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ChromeModule } from './chrome/chrome.module'
import { ScreenshotModule } from './screenshot/screenshot.module';

@Module({
  imports: [ChromeModule, ScreenshotModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
