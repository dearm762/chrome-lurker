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
exports.ScreenshotController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const screenshot_service_1 = require("./screenshot.service");
let ScreenshotController = class ScreenshotController {
    constructor(screenshotService) {
        this.screenshotService = screenshotService;
    }
    async uploadScreenshot(file) {
        return this.screenshotService.handleScreenshot(file);
    }
};
exports.ScreenshotController = ScreenshotController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('screenshot')),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScreenshotController.prototype, "uploadScreenshot", null);
exports.ScreenshotController = ScreenshotController = __decorate([
    (0, common_1.Controller)('screenshot'),
    __metadata("design:paramtypes", [screenshot_service_1.ScreenshotService])
], ScreenshotController);
//# sourceMappingURL=screenshot.controller.js.map