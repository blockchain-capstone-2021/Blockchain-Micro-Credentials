import { Link } from 'react-router-dom';
import microcredapi from '../../apis/microcredapi'

// Utility file to seperate the modal logic from the Question Manage page

function displayQuestionDataModal(questionId) {
    async function getQuestion() {
        return await microcredapi.get(`/questions/${questionId}`).then(response => {
            let question = response.data.question
            const answers = microcredapi.post(`/questions/${questionId}/answers`).then(res => {
                question.answers = res.data.answers
            })
        })
    }
    const question = getQuestion()
    window.addEventListener('DOMContentLoaded', (event) => {
        const el = document.getElementById('questionDataModal')
        el.addEventListener('show.bs.modal', function (event) {
            const mod_qid = document.getElementById('qid')
            mod_qid.innerHTML = question.questionId
        })
    });
    
}

function displayDeleteModal(type, history, redirect) {
    const confId = type === 'DELETE_ALL' ? 'deleteConfAll' : 'deleteConf'
    const el = document.getElementById(confId)
    el.addEventListener('show.bs.modal', function (event) {
      const button = event.relatedTarget
      const qid = button.getAttribute('data-bs-questionid')
      const mid = button.getAttribute('data-bs-moduleid')
      const modalTitle = el.querySelector('.modal-title')
      const modalBodyInput = el.querySelector('.modal-body p')
      const delIdentifier = confId === 'deleteConfAll' ? 'delAll_deleteConfAll' : 'delAll_deleteConf'
      const deleteButton = document.getElementById(delIdentifier)
      if(qid && mid) {
        modalTitle.innerHTML = 'Delete question \'' + qid + '\'?'
        modalBodyInput.innerHTML = 'Are you sure that you want to delete question \'' + qid + '\' from module \''+ mid +'\'? This action is irreversible.'
        deleteButton.onclick = async function() {
          const response = await microcredapi.post(`/questions/${qid}/delete`).then(
              window.location.reload()
          ) 
        }
      } else if (mid) {
        modalTitle.innerHTML = 'Delete all questions?'
        modalBodyInput.innerHTML = 'Are you sure you want to delete all the questions in this module? This action is irreversible.'
        deleteButton.onclick = async function() {
          const response = await microcredapi.post(`/questions/${mid}/deleteAll`).then(
              window.location.reload()
          )
        }
      }
    })
}

function renderQuestionViewModal() {
    
    return (
        <div className="modal fade" id="questionDataModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
        <p>Question ID:<span id="qid"></span></p>
        <p>Module ID:<span id="mid"></span></p>
        <p>Content:<span id="qcontent"></span></p>
            <h6>Answers</h6>
          <table className="table">
              <thead>
                  <tr>
                      <th>Content</th>
                      <th>Value</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td id="acontent1"></td>
                      <td id="aCorrect1"></td>
                  </tr>
                  <tr>
                      <td id="acontent2"></td>
                      <td id="aCorrect2"></td>
                  </tr>
                  <tr>
                      <td id="acontent3"></td>
                      <td id="aCorrect3"></td>
                  </tr>
                  <tr>
                      <td id="acontent4"></td>
                      <td id="aCorrect4"></td>
                  </tr>
              </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
    )
  }

  function renderModal(modType) {
    const isDeleteAll = modType === 'DELETE_ALL' ? 'deleteConfAll' : 'deleteConf'
    return (
      <div className="modal fade" id={isDeleteAll} tabIndex="-1" aria-labelledby="deleteConf" aria-hidden="true">
      <div className="modal-dialog">
          <div className="modal-content">
          <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Delete all questions?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
              <p>Are you sure you want to delete all the questions in this module? This action is irreversible.</p>
          </div>
          <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>

              <Link className="btn btn-danger" id={`delAll_${isDeleteAll}`} data-bs-dismiss="modal">Delete</Link>
          </div>
          </div>
      </div>
      </div>
    )
}

export {displayDeleteModal, renderQuestionViewModal, renderModal, displayQuestionDataModal}