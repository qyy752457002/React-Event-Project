import { useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchEvents } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';

export default function FindEventSection() {
  const searchElement = useRef(); // 创建搜索框的引用
  const [searchTerm, setSearchTerm] = useState(); // 定义搜索关键词状态

  // 使用 useQuery hook 获取符合搜索条件的事件数据
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['events', { searchTerm: searchTerm }], // 查询键，包含搜索关键词
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }), // 查询函数
    enabled: searchTerm !== undefined // 是否启用查询，当搜索关键词不为空时启用
  });

  // 表单提交处理函数
  function handleSubmit(event) {
    event.preventDefault(); // 阻止默认提交行为
    setSearchTerm(searchElement.current.value); // 设置搜索关键词
  }

  let content = <p>请输入搜索关键词来查找事件。</p>; // 默认内容

  // 根据加载状态渲染内容
  if (isLoading) {
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
        {/* 显示事件列表 */}
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>发现你的下一个事件！</h2>
        {/* 显示搜索表单 */}
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="搜索事件"
            ref={searchElement}
          />
          <button>搜索</button>
        </form>
      </header>
      {content}
    </section>
  );
}
