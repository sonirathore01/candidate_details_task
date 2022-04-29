import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from 'src/user/services/user.service';
import { DeleteUser, UserType } from 'src/user/type/user.type';
import {CreateUserArgs, DeleteUserArg, GetUserArgs, UpdateUserArgs, UserList} from '../type/user-data.type'
@Resolver()
export class UserResolver {
    constructor(
        private userService: UserService
      ) { }
    @Query(returns => UserList)
     user(@Args('query',{ nullable: true }) query?: GetUserArgs) {
      const data =this.userService.list(query)
      return data;
    }

    @Query(returns => UserType)
    userById(@Args('id') id:string ) {
        const data =this.userService.getUserById(id)
        return data;
    }

    @Mutation(returns => UserType) 
    async createUser(@Args('userData') userData : CreateUserArgs ) {
        return await this.userService.create(userData)
    }
  
    @Mutation(returns => UserType)
    async updateUser(@Args('data') data : UpdateUserArgs) {
        return await this.userService.update(data)
      }
    
    @Mutation(returns => DeleteUser) 
    async deleteUser(@Args('data') data : DeleteUserArg) {
        return await this.userService.deleteMany(data)
    }
}
    

