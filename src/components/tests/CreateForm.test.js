const { Builder, By, Key, until } = require('selenium-webdriver')
const assert=require('assert');
require('selenium-webdriver/chrome')

require('selenium-webdriver/firefox')
const webdriver=require('selenium-webdriver')
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


describe('Login', () => {
  it('logins with correct creentials', async () => {
    await driver.findElement({ name: 'email' }).sendKeys('chaminnkac@gmail.com')
    await driver.findElement({ name: 'password' }).sendKeys('ffffff')
    await driver.findElement({id:'login_button'}).sendKeys(webdriver.Key.ENTER)
    try{
    assert.doesNotThrow(async () => { 
      await driver.findElement(webdriver.By.xpath("/html/body/div/div/div[2]/h1")).getText().then(textValue => {
        assert.equal('Welcome!', textValue);
      });
    });
  }catch{}
  })
});

describe('Create Form', () => {
  it('Form can be created',  () => {
     driver.get("https://flexlims.herokuapp.com/create-form")
     driver.findElement(webdriver.By.xpath("/html/body/div/div/div[2]/div/div/div[2]/div/input")).sendKeys("Test test")
     driver.findElement(webdriver.By.xpath("//*[@id=\"numeric0\"]")).click()
     driver.findElement(webdriver.By.xpath("/html/body/div/div/div[2]/div/div/div[5]/div[12]/button")).click()
    driver.switchTo().alert().then(
      function() {
        assert.equal(driver.switchTo().alert().getText(),"Form successfully created!")
      },
      function() {
        assert.assert(false)
      }
    );
  })
});