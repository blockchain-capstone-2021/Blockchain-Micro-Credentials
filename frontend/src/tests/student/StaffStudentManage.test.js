import React from "react";
import StaffStudentManage from "../../components/student/StaffStudentManage";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StaffStudentManage />);

describe("testing Staff Student Manage component", () => {
  it('renders with submit', () => {
    expect(StaffStudentManage).toBeDefined();
  });
});
