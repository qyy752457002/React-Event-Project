import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function Modal({ children, onClose }) {
  const dialog = useRef(); // 创建一个对话框的引用

  useEffect(() => {
    // 使用 useEffect 来同步 Modal 组件与 DOM 对话框 API
    // 当 Modal 组件被渲染时，通过它的内置 API 打开原生 <dialog>
    const modal = dialog.current;
    modal.showModal(); // 打开对话框

    return () => {
      modal.close(); // 为了避免抛出错误，在组件卸载时关闭对话框
    };
  }, []);

  // 使用 createPortal 将对话框渲染到指定的 DOM 节点上
  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal') // 将对话框渲染到 id 为 'modal' 的 DOM 元素上
  );
}
