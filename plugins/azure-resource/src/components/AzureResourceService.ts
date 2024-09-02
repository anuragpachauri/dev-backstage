import { createApiRef, ConfigApi, IdentityApi } from '@backstage/core-plugin-api';

export const azureResourcesApiRef = createApiRef<AzureResourceService>({
  id: 'plugin.azure-resources.service',
});

export class AzureResourceService {
  private readonly baseUrl: string;

  constructor(config: ConfigApi, private readonly identityApi: IdentityApi) {
    this.baseUrl = config.getOptionalString('azure.baseURL') || 'http://localhost:7007/api/azure';
  }

  async getResourcesByTag(tagKey: string, tagValue: string): Promise<any[]> {
    // Get the token using identityApi
    const { token } = await this.identityApi.getCredentials();
    
    const response = await fetch(`${this.baseUrl}/resources?tagKey=${tagKey}&tagValue=${tagValue}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch resources');
    }

    return response.json();
  }
}
