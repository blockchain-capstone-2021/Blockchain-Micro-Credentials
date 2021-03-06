import React from "react";
import StudentProfile from "../../components/student/StudentProfile";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StudentProfile />);

describe("testing Student Profile component", () => {
  it('should be defined on render', () => {
    expect(StudentProfile).toBeDefined();
  });

  it('shows message when no details are retrieved', () => {
    expect(
        wrapper.containsMatchingElement(
          <p>No details found</p>
        )
      ).toBeTruthy();
  });
});
