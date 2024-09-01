export declare class ScreenshotService {
    handleScreenshot(file: Express.Multer.File): Promise<{
        message: string;
        filePath: string;
    }>;
    private sendScreenshotToTelegram;
}
