import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'

test.beforeEach(async ({page}) => {

  //tags qismini o'zim yaratgan mock tags bilan to'ldirdim
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      body: JSON.stringify(tags)
    })
  })

  await page.goto('https://conduit.bondaracademy.com/');
})

//main ochilganini main page da mavjud tekst bilan tekshiryapti
// test('has title', async ({ page }) => {
//   await page.route('*/**/api/articles*', async route => {
//     const response = await route.fetch()
//     const responseBody = await response.json()
//     responseBody.articles[0].title = 'IT IS HONOR TO BE HERE!'
//     responseBody.articles[0].description = 'BEST WISHES FROM SOMEONE'

//     await route.fulfill({
//       body: JSON.stringify(responseBody)
//     })
//   })

//   //pagega refresh berib, assertion qilinadi
//   await page.getByText('Global Feed').click()
//   expect(await page.locator('.navbar-brand').innerText()).toBe('conduit')
//   expect(page.locator('app-article-preview h1').first()).toHaveText('IT IS HONOR TO BE HERE!')
//   expect(page.locator('app-article-preview p').first()).toHaveText('BEST WISHES FROM SOMEONE')
//   await page.waitForTimeout(3000)
// });


test('log in', async({page, request}) => {

  // const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   data: {
  //     "user":{"email":"sharifhaqqoniy@gmail.com","password":"12345"}
  //   }
  // })
  // const responseBody = await response.json()
  // const accessToken = responseBody.user.token


  //creating new article
  const creatingArcticle = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data: {
      "article":{"title":"New article title","description":"New article description","body":"New article content","tagList":["no any tags"]}
    }
  })
  //assertion of created article
  expect(creatingArcticle.status()).toBe(201)

  //deleting article
  await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
  await page.getByText('Global Feed').click()
  await page.getByText('New article title').click()
  await page.getByRole('button', {name: 'Delete Article'}).first().click()

  //assertion of deleted article
  expect(await page.locator('app-article-preview h1').nth(0).innerText()).not.toBe('New article title')
})

test('creating article', async ({page, request}) => {
  await page.goto('https://conduit.bondaracademy.com/');
  await page.getByText('New article').click()
  await page.getByPlaceholder('Article Title').fill('Playwright is awesome')
  await page.getByPlaceholder('What\'s this article about?').fill('We use Playwright to automation testing')
  await page.getByPlaceholder('Write your article (in markdown)').fill('Something about Playwright... IT IS HONOR TO BE HERE')
  await page.getByRole('button', {name: ' Publish Article '}).click()

  //created article ning slug(ID)sini extract qilish
  const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
  const articleResponseBody = await articleResponse.json()
  const slugID = articleResponseBody.article.slug

  expect(await page.locator('h1').textContent()).toBe('Playwright is awesome')

  await page.getByText('Home').click()
  expect(await page.locator('app-article-preview h1').nth(0).innerText()).toBe('Playwright is awesome')

  //authorization
  // const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
  //   data: {
  //     "user":{"email":"sharifhaqqoniy@gmail.com","password":"12345"}
  //   }
  // })
  // const responseBody = await response.json()
  // const accessToken = responseBody.user.token

  //deleting article using API
  const deletingArticle = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`)
  
  expect(deletingArticle.status()).toBe(204)
})


// test('open the browser', async({page}) => {
//   await page.goto('https://conduit.bondaracademy.com/')
// })