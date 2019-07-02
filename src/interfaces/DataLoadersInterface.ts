import * as DataLoader from 'dataloader'
import { UserInstance } from '../model/UserModel';
import { PostInstance } from '../model/PostModel';
import { DataLoaderParam } from './DataLoaderInterface';

export interface DataLoaders {
    userLoader: DataLoader<DataLoaderParam<number>, UserInstance>;
    postLoader: DataLoader<DataLoaderParam<number>, PostInstance>;
}