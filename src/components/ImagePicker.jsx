export default function ImagePicker({ images, selectedImage, onSelect }) {
  return (
    <div id="image-picker">
      {/* 显示提示文字 */}
      <p>选择一张图片</p>
      <ul>
        {/* 显示图片列表 */}
        {images.map((image) => (
          <li
            key={image.path}
            onClick={() => onSelect(image.path)}
            // 如果图片被选中，添加 "selected" 类名
            className={selectedImage === image.path ? 'selected' : undefined}
          >
            {/* 显示图片 */}
            <img
              src={`http://localhost:3000/${image.path}`}
              alt={image.caption}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
