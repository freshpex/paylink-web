import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const base = process.env.BASE_URL || "http://localhost:5173";
await mkdir("tests/.artifacts", { recursive: true });
(async () => {
  const browser = await chromium.launch({
    executablePath:
      process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base);
  await page.getByRole("button", { name: "Create an account" }).click();
  await page.getByLabel("Your name", { exact: true }).fill("Morgan Ellis");
  await page
    .getByLabel("Company name", { exact: true })
    .fill("Northstar Academy");
  await page
    .getByLabel("Email address", { exact: true })
    .fill(`morgan${Date.now()}@example.com`);
  await page.getByLabel(/^Password/).fill("Secure-E2E-password-2026");
  await page.getByRole("button", { name: "Create workspace" }).click();
  await page
    .getByRole("heading", { name: "Good to see you, Morgan." })
    .waitFor();
  await page.screenshot({
    path: "tests/.artifacts/paylink-dashboard.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Create payment link", exact: true })
    .click();
  await page
    .getByLabel("Payment title", { exact: true })
    .fill("Spring semester tuition");
  await page
    .getByLabel("Description", { exact: true })
    .fill(
      "Your next chapter starts here. Tuition for the spring semester at Northstar Academy.",
    );
  await page.getByLabel("Amount", { exact: true }).fill("2500");
  await page
    .getByLabel("Payment destination & instructions", { exact: true })
    .fill(
      "Beneficiary: Northstar Academy\nBank: Example Bank\nIBAN: DEMO ACCOUNT — not for real transfers\nReference: Your full name",
    );
  await page
    .getByLabel("Additional notes or terms")
    .fill(
      "Please include your full name in the transfer reference. Receipts are issued after funds arrive.",
    );
  await page.getByRole("button", { name: "Save & create link" }).click();
  await page.getByRole("heading", { name: "All payment links" }).waitFor();
  const href = await page
    .getByRole("link", { name: "Spring semester tuition" })
    .getAttribute("href");
  const customer = await browser.newPage({
    viewport: { width: 900, height: 1200 },
  });
  await customer.goto(`${base}${href}`);
  await customer
    .getByRole("heading", { name: "Spring semester tuition" })
    .waitFor();
  await customer.screenshot({
    path: "tests/.artifacts/paylink-checkout.png",
    fullPage: true,
  });
  await customer
    .getByLabel("Your full name", { exact: true })
    .fill("Alex Rivera");
  await customer.getByLabel("Email for your receipt").fill("alex@example.com");
  await customer
    .getByLabel("Transfer reference (optional)")
    .fill("TEST-TRANSFER-100");
  await customer.getByRole("checkbox").check();
  await customer.getByRole("button", { name: "I’ve made the payment" }).click();
  await customer
    .getByRole("heading", { name: "You’ve done your part." })
    .waitFor();
  await page.getByRole("button", { name: "Payments", exact: true }).click();
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await page.getByRole("button", { name: "Review", exact: true }).click();
  await page.getByRole("button", { name: "Confirm funds received" }).click();
  await page.getByRole("link", { name: "Receipt", exact: true }).waitFor();
  const receiptHref = await page
    .getByRole("link", { name: "Receipt", exact: true })
    .getAttribute("href");
  await customer.goto(`${base}${receiptHref}`);
  await customer.getByText("Confirmed by company", { exact: true }).waitFor();
  await customer.screenshot({
    path: "tests/.artifacts/paylink-receipt.png",
    fullPage: true,
  });
  let download = customer.waitForEvent("download");
  await customer.getByRole("button", { name: "Image", exact: true }).click();
  const png = await download;
  await png.saveAs("tests/.artifacts/paylink-receipt-export.png");
  download = customer.waitForEvent("download");
  await customer.getByRole("button", { name: "PDF", exact: true }).click();
  const pdf = await download;
  await pdf.saveAs("tests/.artifacts/paylink-receipt-export.pdf");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  if ((await page.evaluate(() => document.documentElement.scrollWidth)) > 390)
    throw new Error("Mobile page overflows the viewport");
  await page.screenshot({
    path: "tests/.artifacts/paylink-mobile.png",
    fullPage: true,
  });
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(
    JSON.stringify({
      result: "PASS",
      flow: "register → create link → client reports payment → admin confirms → receipt PNG and PDF downloads",
      receiptHref,
    }),
  );
  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
