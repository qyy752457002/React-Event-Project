export default function LoadingIndicator() {
  return (
    <div className="lds-ring">
      {/* 使用 CSS 实现的加载动画 */}
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

