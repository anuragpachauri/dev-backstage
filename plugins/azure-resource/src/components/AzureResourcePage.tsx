import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { ExampleFetchComponent } from './ExampleFetchComponent';
import { usePermission } from '@backstage/plugin-permission-react';
import { templateStepReadPermission , taskReadPermission } from '@backstage/plugin-scaffolder-common/alpha'; 



export const AzureResourcePage = () => {
  const { entity } = useEntity();
  
  const { allowed: templateStepAllowed } = usePermission({
    permission: templateStepReadPermission,
    resourceRef: 'scaffolder-template',
  });

  const { allowed: taskReadAllowed } = usePermission({
    permission: taskReadPermission,
  });

  const tagAnnotation = entity.metadata.annotations?.['azure.com/resource-tag'];

  if (!templateStepAllowed || !taskReadAllowed) {
    return <div>You do not have permission to view this page.</div>;
  }

  // if (!allowed) {
  //   return <div>You do not have permission to view this page.</div>;
  // }

  if (!tagAnnotation) {
    return <div>No Azure resources associated with this entity.</div>; // Or return null if you prefer
  }


  const [tagKey, tagValue] = tagAnnotation.split(':');

  return (
    <ExampleFetchComponent tagKey={tagKey} tagValue={tagValue} />
  );
};
