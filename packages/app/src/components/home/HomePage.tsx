import React from 'react';
// import { JiraDashboard } from './jira-home';
import { JiraAssigntoMe } from './jira-assigntome';


export const HomePage = () => {
  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Welcome to Backstage!</h1>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',  // Ensures the JiraDashboard is aligned to the left
        alignItems: 'flex-start',
        textAlign: 'left', // Aligns text to the left as well
      }}>
        <JiraAssigntoMe />
      </div>
    </div>
  );
};
