import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import dashboard_routes from '../../routes/dashboard_routes';
import { Layout } from 'antd';
import Report from '../../Pages/Report/ReportRender.js';
import Villages from '../../Pages/Villages/Villages';
import Dda_villages from '../../Pages/DDA_Villages/dda_village';
import ADO from '../../Pages/ADO/ADO';
import DDA_Ado from '../../Pages/DDA_Ado/dda_ado';
import Pending from '../../Pages/Locations/Pending/pending';
import Ongoing from '../../Pages/Locations/ongoing';
import Completed from '../../Pages/Locations/completed';
import Dda_ongoing from '../../Pages/DDA_Locations/dda_ongoing';
import Dda_completed from '../../Pages/DDA_Locations/dda_completed';
import Dda_pending from '../../Pages/DDA_Locations/dda_pending';
const { Content } = Layout;

class Contents extends Component {
  render() {
    const renderReport = ({ match }) => {
      console.log(match.params);
      return <Report villageId={match.params.villageId}></Report>;
    };
    const renderVillage = () => {
      if (this.props.role == 5) {
        return <Villages history={this.props.history}></Villages>;
      } else if (this.props.role == 4) {
        return <Dda_villages history={this.props.history}></Dda_villages>;
      }
    };
    const renderLocation = () => {
      const status = this.props.history.location.pathname.split('/')[2];
      console.log(status);

      if (this.props.role == 5) {
        if (status == 'pending') {
          return <Pending history={this.props.history}></Pending>;
        } else if (status == 'ongoing') {
          return <Ongoing history={this.props.history}></Ongoing>;
        } else if (status == 'completed') {
          return <Completed history={this.props.history}></Completed>;
        }
      } else if (this.props.role == 4) {
        if (status == 'pending') {
          return <Dda_pending history={this.props.history}></Dda_pending>;
        } else if (status == 'ongoing') {
          return <Dda_ongoing history={this.props.history}></Dda_ongoing>;
        } else if (status == 'completed') {
          return <Dda_completed history={this.props.history}></Dda_completed>;
        }
      }
    };
    const renderAdo = () => {
      if (this.props.role == 5) {
        return <ADO history={this.props.history}></ADO>;
      } else if (this.props.role == 4) {
        return <DDA_Ado history={this.props.history}></DDA_Ado>;
      }
    };
    return (
      <Content
        style={{
          margin: '40px 20px',
          borderRadius: '20px',
          minHeight: 'auto',
        }}>
        <Switch>
          {dashboard_routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              children={<route.component history={this.props.history} />}
            />
          ))}
          <Route path="/ado" exact children={renderAdo}></Route>
          <Route
            path="/locations/ongoing/:villageId"
            exact
            component={renderReport}></Route>
          <Route path="/villages" exact children={renderVillage}></Route>
          <Route
            path="/locations/ongoing"
            exact
            children={renderLocation}></Route>
          <Route path="/locations/pending" children={renderLocation}></Route>
          <Route path="/locations/completed" children={renderLocation}></Route>
          <Redirect from="/" to="/" />
        </Switch>
      </Content>
    );
  }
}

export default Contents;
