import { Link, Outlet } from 'react-router-dom';

import Header from '../Header.jsx';
import EventsIntroSection from './EventsIntroSection.jsx';
import FindEventSection from './FindEventSection.jsx';
import NewEventsSection from './NewEventsSection.jsx';

export default function Events() {
  return (
    <>
      <Outlet />
      {/* 使用 Header 组件作为页面头部 */}
      <Header>
        {/* 显示按钮以创建新事件 */}
        <Link to="/events/new" className="button">
          新建事件
        </Link>
      </Header>
      <main>
        {/* 显示事件简介部分 */}
        <EventsIntroSection />
        {/* 显示最新事件列表部分 */}
        <NewEventsSection />
        {/* 显示搜索事件部分 */}
        <FindEventSection />
      </main>
    </>
  );
}
