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
  await page.goto('https://demo.playwright.dev/todomvc/#/')
  const input =  page.getByPlaceholder('What needs to be done?')
  await input.fill('playwright learning')
  await input.press('Enter')
  const item = page.getByTestId('todo-item') 
  await page.getByRole('checkbox', { name: 'Toggle Todo' }).check();

  await expect(item).toHaveClass(/completed/)
})

test('thêm rồi xóa 1 việc => danh sách trống', async({page}) =>{
  await page.goto('https://demo.playwright.dev/todomvc/#/')
  const input =  page.getByPlaceholder('What needs to be done?')
  await input.fill('playwright learning')
  await input.press('Enter')

  const item = page.getByTestId('todo-item')
  await item.hover()
  await page.getByRole('button', { name: 'Delete' }).click();

  await expect(item).toHaveCount(0)
})

test('Kiểm tra ô nhập, mục thứ 2, Clear completed, Active và số việc còn lại', async ({ page }) => {
  await page.goto('https://demo.playwright.dev/todomvc/#/');

  const input = page.getByPlaceholder('What needs to be done?');
  const items = page.getByTestId('todo-item');

  await input.fill('playwright learning');
  await input.press('Enter');

  await input.fill('playwright learning auto');
  await input.press('Enter');

  // Kiểm tra ô nhập và tiêu đề công việc thứ 2
  await expect(input).toBeVisible();
  await expect(items.nth(1)).toContainText('playwright learning auto');

  // Ban đầu có 2 công việc chưa hoàn thành
  await expect(page.locator('.todo-count')).toHaveText('2 items left');

  // Đánh dấu công việc đầu tiên hoàn thành
  await items.first().getByRole('checkbox').check();

  await expect(
    page.getByRole('button', { name: 'Clear completed', exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole('link', { name: 'Active', exact: true })
  ).toBeVisible();

  // Còn 1 công việc chưa hoàn thành
  await expect(page.locator('.todo-count')).toHaveText('1 item left');
});