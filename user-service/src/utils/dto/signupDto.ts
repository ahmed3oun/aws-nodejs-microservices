import { Length } from 'class-validator';
import { LoginDto } from './loginDto';

export class SignupDto extends LoginDto {
    @Length(10, 13)
    phone!: string;
}
