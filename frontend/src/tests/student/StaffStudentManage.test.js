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

  it('renders page header', () => {
    let container = wrapper.find("h1");
    expect(container).toHaveLength(1);
    expect(container.text()).toEqual("Student Management");
  });

  it('renders Enrolments header', () => {
    let container = wrapper.find("h2");
    expect(container).toHaveLength(2);
    // expect(container.text()).toEqual("Enrolled Students");
  });

  it('renders table headings', () => {
    expect(
        wrapper.containsMatchingElement(
          <th>ID</th>,
          <th>Name</th>,
          <th>Status</th>,
          <th>Manage</th>
        )
      ).toBeTruthy();
  });

});
