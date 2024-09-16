import { test } from '@playwright/test';
import user from '../.auth/user.json'
import fs from 'fs'

const authFile = '.auth/user.json'

test('authentication', async({request}) => {
  const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user":{"email":"sharifhaqqoniy@gmail.com","password":"12345"}
    }
  })

  // const statuscode = response.status()
  // console.log(`Status CODE: ${statuscode}`)

  const responseBody = await response.json()
  const accessToken = responseBody.user.token

  //.auth da saqlanadigan json fayldagi tokenni overwrite qilib update qiladi
  user.origins[0].localStorage[0].value = accessToken
  fs.writeFileSync(authFile, JSON.stringify(user))

  //env variable yaratib unga tokenni assign qiladi --- config faylda ham 'use' blokida buni qo'shib qo'yish kerak 
  process.env['ACCESS_TOKEN'] = accessToken
})

// await page.goto('https://conduit.bondaracademy.com/')
  // await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')
  // await page.getByText('Sign in').click()
  // await page.getByPlaceholder('Email').fill('sharifhaqqoniy@gmail.com')
  // await page.getByPlaceholder('Password').fill('12345')
  // await page.getByRole('button', {name: 'Sign in'}).click()
  // await page.waitForResponse('https://conduit-api.bondaracademy.com/api/tags')

  // await page.context().storageState({path: authFile})
  
  //api ga user creditionals bn request jo'natib login qiladi

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo4OTI3fSwiaWF0IjoxNzI2NDgwNDkzLCJleHAiOjE3MzE2NjQ0OTN9.IwXHNdigSSIica4EjXM7GZCNZ5-DZuFG2m28OU55Fnc
//