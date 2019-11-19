const express = require('express');
var cors = require('cors');

const mongoose = require('mongoose');
const Resource = require('../model/schema');
const router = express.Router();

let array = [];

router.use(cors())

// router.get('/job_description', async (req,res) => {
//   try{
//     const posts = await Resource.find({"type":"job_description"})
//     console.log(posts[0])
//     res.json(posts)
//   }catch(err){
//     res.json({message:err })
//   }
// });

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
      // .populate({
      //   path: 'roles', populate: {
      //     path: 'skills', populate: {
      //       path: 'queries', populate: {
      //         path: 'resources'
      //       }
      //     }
      //   } 
      // })
      // .populate({
      //   path: 'skills', populate: {
      //     path: 'queries', populate: {
      //       path: 'resources'
      //     }
      //   }
      // })
      // .populate({
      //   path: 'queries', populate: {
      //     path: 'resources'
      //   }
      // })
      // .populate({ path: 'roles' }).populate({ path: 'queries' })
              //   .populate({ path: 'roles',
              //   populate: [
              //     { path:'queries',
              //     populate:[
              //       { path:'resources' }
              //     ],
              //     }]
              // })
    console.log(posts[0])
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.get('/skills', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"job_description"}).populate('skills')
    console.log(posts[0])
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.get('/skills/queries', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"job_description"}).populate({ path:'skills', populate: {path: 'queries'} })
    console.log(posts[0])
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

router.get('/skills/queries/resources', async (req,res) => {
  try{
    const posts = await Resource.find({"type":"job_description"}).populate({ path: 'skills', populate: { path: 'queries', populate: { path: 'resources' } } })
    console.log(posts[0])
    res.json(posts)
  }catch(err){
    res.json({message:err })
  }
});

module.exports = router;