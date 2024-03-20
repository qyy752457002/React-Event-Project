import {
  Link,
  redirect,
  useNavigate,
  useParams,
  useSubmit,
  useNavigation,
} from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, updateEvent, queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EditEvent() {
  const navigate = useNavigate(); // 获取导航函数
  const { state } = useNavigation(); // 获取导航状态
  const submit = useSubmit(); // 获取提交函数
  const params = useParams(); // 获取路由参数

  // 使用 useQuery hook 获取事件数据
  const { data, isError, error } = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
    staleTime: 10000
  });

  // 提交表单数据的处理函数
  function handleSubmit(formData) {
    submit(formData, { method: 'PUT' });
  }

  // 关闭模态框的处理函数
  function handleClose() {
    navigate('../');
  }

  let content;

  // 根据加载状态渲染内容
  if (isError) {
    content = (
      <>
        {/* 显示加载失败的错误提示 */}
        <ErrorBlock
          title="加载事件失败"
          message={
            error.info?.message ||
            '加载事件失败，请检查输入并稍后重试。'
          }
        />
        <div className="form-actions">
          {/* 显示按钮以返回 */}
          <Link to="../" className="button">
            确定
          </Link>
        </div>
      </>
    );
  }

  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? (
          <p>发送数据中...</p>
        ) : (
          <>
            {/* 显示取消按钮 */}
            <Link to="../" className="button-text">
              取消
            </Link>
            {/* 显示更新按钮 */}
            <button type="submit" className="button">
              更新
            </button>
          </>
        )}
      </EventForm>
    );
  }

  // 将内容渲染到模态框中
  return <Modal onClose={handleClose}>{content}</Modal>;
}

// 加载器函数，用于加载事件数据
export function loader({ params }) {
  return queryClient.fetchQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}

// 动作函数，用于处理更新事件操作
export async function action({ request, params }) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);
  await updateEvent({ id: params.id, event: updatedEventData });
  await queryClient.invalidateQueries(['events']); // 使事件列表查询失效，以便重新获取最新数据
  return redirect('../'); // 重定向到上级路由
}
