"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChromeController = void 0;
const common_1 = require("@nestjs/common");
const chrome_service_1 = require("./chrome.service");
let ChromeController = class ChromeController {
    constructor(chromeService) {
        this.chromeService = chromeService;
    }
    getHello(address) {
        if (!address)
            throw new common_1.BadRequestException('address is required');
        return this.chromeService.sendToTelegram(address);
    }
};
exports.ChromeController = ChromeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('address')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ChromeController.prototype, "getHello", null);
exports.ChromeController = ChromeController = __decorate([
    (0, common_1.Controller)('chrome'),
    __metadata("design:paramtypes", [chrome_service_1.ChromeService])
], ChromeController);
//# sourceMappingURL=chrome.controller.js.map