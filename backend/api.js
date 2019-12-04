const express = require('express');
var cors = require('cors');
const fs = require('fs')

const mongoose = require('mongoose');
const Resource = require('../model/schema');
const router = express.Router();

let array = [];

router.use(cors())

let getResource = async (id) => {
  let data
  // console.log(id)
  await Resource.findById(id, (e, r) => {
    data = r
    // console.log('this is the data: ' + data)
  })
  return data
}

router.get('/resources', async (req, res) => {
  // console.log(req.query.id)
  let resources = await req.query.id.map( async (id) => {
    let resource = await getResource(id)
    array.push(resource)
    return resource
  })
  // console.log('this is the array: ' + array)
  res.json(array)
})

router.get('/job_descriptions', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"job_description"})
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.get('/skills', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"job_description"}).populate('skills')
    // console.log(posts[0])
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.get('/skills/queries', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"job_description"}).populate({ path:'skills', populate: {path: 'queries'} })
    // console.log(posts[0])
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.get('/skills/queries/resources', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"job_description"}).populate({ path: 'skills', populate: { path: 'queries', populate: { path: 'resources' } } })
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.put('/skills/queries/resources?:postId', async (req, res) => {
  let questions = req.body
  let id_array = []
  questions.map(o => id_array.indexOf(o.refsId) < 0 ? id_array.push(o.refsId) : false)
  let data = id_array.map(rid => ({
    refId: rid,
    q: questions.filter(o => o.refsId === rid)
  }))
  console.dir(data)

  let errors = []
  data.map(async resource => {
    let res_id = resource.refId;

    await getResource(res_id).then(async resBody => {
      resource.q.map(question => resBody.summary[question.qId] = question.value)
      console.log(resBody.summary)

      try {
        const updatePost = await Resource.findByIdAndUpdate({ _id: res_id }, { summary: resBody.summary })
      } catch (err) {
        errors.push(err)
      }
    })
  })
  if(errors.length) {
    console.log(errors)
    res.json({ message: "Server error",err:errors})
  } else {
    res.json({ message: "Update Sucessful"})
  }
});

router.put('/delete', async (req, res) => {
  let questions = req.body
  for (i = 0; i < questions.length; i++) {
    console.log(questions[i].refsId, questions[i].qId, questions[i].value)
    try {
      const removedPost = await Resource.updateMany(
        { '_id': questions[i].refsId },
        { $pull: { summary: questions[i].value } }, { multi: false })
      res.json(removedPost);
      console.log(removedPost)
    } catch (err) {
      res.json({ message: err });
    }
  }
});

router.get('/roles', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"role"})
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.get('/roles/skills', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"role"}).populate('skills')
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.get('/roles/queries', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"role"}).populate('queries')
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.get('/roles/queries/resources', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"role"}).populate({ path: 'queries', populate: { path: 'resources' } })
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.get('/all-content', async (req, res) => {
  try{
    const posts = await Resource.find({"type":"job_description"})
      .populate({
        path: 'roles', populate: {
          path: 'skills queries', populate: {
            path: 'queries resources', populate: {
              path: 'resources'
            }
          }
        } 
      })
      .populate({
        path: 'skills', populate: {
          path: 'queries', populate: {
            path: 'resources'
          }
        }
      })
      .populate({
        path: 'queries', populate: {
          path: 'resources'
        }
      })
      // .populate({ path: 'roles' }).populate({ path: 'queries' })
      //           .populate({ path: 'roles',
      //           populate: [
      //             { path:'queries',
      //             populate:[
      //               { path:'resources' }
      //             ],
      //             }]
      //         })
              
    console.log(posts[0])
    res.json(posts)
    const jsonString = JSON.stringify(posts)
    console.log(jsonString)
    fs.writeFile('./jobdescription.json', jsonString, err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
        console.log('Successfuly wrote file')
      }
    })
  }catch(err){
    res.json({message:err })
  }
});



module.exports = router;