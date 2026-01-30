const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const username = process.argv[2];

if (!username) {
  console.log('Usage: node make_admin.js <username>');
  process.exit(1);
}

const promoteUser = async () => {
  await connectDB();

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User '${username}' not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    console.log(`Success! User '${username}' is now an admin.`);
    console.log('You can now access the dashboard at: http://localhost:3000/admin-dashboard');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
};

promoteUser();
