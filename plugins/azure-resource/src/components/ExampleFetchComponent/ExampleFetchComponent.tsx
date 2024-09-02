import React, { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { azureResourcesApiRef } from '../AzureResourceService';
import { Paper, Typography, Grid } from '@material-ui/core';

interface AzureResource {
  id: string;
  name: string;
  type: string;
  location: string;
  ipAddress?: string;
  resourceGroup?: string;
  properties?: any;
}

interface GroupedResources {
  virtualMachines: AzureResource[];
  storageAccounts: AzureResource[];
  others: AzureResource[];
}

export const ExampleFetchComponent = ({ tagKey, tagValue }: { tagKey: string; tagValue: string }) => {
  const azureApi = useApi(azureResourcesApiRef);
  const [resources, setResources] = useState<AzureResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await azureApi.getResourcesByTag(tagKey, tagValue);
        setResources(response);
      } catch (error) {
        console.error('Error fetching Azure resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [azureApi, tagKey, tagValue]);

  if (loading) return <div>Loading...</div>;

  const groupResources = (): GroupedResources => {
    const grouped: GroupedResources = {
      virtualMachines: [],
      storageAccounts: [],
      others: [],
    };

    const ipAddresses: { [networkInterfaceId: string]: string } = {};

    // Extract IP addresses from public IP resources and associate them with VMs
    resources.forEach((resource: AzureResource) => {
      if (resource.type === 'microsoft.network/publicipaddresses') {
        const networkInterfaceId = resource.properties?.ipConfiguration?.id.split('/ipConfigurations')[0];
        ipAddresses[networkInterfaceId] = resource.properties?.ipAddress;
      }
    });

    // Group resources into virtual machines, storage accounts, and others
    resources.forEach((resource: AzureResource) => {
      const type = resource.type.toLowerCase();

      if (type === 'microsoft.compute/virtualmachines') {
        const networkInterfaceId = resource.properties.networkProfile.networkInterfaces[0].id;
        resource.ipAddress = ipAddresses[networkInterfaceId] || 'N/A';
        grouped.virtualMachines.push(resource);
      } else if (type === 'microsoft.storage/storageaccounts') {
        grouped.storageAccounts.push(resource);
      } else if (type === 'microsoft.network/networkinterfaces' || type === 'microsoft.network/virtualnetworks') {
        const associatedVM = grouped.virtualMachines.find(vm => vm.resourceGroup === resource.resourceGroup);
        if (associatedVM) {
          associatedVM.properties.relatedResources = associatedVM.properties.relatedResources || [];
          associatedVM.properties.relatedResources.push({
            name: resource.name,
            type: type.split('/').pop(),
          });
        }
      } else if (type !== 'microsoft.compute/disks' && type !== 'microsoft.network/publicipaddresses') {
        grouped.others.push(resource);
      }
    });

    return grouped;
  };

  const groupedResources = groupResources();

  const renderResourceBlock = (resources: AzureResource[], title: string) => (
    <Grid container spacing={2}>
      {resources.map((resource: AzureResource) => (
        <Grid item xs={12} sm={6} md={4} key={resource.id}>
          <Paper style={{ padding: '20px', backgroundColor: '#282828', borderRadius: '8px' }}>
            <Typography variant="h6" style={{ color: '#fff', fontWeight: 'bold' }}>
              {title}
            </Typography>
            <Typography variant="body1" style={{ color: '#aaa' }}>
              <strong>Name:</strong> {resource.name}
            </Typography>
            <Typography variant="body1" style={{ color: '#aaa' }}>
              <strong>Type:</strong> {resource.type.split('/').pop()}
            </Typography>
            <Typography variant="body1" style={{ color: '#aaa' }}>
              <strong>Location:</strong> {resource.location}
            </Typography>
            {resource.ipAddress && (
              <Typography variant="body1" style={{ color: '#aaa' }}>
                <strong>IP Address:</strong> {resource.ipAddress}
              </Typography>
            )}
            <Typography variant="body1" style={{ color: '#aaa' }}>
              <strong>Resource Group:</strong> {resource.resourceGroup || 'N/A'}
            </Typography>
            {resource.type.toLowerCase().includes('virtualmachines') && resource.properties && (
              <>
                <Typography variant="body1" style={{ color: '#aaa' }}>
                  <strong>VM Size:</strong> {resource.properties.hardwareProfile.vmSize}
                </Typography>
                <Typography variant="body1" style={{ color: '#aaa' }}>
                  <strong>Disk Size (GB):</strong> {resource.properties.storageProfile.osDisk.diskSizeGB}
                </Typography>
                {resource.properties.relatedResources && (
                  <div style={{ marginTop: '10px' }}>
                    <Typography variant="body1" style={{ color: '#aaa', fontWeight: 'bold' }}>
                      Related Resources:
                    </Typography>
                    {resource.properties.relatedResources.map((relatedResource: any, index: number) => (
                      <Typography key={index} variant="body2" style={{ color: '#aaa' }}>
                        {relatedResource.type}: {relatedResource.name}
                      </Typography>
                    ))}
                  </div>
                )}
              </>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <div>
      <Typography
        variant="h4"
        gutterBottom
        style={{ color: '#fff', padding: '20px', backgroundColor: '#1e1e1e' }}
      >
        Azure Resources
      </Typography>
      <Grid container spacing={3}>
        {groupedResources.virtualMachines.length > 0 && (
          <Grid item xs={12}>
            {renderResourceBlock(groupedResources.virtualMachines, 'Virtual Machines')}
          </Grid>
        )}
        {groupedResources.storageAccounts.length > 0 && (
          <Grid item xs={12}>
            {renderResourceBlock(groupedResources.storageAccounts, 'Storage Accounts')}
          </Grid>
        )}
        {groupedResources.others.length > 0 && (
          <Grid item xs={12}>
            {renderResourceBlock(groupedResources.others, 'Other Resources')}
          </Grid>
        )}
      </Grid>
    </div>
  );
};
