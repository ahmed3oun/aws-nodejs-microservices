import { IsPhoneNumber, IsString, Length, isString} from 'class-validator';
import { LoginDto } from './loginDto';

export class SignupDto extends LoginDto {
    @IsPhoneNumber()
    phone!: string;
    @IsString()
    first_name!: string;
    @IsString()
    last_name!: string
}
