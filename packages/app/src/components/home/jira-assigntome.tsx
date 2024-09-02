import React, { useEffect, useState } from 'react';
import { useApi } from '@backstage/core-plugin-api';
import { identityApiRef } from '@backstage/core-plugin-api';
import { Card, CardContent, Typography, Grid, Avatar, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';

// Define interfaces for typing
interface JiraIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    priority: {
      name: string;
    };
    status: {
      name: string;
    };
    assignee: {
      displayName: string;
      avatarUrls: {
        "24x24": string;
      };
    } | null;
  };
}

interface JiraProjectData {
  self: string;
  avatarUrls: {
    "48x48": string;
  };
  name: string;
  key: string;
  lead: {
    displayName: string;
  };
  assignedToMe: JiraIssue[];
}

// JiraDashboard component
export const JiraAssigntoMe = () => {
  const identityApi = useApi(identityApiRef);
  const [assignedToMe, setAssignedToMe] = useState<JiraIssue[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const { token } = await identityApi.getCredentials();
        const response = await fetch('https://dev.anurag.today/api/jira-home/project', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch project data: ${response.statusText}`);
        }

        const data: JiraProjectData = await response.json();
        setAssignedToMe(data.assignedToMe);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };

    fetchProjectData();
  }, [identityApi]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!assignedToMe.length) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '16px', backgroundColor: '#2b2b2b', maxWidth: '800px', margin: '0 auto' }}>
      <Typography variant="h4" style={{ textAlign: 'center', marginBottom: '16px', color: '#fff' }}> Jira Issue Assigned to Me</Typography>
      <Card style={{ height: '100%', minHeight: '300px', border: '1px solid #333', borderRadius: '8px', backgroundColor: '#424242', color: '#fff' }}>
        <CardContent style={{ height: '100%' }}>
          <Typography variant="h6">Assigned Issues ({assignedToMe.length})</Typography>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            <Table size="small" style={{ tableLayout: 'fixed' }}>
              <TableHead>
                <TableRow>
                  <TableCell style={{ width: '15%' }}>Key</TableCell>
                  <TableCell style={{ width: '25%' }}>Summary</TableCell>
                  <TableCell style={{ width: '15%' }}>Priority</TableCell>
                  <TableCell style={{ width: '15%' }}>Status</TableCell>
                  <TableCell style={{ width: '30%' }}>Assignee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assignedToMe.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell>{issue.key}</TableCell>
                    <TableCell style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.fields.summary}</TableCell>
                    <TableCell>{issue.fields.priority.name}</TableCell>
                    <TableCell>{issue.fields.status.name}</TableCell>
                    <TableCell>
                      {issue.fields.assignee ? (
                        <Grid container alignItems="center">
                          <Avatar src={issue.fields.assignee.avatarUrls["24x24"]} />
                          <Typography variant="body2" style={{ marginLeft: '4px' }}>
                            {issue.fields.assignee.displayName}
                          </Typography>
                        </Grid>
                      ) : (
                        'Unassigned'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
