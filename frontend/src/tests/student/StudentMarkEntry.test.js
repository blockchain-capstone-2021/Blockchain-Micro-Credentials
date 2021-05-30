import React from "react";
import StudentMarkEntry from "../../components/student/StudentMarkEntry";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StudentMarkEntry />);

describe("testing Student Mark Entry component", () => {
  it('should be defined on render', () => {
    expect(StudentMarkEntry).toBeDefined();
  });

  it('renders page header', () => {
    let container = wrapper.find("h1");
    expect(container).toHaveLength(1);
    expect(container.text()).toEqual("Enter Final Mark");
  });
  
  it('shows loading when fetching data', () => {
    expect(
        wrapper.containsMatchingElement(
          <p>Loading...</p>
        )
      ).toBeTruthy();
  });

});
