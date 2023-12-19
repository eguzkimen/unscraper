import { SKILLMAP_DEFAULT_PASS } from '@/configs'
import { Lead, SignupResult } from '@/types/models'
import { wait } from '@/util/wait'
import puppeteer from 'puppeteer'

const ACCEPT_COOKIES_BUTTON_XPATH = '/html/body/div[3]/div[3]/div[2]/div[2]/button[1]'
const SIGN_IN_BUTTON_XPATH = '//*[@id="j-app-root"]/div/div/div/div/div[1]/form/button'
const PROFILE_BUTTON_XPATH = '//*[@id="j-app-root"]/div/div/div[1]/div[1]/div[2]/div/a'
const ACCOUNT_SETTINGS_BUTTON_XPATH = '//*[@id="j-app-root"]/div/div/div[1]/main/div[3]/div[2]/div[1]'
const DELETE_ACCOUNT_BUTTON_XPATH = '//*[@id="j-app-root"]/div/div/div[1]/div/div[3]/button'
const CONFIRM_DELETE_BUTTON_XPATH = '/html/body/div[5]/div/div/button[1]'

const EMAIL_INPUT_SELECTOR = '#textfield-1'
const PASSWORD_INPUT_SELECTOR = '#textfield-2'

export async function deleteAccount({ email }: Lead): Promise<SignupResult> {
  const browser = await puppeteer.launch()
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
    await page.click('xpath/' + SIGN_IN_BUTTON_XPATH)

    // Click Profile button
    await page.waitForXPath(PROFILE_BUTTON_XPATH)
    await wait()
    await page.click('xpath/' + PROFILE_BUTTON_XPATH)

    // Click Account Settings button
    await page.waitForXPath(ACCOUNT_SETTINGS_BUTTON_XPATH)
    await wait()
    await page.click('xpath/' + ACCOUNT_SETTINGS_BUTTON_XPATH)

    // Click Delete Account button
    await page.waitForXPath(DELETE_ACCOUNT_BUTTON_XPATH)
    await wait()
    await page.click('xpath/' + DELETE_ACCOUNT_BUTTON_XPATH)

    // Click Confirm button
    await page.waitForXPath(CONFIRM_DELETE_BUTTON_XPATH)
    await wait()
    await page.click('xpath/' + CONFIRM_DELETE_BUTTON_XPATH)

    // Closing the browser here is important to avoid a memory leak
    await browser.close()
    
    return {
      success: true,
      message: 'Deletion successful'
    }
  } catch (e) {
    await browser.close()
    return {
      success: false,
      message: e instanceof Error ? e.message : JSON.stringify(e)
    }
  }
}