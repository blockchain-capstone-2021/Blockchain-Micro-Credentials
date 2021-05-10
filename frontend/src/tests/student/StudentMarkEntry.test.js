import React from "react";
import StudentMarkEntry from "../../components/student/StudentMarkEntry";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

// const wrapper = shallow(<StudentMarkEntry />);
const history = {
    push: jest.fn(),
  };

  describe("testing Student Mark Entry component", () => {
    // let props;
    // let wrapper;
    // let useEffect;

    // const student = { studentId: "s3745409",
    // degreeId: "BP094",
    // studentName: "Daniel Dominique",
    // studentEmail: "s3745409@student.rmit.edu.au",
    // studentCreditPoints: 96,
    // passwordHash: "37653276b74d7442c60db2c26eef32c21b0d121ade2ce826f4d1dc1d3c1e025f"}
  
    // beforeEach(() => {
    //     useEffect = jest.spyOn(React, "useEffect").mockImplementation(f => f());
    
    //     props = {
    //       fetchstudent: jest.fn().mockResolvedValue(student)
    //     };

    //   wrapper = shallow(<StudentMarkEntry {...props} />);
    // });

    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it('renders with submit', () => {
      let wrapper = shallow(<StudentMarkEntry />);
      expect(StudentMarkEntry).toBeDefined();
    });
    it('shows loading when no student is set', () => {
      let wrapper = shallow(<StudentMarkEntry />);
      expect(
          wrapper.containsMatchingElement(
            <p>Loading...</p>
          )
        ).toBeTruthy();
    });

    it("finds button", () => {
      const props = { student: jest.fn().mockResolvedValueOnce({ studentId: "s3745409",
      degreeId: "BP094",
      studentName: "Daniel Dominique",
      studentEmail: "s3745409@student.rmit.edu.au",
      studentCreditPoints: 96,
      passwordHash: "37653276b74d7442c60db2c26eef32c21b0d121ade2ce826f4d1dc1d3c1e025f"}) };
      const wrapper = shallow(<StudentMarkEntry {...props}></StudentMarkEntry>);
      expect(wrapper.find("button")).toHaveLength(1);
      expect(wrapper.find("button").text()).toEqual('Submit');
    });

    it('should render form when student is defined', () => {
      const props = { student: jest.fn() };
      const wrapper = shallow(<StudentMarkEntry {...props}></StudentMarkEntry>);
      expect(wrapper.find("form")).toBeTruthy();
    });
    // it('shows "please hold" when submitting is true', () => {
    //   const props = { submitting: jest.fn().mockResolvedValueOnce(true) };
    //   const wrapper = shallow(<StudentMarkEntry {...props}></StudentMarkEntry>);
    //   expect(wrapper.containsMatchingElement(
    //         <p>Please hold while the form is processing.</p>
    //       )).toBeTruthy();
    //   });
      // it('pushes to "/manage/students" on click', () => {
      //   wrapper.find('button').simulate('click');
      //   expect(history.push).toHaveBeenCalledWith('/manage/students');
      // });
  });
