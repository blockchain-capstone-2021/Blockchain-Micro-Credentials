import React from "react";
import Login from "../../components/login/Login";
import setToken from "../../components/login/UseToken"
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<Login setToken = {setToken}/>);

describe("testing Login component", () => {
  it('should be defined on render', () => {
    expect(Login).toBeDefined();
  });

  it('renders Login header', () => {
    let container = wrapper.find("h1");
    expect(wrapper.find("h1")).toHaveLength(1);
    expect(container.text()).toEqual("Login");
  });

  it('renders login form', () => {
    expect(wrapper.find("form")).toHaveLength(1);
  });

  it('renders correct labels for input fields', () => {
    expect(
        wrapper.containsMatchingElement(
            <label>Username (ID)</label>,
            <label>Password</label>,
        )
      ).toBeTruthy();
  });

});
