const express = require('express');
const router = express.Router();
const User = require('../models/user');

//Get Users
router.get('/Users', (req, res, next)=>{
	console.log('Get users called');
	User.find( (err, Users)=>{
		res.json(Users);
	});
});

//create user
router.post('/create', (req, res)=>{
	console.log('Post user called');
	let newUser = new User();
	newUser.username = req.body.username,
	newUser.address = req.body.address,
	newUser.contact = req.body.contact,
	newUser.email = req.body.email,
	newUser.photo_url = req.body.photo_url

	newUser.save( (err, user) => {
		if(err) {
			console.log(err);
			return res.status(400).send({
				message: "Failed to Add User."
			});
		} else {
			return res.status(201).send({
				message: "User added successfully.",
				user: user
			});
		}
	});
});

//update user
router.post('/update/:id',(req, res, next)=>{
	console.log('Update user called');
	User.findOne({_id: req.params.id}, function(err, user){
		if(err){
			console.log(err);
			res.status(400).send({
				message: "Error getting user data for updation."
			});
		} else {
			user.username = req.body.username,
			user.address = req.body.address,
			user.contact = req.body.contact,
			user.email = req.body.email,
			user.photo_url = req.body.photo_url

			user.save((e, u)=>{
				if(e){
					console.log(e);
					res.status(400).send({
						message: "Error updating User Data."
					});
				} else {
					res.status(200).send({
						message: "User data successfully updated.",
						user: u
					});
				}
			});
		}
	});
});

//delete User
router.delete('/delete/:id',(req, res, next)=>{
	console.log('Delete user called');
	console.log('user id: ', req.params.id);
	User.remove({_id: req.params.id}, (err, result)=>{
		if(err){
			return res.status(400).send({
				message: 'Failed to remove user.',
				error: err
			})
		} else {
			return res.status(200).send({
				message: 'User Removed',
				result: result
			});
		}
	});
});

module.exports = router;