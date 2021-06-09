import React from "react";
import StaffModuleEdit from "../../components/modules/StaffModuleEdit";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const wrapper = shallow(<StaffModuleEdit />);

describe("testing Staff Module Manage component", () => {

    it('renders page header', () => {
        let container = wrapper.find("h1#module-heading");
    });


  it('renders back button', () => {
        let container = wrapper.find(".btn-primary");
  });

});
