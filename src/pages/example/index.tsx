import React from 'react';
import { Typography, Card, Button } from '@arco-design/web-react';
import request from '@/utils/httpUtil';
import { useRequest } from 'ahooks';

function Example() {
  const {
    data: statisticsDataInfo,
    loading: statisLoading,
    run: send,
  } = useRequest(
    () => request.get('/coupon/dashboard?type=coupon&account_id=11'),
    {
      manual: true,
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  return (
    <Card style={{ height: '80vh' }}>
      <Typography.Title heading={6}>
        This is a very basic and simple page
      </Typography.Title>
      <Typography.Text>You can add content here :</Typography.Text>
      <Button onClick={send}>测试接口请求</Button>
    </Card>
  );
}

export default Example;
