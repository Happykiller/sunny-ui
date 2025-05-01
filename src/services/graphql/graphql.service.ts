// src\services\graphql\graphql.service.ts
export default abstract class GraphqlService {
  abstract send(datas: any): Promise<any>;
}