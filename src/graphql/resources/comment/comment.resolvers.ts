import { DbConnection } from "../../../interfaces/DbConnectionInterface";
import { GraphQLResolveInfo } from "graphql";
import { Transaction } from "sequelize";
import { CommentInstance } from "../../../model/CommentModel";
import { handleError, throwError } from "../../../utils/utils";
import { compose } from "../../composable/composable.resolver";
import { authResolvers } from "../../composable/auth.resolver";
import { AuthUser } from "../../../interfaces/AuthUserInterface";


export const commentResolvers = {

    Comment: {
        user: (comment, args, {db}: {db: DbConnection},info: GraphQLResolveInfo) => {
            return db.User
                .findById(comment.get('user'))
                .catch(handleError);
        },
        post: (comment, args, {db}: {db: DbConnection},info: GraphQLResolveInfo) => {
            return db.Post.findById(comment.get('post')).catch(handleError);
        }
    },
    Query: {
        commentByPost: (parent, {postId, first = 10, offset = 0}, {db}: {db: DbConnection}, info: GraphQLResolveInfo) => {
            postId  = parseInt(postId);
            return db.Comment.findAll({
                where: {post: postId},
                limit: first,
                offset: offset
            }).catch(handleError);
        }
    },
    Mutation: {
        createComment: compose(...authResolvers)((parent, {input}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            input.user = authUser.id;
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                    .create(input, {transaction: t});
            }).catch(handleError);
        }),
        updateComment: compose(...authResolvers)((parent, {id, input}, {db, authUser}: {db: DbConnection,  authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id  = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                .findById(id)
                .then((commentt: CommentInstance) =>{
                    throwError(!commentt,`Comment with id ${id} not found!`);
                    throwError(commentt.get('user') != authUser.id,`UnAuthorized! You can only comment by yourself!`);
                    input.user = authUser.id;
                    return commentt.update(input, {transaction: t});
                });
            }).catch(handleError);
        }),
        deleteComment: (parent, {id, input}, {db, authUser}: {db: DbConnection, authUser: AuthUser}, info: GraphQLResolveInfo) => {
            id  = parseInt(id);
            return db.sequelize.transaction((t: Transaction) => {
                return db.Comment
                .findById(id)
                .then((comment: CommentInstance) =>{
                    throwError(!comment,`Comment with id ${id} not found!`);
                    throwError(comment.get('user') != authUser.id,`UnAuthorized! You can only comment by yourself!`);
                    return comment.destroy({transaction: t})
                        .then(comment => !!comment);
                });
            }).catch(handleError);
        }
    }
};