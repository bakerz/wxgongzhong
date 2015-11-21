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
	artno: String,
	place: String,
	range: Array,
	price: Array,
	stock: Number,
	imgs: Array,
	createTime: {
		type: Date,
		default: Date.now
	}
})

exports.User = mongoose.model('User', userSchema);
exports.Product = mongoose.model('Product', productSchema);