import { Component } from 'react'
import { Form, Input } from 'antd'
import debounce from 'lodash/debounce'

export default class SearchForm extends Component {
  state = {
    searchFormText: '',
  }

  componentDidMount() {
    const { onChangeDebounced } = this.props

    this.handleChangeDebounced = debounce(onChangeDebounced, 500)
  }

  onInputChange = (e) => {
    this.setState({
      searchFormText: e.target.value,
    })
    this.handleChangeDebounced(e.target.value)
  }

  render() {
    const { searchText } = this.state

    return (
      <Form>
        <Form.Item name="search">
          <Input placeholder="Type to search..." allowClear value={searchText} onChange={this.onInputChange} />
        </Form.Item>
      </Form>
    )
  }
}
