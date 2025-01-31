import React, { Component } from 'react';
import { axiosInstance } from '../../../utils/axiosIntercepter.js';
import { FilterOutlined, RedditCircleFilled } from '@ant-design/icons';
import {
  Form,
  Select,
  Spin,
  Divider,
  Switch,
  Button,
  Modal,
  Tag,
  message,
} from 'antd';
import RemoveIco from '../../../assets/images/letterX.svg';

let Option = Select.Option;
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};
class ADOFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      distLoading: false,
      district: null,
    };
  }
  handleCancel = () => {
    this.setState({ isModalVisible: false });
  };
  handleOk = () => {
    this.setState({ isModalVisible: false });
  };
  fetchDistricts = () => {
    this.setState({
      ...this.state,
      distLoading: true,
    });
    axiosInstance
      .get('/api/district/')
      .then((res) => {
        this.setState({
          ...this.state,
          distLoading: false,
          district: res.data,
        });
      })
      .catch((err) => {
        this.setState({
          ...this.state,
          distLoading: false,
        });
        console.log(err);
      });
  };
  componentDidMount() {
    this.fetchDistricts();
  }

  render() {
    let tags = [];
    const x = this.props.filters
      ? Object.keys(this.props.filters).forEach((key, idx) => {
          if (this.props.filters[key]) {
            var val = this.props.filters[key].split('_')[0];
            var str = `${key} : ${val}`;
            tags.push(
              <div className="filter_tag">
                <span>{str}</span>
                <div
                  onClick={() => {
                    this.props.removeFilter(key);
                  }}>
                  <img style={{ width: '10px' }} src={RemoveIco}></img>
                </div>
              </div>,
            );
          }
        })
      : 'No filters active';
    return (
      <>
        <div
          className="search-filter"
          style={{ display: 'inline-block' }}
          onClick={() => {
            this.setState({ ...this.state, isModalVisible: true });
          }}>
          <FilterOutlined />
        </div>
        <Modal
          visible={this.state.isModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          style={{
            padding: '10px',
            fontSize: '1.2em',
            color: 'black',
          }}
          footer={[]}>
          <div
            className="filters"
            style={{ minHeight: '25px', marginBottom: '10px' }}>
            <div
              style={{
                fontWeight: 400,
                color: 'black',
                marginBottom: '12px',
                paddingTop: '10px',
              }}>
              Filters Active
            </div>
            {this.props.filters.district ? (
              <div>
                {tags.map((tag) => {
                  return tag;
                })}
              </div>
            ) : (
              <span className="no_filter_disp">No active filters</span>
            )}
          </div>
          <Divider></Divider>
          <div
            style={{
              fontWeight: 400,
              color: 'black',
            }}>
            Add Filters
          </div>
          <Form
            name="pending_location_filter"
            style={{ marginTop: '10px' }}
            {...layout}
            onFinish={(e) => {
              this.props.applyFilters(e);
            }}>
            <Form.Item label="Select District" name="district">
              <Select showSearch placeholder="Select District">
                <Option value={undefined}>No District</Option>
                {!this.state.distLoading && this.state.district ? (
                  this.state.district.map((district) => {
                    return (
                      <Option
                        key={district.id}
                        value={`${district.district}_${district.id}`}>
                        {district.district}
                      </Option>
                    );
                  })
                ) : (
                  <Option style={{ textAlign: 'center' }}>
                    <Spin spinning={true}></Spin>
                  </Option>
                )}
              </Select>
            </Form.Item>
            <Form.Item
              wrapperCol={{ span: 24, offset: 0 }}
              labelCol={{ span: 0 }}
              style={{
                marginTop: '10px',
                marginBottom: '-20px',
              }}>
              <div class="add-filter-modal-footer">
                <Button
                  htmlType="submit"
                  key="submit"
                  type="primary"
                  style={{
                    color: '#e03b3b',
                    backgroundColor: '#f6f6f6',
                    borderRadius: '20px',
                    height: '26px',
                    border: '0px',
                    fontSize: '15px',
                  }}>
                  Add Filters
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  }
}

export default ADOFilter;
