let dataa;

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
          // let output = '';
          // data.forEach(function(post){
          //     output+=`
          //       <div>
          //           <li>${post.name}(${post.description})</li>
          //           <button name="skills" onclick="fetchRoles(${post._id})">Skills</button>
          //       </div>  
          //     `
          // })
          let list = '';
          data[0].skills.forEach(function(skill){
            list +=`
                  <ul id="ul">
                    <li>Description: ${skill.description}</li>
                    <li>Name: ${skill.name}</li>
                    <li>Type: ${skill.type}</li>
                    <button name="queries" onclick="fetchQueries(${skill._id})">Queries</button>
                  </ul>  
            `
          })

        let main = document.getElementById('output')
        // document.getElementById('output').innerHTML = output
        let ul = document.createElement('ul')
        ul.innerHTML = list
        main.appendChild(ul)
          })
        }


        function fetchQueries() {
          fetch('http://localhost:9000/skills/queries')
          .then((res) => res.json())
          .then((data) => {
            // console.log(data[0].skills[0].queries[0])
            //   let output = '';
            //   data.forEach(function(post){
            //       output+=`
            //         <div>
            //             <li>${post.name}(${post.description})</li>
            //             <button name="queries" onclick="fetchRoles(${post._id})">Queries</button>
            //         </div>  
            //       `
            //   })
            //   let list = '';
            //   data[0].skills.forEach(function(skill){
            //     list +=`
            //           <ul id="ul">
            //             <li>Description: ${skill.description}</li>
            //             <li>Name: ${skill.name}</li>
            //             <li>Type: ${skill.type}</li>
            //             <button name="queries" onclick="fetchQueries(${skill.queries}">Queries</button>
            //           </ul>  
            //     `
            //   })
              let queries = '';
              data[0].skills.forEach(function(skill){
                skill.queries.forEach(function(data){
                  queries +=`
                        <ul id="ul_queries">
                          <li>Description: ${data._id}</li>
                          <li>Name: ${data.query}</li>
                          <li>Type: ${data.type}</li>
                        </ul>  
                  `

                })
              })
    
            let main = document.getElementById('output')
            // document.getElementById('output').innerHTML = output
            // let ul = document.createElement('ul')
            // ul.innerHTML = list
            // main.appendChild(ul)
            let ul2 = document.createElement('ul_queries')
            ul2.innerHTML = queries
            main.appendChild(ul2)
              })
            }

      // function fetchRoles() {
      //   return fetch('http://localhost:9000/roles/')
      //   .then((res) => res.json())
      //   .then((dataa) => {
      //     createList();
      //   })
      //   .catch((err) => console.log(err))
      // }

      // function createList(dataa) {
      //   let output = document.querySelector('#output')

      //   let li_id = document.createElement('li');
      //   li_id.innerText = dataa._id
      //   output.appendChild(li_id);
      // }