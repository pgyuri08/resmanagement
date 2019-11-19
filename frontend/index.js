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


function fetchQueries(skillID) {
  fetch('http://localhost:9000/skills/queries')
    .then((res) => res.json())
    .then((data) => {
      let queries = '';
      data[0].skills.forEach(function (skill) {
        if (skill._id == skillID) {
          skill.queries.forEach(function (query) {
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
      document.querySelector('.queriesBtn').disabled = true;
      queryClsBtn.addEventListener("click", function () {
        let skill = document.getElementById('skill-' + skillID)
        let skills_nested = document.querySelector('.ul-skill' + skillID)
        skill.removeChild(skills_nested)
        document.querySelector('.queriesBtn').disabled = false;
        let queryClsbtn_nested = document.querySelector('.queryClsBtn' + skillID)
        skill.removeChild(queryClsbtn_nested)
      })

    })
}

function fetchResources(sid, did) {
  fetch('http://localhost:9000/skills/queries/resources')
    .then((res) => res.json())
    .then((data) => {
      let resources = '';
      data[0].skills.forEach(function (skill) {
        if (skill._id == sid) {
          skill.queries.forEach(function (query) {
            if (query._id == did) {
              query.resources.forEach(function (resource) {
                  resources += `
                  <ul id="resources-${resource._id}">
                    <li><b>${resource.title}</b></li>
                    <input class="question_input" type="text" size="200" value="${resource.summary}"/>
                  </ul>  
                  `
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
      document.querySelector('.resourcesBtn').disabled = true;
      x.addEventListener("click", function () {
        let d = document.getElementById('queries-' + did)
        let d_nested = document.querySelector('.ul-resource' + did)
        d.removeChild(d_nested)
        document.querySelector('.queriesBtn').disabled = false;
        let btn_nested = document.querySelector('.closeBtn' + did)
        d.removeChild(btn_nested)
      })
    })
}