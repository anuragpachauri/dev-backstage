import { createPlugin, createApiFactory, configApiRef, identityApiRef, createRoutableExtension } from '@backstage/core-plugin-api';
import { azureResourcesApiRef, AzureResourceService } from './components/AzureResourceService';
import { rootRouteRef } from './routes';

export const azureResourcePlugin = createPlugin({
  id: 'azure-resource',
  apis: [
    createApiFactory({
      api: azureResourcesApiRef,
      deps: { configApi: configApiRef, identityApi: identityApiRef },
      factory: ({ configApi, identityApi }) => new AzureResourceService(configApi, identityApi),
    }),
  ],
  routes: {
    root: rootRouteRef,
  },
});

export const AzureResourcePage = azureResourcePlugin.provide(
  createRoutableExtension({
    name: 'AzureResourcePage',
    component: () =>
      import('./components/AzureResourcePage').then(m => m.AzureResourcePage),
    mountPoint: rootRouteRef,
  }),
);
