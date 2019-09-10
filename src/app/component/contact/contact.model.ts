export class Contact {

  _id: string;
  title: string;
  fname: string;
  lname: string;
  company:  string;
  nickname: string;
  description: string;
  image: string;
  address: Address[];
  phone: Phone[];
  email: Email[];
  website : Website[];

}

export class Address {
  type: string;
  primary: boolean;
  addline1: string;
  addline2: string;
  landmark: string;
  area: string;
  city: string;
  dist: string;
  state: string;
  country: string;
  pin: string;
}

export class Phone {
  type: string;
  number: string;
  primary: boolean;
}

export class Email {
  type: string;
  email: string;
  primary: boolean;
}

export class Website {
  type: string;
  website: string;
  primary: boolean;
}