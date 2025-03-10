import auth, { AuthParams } from '@/utils/authentication';
import { useEffect, useMemo, useState } from 'react';

export type IRoute = AuthParams & {
  name: string;
  key: string;
  // 当前页是否展示面包屑
  breadcrumb?: boolean;
  children?: IRoute[];
  // 当前路由是否渲染菜单项，为 true 的话不会在菜单中显示，但可通过路由地址访问。
  ignore?: boolean;
};

export const routes: IRoute[] = [
  {
    name: 'menu.dashboard',
    key: 'dashboard',
    children: [
      {
        name: 'menu.dashboard.workplace',
        key: 'dashboard/workplace',
      },
    ],
  },
  {
    name: 'Example',
    key: 'example',
  },
  {
    name: 'menu.devPlatform',
    key: 'devPlatform',
    children: [
      {
        name: 'menu.devPlatform.voucherInfo',
        key: 'devPlatform/voucherInfo',
      },
      {
        name: 'menu.devPlatform.appList',
        key: 'devPlatform/appList',
      },
      // ,
      // {
      //   name: 'menu.devPlatform.appFunc.web',
      //   key: 'devPlatform/appFunc/web',
      // },
      // {
      //   name: 'menu.devPlatform.appFunc.appSearch',
      //   key: 'devPlatform/appFunc/appSearch',
      // },
      // {
      //   name: 'menu.devPlatform.appFunc.lowcode',
      //   key: 'devPlatform/appFunc/lowcode',
      // },
      // {
      //   name: 'menu.devPlatform.appFunc.singleLogout',
      //   key: 'devPlatform/appFunc/singleLogout',
      // },
      // {
      //   name: 'menu.devPlatform.developers',
      //   key: 'devPlatform/developers',
      // },
      // {
      //   name: 'menu.devPlatform.securitySettings',
      //   key: 'devPlatform/securitySettings',
      // },
      // {
      //   name: 'menu.devPlatform.devPermission',
      //   key: 'devPlatform/devPermission',
      // },
      // {
      //   name: 'menu.devPlatform.eventSubscription',
      //   key: 'devPlatform/eventSubscription',
      // },
      // {
      //   name: 'menu.devPlatform.versionsReleases',
      //   key: 'devPlatform/versionsReleases',
      // },
      // {
      //   name: 'menu.devPlatform.versionsInfo',
      //   key: 'devPlatform/versionsInfo',
      // },
      // {
      //   name: 'menu.devPlatform.mobileLogin',
      //   key: 'devPlatform/mobileLogin',
      // },
      // {
      //   name: 'menu.devPlatform.appMonitoring',
      //   key: 'devPlatform/appMonitoring',
      // },
    ],
  },
];

export const getName = (path: string, routes) => {
  return routes.find((item) => {
    const itemPath = `/${item.key}`;
    if (path === itemPath) {
      return item.name;
    } else if (item.children) {
      return getName(path, item.children);
    }
  });
};

export const generatePermission = (role: string) => {
  const actions = role === 'admin' ? ['*'] : ['read'];
  const result = {};
  routes.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => {
        result[child.name] = actions;
      });
    }
  });
  return result;
};

const useRoute = (userPermission): [IRoute[], string] => {
  const filterRoute = (routes: IRoute[], arr = []): IRoute[] => {
    if (!routes.length) {
      return [];
    }
    for (const route of routes) {
      const { requiredPermissions, oneOfPerm } = route;
      let visible = true;
      if (requiredPermissions) {
        visible = auth({ requiredPermissions, oneOfPerm }, userPermission);
      }

      if (!visible) {
        continue;
      }
      if (route.children && route.children.length) {
        const newRoute = { ...route, children: [] };
        filterRoute(route.children, newRoute.children);
        if (newRoute.children.length) {
          arr.push(newRoute);
        }
      } else {
        arr.push({ ...route });
      }
    }

    return arr;
  };

  const [permissionRoute, setPermissionRoute] = useState(routes);

  useEffect(() => {
    const newRoutes = filterRoute(routes);
    setPermissionRoute(newRoutes);
  }, [JSON.stringify(userPermission)]);

  const defaultRoute = useMemo(() => {
    const first = permissionRoute[0];
    if (first) {
      const firstRoute = first?.children?.[0]?.key || first.key;
      return firstRoute;
    }
    return '';
  }, [permissionRoute]);

  return [permissionRoute, defaultRoute];
};

export default useRoute;
