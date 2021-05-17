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
})