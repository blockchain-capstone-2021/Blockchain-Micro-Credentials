//Function to get the current academic semester
async function getCurrentSemester() {
    let date = new Date();
    let semOfEnrol = `Y${date.getFullYear()}S`;
    let month = date.getMonth();
    let semester;
    //If the current month is before July, it is semester 1. Else it is Semester 2.
    if (month < 7) {
        semester = '1';
    } else {
        semester = '2';
    }
    semOfEnrol += semester;

    return semOfEnrol;
}

module.exports = {
    getCurrentSemester
};