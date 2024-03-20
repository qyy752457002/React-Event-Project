import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { queryClient } from '../../util/http.js';

export default function NewEvent() {
  const navigate = useNavigate(); // 获取导航函数

  // 使用 useMutation hook 定义创建新事件的异步操作
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createNewEvent, // 异步请求函数
    onSuccess: () => { // 请求成功后的处理函数
      queryClient.invalidateQueries({ queryKey: ['events'] }); // 使事件列表查询失效，以便重新获取最新数据
      navigate('/events'); // 导航到事件列表页
    },
  });

  // 提交表单数据的处理函数
  function handleSubmit(formData) {
    mutate({ event: formData }); // 调用 mutate 函数发起异步请求
  }

  return (
    <Modal onClose={() => navigate('../')}>
      {/* 显示事件表单 */}
      <EventForm onSubmit={handleSubmit}>
        {isPending && '提交中...'}
        {!isPending && (
          <>
            {/* 显示取消按钮 */}
            <Link to="../" className="button-text">
              取消
            </Link>
            {/* 显示创建按钮 */}
            <button type="submit" className="button">
              创建
            </button>
          </>
        )}
      </EventForm>
      {/* 显示错误提示 */}
      {isError && (
        <ErrorBlock
          title="创建事件失败"
          message={
            error.info?.message ||
            '创建事件失败，请检查输入并稍后重试。'
          }
        />
      )}
    </Modal>
  );
}
