import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { ChromeService } from './chrome.service'

@Controller('chrome')
export class ChromeController {
  constructor(private readonly chromeService: ChromeService) { }

  @Post()
  getHello(
    @Body('address') address: string
  ) {
    if (!address) throw new BadRequestException('address is required')

    return this.chromeService.sendToTelegram(address)
  }
}
