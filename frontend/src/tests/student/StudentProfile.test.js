import React from "react";
import StudentProfile from "../../components/student/StudentProfile";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StudentProfile />);

describe("testing Student Profile component", () => {
  it('renders with submit', () => {
    expect(StudentProfile).toBeDefined();
  });
});
