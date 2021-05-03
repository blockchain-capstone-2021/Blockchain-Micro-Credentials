import React from "react";
import StaffDashboard from "./StaffDashboard";
import {shallow, mount} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe('testing Staff Dashboard component', () => {
    it('includes cards in body', () => {
        const wrapper = shallow(<StaffDashboard />);
        expect(wrapper.matchesElement('div.card-body'));
    });

    it('Page renders', () => {
        const wrapper = shallow(<StaffDashboard />);
    });
})