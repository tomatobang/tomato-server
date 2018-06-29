import { Controller } from 'egg';

export default function auth<T>(validat?: (tokens: any) => boolean) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ): void {
    const method: () => {} = descriptor.value;
    function authCheck(): void {
      const currentUser: string = (this as Controller).ctx.request[
        'currentUser'
      ];
      if (currentUser) {
        return method.call(this);
      }
      (this as Controller).ctx.throw(403);
    }
    descriptor.value = authCheck;
  };
}
