import styled from "@emotion/styled";

import SettingsIcon from '@mui/icons-material/Settings';

export default function LoadingPage() {
    return (
        <>
        <ConstructionContainer>
            <IconsContainer>
                <StyledSettingsIcon />
                <StyledSettingsIcon2 />
                <StyledSettingsIcon3 />
            </IconsContainer>
            <Message>
                <Title>Under Construction</Title>
                <Description>We are currently working on something awesome.</Description>
            </Message>
        </ConstructionContainer>
        </>
    );
}

const ConstructionContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 250px;
`;

const IconsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const StyledSettingsIcon = styled(SettingsIcon)`
  font-size: 120px;
  color: #333;
  animation: spin 5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const StyledSettingsIcon2 = styled(SettingsIcon)`
  font-size: 90px;
  color: #333;
  animation: spin 4s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const StyledSettingsIcon3 = styled(SettingsIcon)`
  font-size: 60px;
  color: orangered;
  animation: spin 6s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      color: orange;
    }
    25%{
      color: hotpink;
    }
    50%{
      color: #00c2cb;
    }
    75%{
      color: greenyellow;
    }
    100% {
      transform: rotate(360deg);
      color: yellow;
    }
  }
`;


const Message = styled.div`
  text-align: center;
  color: #333;
`;

const Title = styled.h1`
  font-size: 2rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
`;
