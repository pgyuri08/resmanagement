fetch('http://localhost:9000/job_descriptions')
  .then((res) => res.json())
  .then((data) => {
    let output = '';
    data.forEach(function (post) {
      output += `
            <div>
                <li>${post.name}</li>
                <li>${post.description}</li>
                <button class="skillsBtn" name="skills" onclick="fetchRoles(${post._id})">Skills</button>
                <button style="float:right" onclick="findModifiedFields()">Save</button>
                <button style="float:right" onclick="deleteFields()">Delete</button>
            </div>  
          `
    })
    document.getElementById('output').innerHTML = output
  })

function fetchRoles() {
  fetch('http://localhost:9000/skills')
    .then((res) => res.json())
    .then((data) => {
      let list = '';
      data[0].skills.forEach(function (skill) {
        list += `
                  <ul id="skill-${skill._id}">
                    <li><b>Description: ${skill.description}</b></li>
                    <li>Name: ${skill.name}</li>
                    <li>Type: ${skill.type}</li>
                    <button class="queriesBtn" name="queries" onclick="fetchQueries(${skill._id})">Queries</button>
                  </ul>  
            `
      })

      let mainOutput = document.getElementById('output')
      let skillList = document.createElement('ul')
      skillList.classList.add('skills-list')
      skillList.innerHTML = list
      mainOutput.appendChild(skillList)

      let rolesCloseBtn = document.createElement('button')
      rolesCloseBtn.classList.add('rolesCloseBtn')
      rolesCloseBtn.innerHTML = "close"
      mainOutput.appendChild(rolesCloseBtn)
      document.querySelector('.skillsBtn').disabled = true;
      rolesCloseBtn.addEventListener("click", function () {
        let mOutpout = document.getElementById('output')
        let skills_nested = document.querySelector('.skills-list')
        mOutpout.removeChild(skills_nested)
        document.querySelector('.skillsBtn').disabled = false;
        let skillsCloseBtn_nested = document.querySelector('.rolesCloseBtn')
        mOutpout.removeChild(skillsCloseBtn_nested)
      })
    })
}


const fetchQueries = skillID => {
  fetch('http://localhost:9000/skills/queries')
    .then((res) => res.json())
    .then((data) => {
      let queries = '';
      data[0].skills.forEach((skill) => {
        if (skill._id == skillID) {
          skill.queries.forEach((query) => {
            queries += `
                          <ul id="queries-${query._id}">
                            <li><b>Name: ${query.query}</b></li>
                            <li>Type: ${query.type}</li>
                            <button class="resourcesBtn" name="resources" onclick="fetchResources(${skill._id},${query._id})">Resources</button>
                          </ul>  
                    `
          })
        }
      })

      let skillElem = document.querySelector('#skill-' + skillID)
      let queryElem = document.createElement('ul')
      queryElem.classList.add('ul-skill' + skillID)
      queryElem.innerHTML = queries
      skillElem.appendChild(queryElem)


      let queryClsBtn = document.createElement('button')
      queryClsBtn.classList.add('queryClsBtn' + skillID)
      queryClsBtn.innerHTML = "close"

      let skillProp = document.querySelector('#skill-' + skillID)
      skillProp.appendChild(queryClsBtn)
      skillProp.querySelectorAll('.queriesBtn').forEach(elm => elm.disabled = true)
      queryClsBtn.addEventListener("click", function () {
        let skill = document.getElementById('skill-' + skillID)
        let skills_nested = document.querySelector('.ul-skill' + skillID)
        skill.removeChild(skills_nested)
        skill.querySelectorAll('.queriesBtn').forEach(elm => elm.disabled = false)
        let queryClsbtn_nested = document.querySelector('.queryClsBtn' + skillID)
        skill.removeChild(queryClsbtn_nested)
      })

    })
}

 const fetchResources = (sid, did) => {
  fetch('http://localhost:9000/skills/queries/resources')
    .then((res) => res.json())
    .then((data) => {
      let questionId = '';
      let resources = '';
      data[0].skills.forEach(skill => {
        if (skill._id == sid) {
          skill.queries.forEach(query => {
            if (query._id == did) {
              query.resources.forEach(resource => {
                questionId = resource.summary.length
                  resources += `
                  <ul id="resources-${resource._id}">
                  <li><b>${resource.title}</b><button id="addBtn-${resource._id}" style="margin-left:10px" onclick="addElement(${resource._id}, ${questionId})">Add</button></li>`
                  
                  resource.summary.map( (value, i) => {
                    resources += `<input id="question-${resource._id}-${i}" class="question_input" type="text" size="100%" value="${value}" onclick="selectCheckBox(${resource._id}, ${i})"/>
                    <input class="checkbox" id="checkbox-${resource._id}-${i}" ref="question-${resource._id}-${i}" type="checkbox">`
                  })

                  resources += `</ul>`
                })
            }
          })
        }
      })

      let main = document.querySelector('#queries-' + did)
      let ul3 = document.createElement('ul')
      ul3.classList.add('ul-resource' + did)
      ul3.innerHTML = resources
      main.appendChild(ul3)

      let x = document.createElement('button')
      x.classList.add('closeBtn' + did)
      x.innerHTML = "close"

      let y = document.querySelector('#queries-' + did)
      y.appendChild(x)
      y.querySelectorAll('.resourcesBtn').forEach(elm => elm.disabled = true)
      x.addEventListener("click", function () {
        let d = document.getElementById('queries-' + did)
        let d_nested = document.querySelector('.ul-resource' + did)
        d.removeChild(d_nested)
        d.querySelectorAll('.resourcesBtn').forEach(elm => elm.disabled = false);
        let btn_nested = document.querySelector('.closeBtn' + did)
        d.removeChild(btn_nested)
      })
    })
}

