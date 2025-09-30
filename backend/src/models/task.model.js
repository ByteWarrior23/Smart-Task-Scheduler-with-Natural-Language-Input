import mongoose , { Schema } from "mongoose";

const TaskSchema = new Schema(
    {
        title : {
            type : String ,
            required : true,
            trim : true,
            index : true,
            maxLength : 50,
        },
        description : {
            type : String ,
            required : true,    
            trim : true,
            maxLength : 200, 
            index : true,
        },
        status : {
            type : String, 
            enum : ['pending' , 'completed'],
            default : 'pending',
            required : true,
            index : true
        },
        deadline : {
            type : Date ,
            default : null ,
        },
        owner :{ 
            type : Schema.Types.ObjectId,
            ref : "User",
            required : true,
            index : true,
        },
        comments : {
            type : [String],
            default : [],
            required : false,
        },
        category : {
            type : String ,
            default : 'general',
            trim : true,
            index : true,
        },
        archived : {
            type : Boolean ,
            default : false,
        },
        time_required : {
            type : Number , // in minutes
            default : null,
            required : false,
        }
    },
    {
        timestamps : true
    }
)

export const Task = mongoose.model("Task" , TaskSchema);
