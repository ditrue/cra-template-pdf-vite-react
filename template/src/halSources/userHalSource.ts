import { LinkProps } from "./halSource";
import { SingleHalSource, SingleHalSourceProps } from "./singleHalSource";

export type UserLinks = {
  memberships: LinkProps;
  self: LinkProps;
  lock: LinkProps;
  showUser: LinkProps;
  updateImmediately: LinkProps;
}

export type UserProps = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  login: string;
  admin: boolean;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  status: string;
  identityUrl: string;
  language: string;
}

export type UserHalSourceProps = SingleHalSourceProps<UserProps & {
  _links: UserLinks;
}>

export class UserHalSource extends SingleHalSource<UserHalSourceProps> implements UserProps {
  links: UserLinks;
  
  constructor(props: UserHalSourceProps) {
    super(props);
    const { _links } = props;
    this.links = _links;
  }

  get id() {
    return this.source.id;
  }

  get name() {
    return  this.source.name;
  }

  get createdAt() {
    return  this.source.createdAt;
  }

  get updatedAt() {
    return  this.source.updatedAt;
  }

  get login() {
    return  this.source.login;
  }

  get admin() {
    return  this.source.admin;
  }

  get firstName() {
    return  this.source.firstName;
  }

  get lastName() {
    return  this.source.lastName;
  }

  get email() {
    return  this.source.email;
  }

  get avatar() {
    return  this.source.avatar;
  }

  get status() {
    return  this.source.status;
  }

  get identityUrl() {
    return  this.source.identityUrl;
  }

  get language() {
    return  this.source.language;
  }
}
