import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
  max-width: 400px;
  width: 100%;
`;

const Message = styled.p`
  font-size: 16px;
  margin-bottom: 16px;
`;

const Button = styled.button`
  background-color: ${({ isPrimary }) => (isPrimary ? '#007aff' : '#fff')};
  color: ${({ isPrimary }) => (isPrimary ? '#fff' : '#333')};
  border: 1px solid ${({ isPrimary }) => (isPrimary ? '#007aff' : '#333')};
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-left: ${({ isPrimary }) => (isPrimary ? '16px' : '0')};
`;

const Alert = ({ onConfirm, onCancel, message, isOpen }: any) => {
  if (!isOpen) {
    return null;
  }

  return (
    <Overlay>
      <Content>
        <Message>{message}</Message>
        <Button isPrimary onClick={onConfirm}>
          Confirmar
        </Button>
        <Button onClick={onCancel}>Cancelar</Button>
      </Content>
    </Overlay>
  );
};

export default Alert;
