import { Injectable } from '@nestjs/common'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { Express } from 'express' // Import Express types
import { existsSync, mkdirSync } from 'fs'
import axios from 'axios'
import * as FormData from 'form-data'; // Import FormData correctly


@Injectable()
export class ScreenshotService {
  async handleScreenshot(file: Express.Multer.File) {
    const screenshotsDir = join(__dirname, '..', '..', 'screenshots')

    // Create the directory if it doesn't exist
    if (!existsSync(screenshotsDir)) {
      mkdirSync(screenshotsDir, { recursive: true })
    }

    const filePath = join(screenshotsDir, file.originalname)

    // Save the file to the desired location
    await writeFile(filePath, file.buffer)

    // Send the screenshot to Telegram
    await this.sendScreenshotToTelegram(file.buffer)

    return { message: 'Screenshot uploaded and sent to Telegram successfully', filePath }
  }

  private async sendScreenshotToTelegram(imageBuffer: Buffer) {
    const url = `https://api.telegram.org/bot${'7264760628:AAF9lm1QjxJaNdIpMz24rQ5DBJ6497Y8hV0'}/sendPhoto`

    const formData = new FormData()
    formData.append('chat_id', '928372069')
    formData.append('photo', imageBuffer, 'screenshot.png')

    try {
      const response = await axios.post(url, formData, {
        headers: formData.getHeaders(), // Get headers from the FormData instance
      })
      console.log('Screenshot sent to Telegram:', response.data)
    } catch (error) {
      console.error('Error sending screenshot to Telegram:', error.response?.data || error.message)
    }
  }
}
