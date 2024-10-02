const mongoose = require('mongoose');
// const DropdownSchema = mongoose.Schema(
//     {
    
//         category: {
//             name:{},
//             subcategory:[],
//             type: [String],
//             default: [],
//             required: false
            
//         },
//         color: {
//             type: [String],
//             default: [],
//             required: false
//         },
//         productCondition: {
//             type: [String],
//             default: [],
//             required: false
//         }
//     },
//     {
//         timestamps: true
//     }
// );

const subcategorySchema = new mongoose.Schema({
    subName: String,
  });
  
  // Define the category schema, including the subcategories array
  const DropdownSchema = new mongoose.Schema({
    catName: String,
    subcategories: [subcategorySchema] // Array of subcategories
  });
  const DropdownSchema2 = new mongoose.Schema({
    category: [DropdownSchema],
    color: {
        type: [String],
        default: [],
        required: false
    },
    productCondition: {
        type: [String],
        default: [],
        required: false
    },
    lotNumber: {
        type: [String],
        default: [],
        required: false
    },                   
  });


module.exports = mongoose.model('Dropdown', DropdownSchema2); 