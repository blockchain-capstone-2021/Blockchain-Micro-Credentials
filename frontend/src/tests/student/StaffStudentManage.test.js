import React from "react";
import StaffStudentManage from "../../components/student/StaffStudentManage";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StaffStudentManage />);

describe("testing Staff Student Manage component", () => {
  it('should be defined on render', () => {
    expect(StaffStudentManage).toBeDefined();
  });

  it('renders page header', () => {
    let container = wrapper.find("h1");
    expect(container).toHaveLength(1);
    expect(container.text()).toEqual("Student Management");
  });

  it('renders 2 Table headers', () => {
    let container = wrapper.find("h2");
    expect(container).toHaveLength(2);
  });

  it('renders dropdown menu', () => {
    expect(
        wrapper.containsMatchingElement(
          <option>Select a Course</option>
        )
      ).toBeTruthy();
  });

  it('renders two tables', () => {
    expect(wrapper.find("table")).toHaveLength(2);
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

  it('renders message if no students enrolled', () => {
    expect(
        wrapper.containsMatchingElement(
          <tr><td>There are no enrolled students for this course.</td></tr>
        )
      ).toBeTruthy();
      expect(
        wrapper.containsMatchingElement(
          <tr><td>There are no completed students for this course.</td></tr>
        )
      ).toBeTruthy();
  });

});
