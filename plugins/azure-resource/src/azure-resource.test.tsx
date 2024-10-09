import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { useApi } from '@backstage/core-plugin-api';
import { ExampleFetchComponent } from './components/ExampleFetchComponent';
import '@testing-library/jest-dom';

// Mocking the core plugin API
jest.mock('@backstage/core-plugin-api', () => ({
  useApi: jest.fn(),
  createApiRef: jest.fn().mockImplementation(() => ({
    id: 'plugin.azure-resources.service',
  })),
}));

describe('ExampleFetchComponent', () => {
  const mockAzureResourcesApi = {
    getResourcesByTag: jest.fn(),
  };

  beforeEach(() => {
    (useApi as jest.Mock).mockReturnValue(mockAzureResourcesApi);
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error to prevent actual logging
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks to reset their state
  });

  it('should render the loading state initially', async () => {
    mockAzureResourcesApi.getResourcesByTag.mockReturnValue(new Promise(() => {})); // Keep it pending to simulate loading state
    
    await act(async () => {
      render(<ExampleFetchComponent tagKey="name" tagValue="postgres" />);
    });

    // Expect the loading state to be visible
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should render virtual machines and other resources', async () => {
    const mockResources = [
      {
        id: '1',
        name: 'vm-1',
        type: 'microsoft.compute/virtualmachines',
        location: 'eastus',
        resourceGroup: 'rg-1',
        properties: {
          hardwareProfile: { vmSize: 'Standard_DS1_v2' },
          storageProfile: { osDisk: { diskSizeGB: 128 } },
          networkProfile: { networkInterfaces: [{ id: 'nic-1' }] },
        },
      },
      {
        id: '2',
        name: 'storage-1',
        type: 'microsoft.storage/storageaccounts',
        location: 'eastus',
        resourceGroup: 'rg-1',
      },
    ];

    mockAzureResourcesApi.getResourcesByTag.mockResolvedValue(mockResources);

    await act(async () => {
      render(<ExampleFetchComponent tagKey="name" tagValue="postgres" />);
    });

    // Wait for the loading to complete
    await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument());

    // Check that VM and Storage Account are rendered
    expect(screen.getByText(/Virtual Machines/i)).toBeInTheDocument();
    expect(screen.getByText(/vm-1/i)).toBeInTheDocument();
    expect(screen.getByText(/Standard_DS1_v2/i)).toBeInTheDocument();
    expect(screen.getByText(/Disk Size/i)).toBeInTheDocument();
    expect(screen.getByText(/128/i)).toBeInTheDocument();
    expect(screen.getByText(/Storage Accounts/i)).toBeInTheDocument();
    expect(screen.getByText(/storage-1/i)).toBeInTheDocument();
  });

  it('should handle errors while fetching resources', async () => {
    mockAzureResourcesApi.getResourcesByTag.mockRejectedValue(new Error('Failed to fetch resources'));

    await act(async () => {
      render(<ExampleFetchComponent tagKey="environment" tagValue="prod" />);
    });

    await waitFor(() => expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument());

    // Check if console.error was called
    expect(console.error).toHaveBeenCalledWith('Error fetching Azure resources:', expect.any(Error));
  });
});
