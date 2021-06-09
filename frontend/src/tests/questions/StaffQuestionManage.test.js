import React from "react";
import StaffQuestionManage from "../../components/questions/StaffQuestionManage";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StaffQuestionManage />);

describe("testing Staff Question Manage component", () => {

    it('renders page header', () => {
        let container = wrapper.find("h1");
        expect(container).toHaveLength(1);
        expect(container.text()).toEqual("Question management");
      });

    it('renders table headings', () => {
        expect(
            wrapper.containsMatchingElement(
              <th>ID</th>,
              <th>Content</th>
            )
          ).toBeTruthy();
      });

      
      it('renders no questions message', () => {
        expect(
            wrapper.containsMatchingElement(
                <td>There are no questions for this module</td>
            )
          ).toBeTruthy();
      });

  it('renders course options', () => {
    let container = wrapper.find("#course");
    expect(container).toHaveLength(2);
    expect(container.first().text()).toEqual("Select a CourseLoading...");
  });


});
