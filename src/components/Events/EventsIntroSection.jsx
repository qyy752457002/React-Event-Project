import { Link } from 'react-router-dom';

import meetupImg from '../../assets/meetup.jpg';

export default function EventsIntroSection() {
  return (
    <section
      className="content-section"
      id="overview-section"
      style={{ backgroundImage: `url(${meetupImg})` }}
    >
      <h2>
        与优秀的人们连接 <br />
        或者 <strong>发现新的激情</strong>
      </h2>
      <p>任何人都可以在 React Event 上组织和参加活动！</p>
      <p>
        <Link to="/events/new" className="button">
          创建你的第一个活动
        </Link>
      </p>
    </section>
  );
}
