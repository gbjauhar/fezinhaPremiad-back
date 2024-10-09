import {
  Body,
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

interface CodeEmailProps {
  code: string;
}

export const CodeEmail = ({ code }: CodeEmailProps) => (
  <Html>
    <Head />
    <Preview>Bem-vindo!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src={`${baseUrl}/static/logo.png`}
            width="50"
            height="50"
            alt="Fezinha logo"
            style={{
              objectFit: 'contain',
            }}
          />

          <Text style={title}>Problema com sua senha? 🤔</Text>
          <Text style={paragraph}>
            Recebemos uma solicitação de recuperação de senha sua, para seguir
            com o processo de recuperação, copie esse código{' '}
            <span style={pass}>{code}</span> e cole no app no momento em que
            pedir o código de recuperação.
          </Text>
          <Hr style={hr} />

          <Text style={codePass}>
            Código: <span style={codePassSpan}>{code}</span>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default CodeEmail;

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
  marginBottom: '32px',
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
