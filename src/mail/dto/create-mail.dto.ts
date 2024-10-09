import { JSXElementConstructor, ReactElement } from 'react';

export type CreateMailDto = {
  subject: string;
  to: string;
  html: string;
};

export type AddToQueueDto = {
  subject: string;
  to: string;
  component: ReactElement<any, string | JSXElementConstructor<any>>;
}