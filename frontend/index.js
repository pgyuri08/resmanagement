  fetch('http://localhost:9000/job_descriptions')
  .then((res) => res.json())
  .then((data) => {
      let output = '';
      data.forEach(function(post){
          output+=`
            <div>
                <li>${post.name}(${post.description})</li>
                <button name="skills" onclick="fetchRoles(${post._id})">Skills</button>
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
          data[0].skills.forEach(function(skill){
            list +=`
                  <ul id="skill-${skill._id}">
                    <li>Description: ${skill.description}</li>
                    <li>Name: ${skill.name}</li>
                    <li>Type: ${skill.type}</li>
                    <button name="queries" onclick="fetchQueries(${skill._id})">Queries</button>
                  </ul>  
            `
          })

        let main = document.getElementById('output')
        let ul = document.createElement('ul')
        ul.classList.add('skills-list')
        ul.innerHTML = list
        main.appendChild(ul)
          })
        }


        function fetchQueries(param) {
          fetch('http://localhost:9000/skills/queries')
          .then((res) => res.json())
          .then((data) => {
              let queries = '';
              data[0].skills.forEach(function(skill){
                if(skill._id == param){
                  skill.queries.forEach(function(data){
                    queries +=`
                          <ul id="ul_queries">
                            <li>Description: ${data._id}</li>
                            <li>Name: ${data.query}</li>
                            <li>Type: ${data.type}</li>
                          </ul>  
                    `
                  })
                }
              })
    
            let main = document.querySelector('#skill-' + param)
            let ul2 = document.createElement('ul')
            ul2.innerHTML = queries
            main.appendChild(ul2)
              })
            }