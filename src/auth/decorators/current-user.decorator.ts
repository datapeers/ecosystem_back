import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from '../enums/valid-roles.enum';
import { AuthUser } from '../types/auth-user';

export const CurrentUser = createParamDecorator( 
    ( roles: ValidRoles[] = [], context: ExecutionContext ) => {

        const ctx = GqlExecutionContext.create( context )
        const user: AuthUser = ctx.getContext().req.user;

        if ( !user ) {
            throw new InternalServerErrorException(`No user inside the request - make sure that we used the AuthGuard`);
        }

        if ( roles.length === 0 ) return user;

        if( !user.roles || !user.roles.length) {
            throw new ForbiddenException("Attempted to access a protected route with a user without roles or document");
        }

        if ( user.isActive === false ) {
            throw new ForbiddenException("Attempted to access a protected route with a disabled user");
        }

        for ( const role of user.roles ) {
            //TODO: Eliminar Valid Roles
            if ( roles.includes( role as ValidRoles ) ) {
                return user;
            }
        }

        throw new ForbiddenException( `User ${ user.fullName } need a valid role [${ roles }]` );

})