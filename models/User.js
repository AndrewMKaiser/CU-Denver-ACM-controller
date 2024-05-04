var mongoose = require('mongoose', { useUnifiedTopology: true });
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.pre('save', async function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    // Middleware removed, as hashing is now handled in the signupRouter.js file
    try {
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (err) {
        next(err);
    }
    
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);