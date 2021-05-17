import React from "react";
import StaffDashboard from "../../components/dashboards/StaffDashboard";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StaffDashboard />);

describe('testing Staff Dashboard component', () => {
    it('should be defined on render', () => {
        expect(StaffDashboard).toBeDefined();
    });
    
    it('renders 3 cards', () => {
        expect(wrapper.find("#card-body")).toHaveLength(3);
    });

    it('Has 3 link buttons', () => {
        expect(wrapper.find("Link")).toHaveLength(3);
    });
})