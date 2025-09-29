import mongoose , {Schema} from 'mongoose';

const UserSchema = new Schema(
    {
        username : {
            type : string ,
            required : true,
            max_length : 16,
            unique : true,
            lowercase : true,
            trim : true,
            index : true,
        },
        fullname : {
            type : string ,
            required : true,
            max_length : 13,
            trim : true,
            index : true,
        },
        password : {
            required : true,
            unique : true,
            type : string , 
            max_length : 12,
            min_length : 8,
            trim : true,
        },
        email : {
            type : string ,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        profile_picture : {
            type : string ,
            default : null,
            trim : true,
        },
        role : {
            type : string ,
            enum : ['user' , 'admin'],
            default : 'user',
        },
        refreshToken : {
            type : string 
        },
    },
    {
        timestamps : true
    }
)

export const User = mongoose.model('User' , UserSchema);

