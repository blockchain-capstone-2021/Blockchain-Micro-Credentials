import React from 'react'

const Answer = ({text, correct}) => {
    return (
        <div class="form-check">
            <input class="form-check-input" type="radio" name="exampleRadios" id="exampleRadios1" value="option1" />
            <label class="form-check-label" for="exampleRadios1">
            {text}
            </label>
        </div>
    )
}

export default Answer
