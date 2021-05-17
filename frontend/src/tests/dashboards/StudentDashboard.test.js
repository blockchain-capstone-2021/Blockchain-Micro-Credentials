import React from "react";
import StudentDashboard from "../../components/dashboards/StudentDashboard";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StudentDashboard />);

describe('testing Student Dashboard component', () => {
    it('should be defined on render', () => {
        expect(StudentDashboard).toBeDefined();
        expect(wrapper).toMatchSnapshot();
        // expect(axios.get).toHaveBeenCalledTimes(1);
    });
    it('renders a header', () => {
        expect(wrapper.find("h1")).toHaveLength(1);
    });
    it('renders two tables', () => {
        expect(wrapper.find("table")).toHaveLength(2);
    });
    it('renders message if no enrolments exist', () => {
        expect(
            wrapper.containsMatchingElement(
              <tbody>No available enrolments</tbody>
            )
          ).toBeTruthy();
    });
    // it('renders enrolments if enrolments exist', () => {
    //     await microcredapi.get(`/student/s3724266/enrolled`)
    //     expect(wrapper).toMatchSnapshot();
    // });
})