import type { StartCliResult } from '@tramvai/test-integration';
import { startCli } from '@tramvai/test-integration';

describe('pokedex', () => {
  let app: StartCliResult;

  beforeAll(async () => {
    app = await startCli('pokedex');
  }, 80000);

  afterAll(() => {
    return app.close();
  });

  it('request to main page return status 200', async () => {
    return app.request('/').expect(200);
  });
});
