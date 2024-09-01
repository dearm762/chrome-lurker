import { ChromeService } from './chrome.service';
export declare class ChromeController {
    private readonly chromeService;
    constructor(chromeService: ChromeService);
    getHello(address: string): Promise<void>;
}
