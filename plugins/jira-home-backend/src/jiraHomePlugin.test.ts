import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import request from 'supertest';
import jiraHomePlugin from '@internal/backstage-plugin-jira-home-backend'; // Adjust the import to your Jira plugin path

describe('jiraHomePlugin', () => {
  it('should respond with status 200 on /api/jira-home/project', async () => {
    // Start the test backend
    const { server } = await startTestBackend({
      features: [
        jiraHomePlugin(),
        mockServices.rootConfig.factory({
          data: {
            jira: {
              projectKey: 'BL',
              username: 'anuragpachauri8',
              baseUrl: 'https://anuragpachauri.atlassian.net/rest/api/2/',
              token: 'Basic YW51cmFncGFjaGF1cmk4QGdtYWlsLmNvbTpBVEFUVDN4RmZHRjAwRURUcU1fNDJudXlWQzB2cGYzNnhwcUhJZHRBRVFKd1dlU2FITXcwRUZLOWJ6X3JtYlhsTVJfUzVWTU9NVW84anN0dU1QaGFNR0VZVjJLZHZ6U2czdUhVZXA2bkljQ2RfSGpaUUxkUlN5ZmR0QzB6NFlad24yUnduT29zUktEdWV4eFVJbHFBaEJfTG5PS28tbnVZUDh6UmFnQVQtMFV5OE9QS3dNazUxWTg9MDVDMjI0MjI=',
            },
          },
        }),
      ],
    });

    // Make a request to the endpoint
    const response = await request(server).get('/api/jira-home/project');

    // Check for 200 status response
    expect(response.status).toBe(200);
  }, 10000);
});
