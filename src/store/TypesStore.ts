export interface LoginUser {
  email: string
  password: string
}

export interface tokenSendOrVerify {
  email: string
  type: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'CHANGE_EMAIL'
  code?: number
}

export type UpdateType = 'PASSWORD' | 'EMAIL' | 'NAME' | 'BIRTHDAY'

export class CreateUserDTO {
  name!: string
  email!: string
  password!: string
  dateBirth!: Date
}

export interface UpdateUserBody {
  name?: string
  email?: string
  password?: string
  dateBirth?: Date
}
export interface UpdateUserParams {
  id: string
}

export class Option {
  icon: string;
  text: string;
  link: string;
  refKey: string;

  constructor(icon: string, text: string, link:string, refKey: string) {
    this.icon = icon
    this.text = text
    this.link = link
    this.refKey = refKey
  }
}
