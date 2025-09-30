import mongoose , {Schema} from 'mongoose';

const UserSchema = new Schema(
    {
        username : {
            type : String ,
            required : true,
            maxLength : 16,
            unique : true,
            lowercase : true,
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
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate Access Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// Generate Refresh Token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model('User' , UserSchema);

