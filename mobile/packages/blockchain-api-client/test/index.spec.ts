import { fetchFrom } from '../src/base/http';

describe('Bitcoin Api Client', () => {
  test('Tests Run', () => {
    expect(true).toBe(true);
  });

  test('MSW Works', async () => {
    const response = await fetchFrom<{ isOk: boolean }>('http://test.test');

    expect(response.isOk).toBeTruthy();
  });
});

export {};
