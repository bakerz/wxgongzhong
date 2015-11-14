var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	createTime: {
		type: Date,
		default: Date.now
	}
});

var productSchema = new Schema({
	username: String,
	name: String,
	place: String,
	price: String,
	artno: String,
	stock: Number,
	imgs: Array,
	createTime: {
		type: Date,
		default: Date.now
	}
})

exports.User = mongoose.model('User', userSchema);
exports.Product = mongoose.model('Product', productSchema);