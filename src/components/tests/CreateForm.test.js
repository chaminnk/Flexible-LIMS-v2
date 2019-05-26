const { Builder, By, Key, until } = require('selenium-webdriver')

require('selenium-webdriver/chrome')

require('selenium-webdriver/firefox')

require('chromedriver')

require('geckodriver')
const rootURL = 'https://flexlims.herokuapp.com/signin'

const d = new Builder().forBrowser('firefox').build()
const waitUntilTime = 20000

let driver, el, actual, expected

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000 * 60 * 5

async function getElementById(id) {

  const el = await driver.wait(until.elementLocated(By.id(id)), waitUntilTime)

  return await driver.wait(until.elementIsVisible(el), waitUntilTime)

}

async function getElementByXPath(xpath) {

  const el = await driver.wait(until.elementLocated(By.xpath(xpath)), waitUntilTime)

  return await driver.wait(until.elementIsVisible(el), waitUntilTime)

}




it('waits for the driver to start', () => {

  return d.then(_d => {

    driver = _d

  })

})

it('initialises the context', async () => {

  await driver.manage().window().setPosition(0, 0)

  await driver.manage().window().setSize(1280, 1024)

  await driver.get(rootURL)

})
it('logins with correct creentials', async () => {
  await driver.findElement({ name: 'email' }).sendKeys('foo')
  await driver.findElement({ name: 'password' }).sendKeys('foo')
  await driver.findElement({id:'fucking_button'}).sendKeys(driver.Key.ENTER)
})
