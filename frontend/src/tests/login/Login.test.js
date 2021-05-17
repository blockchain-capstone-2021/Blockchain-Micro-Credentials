import React from "react";
import Login from "../../components/login/Login";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<Login />);

describe("testing Login component", () => {
  it('renders with submit', () => {
    expect(Login).toBeDefined();
  });
});
