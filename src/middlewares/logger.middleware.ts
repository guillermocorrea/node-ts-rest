import { Request } from 'express';
import morgan from 'morgan';
// import bunyan from 'bunyan';

// morgan.token('id', (req: Request) => req.id);

export const loggerFormat = 'dev';
// ':id [:date[web]]" :method :url" :status :responsetime';

// export const loggerInstance = bunyan.createLogger({
//   name: 'transaction-notifier',
//   serializers: {
//     req: require('bunyan-express-serializer'),
//     res: bunyan.stdSerializers.res,
//     err: bunyan.stdSerializers.err,
//   },
//   level: 'info',
// });

// export const logResponse = function (id, body, statusCode) {
//   var log = this.loggerInstance.child(
//     {
//       id: id,
//       body: body,
//       statusCode: statusCode,
//     },
//     true
//   );
//   log.info('response');
// };
