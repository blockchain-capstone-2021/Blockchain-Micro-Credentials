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
    });

    it('renders Dashboard header', () => {
        let container = wrapper.find("h1");
        expect(container).toHaveLength(1);
        expect(container.text()).toEqual("Dashboard");
    });

    it('renders Enrolments header', () => {
        let container = wrapper.find("h2");
        expect(container).toHaveLength(1);
        expect(container.text()).toEqual("Enrolments");
    });

    it('renders two tables', () => {
        expect(wrapper.find("table")).toHaveLength(2);
    });

    it('renders table headings', () => {
        expect(
            wrapper.containsMatchingElement(
                <th>Course</th>,
                <th>Enrolment Period</th>,
                <th>Status</th>
            )
          ).toBeTruthy();
    });

    it('renders message if no enrolments exist', () => {
        expect(
            wrapper.containsMatchingElement(
              <tbody>No available enrolments</tbody>
            )
          ).toBeTruthy();
    });
})