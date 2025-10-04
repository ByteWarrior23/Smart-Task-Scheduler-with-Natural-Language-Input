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
        priority : {
            type : String,
            enum : ['low' , 'medium' , 'high', 'urgent'],
            default : 'medium',
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
        recurring : {
            type : Boolean,
            default : false,
            index : true,
        },
        natural_language_input : {
            type : String,
            default : null,
            trim : true,
        },
        auto_categorized : {
            type : Boolean,
            default : false,
        },
        smart_suggestions : {
            type : [String],
            default : [],
        },
        dependencies : {
            type : [Schema.Types.ObjectId],
            ref : "Task",
            default : [],
        },
        parent_task_id : {
            type : Schema.Types.ObjectId,
            ref : "Task",
            default : null,
        },
        occurrence_index : {
            type : Number,
            default : null,
        },
        rrule_string : {
            type : String,
            default : null,
        },
        comments : {
            type : [String],
            default : [],
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
        }
    },
    {
        timestamps : true
    }
)

export const Task = mongoose.model("Task" , TaskSchema);
