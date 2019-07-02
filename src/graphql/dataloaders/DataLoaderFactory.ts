import * as DataLoader from 'dataloader'
import { DbConnection } from "../../interfaces/DbConnectionInterface";
import { DataLoaders } from "../../interfaces/DataLoadersInterface";
import { UserLoader } from "./UserLoader";
import { UserInstance } from '../../model/UserModel';
import { PostInstance } from '../../model/PostModel';
import { PostLoader } from './PostLoader';
import { RequestedFields } from '../ast/RequestedFields';
import { DataLoaderParam } from '../../interfaces/DataLoaderInterface';

export class DataLoaderFactory {
    constructor(
        private db: DbConnection,
        private requestedFields: RequestedFields
        ) {}
        getLoaders(): DataLoaders {
            return {
                userLoader: new DataLoader<DataLoaderParam<number>, UserInstance>(
                    (params: DataLoaderParam<number>[]) => UserLoader.batchUsers(this.db.User, params, this.requestedFields),
                    { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
                ),
                postLoader: new DataLoader<DataLoaderParam<number>, PostInstance>(
                    (params: DataLoaderParam<number>[]) => PostLoader.batchPosts(this.db.Post, params, this.requestedFields),
                    { cacheKeyFn: (param: DataLoaderParam<number[]>) => param.key }
                )
            };
        }    
}
