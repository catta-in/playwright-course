import { expect } from "@playwright/test";

export class PaymentPage {
    constructor(page) {
        this.page = page;

        this.discountCode = page.frameLocator('[data-qa="active-discount-container"]')
                                .locator('[data-qa="discount-code"]');
        this.discountInput = page.getByPlaceholder('Discount code');
        this.submitDiscountButton = page.locator('[data-qa="submit-discount-button"]');
        this.discountActivatedText = page.locator('[data-qa="discount-active-message"]');
        this.totalValue = page.locator('[data-qa="total-value"]');
        this.totalWithDiscount = page.locator('[data-qa="total-with-discount-value"]');
        this.cardOwnerInput = page.locator('[data-qa="credit-card-owner"]');
        this.cardNumberInput = page.locator('[data-qa="credit-card-number"]');
        this.cardExpiryInput = page.locator('[data-qa="valid-until"]');
        this.cardCodeInput = page.locator('[data-qa="credit-card-cvc"]');
        this.payButton = page.locator('[data-qa="pay-button"]');
    }
    activateDiscount = async () => {
        await this.discountCode.waitFor();
        const code = await this.discountCode.innerText();
        await this.discountInput.waitFor();

        //Option 1 for laggy inputs: using fill() with await expect()
        await this.discountInput.fill(code);
        await expect(this.discountInput).toHaveValue(code);

        //Option 2 for laggy inputs: slow typing
        // await this.discountInput.focus();
        // await this.page.keyboard.type(code, {delay: 1000});
        // expect(await this.discountInput.inputValue()).toBe(code);
        
        //to verify that the text is not shown:
        await expect(this.discountActivatedText).toBeHidden();
        //or we can use another assertion:
        expect(await this.discountActivatedText.isVisible()).toBe(false);
        expect(await this.totalWithDiscount.isVisible()).toBe(false);
        await this.submitDiscountButton.waitFor();
        await this.submitDiscountButton.click();
        await this.discountActivatedText.waitFor();
        await expect(this.discountActivatedText).toHaveText('Discount activated!');//this one is not necesssary
        await this.totalWithDiscount.waitFor();
        await expect(this.totalWithDiscount).toBeVisible();//this one is not necessary
        const originalValue = await this.totalValue.innerText();
        const originalValueNumber = parseInt(originalValue.replace("$", ""));
        const discountedValue = await this.totalWithDiscount.innerText();
        const discountedValueNumber = parseInt(discountedValue.replace("$", ""));
        expect(discountedValueNumber).toBeLessThan(originalValueNumber);
    }
    fillPaymentDetails = async (paymentDetails) => {
        await this.cardOwnerInput.waitFor();
        await this.cardOwnerInput.fill(paymentDetails.cardOwnerName);
        await this.cardNumberInput.waitFor();
        await this.cardNumberInput.fill(paymentDetails.cardNumber);
        await this.cardExpiryInput.waitFor();
        await this.cardExpiryInput.fill(paymentDetails.cardExpiry);
        await this.cardCodeInput.waitFor();
        await this.cardCodeInput.fill(paymentDetails.cardCvc);
    }
    completePayment = async () => {
        await this.payButton.waitFor();
        await this.payButton.click();
        await this.page.waitForURL(/\/thank-you/, { timeout: 3000 });
    }
}