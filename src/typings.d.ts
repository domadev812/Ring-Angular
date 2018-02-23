/* SystemJS module definition */
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

declare namespace API {
  namespace Response {
    interface Auth {
      token: string
      user: IUser
    }
  }

  interface IUser {
    email: string
    first_name: string
    last_name: string
    id: string
    password: string
    password_confirmation: string
    phone_number: string
    hometown: string
    bio: string
    profile_image: string
    reset_pass_exp: string
    reset_pass_token: string
    roles: string[]
    unread_count: number
    is_verified: boolean
  }
}