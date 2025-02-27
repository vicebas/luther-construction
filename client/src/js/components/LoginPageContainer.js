import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import * as actions from "../actions/index";
import LoginPage from "./LoginPage";

export class LoginPageContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {
        email: "",
        password: "",
      },
    };
  }

  componentDidMount() {
    document.querySelector("head > title").innerHTML =
      "Login | LUTHER CONSTRUCTION";
    this.state = {
      user: {
        email: "",
        password: "",
      },
    };
  }

  changeUser = (e) => {
    const field = e.target.name;
    const user = this.state.user;
    user[field] = e.target.value;

    this.setState({
      user,
    });
  };

  processForm = (e) => {
    e.preventDefault();
    this.props.dispatch(actions.loginUser(this.state.user));
  };

  testApp = (e) => {
    e.preventDefault();
    this.setState(
      {
        user: {
          email: "tester@test.com",
          password: "Tester",
        },
      },
      () => {
        document.querySelector(".login-btn").click();
      }
    );
  };

  render() {
    console.log("LOGIN PAGE ", this.props.loginRedirect);
    return (
      <Route
        path="/login"
        render={() =>
          // eslint-disable-line
          !this.props.loginRedirect ? (
            <LoginPage
              onSubmit={this.processForm}
              onChange={this.changeUser}
              demoSubmit={this.demoSubmit}
              user={this.state.user}
              registrationSuccessMessage={this.props.registrationSuccessMessage}
              errors={this.props.errors}
              loadingStatus={this.props.loadingStatus}
              testApp={this.testApp}
            />
          ) : (
            <Redirect to="/profile" />
          )
        }
      />
    );
  }
}

const mapStateToProps = (state) => ({
  errors: state.auth.loginErrorMessage,
  registrationSuccessMessage: state.auth.registrationSuccessMessage,
  loginRedirect: state.auth.loginRedirect,
  loadingStatus: state.auth.authLoadingStatus,
});

export default connect(mapStateToProps)(LoginPageContainer);
