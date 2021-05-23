import React from "react";
import StaffQuestionView from "../../components/questions/StaffQuestionView";
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

const wrapper = shallow(<StaffQuestionView {...initProps} />);

describe("testing Staff Question Add component", () => {

    it('renders page header', () => {
        let container = wrapper.find("h1");
        expect(
            wrapper.containsMatchingElement(
                <h1>Question Details</h1>
            )
          );
      });

    it('render form inputs', () => {
        expect(
            wrapper.containsMatchingElement(
              <input class="form-control" />
            )
          );
      });

    it('back button renders', () => {
        expect(
            wrapper.containsMatchingElement(
                <button>Back</button>
            )
          );
      });

});
