import React from "react";
import { Layout } from "antd";

const { Content } = Layout;

function Login() {
  const submitHandler = (e) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <form onSubmit={submitHandler}>
          <div className="form-inner">
            Login

            <div className="from-group">
              <label htmlFor="name" id="name">
                Name:
              </label>
              <input type="name" name="name" id="name" />
            </div>

            <div className="from-group">
              <label htmlFor="email" id="email">
                Email:
              </label>
              <input type="email" name="email" id="email" />
            </div>
            <div className="from-group">
              <label htmlFor="password" id="password">
                Password:
              </label>
              <input type="password" name="password" id="password" />
            </div>
            <input type="submit" value="LOGIN" />
          </div>
        </form>
  );
}

export default Login;
