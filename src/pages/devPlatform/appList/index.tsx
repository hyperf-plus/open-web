import React, { createRef, useEffect, useRef, useState } from 'react';

import UpdateApp from './components/UpdateApp';
import { Avatar, Button, Grid, Icon, Input, Message, Pagination, Select, Table } from '@arco-design/web-react';
import { systemApplist } from '@/api/appCategory';
import { fetchWorkList, requestWorkAppUpdateSort } from '@/api/appStore';
import Styles from './styles/index.module.less';
import { IconUser } from '@arco-design/web-react/icon';
const Row = Grid.Row;
const Col = Grid.Col;
const Option = Select.Option;
const InputSearch = Input.Search;

export default function AppList() {
    const [curCategory, setCurCategory] = useState(undefined);
    const [categoryList, setCategoryList] = useState([]);
    const [curId, setCurId] = useState(0);
    const [curSort, setCurSort] = useState(0);
    const [copySort, setCopySort] = useState(0);
    const [appName, setAppName] = useState('');
    const [loading, setLoading] = useState(false);
    const updateApp = useRef()
    const sortInput = useRef()
    const [availableStatus, setAvailableStatus] = useState({ // 可用状态
        'all': '全员可用',
        'part': '部分成员可用'
      });
    const [tableData, setTableData] = useState([]);
    
    const columns = [
      {
        title: '应用',
        scopedSlots: { customRender: 'appDetail' },
        render: (col, record, index) => (
          <div className="app-box">
          <Avatar className="a-avatar" size={48} triggerIcon={<IconUser />}>
          <img
            alt='avatar'
            src={record.detail.avatar}
          />
          </Avatar>
          <div className="app-name text-overflow-1">
            <div className="name-box">
              <p className="name">{ record.detail.name }</p>
              <p className="desc">{ record.detail.desc }</p>
            </div>
          </div>
        </div>
        )
      },
      {
        title: '应用分类',
        key: 'app_category',
        dataIndex: 'app_category.name'
      },
      {
        title: '开发者信息',
        render: (col, record, index) => (
          <div className="dev-info-box">
          <div className="dev-info-text">
            创建人：
            <span>{ record.create_employee_info.name }</span>
          </div>
          <div className="dev-info-text">
            联系人：
            <a rel="noreferrer" href="dingtalk://dingtalkclient/action/sendmsg?dingtalk_id=maozihao" target="_blank">毛自豪</a>
          </div>
        </div>
        )
      },
      {
        title: '可用性状态',
        scopedSlots: { customRender: 'availableStatus' },
        render: (col, record, index) => (
          <div className="available-status-box">
            <span className="status-text">{ availableStatus[record.permission.scope_type] }</span>
          </div>
        )
      },
      {
        title: '排序',
        render: (col, record, index) => (
          <div className="sort-box">
            {!record.sorts ? <span>{ record.sort }</span>: <Input ref={sortInput} style={{width:'60px'}} maxLength={5} size="small" onBlur={saveSort} onChange={(val: string) => setCurSort(val)}/>}
            
            {!record.sorts && <span className="sort-icon" onClick={() => sortShow(record)}>
              <Icon type="edit" />
            </span>}
            
          </div>
        )
      },
      {
        title: '操作',
        width: 200,
        render: (col, record, index) => (
          <div className="tool-box">
          {record.is_update && <Button className="update-btn" size="small" type="primary"
            onClick={() => openUpdate(record.detail.name, record.corp_app_id, record.next_version.version_id, record.next_version)}
    >
            更新
          </Button>}
          <Button size="small" type="link" onClick={() => toPath('/appConfig', { id: record.corp_app_id })}>
            配置
          </Button>
        </div>
        )


      },
    ];
    const [pagination, setPagination] = useState({
        current: 1,
        total: 0
      });
    
      function handleChange(val) {
        setCurCategory(val)
        refreshList();
      }
      async function getClassify() {
        systemApplist({}).then((res) => {
          setCategoryList(res.items || [])
        }).catch((err) => {});
      }
    
      async function saveSort() {
        setTableData(tableData.map((item) => {
          item.sorts = false;
          return item;
        }))
        if (curSort == copySort) {
          return;
        }
        // 请求修改排序
        try {
          await requestWorkAppUpdateSort(curId, {
            sort: curSort
          });
          Message.success('排序修改成功');
          setTableData(tableData.map((item) => {
            if (item.corp_app_id == curId) {
              item.sort = curSort;
            }
            return item;
          }))
        } catch(err) {
          console.log(err);
          Message.success('排序修改失败');
        }
      }


    function sortShow(obj) {
      setCopySort(obj.sort)
      setCurSort(obj.sort)
      setCurId(obj.corp_app_id)
      setTableData(tableData.map((item) => {
        item.sorts = false;
        if (item.corp_app_id == obj.corp_app_id) {
          item.sorts = true;
        }
        return item;
      }))
      setTimeout(() => {
        sortInput.current.focus();
      }, 0);
    }
    function refreshList () {
      fetchAppList(pagination.current);
    }
    function handleTableChange (pagination) {
      const pager = { ...pagination }
      pager.current = pagination.current
      pagination = pager
      fetchAppList(pagination.current)
    }
    // 打开更新弹窗
    function openUpdate (name, userAppId, versionId, nextVersion) {
      updateApp.current.openModal(name, userAppId, versionId, nextVersion);
    }

    const onSearch = (value: string) => {
      setAppName(value)
      fetchAppList(1)
    }
    // 获取列表数据
    function fetchAppList (currentPage) {
      setLoading(true)
      fetchWorkList({
        page: currentPage,
        limit: 10,
        app_name: appName,
        app_category_id: curCategory,
      }).then(res => {
        const { items, total_result } = res || {}
        setTableData(items || [])
        pagination.total = total_result
      }).finally(() => {
        setLoading(false)
      })
    }

    useEffect(() => {

        getClassify();
        fetchAppList(1);
    }, [])

  return <div className={Styles['app-list']}>
    <Row justify="space-between">
      <p className={Styles.title}>已安装应用</p>
      <div className={Styles["right-search"]}>
        <Select value={curCategory} style={{width:'120px',marginRight:'10px'}} allowClear placeholder="请选择分类" onChange={handleChange}>
            {
                categoryList.map((item, inx) => (
                    <Option key={'categoryList' + inx} value={item.app_category_id}>{item.name}</Option>
                ))
            }
        </Select>
        <InputSearch placeholder="搜索应用" style={{width: '200px'}} onSearch={onSearch} />
      </div>
    </Row>
    <Table scroll={{ y: 'calc(100% - 60px)' }} rowKey="corp_app_id"
      columns={columns} data-source={tableData} pagination={pagination} loading={loading}
      onChange={handleTableChange}
    >

    </Table>
    <UpdateApp ref={updateApp} onRefreshList={refreshList} />
  </div>
}
