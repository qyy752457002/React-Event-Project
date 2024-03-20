import { useIsFetching } from '@tanstack/react-query';

export default function Header({ children }) {
  // 使用 useIsFetching hook 获取数据加载状态
  const fetching = useIsFetching();

  return (
    <>
      {/* 如果有正在加载的数据，显示进度条 */}
      <div id="main-header-loading">{fetching > 0 && <progress />}</div>
      <header id="main-header">
        <div id="header-title">
          {/* 显示标题 */}
          <h1>React Events</h1>
        </div>
        {/* 显示导航栏 */}
        <nav>{children}</nav>
      </header>
    </>
  );
}
