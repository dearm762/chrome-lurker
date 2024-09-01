import { ScreenshotService } from './screenshot.service';
export declare class ScreenshotController {
    private readonly screenshotService;
    constructor(screenshotService: ScreenshotService);
    uploadScreenshot(file: Express.Multer.File): Promise<{
        message: string;
        filePath: string;
    }>;
}
