import { azureResourcePlugin } from './plugin';

describe('azure-resource', () => {
  it('should export plugin', () => {
    expect(azureResourcePlugin).toBeDefined();
  });
});
