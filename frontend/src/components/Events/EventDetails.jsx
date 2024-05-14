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
    isPending: isPendingDeletion, // 是否正在删除事件的状态，isPendingDeletion 
    isError: isErrorDeleting, // 是否删除事件出错的状态，isErrorDeleting
    error: deleteError, // 删除事件的错误信息，deleteError
  } = useMutation({
    mutationFn: deleteEvent, // 删除事件的函数
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['events'], // 立即标记 "events" 查询键下的数据为stale
        refetchType: 'none',  // 客户端不会立即向服务器请求最新的 "events" 查询键下的数据
                              // ex. http://localhost:3000/events/279 是不行的，因为 id 为 279 的 事件 已经被删除了
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
    // { id: params.id } 对应 deleteEvent 函数 里 传进 的 { id }
    mutate({ id: params.id }); // 调用删除事件的函数
  }

  let content;

  // 显示加载状态
  if (isPending) {
    content = (
      <div id="event-details-content" className="center">
        <p>Fetching event data...</p>
      </div>
    );
  }

  // 显示错误信息
  if (isError) {
    content = (
      <div id="event-details-content" className="center">
        <ErrorBlock
          title="Failed to load event"
          message={
            error.info?.message ||
            'Failed to fetch event data, please try again later.'
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
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
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
        <h2>Are you sure?</h2>
          <p>
            Do you really want to delete this event? This action cannot be
            undone.
          </p>
          <div className="form-actions"> 
            {isPendingDeletion && <p>Deleting, please wait...</p>}
            {!isPendingDeletion && (
              <>
                <button onClick={handleStopDelete} className="button-text">
                  Cancel
                </button>
                <button onClick={handleDelete} className="button">
                  Delete
                </button>
              </>
            )}
          </div>
          {/* 显示删除事件的错误信息 */}
          {isErrorDeleting && (
            <ErrorBlock
              title="Failed to delete event"
              message={
                deleteError.info?.message ||
                'Failed to delete event, please try again later.'
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
          View all Events
        </Link>
      </Header>
      {/* 显示事件详情内容 */}
      <article id="event-details">{content}</article>
    </>
  );
}

