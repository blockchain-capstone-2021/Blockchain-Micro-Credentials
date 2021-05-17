import React from "react";
import StudentMarkEntry from "../../components/student/StudentMarkEntry";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StudentMarkEntry />);

describe("testing Student Mark Entry component", () => {
  it('renders with submit', () => {
    expect(StudentMarkEntry).toBeDefined();
  });
  
  it('shows loading when no student is set', () => {
    expect(
        wrapper.containsMatchingElement(
          <p>Loading...</p>
        )
      ).toBeTruthy();
  });

});
