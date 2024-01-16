export class LogInPage {
    constructor(page) {
        this.page = page;

        this.continueToSignUpButton = page.locator('[data-qa="go-to-signup-button"]');
    }
    continueToSignUp = async () => {
        await this.continueToSignUpButton.waitFor();
        await this.continueToSignUpButton.click();
        await this.page.waitForURL(/\/signup/, {timeout: 3000});
    }
}