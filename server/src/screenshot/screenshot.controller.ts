import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ScreenshotService } from './screenshot.service'

@Controller('screenshot')
export class ScreenshotController {
  constructor(private readonly screenshotService: ScreenshotService) { }

  @Post()
  @UseInterceptors(FileInterceptor('screenshot'))
  async uploadScreenshot(@UploadedFile() file: Express.Multer.File) {
    return this.screenshotService.handleScreenshot(file)
  }
}
