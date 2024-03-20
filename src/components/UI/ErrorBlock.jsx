export default function ErrorBlock({ title, message }) {
  return (
    <div className="error-block">
      {/* 显示错误图标 */}
      <div className="error-block-icon">!</div>
      <div className="error-block-text">
        {/* 显示错误标题 */}
        <h2>{title}</h2>
        {/* 显示错误信息 */}
        <p>{message}</p>
      </div>
    </div>
  );
}
