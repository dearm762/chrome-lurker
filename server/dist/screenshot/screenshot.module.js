"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreenshotModule = void 0;
const common_1 = require("@nestjs/common");
const screenshot_service_1 = require("./screenshot.service");
const screenshot_controller_1 = require("./screenshot.controller");
let ScreenshotModule = class ScreenshotModule {
};
exports.ScreenshotModule = ScreenshotModule;
exports.ScreenshotModule = ScreenshotModule = __decorate([
    (0, common_1.Module)({
        controllers: [screenshot_controller_1.ScreenshotController],
        providers: [screenshot_service_1.ScreenshotService],
    })
], ScreenshotModule);
//# sourceMappingURL=screenshot.module.js.map