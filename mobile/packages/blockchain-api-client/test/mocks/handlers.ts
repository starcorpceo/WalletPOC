import { rest } from 'msw';

export const handlers = [
  // Handles a POST /login request
  rest.get('http://test.test', (req, res, ctx) => {
    console.log('Mocking request to', req.url.href);
    return res(ctx.json({ isOk: true }));
  }),
];
