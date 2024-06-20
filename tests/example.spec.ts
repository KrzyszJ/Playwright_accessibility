const AxeBuilder = require('@axe-core/playwright').default;
import {chromium, Browser, test, BrowserContext, Page} from '@playwright/test';
import { createHtmlReport } from 'axe-html-reporter';

let browser: Browser, context: BrowserContext, page: Page;

test.describe('playwright accessibility test', async () => {

  test.beforeEach(async () => {
    browser = await chromium.launch();
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto('https://magento.softwaretestingboard.com/');
  })

  test('checks accessibility for example website - full options' , async ({}, testInfo) => {
    const results = await new AxeBuilder({ page }).analyze();
    createHtmlReport({
      results,
      options: {
        projectKey: 'Test Website',
        reportFileName: "testWebsite.html",
        outputDir: `accessibilityReports-${testInfo.project.name}`
      },
    });
    await browser.close();
  })

  test('checks accessibility with excluded part of website' , async ({}, testInfo) => {
    const builder = await new AxeBuilder({ page })
    const results = await builder.exclude('.block-promo-wrapper .block-promo-hp').analyze();
    createHtmlReport({
      results,
      options: {
        projectKey: 'Test Website',
        reportFileName: "testWebsite-excludedElement.html",
        outputDir: `accessibilityReports-${testInfo.project.name}`
      },
    });
    await browser.close();
  })

  // list of rules can be found here: https://dequeuniversity.com/rules/axe/4.9
  test('test website - specified rule' , async ({}, testInfo) => {
    const builder = await new AxeBuilder({ page })
    const results = await builder.withRules('landmark-one-main').analyze();
    createHtmlReport({
      results,
      options: {
        projectKey: 'Test Website',
        reportFileName: "testWebsite-specifiedRule.html",
        outputDir: `accessibilityReports-${testInfo.project.name}`
      },
    });
    await browser.close();
  })

  test('test website  - specified tag' , async ({}, testInfo) => {
    // https://github.com/dequelabs/axe-core/blob/master/doc/API.md#axe-core-tags
    const builder = await new AxeBuilder({ page })
    const results = await builder.withTags('best-practice').analyze();
    createHtmlReport({
      results,
      options: {
        projectKey: 'Test Website',
        reportFileName: "testWebsite-specifiedTag.html",
        outputDir: `accessibilityReports-${testInfo.project.name}`
      },
    });
    await browser.close();
  })
})