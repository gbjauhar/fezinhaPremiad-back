import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { colors } from '../themes/colors';

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

interface WelcomeEmailProps {
  code: string;
  link: string;
}

export const WelcomeEmail = ({ code, link }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`https://fezinha-premiada.s3.amazonaws.com/logo.png`}
            width="50"
            height="50"
            alt="Fezinha logo"
            style={{
              objectFit: 'contain',
            }}
          />

          <Text style={title}>Obrigado por ter se cadastrado!</Text>
          <Text style={paragraph}>
            Nós da fezinha estamos muito felizes por ter você aqui, para acessar
            sua conta basta copiar essa sua senha
            <span style={pass}>{code}</span> e acessar o app usando ela e o
            e-mail cadastrado na compra.
          </Text>
          <Hr style={hr} />

          <Text style={codePass}>
            Senha: <span style={codePassSpan}>{code}</span>
          </Text>

          <Button pX={10} pY={10} style={button} href={link}>
            Acessar o site
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#e3e3e3',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: colors.background,
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const box = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const paragraph = {
  color: colors.subtitle,

  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

export const title = {
  color: colors.subtitle,

  fontSize: '32px',
  marginTop: '24px',
  fontWeight: 'bold',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const codePass = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: colors.subtitle,
  textAlign: 'left' as const,
};

export const codePassSpan = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: colors.title,
  padding: '8px 16px',

  backgroundColor: colors.grey,
  borderRadius: '4px',
  margin: '0 8px',
  textAlign: 'left' as const,
};

const pass = {
  color: colors.title,
  padding: '2px 5px',
  backgroundColor: colors.grey,
  borderRadius: '2px',
  margin: '0 8px',
};

const button = {
  backgroundColor: colors.buttonBackground,
  borderRadius: '5px',
  color: colors.buttonText,
  fontSize: '16px',
  fontWeight: 'block',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'flex',
  width: '100%',
  marginTop: '16px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};
