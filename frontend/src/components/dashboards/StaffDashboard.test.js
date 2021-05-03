import React from "react";
import StaffDashboard from "./StaffDashboard";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe('testing Staff Dashboard component', () => {
    it('Page renders', () => {
        const wrapper = shallow(<StaffDashboard />);
    });
    
    it('renders 3 cards', () => {
        const wrapper = shallow(<StaffDashboard />);
        expect(wrapper.find("#card-body")).toHaveLength(3);
    });
})