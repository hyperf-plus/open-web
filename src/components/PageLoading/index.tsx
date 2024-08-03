import React from 'react';
import { Spin } from '@arco-design/web-react';

const PageLoading = ({ visible }) => {
  return visible ? (
    <div className="page-loading">
      <Spin />
    </div>
  ) : null;
};

export default PageLoading;
