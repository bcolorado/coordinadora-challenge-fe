export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface UserResponseDto {
  id: number;
  email: string;
  fullName: string;
}

export interface LoginResponseDto {
  token: string;
  user: UserResponseDto;
}

export interface RegisterRequestDto {
  document: string;
  documentType: string;
  email: string;
  password: string;
  firstName: string;
  secondName?: string | undefined;
  firstSurname: string;
  secondSurname?: string | undefined;
}
