import { useQuery } from '@tanstack/react-query';

import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';
import { fetchEvents } from '../../util/http.js';

export default function NewEventsSection() {
  // 使用 useQuery hook 获取最新添加的事件数据
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', { max: 5 }], // 查询键，限制获取最多5个事件

    // queryKey[1] 对应于 { max: 5 } 这个对象，它传递了一个 max 参数，用于限制获取的事件数量最多为5个

    /*
      详细步骤: 
      
      step 1. queryKey[1] 返回 {max : 5}

      step 2. ...queryKey[1] 返回 max : 5

      step 3. fetchEvents({ signal, max : 5 })
    */

    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }), // 查询函数
    staleTime: 5000, // 每隔10秒，'events' 查询键下对应 { max: 5 } 数据会被标记为 stale，客户端会向服务器请求 最新的 'events' 查询键下对应 { max: 5 } 的 数据
    // gcTime: 1000 // 数据会在缓存里面保留1秒
  });

  let content;

  // 根据加载状态渲染内容
  if (isPending) {
    content = <LoadingIndicator />; // 显示加载指示器
  }

  if (isError) {
    content = (
      <ErrorBlock
        title="An Error Has Happened"
        message={error.info?.message || 'Unable to Fetch Events。'}
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
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
