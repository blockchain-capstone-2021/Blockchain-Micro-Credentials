async function getCurrentSemester(){
    let date = new Date()
    let semOfEnrol = `Y${date.getFullYear()}S`
    let month = date.getMonth()
    let semester
    if(month < 7){
        semester = '1'
    }else{
        semester = '2'
    }
    semOfEnrol += semester
    
    return semOfEnrol
}

module.exports = {
    getCurrentSemester
}