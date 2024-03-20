import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import ImagePicker from '../ImagePicker.jsx';
import { fetchSelectableImages } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';

export default function EventForm({ inputData, onSubmit, children }) {
  // 定义状态变量，用于存储选定的图片
  const [selectedImage, setSelectedImage] = useState(inputData?.image);

  // 使用 useQuery hook 获取可选择的图片数据
  const { data, isPending, isError } = useQuery({
    queryKey: ['events-images'], // 查询键
    queryFn: fetchSelectableImages, // 查询函数
  });

  // 处理选择图片的函数
  function handleSelectImage(image) {
    setSelectedImage(image);
  }

  // 提交表单的处理函数
  function handleSubmit(event) {
    event.preventDefault(); // 阻止表单默认提交行为

    const formData = new FormData(event.target); // 创建 FormData 对象来收集表单数据
    const data = Object.fromEntries(formData); // 将 FormData 转换为普通对象

    onSubmit({ ...data, image: selectedImage }); // 调用 onSubmit 回调函数并传递表单数据和选定的图片
  }

  return (
    <form id="event-form" onSubmit={handleSubmit}>
      <p className="control">
        <label htmlFor="title">标题</label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={inputData?.title ?? ''}
        />
      </p>

      {/* 显示加载状态或错误提示 */}
      {isPending && <p>正在加载可选图片...</p>}
      {isError && (
        <ErrorBlock
          title="无法加载可选图片"
          message="请稍后再试。"
        />
      )}

      {/* 显示可选图片选择器 */}
      {data && (
        <div className="control">
          <ImagePicker
            images={data}
            onSelect={handleSelectImage}
            selectedImage={selectedImage}
          />
        </div>
      )}

      <p className="control">
        <label htmlFor="description">描述</label>
        <textarea
          id="description"
          name="description"
          defaultValue={inputData?.description ?? ''}
        />
      </p>

      <div className="controls-row">
        <p className="control">
          <label htmlFor="date">日期</label>
          <input
            type="date"
            id="date"
            name="date"
            defaultValue={inputData?.date ?? ''}
          />
        </p>

        <p className="control">
          <label htmlFor="time">时间</label>
          <input
            type="time"
            id="time"
            name="time"
            defaultValue={inputData?.time ?? ''}
          />
        </p>
      </div>

      <p className="control">
        <label htmlFor="location">地点</label>
        <input
          type="text"
          id="location"
          name="location"
          defaultValue={inputData?.location ?? ''}
        />
      </p>

      {/* 显示表单操作按钮 */}
      <p className="form-actions">{children}</p>
    </form>
  );
}
