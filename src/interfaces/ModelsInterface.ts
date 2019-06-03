import { PostModel } from "../model/PostModel";
import { UserModel } from "../model/UserModel";
import { CommentModel } from "../model/CommentModel";

export interface ModelsInterface {
    Post: PostModel;
    User: UserModel;
    Comment: CommentModel;
}