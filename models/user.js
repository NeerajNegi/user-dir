const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	username:{
		type: String,
		required: true
	},
	address:{
		type: String,
		require: true
	},
	contact:{
		type: String,
		require: true
	},
	email:{
		type: String,
		required: true
	},
	photo_url:{
		type: String,
		required: true
	}
});

const User = module.exports = mongoose.model('User', UserSchema);