const selectCheckBox = (resId, index) => {
  let y = document.querySelector("#checkbox-" + resId + "-" + index).checked = true;
}

const findModifiedFields = () => {
  let id = ''
  let val = ''
  let questions = []
  let checkbox = document.querySelectorAll('.checkbox:checked').forEach(ck => {
    id = ck.getAttribute('ref')
    let refs = id.split('-')
    val = document.getElementById(id).value
    // console.log(id, val, document.getElementById(id))
    questions.push({ 
      refsId:refs[1],
      qId:refs[2],
      value:val
     })
  })
  ck.checked = false
    return fetch('http://localhost:9000/skills/queries/resources', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questions)
    }).then(response => {
      response.json().then(json => {
        return json;
      }).then(json => {
        document.querySelectorAll('.checkbox:checked').forEach(ck => ck.checked = false)
        // console.log(json)
      })
    });
  // console.log(questions)
}

const deleteFields = () => {
  let questions = []
  let checkbox = document.querySelectorAll('.checkbox:checked').forEach(ck => {
    id = ck.getAttribute('ref')
    let refs = id.split('-')
    val = document.getElementById(id).value
    questions.push({
      refsId: refs[1],
      qId: refs[2],
      value:val
    })
  })
  console.log(questions)
  return fetch('http://localhost:9000/delete', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(questions)
  }).then(response => {
    response.json().then(json => {
      return json;
    }).then(json => {
      document.querySelectorAll('.checkbox:checked').forEach(ck => ck.checked = false)
    })
  })
}

const addElement = (id, questionId) => {
  let resourceContainer = document.getElementById('resources-' + id)

  let newInput = document.createElement('input')
  newInput.setAttribute("id",`question-${id}-${questionId}`)
  newInput.classList.add('question_input')
  newInput.setAttribute("type","text")
  newInput.setAttribute("size","100%")
  newInput.setAttribute("placeholder","Insert your question here")
  newInput.setAttribute("onclick",`selectCheckBox(${id},${questionId})`)

  let relatedCheckbox = document.createElement('input')
  relatedCheckbox.classList.add('checkbox')
  relatedCheckbox.setAttribute("id",`checkbox-${id}-${questionId}`)
  relatedCheckbox.setAttribute("ref",`question-${id}-${questionId}`)
  relatedCheckbox.setAttribute("type","checkbox")
  relatedCheckbox.setAttribute("checked","true")
  relatedCheckbox.setAttribute("style","margin-left:7px")

  resourceContainer.appendChild(newInput)
  resourceContainer.appendChild(relatedCheckbox)

}