import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
import { messagesHelper } from 'src/app/helpers/messages/messages.helper';
import { RegExHelper } from 'src/app/helpers/regex/regex.helper';

export class CreateUserDto {
  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
  public lastName: string;

  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @Matches(RegExHelper.password, {
    message: messagesHelper.PASSWORD_VALID,
  })
  public password: string;
}
