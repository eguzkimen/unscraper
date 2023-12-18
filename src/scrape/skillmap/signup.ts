import { SKILLMAP_ACCESS_CODE, SKILLMAP_DEFAULT_PASS } from '@/configs'
import { Lead, SignupResult } from '@/types/models'
import { wait } from '@/util/wait'
import puppeteer from 'puppeteer'

const ACCESS_CODE_INPUT_SELECTOR = '#textfield-1'
const EMAIL_INPUT_SELECTOR = '#textfield-2'
const PASSWORD_INPUT_SELECTOR = '#textfield-3'
const FIRST_NAME_INPUT_SELECTOR = '#textfield-4'
const LAST_NAME_INPUT_SELECTOR = '#textfield-5'

const ACCEPT_COOKIES_BUTTON_XPATH = '/html/body/div[3]/div[3]/div[2]/div[2]/button[1]'
const SUBMIT_ACCESS_CODE_BUTTON_XPATH = '//*[@id="j-app-root"]/div/div/div/div/div/div/form/button'
const SIGN_UP_BUTTON_XPATH = '//*[@id="j-app-root"]/div/div/div/div/div/div[1]/a'
const SUBMIT_EMAIL_AND_PASS_BUTTON_XPATH = '//*[@id="j-app-root"]/div/div/div/div/div/div[1]/form/button'
const SUBMIT_NAME_BUTTON_XPATH = '//*[@id="j-app-root"]/div/div/form/button'

export async function signup({ firstName, lastName, email }: Lead): Promise<SignupResult> {
  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    page.setDefaultTimeout(3_000)

    await page.goto('https://skillmap.app/mobile/guest/authentication/register')

    // Accept cookies
    await page.waitForXPath(ACCEPT_COOKIES_BUTTON_XPATH)
    await wait()
    await page.click('xpath/' + ACCEPT_COOKIES_BUTTON_XPATH)

    // Type access code
    await page.waitForSelector(ACCESS_CODE_INPUT_SELECTOR)
    await page.type(ACCESS_CODE_INPUT_SELECTOR, SKILLMAP_ACCESS_CODE)

    // Click next
    await page.waitForXPath(SUBMIT_ACCESS_CODE_BUTTON_XPATH)
    await wait()
    await page.click('xpath/' + SUBMIT_ACCESS_CODE_BUTTON_XPATH)

    // Click sign up with email
    await page.waitForXPath(SIGN_UP_BUTTON_XPATH)
    await wait()
    await page.click('xpath/' + SIGN_UP_BUTTON_XPATH)

    // Type email
    await page.waitForSelector(EMAIL_INPUT_SELECTOR)
    await page.type(EMAIL_INPUT_SELECTOR, email)

    // Type password
    await page.waitForSelector(PASSWORD_INPUT_SELECTOR)
    await page.type(PASSWORD_INPUT_SELECTOR, SKILLMAP_DEFAULT_PASS)

    // Click next
    await page.waitForXPath(SUBMIT_EMAIL_AND_PASS_BUTTON_XPATH)
    await wait()
    await page.click('xpath/' + SUBMIT_EMAIL_AND_PASS_BUTTON_XPATH)

    // Type firstName
    await page.waitForSelector(FIRST_NAME_INPUT_SELECTOR)
    await page.type(FIRST_NAME_INPUT_SELECTOR, firstName)

    // Type lastName
    await page.waitForSelector(LAST_NAME_INPUT_SELECTOR)
    await page.type(LAST_NAME_INPUT_SELECTOR, lastName)

    // Click next
    await page.waitForXPath(SUBMIT_NAME_BUTTON_XPATH)
    await wait()
    await page.click('xpath/' + SUBMIT_NAME_BUTTON_XPATH)

    // Closing the browser here is important to avoid a memory leak
    await browser.close()

    return {
      success: true
    }
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : JSON.stringify(e)
    }
  }
}