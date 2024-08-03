import React, { useEffect, useState, useRef } from 'react';
import {
  Button,
  Icon,
  Form,
  Input,
  Select,
  Tag,
  Avatar,
  Modal,
  Radio,
  Spin,
  Message,
} from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import {
  createOaVersionCreate,
  getOaVersionDetail,
  doPublishVersion,
  updateOaVersionDetail,
  publishDetail,
  getVersionDetail,
} from '@/api/version';
import PeopleShuttle from '@/components/PeopleShuttle';
export const VersionStatusMap = {
  待申请: 0,
  0: '待申请',
  已发布: 1,
  1: '已发布',
};

const VersionsInfo = ({ systemAppId }) => {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [setPeopleModal, setSetPeopleModal] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [versionsForm, setVersionsForm] = useState({
    version: '',
    description: '',
    scopes: [],
    permissionsChange: '',
    scope_type: 'all',
    remark: '',
    type: -1,
  });
  const [publish, setPublish] = useState({});
  const [isPageManage, setIsPageManage] = useState(false);
  const id = useRef('');
  const lastV = useRef('0.0.1');
  const userData = useSelector((state) => state.userData);
  const [selectPeopleData, setSelectPeopleData] = useState([]);

  const getSelectName = () => {
    const nameObj = {
      userName: [],
      department: [],
    };
    versionsForm.scopes.forEach((item) => {
      if (!item.department) {
        nameObj.userName.push(item.label);
      } else {
        nameObj.department.push(item.label);
      }
    });
    return nameObj;
  };

  useEffect(() => {
    id.current = new URLSearchParams(window.location.search).get('id') || '';
    lastV.current =
      new URLSearchParams(window.location.search).get('lastV') || '0.0.1';
    setShowForm(!id.current);
    setIsPageManage(
      window.location.pathname.includes('pageManageVersionsInfo')
    );
    if (showForm) {
      setVersionsForm((prev) => ({
        ...prev,
        scopes: [
          {
            avatar: `${userData.avatar}?x-oss-process=image/resize,h_100,m_lfit`,
            label: userData.name,
            id: userData.employee_id,
            department: false,
            select: true,
          },
        ],
      }));
    } else {
      getDetail();
    }
    setLoading(true);
    publishDetail(systemAppId)
      .then((e) => {
        setPublish(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [systemAppId, showForm, userData]);

  const getDetail = () => {
    setSpinning(true);
    getOaVersionDetail(id.current)
      .then((res) => {
        setVersionsForm((prev) => ({ ...prev, ...res }));
      })
      .finally(() => setSpinning(false));
  };

  const handleCancel = () => {
    if (id.current) {
      setShowForm(false);
      getDetail();
    } else {
      window.history.back();
    }
  };

  const clickSave = () => {
    // Validate form and save
  };

  const doPublish = () => {
    setSpinning(true);
    doPublishVersion(id.current, { type: 1 })
      .then((res) => {
        Message.success('发布成功');
        setVersionsForm((prev) => ({ ...prev, type: res.type }));
      })
      .finally(() => setSpinning(false));
  };

  const openPeopleModal = () => {
    setSetPeopleModal(true);
  };

  const handleSetPeople = () => {
    // Handle people selection
  };

  const cancelSetPeople = () => {
    setSetPeopleModal(false);
  };

  const radioChange = (e) => {
    if (e.target.value === 'part') {
      // Handle radio change
    }
  };

  return (
    <div
      ref={id}
      className="versions-info"
      style={{ display: loading ? 'none' : 'block' }}
    >
      <div>
        <Button
          type="text"
          icon={<Icon type="left" />}
          style={{ marginLeft: -17 }}
          onClick={handleCancel}
        >
          返回
        </Button>
        <div className="title-box">
          <div className="title-box-left">
            <div className="title">版本详情</div>
            <Icon
              style={{
                display:
                  !showForm && versionsForm.type !== VersionStatusMap.已发布
                    ? 'inline'
                    : 'none',
              }}
              type="edit"
              onClick={() => setShowForm(true)}
            />
          </div>
          {!showForm && versionsForm.type !== VersionStatusMap.已发布 && (
            <Button type="primary" onClick={doPublish}>
              申请发布
            </Button>
          )}
        </div>
      </div>
      <Spin spinning={spinning}>
        <Form ref={id} className="versions-form" initialValues={versionsForm}>
          <Form.Item label="应用版本号" field="version">
            {showForm ? (
              <Input
                disabled
                placeholder="对用户展示的正式版本号"
                maxLength={10}
              />
            ) : (
              <div>
                <span style={{ marginRight: 10 }}>{versionsForm.version}</span>
                <Tag color={['orange', 'green'][versionsForm.type]}>
                  {VersionStatusMap[versionsForm.type]}
                </Tag>
              </div>
            )}
          </Form.Item>

          {publish.webpage_status === 1 && (
            <Form.Item label="PC客户端默认的应用功能" required>
              {showForm ? (
                <Select defaultValue="1">
                  <Select.Option value="1">网页</Select.Option>
                </Select>
              ) : (
                <span>网页</span>
              )}
            </Form.Item>
          )}

          <Form.Item
            label="更新说明"
            field="description"
            rules={[{ required: true, message: '请填写' }]}
          >
            {showForm ? (
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 6 }}
                placeholder="此内容将于应用的更新日志中显示"
              />
            ) : (
              <p>{versionsForm.description}</p>
            )}
          </Form.Item>
          <Form.Item label="权限变更">
            <div>
              {publish.add_scope_tags && publish.add_scope_tags.length > 0 && (
                <div>
                  <div>添加的权限</div>
                  {publish.add_scope_tags.map((item, index) => (
                    <span key={index}>
                      {index !== 0 && '，'}
                      {item}
                    </span>
                  ))}
                </div>
              )}
              {publish.remove_scope_tags &&
                publish.remove_scope_tags.length > 0 && (
                  <div>
                    <div>删除的权限</div>
                    {publish.remove_scope_tags.map((item, index) => (
                      <span key={index}>
                        {index !== 0 && '，'}
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              {publish.add_scope_tags?.length <= 0 &&
                publish.remove_scope_tags?.length <= 0 && <span>暂无</span>}
            </div>
          </Form.Item>
          <Form.Item label="可用性范围">
            <div className="available-box">
              <span>
                {versionsForm.scope_type === 'all' ? '所有员工' : '部分员工'}
              </span>
              {showForm && (
                <Button type="text" onClick={openPeopleModal}>
                  编辑
                </Button>
              )}
            </div>
            {versionsForm.scope_type === 'part' &&
              getSelectName().userName.length > 0 && (
                <div className="available-item-box">
                  <Avatar
                    className="icon"
                    size={20}
                    icon={<Icon type="user" />}
                  />
                  <span className="name">
                    {getSelectName().userName.join(',')}
                  </span>
                </div>
              )}
            {versionsForm.scope_type === 'part' &&
              getSelectName().department.length > 0 && (
                <div className="available-item-box">
                  <Avatar
                    className="icon"
                    size={20}
                    src="https://sf1-scmcdn-tos.pstatp.com/goofy/ee/suite/admin/static/imgs/department@3705de03c.svg"
                  />
                  <span className="name">
                    {getSelectName().department.join(',')}
                  </span>
                </div>
              )}
          </Form.Item>
          {!isPageManage && (
            <Form.Item label="备注说明">
              {showForm ? (
                <Input.TextArea
                  autoSize={{ minRows: 4, maxRows: 6 }}
                  placeholder="帮助审核人员了解此应用的附加信息，例如：1. 为什么需要使用这些高级权限；2. 为什么需要申请这些可用性范围。"
                />
              ) : (
                <p>{versionsForm.remark}</p>
              )}
            </Form.Item>
          )}
        </Form>
        {showForm && (
          <div className="foot-btn">
            <Button style={{ marginRight: 16 }} onClick={handleCancel}>
              取消
            </Button>
            <Button type="primary" onClick={clickSave}>
              保存
            </Button>
          </div>
        )}
      </Spin>
      <Modal
        visible={setPeopleModal}
        title="可用性设置"
        width="800px"
        okText="确认"
        cancelText="取消"
        maskClosable={false}
        getContainer={() => id.current}
        onOk={handleSetPeople}
        onCancel={cancelSetPeople}
      >
        <div>
          <Radio.Group value={versionsForm.scope_type} onChange={radioChange}>
            <Radio value="all">全部成员</Radio>
            <Radio value="part">部分成员</Radio>
          </Radio.Group>
          {versionsForm.scope_type === 'part' && (
            <PeopleShuttle
              isOrganization={true}
              isUserLabel={false}
              isUseCorpApi={false}
              isUser={true}
              showMemberSelect={true}
              selectMessage="请选择可见范围"
              selectCount={null}
              custmerMember={1}
              isSelectDepartmen={false}
              parentPeople={versionsForm.scopes || []}
              mustSelect={false}
              showDepartmentSelect={true}
              isExternalContacts={false}
              setAllRadioButtonShow={() => true}
              closeResponsible={selectPeopleData}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default VersionsInfo;
