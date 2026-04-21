import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import NotificationForm from '../components/NotificationForm';

function CreateNotification() {
  const navigate = useNavigate();

  const handleNotificationCreated = (notification) => {
    navigate('/notifications');
  };

  const handleError = (error) => {
    console.error(error);
  };

  return (
    <div className="page">
      <PageHeader 
        title="Create Notification" 
        subtitle="Schedule a new SMS notification"
        icon=""
      />

      <div className="form-page-wrapper">
        <NotificationForm
          onNotificationCreated={handleNotificationCreated}
          onError={handleError}
        />
      </div>
    </div>
  );
}

export default CreateNotification;
