import { Alert } from 'antd'
import './AlertMessage.css'
const AlertMessage = () => {
  return (
    <div className={'error'}>
      <Alert message="Error loading data" type="error" showIcon />
    </div>
  )
}

export default AlertMessage
