import { useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';

import Header from '../Header.jsx';
import { fetchEvent, deleteEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false); // 是否正在删除事件的状态

  const params = useParams(); // 获取路由参数
  const navigate = useNavigate(); // 获取导航函数

  // 使用 useQuery hook 获取事件数据
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', params.id], // 查询键
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }), // 查询函数
  });

  // 使用 useMutation hook 处理删除事件
  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeleting,
    error: deleteError,
  } = useMutation({
    mutationFn: deleteEvent, // 删除事件的函数
    onSuccess: () => {
      queryClient.invalidateQueries({ // 使查询无效
        queryKey: ['events'], // 查询键
        refetchType: 'none', // 不重新获取数据
      });
      navigate('/events'); // 导航到事件列表页
    },
  });

  // 开始删除事件
  function handleStartDelete() {
    setIsDeleting(true);
  }

  // 取消删除事件
  function handleStopDelete() {
    setIsDeleting(false);
  }

  // 确认删除事件
  function handleDelete() {
    mutate({ id: params.id }); // 调用删除事件的函数
  }

  let content;

  // 显示加载状态
  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <p>正在获取事件数据...</p>
      </div>
    );
  }

  // 显示错误信息
  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title="无法加载事件"
          message={
            error.info?.message ||
            '无法获取事件数据，请稍后再试。'
          }
        />
      </div>
    );
  }

  // 显示事件详情
  if (data) {
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    content = (
      <>
        <header>
          {/* 显示事件标题和操作按钮 */}
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleStartDelete}>删除</button>
            <Link to="edit">编辑</Link>
          </nav>
        </header>
        <div id="event-details-content">
          {/* 显示事件图片 */}
          <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
          <div id="event-details-info">
            <div>
              {/* 显示事件地点和日期时间 */}
              <p id="event-details-location">{data.location}</p>
              <time dateTime={`${data.date}T${data.time}`}>
                {formattedDate} @ {data.time}
              </time>
            </div>
            {/* 显示事件描述 */}
            <p id="event-details-description">{data.description}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* 显示删除事件的确认模态框 */}
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>确定要删除吗？</h2>
          <p>您确定要删除此事件吗？此操作无法撤销。</p>
          <div className="form-actions">
            {isPendingDeletion && <p>正在删除，请稍候...</p>}
            {!isPendingDeletion && (
              <>
                <button onClick={handleStopDelete} className="button-text">
                  取消
                </button>
                <button onClick={handleDelete} className="button">
                  删除
                </button>
              </>
            )}
          </div>
          {/* 显示删除事件的错误信息 */}
          {isErrorDeleting && (
            <ErrorBlock
              title="无法删除事件"
              message={
                deleteError.info?.message ||
                '无法删除事件，请稍后再试。'
              }
            />
          )}
        </Modal>
      )}
      {/* 显示子路由 */}
      <Outlet />
      {/* 显示页面头部 */}
      <Header>
        <Link to="/events" className="nav-item">
          查看所有事件
        </Link>
      </Header>
      {/* 显示事件详情内容 */}
      <article id="event-details">{content}</article>
    </>
  );
}

