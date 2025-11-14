const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function migrateUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Find all users
    const users = await usersCollection.find({}).toArray();
    console.log(`Found ${users.length} users to check`);

    let migratedCount = 0;

    for (const user of users) {
      let needsUpdate = false;
      let updates = {};

      // Check if subscription is a string (old format) or missing
      if (typeof user.subscription === 'string' || !user.subscription) {
        const subscriptionType = user.subscription || 'free';
        updates.subscription = {
          type: subscriptionType,
          startDate: user.createdAt || new Date(),
          endDate: null,
          autoRenew: false
        };
        needsUpdate = true;
        console.log(`  Migrating ${user.email}: ${subscriptionType} -> subscription object`);
      }
      // Check if subscription is an object but missing type field
      else if (user.subscription && !user.subscription.type) {
        updates['subscription.type'] = user.subscription.type || 'free';
        updates['subscription.startDate'] = user.subscription.startDate || user.createdAt || new Date();
        updates['subscription.endDate'] = user.subscription.endDate || null;
        updates['subscription.autoRenew'] = user.subscription.autoRenew || false;
        needsUpdate = true;
        console.log(`  Fixing subscription structure for ${user.email}`);
      }

      // Add username if missing
      if (!user.username) {
        // Generate username from email
        updates.username = user.email.split('@')[0] + '_' + Math.random().toString(36).substring(7);
        needsUpdate = true;
        console.log(`  Adding username for ${user.email}: ${updates.username}`);
      }

      if (needsUpdate) {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: updates }
        );
        migratedCount++;
      }
    }

    console.log(`\n✅ Migration completed! Updated ${migratedCount} users`);
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateUsers();
