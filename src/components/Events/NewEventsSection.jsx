import { useQuery } from '@tanstack/react-query';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {
  // 使用 useQuery hook 获取最新添加的事件数据
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', { max: 3 }], // 查询键，限制获取最多3个事件
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }), // 查询函数
    staleTime: 5000, // 数据过期时间
    // gcTime: 1000 // 垃圾回收时间
  });

  let content;

  // 根据加载状态渲染内容
  if (isPending) {
    content = <LoadingIndicator />; // 显示加载指示器
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="发生错误"
        message={error.info?.message || '无法获取事件。'}
      />
    ); // 显示错误提示
  }

  if (data) {
    content = (
      <ul className="events-list">
        {/* 显示最新事件列表 */}
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>最近添加的事件</h2>
      </header>
      {content}
    </section>
  );
}
