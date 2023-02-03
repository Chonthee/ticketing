import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describe the properties
// that are required to create an new User
interface UserAttrs{
    email:string,
    password:string
}

// An interface that describe the properties
// that User Model has
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs:UserAttrs): UserDoc;
}

// An interface that describe the properties
// that a User Document has
interface UserDoc extends mongoose.Document{
    email:string,
    password:string;
}


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
}, {
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

// Middleware in mongoose
userSchema.pre('save', async function(done){
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'));
        this.set('password',hashed);
    }
    done();
})

// When we want to create a new User
// Call this function instead of declare new User
userSchema.statics.build=(attrs:UserAttrs)=>{
    return new User(attrs);
}

const User = mongoose.model<UserDoc,UserModel>('User',userSchema);

// // Type checking when create user
// User.build({
//     email:'test@test.com',
//     password:'password'
// })

export { User };