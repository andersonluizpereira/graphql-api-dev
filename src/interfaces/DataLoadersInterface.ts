import * as DataLoader from 'dataloader'
import { UserInstance } from '../model/UserModel';
import { PostInstance } from '../model/PostModel';

export interface DataLoaders {
    userLoader: DataLoader<number, UserInstance>;
    postLoader: DataLoader<number, PostInstance>;
}