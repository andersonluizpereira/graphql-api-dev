import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";
import { CommentInstance } from "../../../model/CommentModel";


export const commentResolvers = {

    Comment: {
        user: (comment, args, {db}: {db: DbConnection},info: GraphQLResolveInfo) => {
            return db.User
                .findById(comment.get('user'));
        },
        post: (comment, args, {db}: {db: DbConnection},info: GraphQLResolveInfo) => {
            return db.Post.findById(comment.get('post'))
        }
    },
    Query: {
        commentByPost: (parent, {postId, first = 10, offset = 0}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.Comment.findAll({
                where: {post: postId},
                limit: first,
                offset: offset
            });
        }
    },
    Mutation: {
        createComment: (parent, {input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .create(input, {transaction: t});
            });
        },
        updateComment: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id  = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Post
                .findById(id)
                .then((commentt: CommentInstance) =>{
                    if(!commentt) throw new Error(`Comment with id ${id} not found!`);
                    return commentt.update(input, {transaction: t});
                });
            });
        },
        deleteComment: (parent, {id, input}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            id  = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                .findById(id)
                .then((comment: CommentInstance) =>{
                    if(!comment) throw new Error(`Comment with id ${id} not found!`);
                    return comment.destroy({transaction: t})
                        .then(comment => !!comment);
                });
            });
        }
    }
}