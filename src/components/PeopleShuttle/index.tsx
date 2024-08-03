import React, { useState, useEffect, useRef } from 'react';
import {
  Input,
  Icon,
  Tabs,
  Checkbox,
  Avatar,
  Breadcrumb,
  Button,
  Spin,
  Modal,
  Radio,
} from '@arco-design/web-react';
import { useSelector } from 'react-redux';
import { getCorpList, list, search, corpSearch } from '@/api/contact';
import { labelList } from '@/api/userLabel';
import PageLoading from '../PageLoading';
const PeopleShuttle = ({
  isOrganization = true,
  isUserLabel = false,
  isUseCorpApi = false,
  isUser = true,
  showMemberSelect = true,
  selectMessage = '未选中任何用户',
  selectCount = 1,
  custmerMember = 1,
  isSelectDepartmen = false,
  parentPeople = [],
  mustSelect = false,
  showDepartmentSelect = true,
  isExternalContacts = false,
  setAllRadioButtonShow,
  closeResponsible,
}) => {
  const [searchShow, setSearchShow] = useState(true);
  const [keyWords, setKeyWords] = useState('');
  const [members, setMembers] = useState(1);
  const [membersArr, setMembersArr] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [indeterminateUser, setIndeterminateUser] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [userCheckAll, setUserCheckAll] = useState(false);
  const [selectError, setSelectError] = useState(false);
  const [selectPeople, setSelectPeople] = useState([]);
  const [selectPeopleData, setSelectPeopleData] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [userLabelData, setUserLabelData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllRadioButton, setShowAllRadioButton] = useState(false);
  const [activeKey, setActiveKey] = useState(1);

  const groupLabel = isExternalContacts ? '分组' : '部门';

  const getSelectName = () => {
    const countObj = {
      userCount: 0,
      departmentCount: 0,
    };
    selectPeopleData.forEach((item) => {
      if (!item.department) {
        countObj.userCount += 1;
      } else {
        countObj.departmentCount += 1;
      }
    });
    return countObj;
  };

  const openResponsible = () => {
    setSelectPeopleData([...parentPeople]);
    setSelectPeople(parentPeople.map((item) => item.id));
    getOrganizationList();
    if (isUserLabel) {
      getLabelList();
    }
    if (!isOrganization) {
      setActiveKey(2);
    }
    setIndeterminate(false);
    setCheckAll(false);
    setSelectError(false);
    setMembers(custmerMember);
    setMembersArr([
      {
        id: 0,
        label: isExternalContacts ? '联系人' : userData.corp.name || '全部',
      },
    ]);
  };

  const onCheckAllChange = () => {
    if (activeKey === 1 || !searchShow) {
      const newCheckAll = !checkAll;
      setCheckAll(newCheckAll);
      setIndeterminate(false);
      const newSelectPeople = [...selectPeople];
      const newSelectPeopleData = [...selectPeopleData];
      membersData.forEach((item) => {
        if (item.select !== null) {
          if (newCheckAll) {
            item.select = true;
            if (!newSelectPeople.includes(item.id)) {
              newSelectPeople.push(item.id);
              newSelectPeopleData.push(item);
            }
          } else {
            item.select = false;
            const index = newSelectPeople.indexOf(item.id);
            newSelectPeople.splice(index, 1);
            newSelectPeopleData.splice(index, 1);
          }
        }
      });
      setSelectPeople(newSelectPeople);
      setSelectPeopleData(newSelectPeopleData);
    } else if (activeKey === 2) {
      const newUserCheckAll = !userCheckAll;
      setUserCheckAll(newUserCheckAll);
      setIndeterminateUser(false);
      const newSelectPeople = [...selectPeople];
      const newSelectPeopleData = [...selectPeopleData];
      userLabelData.forEach((item) => {
        if (item.select !== null) {
          if (newUserCheckAll) {
            item.select = true;
            if (!newSelectPeople.includes(item.id)) {
              newSelectPeople.push(item.id);
              newSelectPeopleData.push(item);
            }
          } else {
            item.select = false;
            const index = newSelectPeople.indexOf(item.id);
            newSelectPeople.splice(index, 1);
            newSelectPeopleData.splice(index, 1);
          }
        }
      });
      setSelectPeople(newSelectPeople);
      setSelectPeopleData(newSelectPeopleData);
    }
  };

  const peopleChange = (item) => {
    const newSelectPeople = [...selectPeople];
    const newSelectPeopleData = [...selectPeopleData];
    const index = newSelectPeople.indexOf(item.id);
    if (index === -1) {
      item.childDisable !== undefined && (item.childDisable = true);
      newSelectPeople.push(item.id);
      newSelectPeopleData.push(item);
      setSelectError(false);
    } else {
      item.childDisable !== undefined && (item.childDisable = false);
      newSelectPeople.splice(index, 1);
      newSelectPeopleData.splice(index, 1);
    }
    setSelectPeople(newSelectPeople);
    setSelectPeopleData(newSelectPeopleData);
    updateCheckAllStatus();
  };

  const removePeople = (item) => {
    const newSelectPeople = [...selectPeople];
    const newSelectPeopleData = [...selectPeopleData];
    const index = newSelectPeople.indexOf(item.id);
    newSelectPeople.splice(index, 1);
    newSelectPeopleData.splice(index, 1);
    setSelectPeople(newSelectPeople);
    setSelectPeopleData(newSelectPeopleData);
    if (item.user_label && searchShow) {
      userLabelData.forEach((labelItem) => {
        if (labelItem.id === item.id) {
          labelItem.childDisable !== undefined &&
            (labelItem.childDisable = false);
          labelItem.select = false;
        }
      });
      updateCheckAllStatus();
    } else {
      membersData.forEach((memberItem) => {
        if (memberItem.id === item.id) {
          memberItem.childDisable !== undefined &&
            (memberItem.childDisable = false);
          memberItem.select = false;
        }
      });
      updateCheckAllStatus();
    }
  };

  const handleResponsible = () => {
    if (
      mustSelect ||
      (selectPeople.length > 0 &&
        (selectCount === null || selectPeople.length <= selectCount))
    ) {
      closeResponsible(selectPeopleData);
    } else {
      setSelectError(true);
    }
  };

  const getMembersData = (item, index) => {
    if (item.childDisable) return;
    if (index === -1) {
      setMembersArr([...membersArr, item]);
    } else {
      setMembersArr(membersArr.slice(0, index + 1));
    }
    getOrganizationList(item.id);
  };

  const getLabelList = () => {
    setLoading(true);
    labelList().then((res) => {
      processingUserData(res);
      setLoading(false);
    });
  };

  const getOrganizationList = (id = 0) => {
    setLoading(true);
    const listApi = isUseCorpApi ? getCorpList : list;
    const params = { department_id: id, contact_type: undefined };
    if (isExternalContacts) params.contact_type = 1;
    listApi({ params })
      .then((res) => {
        processingData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const searchOrganizationList = () => {
    setLoading(true);
    const searchApi = isUseCorpApi ? corpSearch : search;
    searchApi({ params: { query: keyWords } })
      .then((res) => {
        processingData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const processingData = (res) => {
    setAllRadioButtonShow(res.scope_type === 'all');
    const dept = res.dept.map((item) => ({
      id: item.department_id,
      label: item.name,
      avatar: '/path/to/departmentIcon', // 替换为实际图标路径
      department: true,
      select: isSelectDepartmen,
      childDisable: !selectPeople.includes(item.id),
      select_status: item.select_status,
    }));
    const users = res.users.map((item) => ({
      id: item.employee_id,
      label: item.name,
      avatar: item.avatar,
      department: false,
      select: false,
      select_status: item.select_status,
    }));
    const usersLabel = res.user_label.map((item) => ({
      id: item.corp_user_label_id,
      label: item.name,
      avatar: '/path/to/userLabelIcon', // 替换为实际图标路径
      department: false,
      user_label: true,
      select: false,
      select_status: true,
    }));
    const newMembersData = [...dept, ...users, ...usersLabel];
    setMembersData(newMembersData);
    updateCheckAllStatus(newMembersData);
  };

  const processingUserData = (res) => {
    const usersLabel = res.items.map((item) => ({
      id: item.corp_user_label_id,
      label: item.name,
      avatar: '/path/to/userLabelIcon', // 替换为实际图标路径
      department: false,
      user_label: true,
      select: false,
      select_status: true,
    }));
    setUserLabelData(usersLabel);
    updateCheckAllStatus(usersLabel);
  };

  const updateCheckAllStatus = (data = membersData) => {
    let selectCount = 0;
    let totalCount = 0;
    data.forEach((item) => {
      if (item.select !== null) {
        totalCount += 1;
        selectCount += item.select ? 1 : 0;
      }
    });
    if (activeKey === 1) {
      setIndeterminate(selectCount > 0 && selectCount < totalCount);
      setCheckAll(selectCount === totalCount && totalCount > 0);
    } else {
      setIndeterminateUser(selectCount > 0 && selectCount < totalCount);
      setUserCheckAll(selectCount === totalCount && totalCount > 0);
    }
    setSelectError(mustSelect ? false : selectPeople.length === 0);
  };

  const dataChange = () => {
    setMembersArr([{ id: 0, label: userData.corp.name || '全部' }]);
    if (keyWords) {
      setSearchShow(false);
      searchOrganizationList();
    } else {
      setSearchShow(true);
      getOrganizationList();
      getLabelList();
    }
  };

  function peopleShuttle() {}

  return (
    <div ref={peopleShuttle} className="people-shuttle">
      <div className="content">
        <div className="members-box">
          <div className="input-box">
            <Input
              value={keyWords}
              onChange={(value) => setKeyWords(value)}
              placeholder={`请输入姓名、手机号、${groupLabel}名称${
                isUserLabel ? '、用户标签名称' : ''
              }`}
              onPressEnter={dataChange}
              prefix={<Icon type="search" />}
            />
          </div>
          {isUserLabel && searchShow && isOrganization && (
            <Tabs onChange={(key) => setActiveKey(Number(key))}>
              <Tabs.TabPane key="1" title="组织架构" />
              <Tabs.TabPane key="2" title="用户标签" />
            </Tabs>
          )}
          {(activeKey === 1 || !searchShow) && isOrganization && (
            <div className={`members-item-box ${selectError ? 'error' : ''}`}>
              <PageLoading visible={loading} />
              {membersArr.length > 1 && (
                <Breadcrumb>
                  {membersArr.map((item, index) => (
                    <Breadcrumb.Item key={index}>
                      <a onClick={() => getMembersData(item, index)}>
                        {item.label}
                      </a>
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              )}
              {membersData.length > 0 ? (
                <div className="members-people-box">
                  {showAllRadioButton && isUser && (
                    <Checkbox
                      indeterminate={indeterminate}
                      checked={checkAll}
                      onChange={onCheckAllChange}
                    >
                      全选
                    </Checkbox>
                  )}
                  {membersData.map((item, index) => (
                    <div key={index} className="members-item">
                      <div className="item-left">
                        {item.select !== null && (
                          <Checkbox
                            disabled={!item.select_status}
                            checked={item.select}
                            onChange={() => peopleChange(item)}
                          />
                        )}
                        <img src={item.avatar} alt="" />
                        <span>{item.label}</span>
                      </div>
                      {item.department && (
                        <div
                          className={`item-right ${
                            item.childDisable ? 'disable' : ''
                          }`}
                          onClick={() => getMembersData(item, -1)}
                        >
                          <Icon type="branches" className="icon" />
                          <span>下级</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">暂无数据!</div>
              )}
            </div>
          )}
          {activeKey === 2 && searchShow && isUserLabel && (
            <div className={`members-item-box ${selectError ? 'error' : ''}`}>
              <PageLoading visible={loading} />
              {userLabelData.length > 0 ? (
                <div className="members-people-box">
                  {showAllRadioButton && isUser && (
                    <Checkbox
                      indeterminate={indeterminateUser}
                      checked={userCheckAll}
                      onChange={onCheckAllChange}
                    >
                      全选
                    </Checkbox>
                  )}
                  {userLabelData.map((item, index) => (
                    <div key={index} className="members-item">
                      <div className="item-left">
                        {item.select !== null && (
                          <Checkbox
                            disabled={!item.select_status}
                            checked={item.select}
                            onChange={() => peopleChange(item)}
                          />
                        )}
                        <img src={item.avatar} alt="" />
                        <span>{item.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">暂无数据!</div>
              )}
            </div>
          )}
          {selectError && (
            <span className="error-text">{`每次最多可添加${selectCount}个成员`}</span>
          )}
        </div>
        <div className="select-mombers-box">
          <div>
            {getSelectName().userCount > 0 && (
              <span>{`已选${getSelectName().userCount}名用户 `}</span>
            )}
            {getSelectName().departmentCount > 0 && (
              <span>{`已选${
                getSelectName().departmentCount
              }个${groupLabel}`}</span>
            )}
          </div>
          <div className="select-people">
            {selectPeopleData.map((item, index) => (
              <div key={index} className="people-item">
                <Avatar
                  src={`${item.avatar}?x-oss-process=image/resize,h_100,m_lfit`}
                  size={28}
                  icon={<Icon type="user" />}
                />
                <div className="people-detail">
                  <p>{item.label}</p>
                  <p>{item.departmentName}</p>
                </div>
                <Icon
                  type="close"
                  className="icon"
                  onClick={() => removePeople(item)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeopleShuttle;
