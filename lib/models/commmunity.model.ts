import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema({
    id: {type:String, required:true},
    name: {type:String, required:true},
    image: {type:String},
    threads:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Thread"
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    members: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
})

const Community = mongoose.models.community || mongoose.model("community", CommunitySchema);

export default Community;