import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="notfound-container">
    <img
      src="https://res.cloudinary.com/dt0d1rirt/image/upload/v1721805668/Group_7484_drskeh.png"
      className="not-found-image"
      alt="not-found-pic"
    />
    <h1 className="notfound-heading">PAGE NOT FOUND</h1>
    <p className="notfound-paragraph">
      we are sorry, the page you requested could not be found
    </p>
    <Link to="/" className="link-container">
      <button className="home-btn">Home</button>
    </Link>
  </div>
)

export default NotFound
