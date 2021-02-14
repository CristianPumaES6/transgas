import { Module } from '@nestjs/common';
import { UserDetailsService } from './user-details.service';

@Module({
  providers: [UserDetailsService]
})
export class UserDetailsModule {}
