import { Link } from 'react-router-dom';

export default function EventItem({ event }) {
  // 格式化日期
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <article className="event-item">
      {/* 显示事件图片 */}
      <img src={`http://localhost:3000/${event.image}`} alt={event.title} />
      <div className="event-item-content">
        <div>
          {/* 显示事件标题 */}
          <h2>{event.title}</h2>
          {/* 显示事件日期 */}
          <p className="event-item-date">{formattedDate}</p>
          {/* 显示事件地点 */}
          <p className="event-item-location">{event.location}</p>
        </div>
        <p>
          {/* 显示链接按钮以查看详情 */}
          <Link to={`/events/${event.id}`} className="button">
            查看详情
          </Link>
        </p>
      </div>
    </article>
  ); 
}
