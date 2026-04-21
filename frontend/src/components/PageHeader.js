import React from 'react';

function PageHeader({ title, subtitle, icon }) {
  return (
    <div className="page-header">
      <div className="header-content">
        <h1 className="page-title">
          <span className="header-icon">{icon}</span>
          {title}
        </h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

export default PageHeader;
