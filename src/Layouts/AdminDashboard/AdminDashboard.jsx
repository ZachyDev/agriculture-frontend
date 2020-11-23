import React, { Component } from 'react';
import { Layout } from 'antd';
import './AdminDashboard.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import Headers from '../../Components/Header/Header';
import Contents from '../../Components/Content/Content';

class AdminDashboard extends Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
    };
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <div>
        <Layout style={{ height: '100vh' }}>
          <Sidebar collapsed={this.state.collapsed} type="admin_dashboard" pathname={this.props.history.location.pathname}/>
          <Layout
            className="site-layout"
            style={{ backgroundColor: '#f5f3ff' }}>
            <Headers
              logout={this.props.logout}
              toggle={this.toggle}
              collapsed={this.state.collapsed}
            />
            <Contents history={this.props.history} role={5}/>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default AdminDashboard;
