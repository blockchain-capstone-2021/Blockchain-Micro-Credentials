import { Link, useHistory } from 'react-router-dom';
import microcredapi from '../../apis/microcredapi'

function displayQuestionDataModal(questionId) {
    async function getQuestion() {
        return await microcredapi.get(`/questions/${questionId}`).then(response => {
            let question = response.data.question
            const answers = microcredapi.post(`/questions/${questionId}/answers`).then(res => {
                question.answers = res.data.answers
            })
            console.log(question);
        })
    }
    const question = getQuestion()
    window.addEventListener('DOMContentLoaded', (event) => {
        const el = document.getElementById('questionDataModal')
        el.addEventListener('show.bs.modal', function (event) {
            // const button = event.relatedTarget
            // const qid = button.getAttribute('data-bs-qid')
            // const mid = button.getAttribute('data-bs-mid')
            // const content = button.getAttribute('data-bs-qcontent')
            // const a1Content = button.getAttribute('data-bs-acontent1')
            // const a2Content = button.getAttribute('data-bs-acontent2')
            // const a3Content = button.getAttribute('data-bs-acontent3')
            // const a4Content = button.getAttribute('data-bs-acontent4')
            // const a1IsCorrect1 = button.getAttribute('data-bs-aCorrect1')
            // const a2IsCorrect2 = button.getAttribute('data-bs-aCorrect2')
            // const a3IsCorrect3 = button.getAttribute('data-bs-aCorrect3')
            // const a4IsCorrect4 = button.getAttribute('data-bs-aCorrect4')

            const mod_qid = document.getElementById('qid')
            const mod_mid = document.getElementById('mid')
            const mod_content = document.getElementById('qcontent')
            const mod_a1Content = document.getElementById('acontent1')
            const mod_a2Content = document.getElementById('acontent2')
            const mod_a3Content = document.getElementById('acontent3')
            const mod_a4Content = document.getElementById('acontent4')
            const mod_a1IsCorrect1 = document.getElementById('aCorrect1')
            const mod_a2IsCorrect2 = document.getElementById('aCorrect2')
            const mod_a3IsCorrect3 = document.getElementById('aCorrect3')
            const mod_a4IsCorrect4 = document.getElementById('aCorrect4')

            mod_qid.innerHTML = question.questionId
            // mod_mid.innerHTML = mid
            // mod_content.innerHTML = content
            // mod_a1Content.innerHTML = a1Content
            // mod_a2Content.innerHTML = a2Content
            // mod_a3Content.innerHTML = a3Content
            // mod_a4Content.innerHTML = a4Content
            // mod_a1IsCorrect1.innerHTML = a1IsCorrect1
            // mod_a2IsCorrect2.innerHTML = a1IsCorrect2
            // mod_a3IsCorrect3.innerHTML = a1IsCorrect3
            // mod_a4IsCorrect4.innerHTML = a1IsCorrect4
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
        <div class="modal fade" id="questionDataModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Modal title</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
        <p>Question ID:<span id="qid"></span></p>
        <p>Module ID:<span id="mid"></span></p>
        <p>Content:<span id="qcontent"></span></p>
            <h6>Answers</h6>
          <table class="table">
              <thead>
                  <tr>
                      <th>Content</th>
                      <th>Value</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td scope="row" id="acontent1"></td>
                      <td id="aCorrect1"></td>
                  </tr>
                  <tr>
                      <td scope="row" id="acontent2"></td>
                      <td id="aCorrect2"></td>
                  </tr>
                  <tr>
                      <td scope="row" id="acontent3"></td>
                      <td id="aCorrect3"></td>
                  </tr>
                  <tr>
                      <td scope="row" id="acontent4"></td>
                      <td id="aCorrect4"></td>
                  </tr>
              </tbody>
          </table>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
    )
  }

  function renderModal(modType) {
    const isDeleteAll = modType == 'DELETE_ALL' ? 'deleteConfAll' : 'deleteConf'
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
              {/* <button type="button" className="btn btn-danger" id="del" data-bs-dismiss="modal">Delete</button> */}
          </div>
          </div>
      </div>
      </div>
    )
}

export {displayDeleteModal, renderQuestionViewModal, renderModal, displayQuestionDataModal}