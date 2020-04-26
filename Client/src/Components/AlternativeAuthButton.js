import React from 'react';
import styled from 'styled-components';

const AlternativeAuth = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.div`
  font-weight: 300;
  font-size: 16px;
  line-height: 19px;
  color: #757575;
  margin-bottom: 0.5rem;
`;

const Button = styled.button`
  font-weight: 500;
  font-size: 14px;
  line-height: 16px;
  text-transform: uppercase;
  color: #A71E15;
`;

export default ({ label, buttonText, onClick }) => {
  return (
    <AlternativeAuth>
      <Label>{label}</Label>
      <Button onClick={onClick}>{buttonText}</Button>
    </AlternativeAuth>
  );
};
