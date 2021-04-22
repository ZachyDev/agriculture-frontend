import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Space, Modal, message } from 'antd';
import '../location.css';
import { axiosInstance } from '../../../utils/axiosIntercepter';
import MainContent from '../../../Components/MainContent/MainContent';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import pencil from '../../../assets/images/edit.png';
import delete_logo from '../../../assets/images/trash-can.png';
import LocationFilter from '../LocationFilter';
const { confirm } = Modal;

class Pending extends Component {
  constructor() {
    super();
    this.state = {
      search: '',
      totalCount: null,
      locationsData: [],
      loading: false,
      filters: null,
    };
  }
  columns = [
    {
      title: 'STATE',
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: 'BLOCK',
      dataIndex: 'block',
      key: 'block',
    },
    {
      title: 'VILLAGE',
      dataIndex: 'village_name',
      key: 'village_name',
      render: (vill) => {
        return <span>{vill ? vill.village : ''}</span>;
      },
    },
    {
      title: 'DDA',
      dataIndex: 'dda',
      key: 'dda',
      render: (dda) => {
        // let tooltipText = '';
        // if (dda) {
        //   tooltipText = () => {
        //     return (
        //       <>
        //         <div className="tooltip-text">
        //           Name : {dda.user.name}
        //           <br></br>
        //           Email : {dda.user.email}
        //           <br></br>
        //           District :{' '}
        //           {dda.district.district ? dda.district.district : 'null'}
        //           <br></br>
        //           State : {dda.district.state.state}
        //         </div>
        //       </>
        //     );
        //   };
        // }
        return (
          // <Tooltip placement="bottom" title={tooltipText}>
          <span>{dda ? dda.user.name : 'No Data'}</span>
          //</Tooltip>
        );
      },
    },
    {
      title: 'ADO',
      dataIndex: 'ado',
      key: 'ado',
      render: (ado) => {
        // let tooltipText = '';
        // if (ado) {
        //   tooltipText = () => {
        //     return (
        //       <>
        //         <div className="tooltip-text">
        //           Name : {ado.user.name}
        //           <br></br>
        //           Email : {ado.user.email}
        //           <br></br>
        //           State : {ado.user.state ? ado.user.state.state : 'null'}
        //         </div>
        //       </>
        //     );
        //   };
        // }
        return (
          // <Tooltip placement="bottom" title={tooltipText}>
          <span>{ado ? ado.user.name : 'No Data'}</span>
          // </Tooltip>
        );
      },
    },
    {
      title: 'DATE',
      dataIndex: 'acq_date',
      key: 'acq_date',
    },
    {
      title: 'OPTIONS',
      key: 'operation',
      render: (text, record) => {
        return (
          <Space size="large">
            <Link to={`/locations/pending/edit/${record.id}`}>
              <img src={pencil} alt="edit" className="icons" />
            </Link>
            <img
              src={delete_logo}
              className="icons"
              alt="delete"
              onClick={() => this.showDeleteConfirm(record.village, record.id)}
            />
          </Space>
        );
      },
    },
  ];

  onSearch = (value) => {
    if (this.state.filters) {
      var distId = this.state.filters.district.split('_')[1];
      const assign = this.state.filters.assignment ? 'assigned' : 'unassigned';
      this.props.history.push({
        pathname: '/locations/pending',
        search: `?page=${1}&search=${value}`,
      });
      this.fetchLocations(1, value, distId, assign);
    } else {
      this.props.history.push({
        pathname: '/locations/pending',
        search: `?page=${1}&search=${value}`,
      });
      this.fetchLocations(1, value, null, null);
    }
  };
  showDeleteConfirm = (villlageName, locationId) => {
    let currentPage = this.props.history.location.search.split('=')[1];
    let instance = this;
    confirm({
      title: 'Are you sure delete this location?',
      icon: <ExclamationCircleOutlined />,
      content: villlageName,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        console.log('OK');
        axiosInstance
          .delete(`/api/location/${locationId}/`)
          .then((res) => {
            console.log(res);
            message.success('Location deleted successfully');
            if (currentPage === undefined) {
              instance.fetchLocations(1);
            } else {
              instance.fetchLocations(currentPage);
            }
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
            } else {
              message.error(err.message);
              console.log(err.message);
            }
          });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  onPageChange = (page) => {
    console.log('page = ', page);

    let search = this.props.history.location.search.split('=')[2];
    if (search == 'undefined') {
      search = undefined;
    }
    console.log(this.state.filters);
    if (this.state.filters) {
      var distId = this.state.filters.district.split('_')[1];
      const assign = this.state.filters.assignment ? 'assigned' : 'unassigned';
      this.props.history.push({
        pathname: '/locations/pending',
        search: `?page=${page}&search=${search}`,
      });
      this.fetchLocations(page, search, distId, assign);
    } else {
      this.props.history.push({
        pathname: '/locations/pending',
        search: `?page=${page}&search=${search}`,
      });
      this.fetchLocations(page, search, null, null);
    }
  };

  fetchLocations = (page, search = '', distId, assign) => {
    var url;
    if (distId && assign) {
      url = `/api/location/district/${distId}/${assign}?page=${page}&search=${search}`;
    } else {
      url = `/api/locations/pending?page=${page}&search=${search}`;
    }

    this.setState({ ...this.state, loading: true });
    axiosInstance
      .get(url)
      .then((res) => {
        console.log(res.data);
        this.setState({
          ...this.state,
          locationsData: res.data.results,
          loading: false,
          totalCount: res.data.count,
        });
      })
      .catch((err) => {
        this.setState({
          ...this.state,
          loading: false,
        });
        if (err.response) {
          console.log(err.response);
        } else {
          console.log(err.message);
        }
      });
  };

  componentDidMount() {
    this.setState({ ...this.state, loading: true });
    this.fetchLocations(1, this.state.search);
    document.title = 'AFL - Pending Locations';
  }
  applyFilter = (filters) => {
    console.log(filters);
    const { district, assignment } = filters;
    console.log(assignment);
    const distName = district.split('_')[0];
    const distId = district.split('_')[1];
    const assign = assignment ? 'assigned' : 'unassigned';
    message.success(`Showing ${assign} locations under ${distName}`);
    this.setState({ ...this.state, filters: filters }, () => {
      this.fetchLocations(1, '', distId, assign);
    });
  };
  removeFilter = () => {
    this.setState({ ...this.state, filters: null }, () => {
      this.fetchLocations(1, '', null, null);
    });
  };
  render() {
    return (
      <>
        <MainContent
          title="Pending Locations"
          addlink="/locations/add"
          loading={this.state.loading}
          filter={() => {
            return (
              <LocationFilter
                applyFilters={this.applyFilter}
                filters={this.state.filters}
                removeFilter={this.removeFilter}
                status="Pending"></LocationFilter>
            );
          }}
          dataSource={this.state.locationsData}
          columns={this.columns}
          totalPages={this.state.totalCount}
          onPageChange={this.onPageChange}
          onSearch={this.onSearch}
          isLocation="true"
          locStatus="Pending"
        />
      </>
    );
  }
}

export default Pending;
