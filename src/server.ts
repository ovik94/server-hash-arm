import mongoose from 'mongoose';
import app from './app';
import { logger } from './utils';
import { config } from './config';

if (
  config.mongo.login &&
  config.mongo.password &&
  config.mongo.host &&
  config.mongo.port &&
  config.mongo.database
) {
  mongoose.connect(
    `mongodb://${config.mongo.login}:${config.mongo.password}@${config.mongo.host}:${config.mongo.port}/${config.mongo.database}?authSource=admin`
  );
} else {
  logger.warn(
    'MongoDB connection variables are not fully defined. Check MONGO_LOGIN/MONGO_PWD/MONGO_HOST/MONGO_PORT/MONGO_DB.'
  );
}

export default app.listen(config.app.port, () => {
  logger.info('Listening on port ' + config.app.port);
});
