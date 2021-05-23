import React from "react";
import StaffQuestionAdd from "../../components/questions/StaffQuestionAdd";
import {shallow} from "enzyme";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const initProps = {
    location: {
        state: {
            module: {}
        }
    }
}

const wrapper = shallow(<StaffQuestionAdd {...initProps} />);

describe("testing Staff Question Add component", () => {

    it('renders page header', () => {
        let container = wrapper.find("h1");
        expect(container).toHaveLength(1);
        expect(container.text()).toEqual("Create a question");
      });

    it('render form inputs', () => {
        expect(
            wrapper.containsMatchingElement(
              <input class="form-control" />
            )
          );
      });
    it('submit button renders', () => {
        expect(
            wrapper.containsMatchingElement(
                <button>Submit</button>
            )
          ).toBeTruthy();
      });

});
