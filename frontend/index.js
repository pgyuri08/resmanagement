fetch('http://localhost:9000/job_descriptions')
  .then((res) => res.json())
  .then((data) => {
    let output = '';
    data.forEach(function (post) {
      output += `
            <div class="mainBtns">    
              <button style="float:right" onclick="findModifiedFields()">Save</button>
              <button style="float:right" onclick="deleteFields()">Delete</button>
              <button style="float:right" onclick="getAllContent()">Export to JSON</button>
            </div>  
            <div id="skillsColl" class=""skillsColl">
                <li>${post.name}</li>
                <li>${post.description}</li>
                <button class="skillsBtn" name="skills" onclick="fetchSkills(${post._id})">Skills</button>
            </div>
            <div id="rolesColl" class="rolesColl">
              <button class="rolesBtn" name="roles" onclick="fetchRoles()">Roles</button>
            </div>  
          `
    })
    document.getElementById('output').innerHTML = output
  })

function fetchSkills() {
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

      let mainOutput = document.getElementById('skillsColl')
      let skillList = document.createElement('ul')
      skillList.classList.add('skills-list')
      skillList.innerHTML = list
      mainOutput.appendChild(skillList)

      let rolesCloseBtn = document.createElement('button')
      rolesCloseBtn.classList.add('skillCloseBtn')
      rolesCloseBtn.innerHTML = "close"
      mainOutput.appendChild(rolesCloseBtn)
      document.querySelector('.skillsBtn').disabled = true;
      rolesCloseBtn.addEventListener("click", function () {
        let mOutpout = document.getElementById('skillsColl')
        let skills_nested = document.querySelector('.skills-list')
        mOutpout.removeChild(skills_nested)
        document.querySelector('.skillsBtn').disabled = false;
        let skillsCloseBtn_nested = document.querySelector('.skillCloseBtn')
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
  // ck.checked = false
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
  restOfTheElements(id, questionId, resourceContainer)
}

const addQuestion = (id, questionId) => {
  let resourceContainer = document.getElementById('rolesQuerySources-' + id)
  restOfTheElements(id, questionId, resourceContainer)
}

const restOfTheElements = (id, questionId, resourceContainer) => {
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

const fetchRoles = () => {
  fetch('http://localhost:9000/roles')
  .then((res) => res.json())
  .then((data) => {
    let roles = '';
    data.forEach(function (role) {
      if(role.queries !== undefined){
        roles += `
        <ul id="roles-${role._id}">
          <li><b>Description: ${role.description}</b></li>
          <li>Name: ${role.name}</li>
          <li>Type: ${role.type}</li>
          <button class="rolesSkillBtn-${role._id}" name="rolesSkill" onclick="fetchRolesSkills(${role._id})">Skills</button>
          <button class="rolesQueryBtn-${role._id}" name="rolesQuery" onclick="fetchRolesQueries(${role._id})">Query</button>
        </ul>  
  `
      } else {
        roles += `
        <ul id="roles-${role._id}">
          <li><b>Description: ${role.description}</b></li>
          <li>Name: ${role.name}</li>
          <li>Type: ${role.type}</li>
          <button class="rolesSkillBtn-${role._id}" name="rolesSkill" onclick="fetchRolesSkills(${role._id})">Skills</button>
        </ul>  
  `
      }
    })

    let mainOutput = document.getElementById('output')
    let roleList = document.createElement('ul')
    roleList.classList.add('role-list')
    roleList.innerHTML = roles
    mainOutput.appendChild(roleList)

    let rolesCloseBtn = document.createElement('button')
    rolesCloseBtn.classList.add('rolesCloseBtn')
    rolesCloseBtn.innerHTML = "close"
    mainOutput.appendChild(rolesCloseBtn)
    document.querySelector('.rolesBtn').disabled = true;
    rolesCloseBtn.addEventListener("click", function () {
      let mOutpout = document.getElementById('output')
      let roles_nested = document.querySelector('.role-list')
      mOutpout.removeChild(roles_nested)
      document.querySelector('.rolesBtn').disabled = false;
      let rolesCloseBtn_nested = document.querySelector('.rolesCloseBtn')
      mOutpout.removeChild(rolesCloseBtn_nested)
    })
  })
}

const fetchRolesSkills = (roleId) => {
  fetch('http://localhost:9000/roles/skills')
    .then((res) => res.json())
    .then((data) => {
      let rolesSkill = '';
      let i = ''; //declared the amount of elements that it has to remember how many times it has to loop through
      for (i = 0; i < data.length; i++) { //loop through all the elements stored in the data array
        if (data[i]._id === roleId) { //when you click on the button it deals with the that role where the ids matching
          let leng = data[i].skills.length //hen checks the length of that role's skills
          for (a = 0; a < leng; a++) { //then it loops through on all the skills

            skillId = data[i].skills[a]._id
            skillName = data[i].skills[a].name
            skillDesc = data[i].skills[a].description
            skillType = data[i].skills[a].type

            rolesSkill += `
              <ul id="rolesSkill-${skillId}">
                <li><b>Description: ${skillDesc}</b></li>
                <li>Name: ${skillName}</li>
                <li>Type: ${skillType}</li>
              </ul>  
        `

          }
        }

      }
      let mainOutput = document.getElementById('roles-' + roleId)
      let roleList = document.createElement('ul')
      roleList.classList.add('role-skill-list-' + roleId)
      roleList.innerHTML = rolesSkill
      mainOutput.appendChild(roleList)

      mainOutput.querySelectorAll('.rolesQueryBtn-' + roleId).forEach(elm => elm.disabled = true)

      let rolesSkillCloseBtn = document.createElement('button')
      rolesSkillCloseBtn.classList.add('rolesSkillCloseBtn' + roleId)
      rolesSkillCloseBtn.innerHTML = "close"

      mainOutput.appendChild(rolesSkillCloseBtn)
      mainOutput.querySelectorAll('.rolesSkillBtn-' + roleId).forEach(elm => elm.disabled = true)
      rolesSkillCloseBtn.addEventListener("click", function () {
        let mOutpout = document.getElementById('roles-' + roleId)
        let roles_skill_nested = document.querySelector('.role-skill-list-' + roleId)
        mOutpout.removeChild(roles_skill_nested)
        mOutpout.querySelectorAll('.rolesSkillBtn-' + roleId).forEach(elm => elm.disabled = false);
        mOutpout.querySelectorAll('.rolesQueryBtn-' + roleId).forEach(elm => elm.disabled = false)
        let rolesCloseBtn_nested = document.querySelector('.rolesSkillCloseBtn' + roleId)
        mOutpout.removeChild(rolesCloseBtn_nested)
      })
    })
}

const fetchRolesQueries = (roleId) => {
  fetch('http://localhost:9000/roles/queries')
    .then((res) => res.json())
    .then((data) => {
      let rolesQueries = '';
      let i = '';
      for (i = 0; i < data.length; i++) {
        if (data[i]._id === roleId) {
          let leng = data[i].queries.length
          for (a = 0; a < leng; a++) {

            queryId = data[i].queries[a]._id
            queryQuery = data[i].queries[a].query
            queryType = data[i].queries[a].type

            rolesQueries += `
              <ul id="rolesQueries-${queryId}">
                <li><b>Description: ${queryQuery}</b></li>
                <li>Type: ${queryType}</li>
                <button class="rolesQueryResourcesBtn-${queryId}" name="rolesQueryResourcesBtn" onclick="fetchRolesQueryResources(${roleId},${queryId})">Resources</button>
              </ul>  
        `
          }
        }
      }
      let mainOutput = document.getElementById('roles-' + roleId)
      let roleList = document.createElement('ul')
      roleList.classList.add('role-query-list-' + roleId)
      roleList.innerHTML = rolesQueries
      mainOutput.appendChild(roleList)
    })
}

const fetchRolesQueryResources = (roleId, queryId) => {
  fetch('http://localhost:9000/roles/queries/resources')
    .then((res) => res.json())
    .then((data) => {
      let questionId = '';
      let rolesQuerySources = '';
      let i = ''; 
      for (i = 0; i < data.length; i++) { 
        if (data[i]._id === roleId) { 
          let leng = data[i].queries.length 
          for (a = 0; a < leng; a++) { 
            questionId = data[i].queries[a].resources.length
            for (b = 0; b < questionId; b++) {

              questionNo = data[i].queries[a].resources[b]._id
              questionTitle = data[i].queries[a].resources[b].title
              questions = data[i].queries[a].resources[b].summary

              rolesQuerySources += `
                <ul id="rolesQuerySources-${questionNo}">
                <li><b>${questionTitle}</b><button id="addBtn-${questionNo}" style="margin-left:10px" onclick="addQuestion(${questionNo}, ${questionId})">Add</button></li>
                `

              data[i].queries[a].resources[b].summary.map((value, i) => {
                rolesQuerySources += `<input id="question-${questionNo}-${i}" class="question_input" type="text" size="100%" value="${value}" onclick="selectCheckBox(${questionNo}, ${i})"/>
                <input class="checkbox" id="checkbox-${questionNo}-${i}" ref="question-${questionNo}-${i}" type="checkbox">`
              })

              rolesQuerySources += `</ul>`
            }
          }
        }
      }
      let mainOutput = document.getElementById('rolesQueries-' + queryId)
      let rolesQuerySourcesElm = document.createElement('ul')
      rolesQuerySourcesElm.classList.add('role-query-source-list' + queryId)
      rolesQuerySourcesElm.innerHTML = rolesQuerySources
      mainOutput.appendChild(rolesQuerySourcesElm)

      mainOutput.querySelectorAll('.rolesQueryResourcesBtn-' + queryId).forEach(elm => elm.disabled = true)

      let rolesQuerySourcesCloseBtn = document.createElement('button')
      rolesQuerySourcesCloseBtn.classList.add('rolesQuerySourcesCloseBtn' + queryId)
      rolesQuerySourcesCloseBtn.innerHTML = "close"

      mainOutput.appendChild(rolesQuerySourcesCloseBtn)
      rolesQuerySourcesCloseBtn.addEventListener("click", function () {
        let mOutpout = document.getElementById('rolesQueries-' + queryId)
        let roles_queries_sources_nested = document.querySelector('.role-query-source-list' + queryId)
        mOutpout.removeChild(roles_queries_sources_nested)
        mOutpout.querySelectorAll('.rolesQueryResourcesBtn-' + queryId).forEach(elm => elm.disabled = false)
        let rolesQueriesSourceCloseBtn_nested = document.querySelector('.rolesQuerySourcesCloseBtn' + queryId)
        mOutpout.removeChild(rolesQueriesSourceCloseBtn_nested)
      })
    })
}

const getAllContent = () => {
  fetch('http://localhost:9000/all-content')
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
    })
}

