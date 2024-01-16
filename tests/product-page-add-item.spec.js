import { test, expect } from "@playwright/test";

test.skip("Product Page Add To Basket", async ({ page }) => {
    await page.goto("/");

    const addToBasketButton = page.locator('[data-qa="product-button"]').first();
    const basketCounter = page.locator('[data-qa="header-basket-count"]');
    await addToBasketButton.waitFor();
    await expect(addToBasketButton).toHaveText("Add to Basket");
    await expect(basketCounter).toHaveText('0');
    await addToBasketButton.click();

    // console.log(await page.getByRole('button', { name: 'Add to Basket' }).count());

    await expect(addToBasketButton).toHaveText("Remove from Basket");
    await expect(basketCounter).toHaveText('1');
    const checkoutLink = page.getByRole('link', { name: 'Checkout' });
    // await page.pause();
    await checkoutLink.waitFor();
    await checkoutLink.click();
    await page.waitForURL("/basket");

});