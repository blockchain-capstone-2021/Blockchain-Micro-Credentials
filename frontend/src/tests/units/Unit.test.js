import React from "react";
import Unit from "../../components/units/Unit";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<Unit />);

describe('testing Unit component', () => {
    it('should be defined on render', () => {
        expect(Unit).toBeDefined();
    });

    it('renders modules table', () => {
        expect(wrapper.find("table")).toHaveLength(1);
    });

    it('renders table headings', () => {
        expect(
            wrapper.containsMatchingElement(
                <th>Name</th>,
                <th># of Attempts</th>,
                <th>Best result</th>,
                <th>Weight</th>,
                <th>Action</th>
            )
          ).toBeTruthy();
    });

    it('shows loading when fetching module data', () => {
        expect(
            wrapper.containsMatchingElement(
                <tr>Loading</tr>
            )
          ).toBeTruthy();
      });
})