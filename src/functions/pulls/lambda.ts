import middy from "@middy/core";
import validator from '@middy/validator';
import { responseSchema } from './schema';



export const middyfy = (handler) => {
  return middy(handler).use(validator({ responseSchema }))
}
