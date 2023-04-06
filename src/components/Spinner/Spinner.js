import { Spin } from 'antd'
import './Spinner.css'
const Spinner = () => (
  <div className="spinner">
    <Spin size="large" tip="Loading..." />
  </div>
)
export default Spinner
