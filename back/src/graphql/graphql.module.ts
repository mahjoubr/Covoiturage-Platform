import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from '../auth/auth.module'; 
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthResolver } from 'src/auth/auth.resolver';

@Module({
  imports: [
    NestGraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
        playground: true, 
        context: ({ req }) => ({
          user: req.user,}),
        introspection: true, 
        debug: true,
        path: '/graphql',
        
    }),
    
    
    AuthModule, 
  ],
  providers: [AuthResolver],
})
export class GraphqlModule {}
