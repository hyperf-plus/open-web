
import { requestWorkAppUpdateConfig } from '@/api/appStore';
import { Icon, Message, Modal, Tooltip } from '@arco-design/web-react';
import React, { forwardRef, useRef, useState } from 'react';
import Styles from './index.module.less'

interface IProps {
    onRefreshList: () => void;
}
export default forwardRef( function UpdateApp(props: IProps) {
    const { onRefreshList } = props;

    const [state, setState] = useState(
        {
            name: '', // 应用名称
            updateModal: false, // 更新应用弹窗
            generalPermissions: [], // 普通权限
            advancedPermissions: [], // 高级权限
            description: '',  // 简短描述
            userAppId: null,  // 应用ID
            versionId: null, // 当前版本号
        }
    );
    

    function openModal (name, userAppId, versionId, nextVersion) {
  
        let tempData = [
          {
            id:3000,
            name:"获取用户发给机器人的私聊消息（历史版本）",
            is_advance:false,
            is_new:false
          },
          {
            id:8000,
            name:"校验用户是否为应用管理员",
            is_advance:false,
            is_new:false
          },
          {
            id:8,
            name:"通过手机号或者邮箱获取用户 ID",
            is_advance:true,
            is_new:false
          },
          {
            id:9,
            name:"应用以用户身份进行云文档操作",
            is_advance:true,
            is_new:false
          },
          {
            id:1000,
            name:"以应用的身份发消息（历史版本）",
            is_advance:false,
            is_new:false
          },
          {
            id:3001,
            name:"获取群聊中用户 @ 机器人的消息（历史版本）",
            is_advance:false,
            is_new:false
          }
        ]

      // state.advancedPermissions = []
      // state.generalPermissions = []
      // for (let i = 0; i < tempData.length; i++) {
      //   if (tempData[i].is_advance) {
      //     state.advancedPermissions.push(tempData[i].name)
      //   } else {
      //     state.generalPermissions.push(tempData[i].name)
      //   }
      // }
      
        setState(prevState => ({
            ...prevState,
            name: name,
            description: nextVersion.description,
            userAppId: userAppId,
            versionId: versionId,
            updateModal: true
          }));
      }


    // 更新确定
    function clickUpdate () {
        requestWorkAppUpdateConfig({
            corp_app_id: state.userAppId,
            version_id: state.versionId
        }).then(res => {
            if (res) {
                state.updateModal = false;
                Message.success('成功更新版本！');
                // 刷新父级数据
                onRefreshList?.()
            }
        })
    }

      // 更新弹窗关闭
      function cancelUpdate () {
        state.updateModal = false
      }

      const updateApp = useRef()

    return  <div ref={updateApp} className={Styles['update-modal']}>
      <Modal
        className="update-modal"
        title={`${state.name} 做了以下更新`}
        visible={state.updateModal}
        closable={false}
        maskClosable={false}
        okText="授权并更新"
        getPopupContainer={() => updateApp.current}
        onOk={clickUpdate}
        onCancel={cancelUpdate}
      >
        <div className={Styles.permissions}>
          {/* <!-- <p className="permissions-title">普通权限</p>
          <div className="permissions-box">
            <div v-for="(item, index) in generalPermissions" :key="index" className="permissions-item">
              <Icon className="icon" type="key" />
              <p className="text">{{item}}</p>
            </div>
          </div> --> */}
          {/* <!-- <p className="permissions-title">
            高级权限
            <Tooltip placement="top">
              <template slot="title">
                <span>请仔细确认是否允许应用使用如下权限</span>
              </template>
              <Icon type="info-circle" style="color: rgb(255, 196, 0);" />
            </Tooltip>
          </p>
          <div className="permissions-box">
            <div v-for="(item, index) in advancedPermissions" :key="index" className="permissions-item">
              <Icon className="icon general" type="key" />
              <p className="text">{{item}}</p>
            </div>
          </div> --> */}
          <div className={Styles['permissions-box']}>
            <div className={Styles['permissions-item']}>
              <Icon className="icon" type="key" />
              <p className={Styles['text']}>{state.description}</p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
})