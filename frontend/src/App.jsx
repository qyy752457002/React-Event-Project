import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';

import Events from './components/Events/Events.jsx';
import EventDetails from './components/Events/EventDetails.jsx';
import NewEvent from './components/Events/NewEvent.jsx';
import EditEvent, {
  loader as editEventLoader,
  action as editEventAction,
} from './components/Events/EditEvent.jsx';
import { queryClient } from './util/http.js';

// 创建基于浏览器的路由
const router = createBrowserRouter([
  // 首页重定向到事件页面
  {
    path: '/',
    element: <Navigate to="/events" />,
  },
  // 事件页面
  {
    path: '/events',
    element: <Events />,
    children: [
      // 新建事件页面
      {
        path: '/events/new',
        element: <NewEvent />,
      },
    ],
  },
  // 事件详情页面
  {
    path: '/events/:id',
    element: <EventDetails />,
    children: [
      // 编辑事件页面
      {
        path: '/events/:id/edit',
        element: <EditEvent />,
        // 编辑事件页面加载器和操作
        loader: editEventLoader,
        action: editEventAction
      },
    ],
  },
]);

function App() {
  return (
    // 使用React Query提供的QueryClientProvider包装整个应用，使其可用于数据查询
    <QueryClientProvider client={queryClient}>
      {/* 使用RouterProvider提供的路由 */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
