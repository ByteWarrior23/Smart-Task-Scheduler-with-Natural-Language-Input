import mongoose , {Schema} from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
    {
        username : {
            type : String ,
            required : true,
            maxLength : 16,
            unique : true,
            trim : true,
            index : true,
        },
        fullname : {
            type : String ,
            required : true,
            maxLength : 13,
            trim : true,
            index : true,
        },
        password : {
            required : true,
            type : String , 
            trim : true,
            minlength : 8,
        },
        email : {
            type : String ,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        profile_picture : {
            type : String ,
            default : null,
            trim : true,
        },
        role : {
            type : String ,
            enum : ['user' , 'admin'],
            default : 'user',
        },
        refreshToken : {
            type : String 
        },
    },
    {
        timestamps : true
    }
)

// Compare password
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.JWT_ACCESS_TOKEN,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
    }
  );
};

// Generate Refresh Token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_REFRESH_TOKEN,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    }
  );
};

export const User = mongoose.model('User' , UserSchema);

