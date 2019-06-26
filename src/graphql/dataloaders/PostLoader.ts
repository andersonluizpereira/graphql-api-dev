import { PostModel, PostInstance } from "../../model/PostModel";

export class PostLoader {
    static batchPosts(Post: PostModel, ids: number[]): Promise<PostInstance[]> {
        return Promise.resolve(
            Post.findAll({
                where: { id: ids}
            })
        );
    }
}