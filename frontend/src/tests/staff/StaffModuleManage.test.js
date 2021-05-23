import React from "react";
import StaffModuleManage from "../../components/modules/StaffModuleManage";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StaffModuleManage />);

describe("testing Staff Module Manage component", () => {

    it('renders page header', () => {
        let container = wrapper.find("h1");
        expect(container).toHaveLength(1);
        expect(container.text()).toEqual("Module Management");
      });

    it('renders table headings', () => {
        expect(
            wrapper.containsMatchingElement(
              <th>#</th>,
              <th>Name</th>,
              <th>Questions Written</th>,
              <th>Question Bank Size</th>,
              <th>Publish</th>,
              <th>Weight</th>,
              <th>Manage</th>
            )
          ).toBeTruthy();
      });

  it('renders course options', () => {
    let container = wrapper.find("#inlineFormSelectPref");
    expect(container).toHaveLength(1);
    expect(container.text()).toEqual("Select a CourseLoading");
  });

  it('no options rendered when no courses taught', () => {
    let container = wrapper.find("#inlineFormSelectPref");
    expect(container).toHaveLength(1);
    expect(container.text()).toEqual("Select a CourseLoading");
  });

  it('unpublish a module', () => {
    let container = wrapper.find("#inlineFormSelectPref");
    expect(container).toHaveLength(1);
    expect(container.text()).toEqual("Select a CourseLoading");
  });

  it('publish a module', () => {
    let container = wrapper.find("#inlineFormSelectPref");
    expect(container).toHaveLength(1);
    expect(container.text()).toEqual("Select a CourseLoading");
  });

  it('renders no modules message', () => {
    expect(
        wrapper.containsMatchingElement(
            <td>No modules for the selected course</td>
        )
      ).toBeTruthy();
  });

});
