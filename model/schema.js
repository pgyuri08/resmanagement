const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ResourscesSchema = mongoose.Schema({
  _id: {
    type: Number
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  summary: {
    type: Array,
    of: String
  },
  type: {
    type: String
  },
  created_by: {
    type: String
  },
  updated_by: {
    type: String
  },
  created_at: {
    type: String
  },
  updated_at: {
    type: String
  }
})

module.exports = mongoose.model('Templates', ResourscesSchema);

// const PostSchema = mongoose.Schema ({
//   _id: {
//     type: Number
//   },
//   name: {
//     type: String
//   },
//   description: {
//     type: String
//   },
//   skills: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Templates'
//   }],
//   roles: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Templates'
//   }],
//   queries: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Templates'
//   }],
//   type: {
//     type: String
//   },
//   created_by: {
//     type: String
//   },
//   updated_by: {
//     type: String
//   },
//   created_at: {
//     type: String
//   },
//   updated_at: {
//     type: String
//   }
// });

// module.exports = mongoose.model('Templates', PostSchema);

// const JobDescriptionSchema = mongoose.Schema({
//   _id: {
//     type: Number
//   },
//   name: {
//     type: String
//   },
//   description: {
//     type: String
//   },
//   skills: {
//     type: Array,
//     default: undefined
//   },
//   roles: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Templates'
//   }],
//   type: {
//     type: String
//   },
//   created_by: {
//     type: String
//   },
//   updated_by: {
//     type: String
//   },
//   created_at: {
//     type: String
//   },
//   updated_at: {
//     type: String
//   }
// });

// const SkillsSchema = mongoose.Schema({
//   _id: {
//     type: Number
//   },
//   name: {
//     type: String
//   },
//   description: {
//     type: String
//   },
//   queries: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Template'
//   }],
//   type: {
//     type: String
//   },
//   created_by: {
//     type: String
//   },
//   updated_by: {
//     type: String
//   },
//   created_at: {
//     type: String
//   },
//   updated_at: {
//     type: String
//   }
// })

// const RolesSchema = mongoose.Schema({
//   _id: {
//     type: Number
//   },
//   name: {
//     type: String
//   },
//   description: {
//     type: String
//   },
//   skills: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Skills'
//   }],
//   type: {
//     type: String
//   },
//   created_by: {
//     type: String
//   },
//   updated_by: {
//     type: String
//   },
//   created_at: {
//     type: String
//   },
//   updated_at: {
//     type: String
//   }
// })

// const QueriesSchema = mongoose.Schema({
//   _id: {
//     type: Number
//   },
//   resources: [{
//     type: Schema.Types.ObjectId,
//     ref: 'Resources'
//   }],
//   description: {
//     type: String
//   },
//   query: {
//     type: String
//   },
//   type: {
//     type: String
//   },
//   created_by: {
//     type: String
//   },
//   updated_by: {
//     type: String
//   },
//   created_at: {
//     type: String
//   },
//   updated_at: {
//     type: String
//   }
// })


// const DataSchema = mongoose.Schema({
//   id: Number,
//   name: String,
//   description: String,
//   skills: [{
//     id: Number,
//     name: String,
//     description: String,
//     queries: [{
//       id: Number,
//       query: String,
//       type: String,
//       resources: [{
//         _id: Number,
//         title: String,
//         url: String,
//         is_paid: Boolean,
//         rating: Number,
//         num_reviews: Number,
//         summary: [{

//         }],
//         headline: String,
//         image_240x135: String,
//         num_published_lectures: Number,
//         instructors: [{

//         }],
//         topic_tags: [{

//         }],
//         predictive_score: Number,
//         relevancy_score: Number,
//         last_update_date: String,
//         type: String,
//         created_by: String,
//         updated_by: String,
//         created_at: String,
//         updated_at: String,
//       }],
//       created_by: String,
//       updated_by: String,
//       created_at: String,
//       updated_at: String,
//     }],
//     type: String,
//     created_by: String,
//     updated_by: String,
//     created_at: String,
//     updated_at: String,
//   }],
//   roles: [{

//   }],
//   type: String,
//   created_by: String,
//   updated_by: String,
//   created_at: String,
//   updated_at: String,
// })

// let JobDescription = mongoose.model('JobDescription', JobDescriptionSchema);
// const Skills = mongoose.model('Skills', SkillsSchema);
// const Roles = mongoose.model('Roles', RolesSchema);
// const Queries = mongoose.model('Queries', QueriesSchema);
// const Resources = mongoose.model('Resources', ResourscesSchema);