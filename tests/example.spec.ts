import { test, expect } from '@playwright/test';

test('thêm 2 việc to do vào list => đếm có 2 việc', async({page}) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/')
  const input =  page.getByPlaceholder('What needs to be done?')
  await input.fill('playwright learning')
  await input.press('Enter')
  await input.fill('playwright testing')
  await input.press('Enter')
  await expect(page.getByTestId('todo-item')).toHaveCount(2);
})

test('thêm 1 việc rồi tick checkbox, kiểm tra việc đó đã đổi trạng thái hoàn thành hay chưa', async ({page}) => {
  
})