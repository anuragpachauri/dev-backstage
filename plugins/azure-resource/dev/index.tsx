import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { azureResourcePlugin, AzureResourcePage } from '../src/plugin';

createDevApp()
  .registerPlugin(azureResourcePlugin)
  .addPage({
    element: <AzureResourcePage />,
    title: 'Root Page',
    path: '/azure-resource',
  })
  .render();
