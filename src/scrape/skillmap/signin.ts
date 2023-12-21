import { SKILLMAP_DEFAULT_PASS } from '@/configs'
import { Lead, SignupResult } from '@/types/models'
import { wait } from '@/util/wait'
import puppeteer from 'puppeteer'

const EMAIL_INPUT_SELECTOR = '#textfield-1'
const PASSWORD_INPUT_SELECTOR = '#textfield-2'
const SIGN_IN_BUTTON_XPATH = '//*[@id="j-app-root"]/div/div/div/div/div[1]/form/button'
const ACCEPT_COOKIES_BUTTON_XPATH = '/html/body/div[3]/div[3]/div[2]/div[2]/button[1]'
const REACH_YOUR_GOALS_FASTER_XPATH = '//*[@id="j-app-root"]/div/div/div[1]/div[3]/p[1]/span'

export async function signin({ email }: Lead, headless: boolean = true): Promise<SignupResult> {
  const browser = await puppeteer.launch({ headless})
  const page = await browser.newPage()

  page.setDefaultTimeout(3_000)

  try {
    await page.goto('https://skillmap.app/mobile/guest/authentication')

    // Accept cookies
    await page.waitForXPath(ACCEPT_COOKIES_BUTTON_XPATH, {timeout: 5_000})
    await wait()
    await page.click('xpath/' + ACCEPT_COOKIES_BUTTON_XPATH)

    // Type email
    await page.waitForSelector(EMAIL_INPUT_SELECTOR)
    await page.type(EMAIL_INPUT_SELECTOR, email)

    // Type password
    await page.waitForSelector(PASSWORD_INPUT_SELECTOR)
    await page.type(PASSWORD_INPUT_SELECTOR, SKILLMAP_DEFAULT_PASS)

    // Click Sign In
    await page.waitForXPath(SIGN_IN_BUTTON_XPATH)
    await wait()
    await page.click('xpath/' + SIGN_IN_BUTTON_XPATH)
    
    // Check for login page
    await page.waitForXPath(REACH_YOUR_GOALS_FASTER_XPATH)

    // Closing the browser here is important to avoid a memory leak
    await browser.close()
    
    return {
      success: true,
      message: 'Sign in successful'
    }
  } catch (e) {
    await browser.close()
    return {
      success: false,
      message: e instanceof Error ? e.message : JSON.stringify(e)
    }
  }
}